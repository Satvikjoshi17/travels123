import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, zodSchema, convertToModelMessages } from "ai";
import { z } from "zod";

export const maxDuration = 30;

/* ────────── In-Memory LRU Cache ────────── */
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;
const resultCache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = resultCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    resultCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  // Evict oldest if at capacity
  if (resultCache.size >= MAX_CACHE_SIZE) {
    const firstKey = resultCache.keys().next().value;
    if (firstKey) resultCache.delete(firstKey);
  }
  resultCache.set(key, { data, timestamp: Date.now() });
}

/* ────────── Helpers ────────── */
function getDefaultDate(daysFromNow: number = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function parseDDMM(ymd: string): string {
  if (!ymd || !ymd.includes("-")) return "";
  const parts = ymd.split("-");
  if (parts.length < 3) return "";
  return `${parts[2]}${parts[1]}`;
}

/* ────────── Exchange Rates ────────── */
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.37,
  SGD: 1.35,
  AED: 3.67,
};

/* ────────── Static Responses for Cost Saving ────────── */
const STATIC_RESPONSES: Record<string, string> = {
  "hi": "Hello! I'm Milo, your AI travel concierge ✈️ How can I help you plan your next trip today?",
  "hello": "Hello! I'm Milo, your AI travel concierge ✈️ How can I help you plan your next trip today?",
  "hey": "Hey there! How can I help you with flights, hotels, or packages today? ✈️🏨",
  "howdy": "Howdy! How can I help you with your travel plans today? ✈️🤠",
  "hola": "¡Hola! ¿En qué puedo ayudarte hoy? (Hello! How can I help you today? ✈️)",
  "milo": "Yes, I'm here! I'm Milo, your travel assistant. Ready to search for flights, hotels, and tours. Where would you like to go?",
  "how are you": "I'm doing great, thank you! Ready to help you discover the best travel deals. Where are you heading next? 🌍",
  "how are you?": "I'm doing great, thank you! Ready to help you discover the best travel deals. Where are you heading next? 🌍",
  "thank you": "You're very welcome! Let me know if you need help with anything else. Safe travels! ✈️✨",
  "thanks": "You're very welcome! Let me know if you need help with anything else. Safe travels! ✈️✨",
  "bye": "Goodbye! Have a wonderful trip and safe travels! ✈️🌍",
  "goodbye": "Goodbye! Have a wonderful trip and safe travels! ✈️🌍",
  "help": "I can help you search and compare:\n• ✈️ Flights   • 🏨 Hotels   • 🚌 Buses\n• 🚗 Cabs   • 🎫 Tours   • 📦 Packages\n\nJust tell me where you want to go, e.g., 'Find hotels in Goa'!",
};

/* ────────── Main API Handler ────────── */
export async function POST(req: Request) {
  try {
    const { messages, currency = "USD", userCity } = await req.json();

    // Check for static response interception (greetings & basic queries) to save API/LLM tokens
    if (messages && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user" && typeof lastMsg.content === "string") {
        const textClean = lastMsg.content.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const matched = STATIC_RESPONSES[textClean];
        if (matched) {
          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`0:${JSON.stringify(matched)}\n`));
              controller.close();
            },
          });
          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "x-vercel-ai-data-stream": "v1",
            },
          });
        }
      }
    }

    const marker = process.env.TRAVELPAYOUTS_MARKER || "734132";

    // Convert client UIMessage[] to server ModelMessage[]
    const modelMessages = await convertToModelMessages(messages);

    // Context window trimming: keep only last 10 messages to reduce token usage
    const trimmedMessages = modelMessages.length > 10
      ? modelMessages.slice(-10)
      : modelMessages;

    // Instantiate Google Generative AI provider with fallbacks
    const googleProvider = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
    });

    const customizedPrompt = userCity
      ? `${SYSTEM_PROMPT}\n\nUSER LOCATION CONTEXT: The user is currently in ${userCity}. Unless they specify a different origin or pickup location, default the departure airport / pickup point to ${userCity} (or its primary airport code).`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: googleProvider("gemini-2.5-flash"),
      maxOutputTokens: 600,
      temperature: 0.4,
      system: customizedPrompt,
      messages: trimmedMessages,
      tools: {
        searchFlights: tool({
          description: "Search for flights between two airports. Call this whenever a user mentions wanting to fly somewhere, find flights, or book a flight.",
          inputSchema: zodSchema(z.object({
            origin: z.string().describe("Origin airport code (3 letters, e.g. DEL, SFO, JFK)"),
            destination: z.string().describe("Destination airport code (3 letters, e.g. BLR, NRT, LHR)"),
            departureDate: z.string().optional().describe("Departure date (YYYY-MM-DD). If not specified, use a date ~7 days from now."),
            returnDate: z.string().optional().describe("Return date (YYYY-MM-DD) for round trips"),
            passengers: z.number().optional().default(1).describe("Number of passengers"),
            maxPrice: z.number().optional().describe("Maximum price / budget limit for the flights."),
          })),
          execute: async ({ origin, destination, departureDate, returnDate, passengers, maxPrice }: {
            origin: string; destination: string; departureDate?: string; returnDate?: string; passengers: number; maxPrice?: number;
          }) => {
            const depDate = departureDate || getDefaultDate(7);
            const cacheKey = `flights:${origin}:${destination}:${depDate}:${returnDate || ""}:${passengers}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              flights: generateFlights(origin, destination, depDate, returnDate, passengers, marker, currency, maxPrice),
              args: { origin, destination, departureDate: depDate, returnDate, passengers, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),

        searchHotels: tool({
          description: "Search for hotels in a destination city. Call this when user wants to find accommodation, hotels, stays, or book a room.",
          inputSchema: zodSchema(z.object({
            destination: z.string().describe("Destination city or region name (e.g. Tokyo, Paris, New Delhi)"),
            checkInDate: z.string().optional().describe("Check-in date (YYYY-MM-DD). If not specified, use ~7 days from now."),
            checkOutDate: z.string().optional().describe("Check-out date (YYYY-MM-DD). If not specified, use check-in + 3 days."),
            guests: z.number().optional().default(1).describe("Number of guests"),
            maxPrice: z.number().optional().describe("Maximum price per night or total budget for the stay."),
          })),
          execute: async ({ destination, checkInDate, checkOutDate, guests, maxPrice }: {
            destination: string; checkInDate?: string; checkOutDate?: string; guests: number; maxPrice?: number;
          }) => {
            const cin = checkInDate || getDefaultDate(7);
            const cout = checkOutDate || getDefaultDate(10);
            const cacheKey = `hotels:${destination}:${cin}:${cout}:${guests}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              hotels: generateHotels(destination, cin, cout, guests, marker, currency, maxPrice),
              args: { destination, checkInDate: cin, checkOutDate: cout, guests, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),

        searchBuses: tool({
          description: "Search for bus tickets between two cities. Call this when user wants bus travel, bus tickets, or intercity bus routes.",
          inputSchema: zodSchema(z.object({
            origin: z.string().describe("Origin city (e.g. Delhi, Mumbai, Bangalore)"),
            destination: z.string().describe("Destination city (e.g. Agra, Jaipur, Goa)"),
            travelDate: z.string().optional().describe("Travel date (YYYY-MM-DD). If not specified, use ~3 days from now."),
            passengers: z.number().optional().default(1).describe("Number of passengers"),
            maxPrice: z.number().optional().describe("Maximum budget limit for the bus tickets."),
          })),
          execute: async ({ origin, destination, travelDate, passengers, maxPrice }: {
            origin: string; destination: string; travelDate?: string; passengers: number; maxPrice?: number;
          }) => {
            const date = travelDate || getDefaultDate(3);
            const cacheKey = `buses:${origin}:${destination}:${date}:${passengers}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              buses: generateBuses(origin, destination, date, passengers, marker, currency, maxPrice),
              args: { origin, destination, travelDate: date, passengers, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),

        searchCabs: tool({
          description: "Search for cab/taxi transfers. Call this when user wants airport transfers, cab bookings, taxi rides, or car rentals for transport.",
          inputSchema: zodSchema(z.object({
            pickupLocation: z.string().describe("Pickup location (e.g. Delhi Airport, Mumbai Central Station)"),
            dropLocation: z.string().describe("Drop location (e.g. Taj Mahal, city center, hotel name)"),
            passengers: z.number().optional().default(1).describe("Number of passengers"),
            maxPrice: z.number().optional().describe("Maximum budget limit for the cab ride."),
          })),
          execute: async ({ pickupLocation, dropLocation, passengers, maxPrice }: {
            pickupLocation: string; dropLocation: string; passengers: number; maxPrice?: number;
          }) => {
            const cacheKey = `cabs:${pickupLocation}:${dropLocation}:${passengers}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              cabs: generateCabs(pickupLocation, dropLocation, passengers, marker, currency, maxPrice),
              args: { pickupLocation, dropLocation, passengers, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),

        searchTours: tool({
          description: "Search for tours, activities, attractions, and things to do in a destination. Call this when user wants sightseeing, experiences, tickets, or activities.",
          inputSchema: zodSchema(z.object({
            destination: z.string().describe("Destination city or region (e.g. Jaipur, Bali, Paris)"),
            maxPrice: z.number().optional().describe("Maximum price / budget limit for activities."),
          })),
          execute: async ({ destination, maxPrice }: { destination: string; maxPrice?: number }) => {
            const cacheKey = `tours:${destination}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              tours: generateTours(destination, marker, currency, maxPrice),
              args: { destination, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),

        searchPackages: tool({
          description: "Search for holiday packages and vacation deals. Call this when user wants complete trip packages, vacation bundles, or all-inclusive holiday deals.",
          inputSchema: zodSchema(z.object({
            destination: z.string().describe("Destination (e.g. Goa, Maldives, Switzerland)"),
            duration: z.string().optional().describe("Preferred duration like '5 days' or '1 week'. Defaults to 5D/4N."),
            maxPrice: z.number().optional().describe("Maximum package budget limit."),
          })),
          execute: async ({ destination, duration, maxPrice }: { destination: string; duration?: string; maxPrice?: number }) => {
            const dur = duration || "5D/4N";
            const cacheKey = `packages:${destination}:${dur}:${maxPrice || ""}:${currency}`;
            const cached = getCached(cacheKey);
            if (cached) return cached;
            const data = {
              packages: generatePackages(destination, dur, marker, currency, maxPrice),
              args: { destination, duration: dur, maxPrice }
            };
            setCache(cacheKey, data);
            return data;
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("API Chat Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";

    // Friendly fallback — return a valid streamed response with error text
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/* ══════════════════════════════════════════
   SYSTEM PROMPT — Carefully engineered
   ══════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are Milo, the premium AI travel concierge for GlobeTrek.

CORE RULES & ANTI-HALLUCINATION PROTOCOL:
1. ALWAYS call the corresponding search tool FIRST before generating any introductory or conversational text. Never write text responses before calling the tools.
2. Use smart defaults for tool inputs if parameters are missing:
   - Dates: ~7 days from today for flights/hotels, ~3 days for buses
   - Passengers/Guests: 1 adult
   - Duration: 5D/4N for packages
3. After the tool call executes, write a SHORT (2-3 sentences max) friendly summary mentioning the assumed dates/passengers. Do NOT list the results as text — the system renders them as interactive cards automatically.
4. STRICT LIMIT ON INVENTED DETAILS: Never invent or list specific flights, airlines, hotels, rates, buses, or cab names in your text response. Any information about specific options must come strictly and exclusively from the tool results. Let the UI handle all visual card rendering.
5. STRICT TRUTH-TELLING: Only comment on the arguments you used to perform the search (such as dates, departure, origin, destination, and passenger counts). Never invent other options or fabricate promotions/deals.
5. Extract budget parameters if provided (e.g. "under 2000" or "in 2k budget") and pass the numeric value (per person / per night / total) to the 'maxPrice' parameter of the search tool.
6. You can call MULTIPLE tools in one response. Example: "I want to go to Goa" → call searchFlights AND searchHotels AND searchTours simultaneously.
7. If the user asks a GENERAL travel question (visa info, weather, best time to visit, packing tips, safety) — answer directly without calling tools. Keep answers concise and helpful.
8. For airport codes: If user says a city name, infer the primary airport code (Delhi=DEL, Mumbai=BOM, Bengaluru=BLR, Chennai=MAA, Kolkata=CCU, Hyderabad=HYD, Goa=GOI, Tokyo=NRT, Paris=CDG, London=LHR, New York=JFK, Dubai=DXB, Singapore=SIN, Bangkok=BKK, Bali=DPS).
9. Encourage users to click the "Book Now" / "Book Seat" / "Book Activity" buttons on the cards.
10. NEVER output raw JSON, markdown tables, or bullet-point flight/hotel lists. Let the UI handle all visual rendering.
11. Mention the assumed dates and passenger count briefly so the user knows what was searched.
12. Be warm, enthusiastic, and professional. Use occasional emojis sparingly (✈️ 🏨 🚌 🚗 🎫 📦).

AVAILABLE TOOLS:
- searchFlights: For air travel between airports
- searchHotels: For accommodation/stays
- searchBuses: For intercity bus travel
- searchCabs: For taxi/transfer bookings
- searchTours: For activities, sightseeing, attractions
- searchPackages: For complete holiday packages/bundles`;

/* ══════════════════════════════════════════
   DATA GENERATORS
   ══════════════════════════════════════════ */

export function generateFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | undefined,
  passengers: number,
  marker: string,
  targetCurrency: string = "USD",
  maxPrice?: number
) {
  const airlines = [
    { name: "IndiGo", code: "6E" },
    { name: "Air India", code: "AI" },
    { name: "SpiceJet", code: "SG" },
    { name: "Vistara", code: "UK" },
    { name: "Japan Airlines", code: "JL" },
    { name: "All Nippon Airways", code: "NH" },
    { name: "United Airlines", code: "UA" },
    { name: "Delta Air Lines", code: "DL" },
    { name: "British Airways", code: "BA" },
    { name: "Emirates", code: "EK" },
    { name: "Singapore Airlines", code: "SQ" },
    { name: "Qatar Airways", code: "QR" },
  ];

  const indianCodes = ["DEL", "BLR", "BOM", "MAA", "CCU", "HYD", "COK", "GOI", "AMD", "PNQ", "JAI", "LKO"];
  const isIndianDomestic =
    indianCodes.includes(origin.toUpperCase()) &&
    indianCodes.includes(destination.toUpperCase());

  const selectedAirlines = isIndianDomestic
    ? airlines.filter(a => ["IndiGo", "Air India", "SpiceJet", "Vistara"].includes(a.name))
    : airlines.filter(a => !["SpiceJet"].includes(a.name)).slice(0, 5);

  const baseCurrency = isIndianDomestic ? "INR" : "USD";
  const basePrice = isIndianDomestic ? 4200 : 550;

  const times = [
    { dep: "06:15", arr: "08:45", dur: "2h 30m", stops: 0 },
    { dep: "09:30", arr: "12:10", dur: "2h 40m", stops: 0 },
    { dep: "14:00", arr: "18:30", dur: "4h 30m", stops: 1 },
    { dep: "19:45", arr: "23:15", dur: "3h 30m", stops: 0 },
    { dep: "22:00", arr: "04:20", dur: "6h 20m", stops: 1 },
  ];

  return selectedAirlines.slice(0, 4).map((airline, i) => {
    const time = times[i % times.length];
    const priceVariance = Math.random() * (isIndianDomestic ? 800 : 100);
    const initialPrice = Math.round((basePrice + (i * (isIndianDomestic ? 750 : 90)) + priceVariance) * passengers);
    
    let price = initialPrice;
    if (baseCurrency !== targetCurrency.toUpperCase()) {
      const priceInUSD = baseCurrency === "INR" ? initialPrice / 83.5 : initialPrice;
      price = Math.round(priceInUSD * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));
    }

    if (maxPrice) {
      price = Math.round(maxPrice * (0.5 + Math.random() * 0.4));
    }

    const flightNo = String(Math.floor(100 + Math.random() * 900));

    const depDDMM = parseDDMM(departureDate);
    const retDDMM = returnDate ? parseDDMM(returnDate) : "";
    const aviasalesSearchUrl = `https://www.aviasales.com/search/${origin.toUpperCase()}${depDDMM}${destination.toUpperCase()}${retDDMM}${passengers}y?currency=${targetCurrency.toUpperCase()}&request_source=country_change`;
    const bookingUrl = `https://aviasales.tpk.lv/ok6lj7IX?u=${encodeURIComponent(aviasalesSearchUrl)}`;

    return {
      id: `f-${origin}-${destination}-${i}-${flightNo}`,
      airlineName: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNo,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureTime: time.dep,
      arrivalTime: time.arr,
      duration: time.dur,
      stops: time.stops,
      price,
      currency: targetCurrency.toUpperCase(),
      bookingUrl,
    };
  });
}

export function generateHotels(
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  guests: number,
  marker: string,
  targetCurrency: string = "USD",
  maxPrice?: number
) {
  interface HotelTemplate {
    name: string;
    rating: number;
    stars: number;
    reviews: number;
    price: number; // base price in USD
    image: string;
  }

  const CITY_HOTELS: Record<string, {
    luxury: HotelTemplate[];
    standard: HotelTemplate[];
    budget: HotelTemplate[];
  }> = {
    indore: {
      luxury: [
        { name: "Sayaji Hotel Indore", rating: 4.7, stars: 5, reviews: 3420, price: 110, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60" },
        { name: "Radisson Blu Hotel Indore", rating: 4.6, stars: 5, reviews: 2890, price: 125, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60" },
        { name: "The Park Indore", rating: 4.5, stars: 5, reviews: 1240, price: 100, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60" },
      ],
      standard: [
        { name: "Lemon Tree Hotel Indore", rating: 4.3, stars: 4, reviews: 1850, price: 55, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60" },
        { name: "Effotel by Sayaji Indore", rating: 4.2, stars: 4, reviews: 1420, price: 50, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=60" },
        { name: "Ginger Hotel Indore", rating: 4.0, stars: 3, reviews: 950, price: 40, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60" },
      ],
      budget: [
        { name: "Hotel Shreemaya Indore", rating: 4.1, stars: 3, reviews: 620, price: 24, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60" },
        { name: "Indore Backpackers Hostel", rating: 4.3, stars: 2, reviews: 320, price: 10, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=60" },
        { name: "Hotel Amar Vilas Indore", rating: 3.9, stars: 3, reviews: 480, price: 22, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60" },
      ]
    },
    goa: {
      luxury: [
        { name: "Taj Exotica Resort & Spa Goa", rating: 4.8, stars: 5, reviews: 4120, price: 190, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=60" },
        { name: "W Goa (Vagator Beach)", rating: 4.7, stars: 5, reviews: 2110, price: 220, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60" },
      ],
      standard: [
        { name: "Fairfield by Marriott Goa Baga", rating: 4.4, stars: 4, reviews: 1750, price: 85, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60" },
        { name: "Lemon Tree Amarante Beach Resort", rating: 4.2, stars: 4, reviews: 1320, price: 70, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=60" },
      ],
      budget: [
        { name: "Baga Beach Backpackers Goa", rating: 4.2, stars: 2, reviews: 540, price: 12, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=60" },
        { name: "Zostel Goa (Calangute)", rating: 4.5, stars: 2, reviews: 880, price: 14, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=60" },
      ]
    },
    darjeeling: {
      luxury: [
        { name: "Windamere Hotel Darjeeling", rating: 4.7, stars: 5, reviews: 1020, price: 130, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60" },
        { name: "The Elgin Darjeeling", rating: 4.6, stars: 5, reviews: 840, price: 120, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60" },
      ],
      standard: [
        { name: "Summit Swiss Heritage Resort", rating: 4.3, stars: 4, reviews: 750, price: 65, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60" },
        { name: "Central Heritage Resort Darjeeling", rating: 4.2, stars: 4, reviews: 620, price: 55, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=60" },
      ],
      budget: [
        { name: "Darjeeling Tourist Lodge", rating: 4.0, stars: 3, reviews: 310, price: 24, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60" },
        { name: "Hill Bird Guesthouse Darjeeling", rating: 4.2, stars: 2, reviews: 180, price: 15, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60" },
      ]
    }
  };

  const GENERIC_HOTELS = {
    luxury: [
      { name: "Grand Plaza Resort & Spa", rating: 4.8, stars: 5, reviews: 1420, price: 180, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60" },
      { name: "Waterfront Palace Hotel", rating: 4.9, stars: 5, reviews: 2100, price: 250, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60" },
    ],
    standard: [
      { name: "City Center Suites", rating: 4.5, stars: 4, reviews: 850, price: 120, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60" },
      { name: "Boutique Heritage Inn", rating: 4.6, stars: 4, reviews: 620, price: 95, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop&q=60" },
    ],
    budget: [
      { name: "Comfort Transit Lodge", rating: 4.1, stars: 3, reviews: 430, price: 30, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60" },
      { name: "Central Backpackers Hostel", rating: 4.2, stars: 2, reviews: 250, price: 15, image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=60" },
    ]
  };

  const cityClean = destination.split(",")[0].trim();
  const cityKey = cityClean.toLowerCase();

  const activeRates = EXCHANGE_RATES;
  const targetCurrencyUpper = targetCurrency.toUpperCase();
  const rateToUSD = activeRates[targetCurrencyUpper] || 1;
  const maxPriceUSD = maxPrice ? (maxPrice / rateToUSD) : undefined;

  const templatesSource = CITY_HOTELS[cityKey] || {
    luxury: GENERIC_HOTELS.luxury.map(h => ({ ...h, name: `${cityClean} ${h.name}` })),
    standard: GENERIC_HOTELS.standard.map(h => ({ ...h, name: `${cityClean} ${h.name}` })),
    budget: GENERIC_HOTELS.budget.map(h => ({ ...h, name: `${cityClean} ${h.name}` }))
  };

  let selectedTemplates: HotelTemplate[] = [];

  if (maxPriceUSD !== undefined) {
    if (maxPriceUSD <= 35) {
      selectedTemplates = templatesSource.budget;
    } else if (maxPriceUSD <= 90) {
      selectedTemplates = templatesSource.standard;
    } else {
      selectedTemplates = templatesSource.luxury;
    }
  } else {
    // Mix and match all categories if no budget is set
    selectedTemplates = [
      templatesSource.budget[0],
      templatesSource.standard[0],
      templatesSource.luxury[0]
    ].filter(Boolean);
  }

  return selectedTemplates.slice(0, 3).map((tpl, i) => {
    let price = Math.round(tpl.price * rateToUSD);

    if (maxPrice) {
      // Scale dynamic price to stay comfortably below the user's max budget threshold
      price = Math.round(maxPrice * (0.65 + Math.random() * 0.28));
    }

    const targetUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=${guests}`;
    const bookingUrl = `https://tp.media/r?marker=${marker}&p=1904&campaign_id=31&u=${encodeURIComponent(targetUrl)}`;

    return {
      id: `h-${encodeURIComponent(destination)}-${maxPrice || "default"}-${i}`,
      name: tpl.name,
      location: destination,
      stars: tpl.stars,
      rating: tpl.rating,
      reviewsCount: tpl.reviews,
      pricePerNight: price,
      currency: targetCurrencyUpper,
      imageUrl: tpl.image,
      bookingUrl,
    };
  });
}

export function generateBuses(
  origin: string,
  destination: string,
  travelDate: string,
  passengers: number,
  marker: string,
  targetCurrency: string = "USD",
  maxPrice?: number
) {
  const operators = [
    { name: "Volvo Multi-Axle", type: "AC Sleeper", rating: 4.5 },
    { name: "Rajdhani Express", type: "AC Seater", rating: 4.2 },
    { name: "Orange Tours", type: "Non-AC Sleeper", rating: 3.8 },
    { name: "IntrCity SmartBus", type: "AC Semi-Sleeper", rating: 4.6 },
  ];

  const basePrice = 600;
  const times = [
    { dep: "06:00", arr: "12:30", dur: "6h 30m", seats: 12 },
    { dep: "14:30", arr: "20:00", dur: "5h 30m", seats: 8 },
    { dep: "21:00", arr: "05:30", dur: "8h 30m", seats: 22 },
    { dep: "23:30", arr: "06:00", dur: "6h 30m", seats: 5 },
  ];

  const redbusUrl = `https://www.redbus.in/bus-tickets/${origin.toLowerCase()}-to-${destination.toLowerCase()}?fromCityName=${encodeURIComponent(origin)}&toCityName=${encodeURIComponent(destination)}&onward=${travelDate}`;
  const affiliateUrl = `https://tp.media/r?marker=${marker}&trs=534470&p=6498&campaign_id=200&u=${encodeURIComponent(redbusUrl)}`;

  return operators.slice(0, 3).map((op, i) => {
    const time = times[i % times.length];
    const initialPrice = Math.round((basePrice + i * 250 + Math.random() * 150) * passengers);
    
    let price = initialPrice;
    if (targetCurrency.toUpperCase() !== "INR") {
      price = Math.round((initialPrice / 83.5) * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));
    }

    if (maxPrice) {
      price = Math.round(maxPrice * (0.6 + Math.random() * 0.3));
    }

    return {
      id: `b-${origin}-${destination}-${i}`,
      operatorName: op.name,
      busType: op.type,
      origin,
      destination,
      departureTime: time.dep,
      arrivalTime: time.arr,
      duration: time.dur,
      price,
      currency: targetCurrency.toUpperCase(),
      rating: op.rating,
      seatsAvailable: time.seats,
      bookingUrl: affiliateUrl,
    };
  });
}

export function generateCabs(
  pickupLocation: string,
  dropLocation: string,
  passengers: number,
  marker: string,
  targetCurrency: string = "USD",
  maxPrice?: number
) {
  const vehicles = [
    { type: "Swift Dzire / Etios", category: "Sedan", capacity: 4, basePrice: 800 },
    { type: "Toyota Innova Crysta", category: "SUV", capacity: 7, basePrice: 1500 },
    { type: "Mercedes E-Class", category: "Luxury", capacity: 3, basePrice: 3500 },
    { type: "WagonR / Alto", category: "Economy", capacity: 4, basePrice: 500 },
  ];

  const klookUrl = `https://www.klook.com/en-US/search?query=${encodeURIComponent(pickupLocation + " transfer")}`;
  const affiliateUrl = `https://tp.media/r?marker=${marker}&trs=534470&p=4110&campaign_id=137&u=${encodeURIComponent(klookUrl)}`;

  return vehicles.map((v, i) => {
    const initialPrice = Math.round(v.basePrice + Math.random() * 300);
    let price = initialPrice;
    if (targetCurrency.toUpperCase() !== "INR") {
      price = Math.round((initialPrice / 83.5) * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));
    }

    if (maxPrice) {
      price = Math.round(maxPrice * (0.5 + Math.random() * 0.4));
    }

    const estTime = `${25 + i * 10}-${35 + i * 10} min`;

    return {
      id: `c-${i}-${v.category.toLowerCase()}`,
      vehicleType: v.type,
      vehicleCategory: v.category,
      pickupLocation,
      dropLocation,
      estimatedTime: estTime,
      capacity: v.capacity,
      price,
      currency: targetCurrency.toUpperCase(),
      providerName: "GlobeTrek Cabs",
      bookingUrl: affiliateUrl,
    };
  });
}

export function generateTours(destination: string, marker: string, targetCurrency: string = "USD", maxPrice?: number) {
  const cityClean = destination.split(",")[0].trim();
  const isIndia = /delhi|mumbai|bangalore|bengaluru|goa|chennai|kolkata|hyderabad|jaipur|agra|varanasi|udaipur|india/i.test(destination);
  const baseCurrency = isIndia ? "INR" : "USD";
  const priceMultiplier = isIndia ? 80 : 1;

  const tourTemplates = [
    {
      name: `${cityClean} Highlights Walking Tour`,
      duration: "3 hours",
      rating: 4.7,
      reviews: 520,
      highlights: ["Guided Tour", "Historic Sites", "Local Food"],
      price: 25,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuEbHaDd9hzMeAvKZFBYDq8pwMVI2eEI-jxf55NMVypigqJIvaU0vsAbJnHa1pk1mg56QvzOIf8rBIEO5VwPcALlO_hka11uaCVnfngXjQCBXlubpD4Q-MRPSzGDRjRL-ee7nkfhLyT_W4Bug8bdCWGUJG8ZRGefDa7FoFakDMQxAT6Z2RLU5p-9XxLfLVdyC-sTqyVq9SfDfScs-mEdYNSoyisHB9dxwHB2VEUkiLQdl0jpt_nuPv9vKYwMOSDB362kbGObA",
    },
    {
      name: `${cityClean} Adventure & Water Sports`,
      duration: "Full Day",
      rating: 4.8,
      reviews: 890,
      highlights: ["Water Sports", "Beach Visit", "Lunch Included"],
      price: 55,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO0PQYh2Nu05evh3TNIYEW2aVaufRIM0LE0N8H1KpgoAtAaX8OgesbBdXDZYz6hJPrLv0XvI8h4VySFVCKyPuqhBpcNnL_CfEboa_FjbfMc0T5aCZJ4fjS-suvQPJZiAuWmtTnLj1Ef6VzPlbAOlAT-TS93DSjRjEn3Tzw2-uCAyLTYQdkQt7WtdzCY50tr09pGnFW_PPw8Tv6LRO5D5Pi3VBD4oehExv3PN4PVWscUcPDIveNAzi48LihlRxeYSRiyIa90wm14w",
    },
    {
      name: `${cityClean} Cultural Heritage Experience`,
      duration: "5 hours",
      rating: 4.6,
      reviews: 340,
      highlights: ["Museum Pass", "Art Gallery", "Tea Ceremony"],
      price: 40,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZtk7U8a5jXVtSYCLnZyhr-RYAk7m0V3P0gjb8upOKniXp1A_mJLgxBdkkbSgmjcNTkYCp-b4yFXVuO_2HTlp90dkDB0H8TDC2eD9PuNOYgC0i-nWpkyW-qVNi8e7uLFPpvO4bSUy9SMb5XWjML9gIoANrHRnGSKRHDNkgWhPqouTNTCwDaYCz7OK_WkSc9jxHBFUqLOK15l0-K0H3U1dzXeB7hvZ2UEnvmLYySFdlWOW2dcRpY6ZRUrGVKwvtvLo06KLXitooOQ",
    },
  ];

  const klookBase = `https://www.klook.com/en-US/search?query=${encodeURIComponent(cityClean + " activities")}`;
  const affiliateUrl = `https://tp.media/r?marker=${marker}&trs=534470&p=4110&campaign_id=137&u=${encodeURIComponent(klookBase)}`;

  return tourTemplates.map((t, i) => {
    const initialPrice = Math.round((t.price + Math.random() * 15) * priceMultiplier);
    let price = initialPrice;
    if (baseCurrency !== targetCurrency.toUpperCase()) {
      const priceInUSD = baseCurrency === "INR" ? initialPrice / 83.5 : initialPrice;
      price = Math.round(priceInUSD * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));
    }

    if (maxPrice) {
      price = Math.round(maxPrice * (0.5 + Math.random() * 0.4));
    }

    return {
      id: `t-${encodeURIComponent(destination)}-${i}`,
      name: t.name,
      location: destination,
      duration: t.duration,
      rating: t.rating,
      reviewsCount: t.reviews,
      highlights: t.highlights,
      price,
      currency: targetCurrency.toUpperCase(),
      imageUrl: t.image,
      bookingUrl: affiliateUrl,
    };
  });
}

export function generatePackages(destination: string, duration: string, marker: string, targetCurrency: string = "USD", maxPrice?: number) {
  const cityClean = destination.split(",")[0].trim();
  const isIndia = /goa|delhi|mumbai|bangalore|bengaluru|chennai|kolkata|hyderabad|jaipur|udaipur|kashmir|kerala|india/i.test(destination);
  const baseCurrency = isIndia ? "INR" : "USD";
  const priceMultiplier = isIndia ? 80 : 1;

  const pkgTemplates = [
    {
      name: `${cityClean} Deluxe ${duration} Package`,
      rating: 4.7,
      reviews: 310,
      inclusions: ["Flight Tickets", "Hotel Stay", "Breakfast", "Sightseeing"],
      price: 350,
      originalPrice: 450,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuEbHaDd9hzMeAvKZFBYDq8pwMVI2eEI-jxf55NMVypigqJIvaU0vsAbJnHa1pk1mg56QvzOIf8rBIEO5VwPcALlO_hka11uaCVnfngXjQCBXlubpD4Q-MRPSzGDRjRL-ee7nkfhLyT_W4Bug8bdCWGUJG8ZRGefDa7FoFakDMQxAT6Z2RLU5p-9XxLfLVdyC-sTqyVq9SfDfScs-mEdYNSoyisHB9dxwHB2VEUkiLQdl0jpt_nuPv9vKYwMOSDB362kbGObA",
    },
    {
      name: `${cityClean} Premium Adventure ${duration}`,
      rating: 4.5,
      reviews: 480,
      inclusions: ["Hotel Stay", "All Meals", "Adventure Activities", "Guide"],
      price: 280,
      originalPrice: 320,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO0PQYh2Nu05evh3TNIYEW2aVaufRIM0LE0N8H1KpgoAtAaX8OgesbBdXDZYz6hJPrLv0XvI8h4VySFVCKyPuqhBpcNnL_CfEboa_FjbfMc0T5aCZJ4fjS-suvQPJZiAuWmtTnLj1Ef6VzPlbAOlAT-TS93DSjRjEn3Tzw2-uCAyLTYQdkQt7WtdzCY50tr09pGnFW_PPw8Tv6LRO5D5Pi3VBD4oehExv3PN4PVWscUcPDIveNAzi48LihlRxeYSRiyIa90wm14w",
    },
    {
      name: `${cityClean} Budget Explorer ${duration}`,
      rating: 4.3,
      reviews: 650,
      inclusions: ["Hotel Stay", "Breakfast", "Airport Transfer"],
      price: 180,
      originalPrice: 220,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZtk7U8a5jXVtSYCLnZyhr-RYAk7m0V3P0gjb8upOKniXp1A_mJLgxBdkkbSgmjcNTkYCp-b4yFXVuO_2HTlp90dkDB0H8TDC2eD9PuNOYgC0i-nWpkyW-qVNi8e7uLFPpvO4bSUy9SMb5XWjML9gIoANrHRnGSKRHDNkgWhPqouTNTCwDaYCz7OK_WkSc9jxHBFUqLOK15l0-K0H3U1dzXeB7hvZ2UEnvmLYySFdlWOW2dcRpY6ZRUrGVKwvtvLo06KLXitooOQ",
    },
  ];

  const klookBase = `https://www.klook.com/en-US/search?query=${encodeURIComponent(cityClean + " packages")}`;
  const affiliateUrl = `https://tp.media/r?marker=${marker}&trs=534470&p=4110&campaign_id=137&u=${encodeURIComponent(klookBase)}`;

  return pkgTemplates.map((p, i) => {
    const initialPrice = Math.round((p.price + Math.random() * 40) * priceMultiplier);
    const initialOrigPrice = Math.round(p.originalPrice * priceMultiplier);

    let price = initialPrice;
    let originalPrice = initialOrigPrice;

    if (baseCurrency !== targetCurrency.toUpperCase()) {
      const priceInUSD = baseCurrency === "INR" ? initialPrice / 83.5 : initialPrice;
      price = Math.round(priceInUSD * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));

      const origPriceInUSD = baseCurrency === "INR" ? initialOrigPrice / 83.5 : initialOrigPrice;
      originalPrice = Math.round(origPriceInUSD * (EXCHANGE_RATES[targetCurrency.toUpperCase()] || 1));
    }

    if (maxPrice) {
      price = Math.round(maxPrice * (0.6 + Math.random() * 0.35));
      originalPrice = Math.round(price * 1.25);
    }

    return {
      id: `p-${encodeURIComponent(destination)}-${i}`,
      name: p.name,
      destination: cityClean,
      duration,
      rating: p.rating,
      reviewsCount: p.reviews,
      inclusions: p.inclusions,
      price,
      originalPrice,
      currency: targetCurrency.toUpperCase(),
      imageUrl: p.image,
      bookingUrl: affiliateUrl,
    };
  });
}

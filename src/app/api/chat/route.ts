import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool, zodSchema, convertToModelMessages } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const marker = process.env.TRAVELPAYOUTS_MARKER || "734132";

    // Convert client UIMessage[] to server ModelMessage[]
    const modelMessages = await convertToModelMessages(messages);

    // Instantiate Google Generative AI provider with fallbacks
    const googleProvider = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
    });

    const result = streamText({
      model: googleProvider("gemini-2.5-flash"),
      system:
        "You are Milo, a premium, friendly AI travel assistant for GlobeTrek. " +
        "You act as a helpful travel concierge. " +
        "When users ask to search for flights or hotels, you MUST call the corresponding searchFlights or searchHotels tool. " +
        "Do NOT write out flights or hotels as text lists, markdown tables, or raw bullet points. Let the system render them as UI cards. " +
        "Simply let the user know you are searching, and then provide a friendly overview of the options found. " +
        "Encourage them to use the 'Book Now' or 'Book Room' buttons on the cards.",
      messages: modelMessages,
      tools: {
        searchFlights: tool({
          description: "Search for flights between an origin and destination airport.",
          inputSchema: zodSchema(z.object({
            origin: z.string().describe("Origin airport code (3 letters, e.g. DEL, SFO, JFK)"),
            destination: z.string().describe("Destination airport code (3 letters, e.g. BLR, NRT, LHR)"),
            departureDate: z.string().describe("Departure date (YYYY-MM-DD)"),
            returnDate: z.string().optional().describe("Return date (YYYY-MM-DD) for round trips"),
            passengers: z.number().optional().default(1).describe("Number of passengers"),
          })),
          execute: async ({
            origin,
            destination,
            departureDate,
            returnDate,
            passengers
          }: {
            origin: string;
            destination: string;
            departureDate: string;
            returnDate?: string;
            passengers: number;
          }) => {
            const flights = getMockFlights(origin, destination, departureDate, returnDate, passengers, marker);
            return { flights };
          },
        }),
        searchHotels: tool({
          description: "Search for hotels in a destination city.",
          inputSchema: zodSchema(z.object({
            destination: z.string().describe("Destination city or region name (e.g. Tokyo, Paris, New Delhi)"),
            checkInDate: z.string().describe("Check-in date (YYYY-MM-DD)"),
            checkOutDate: z.string().describe("Check-out date (YYYY-MM-DD)"),
            guests: z.number().optional().default(1).describe("Number of guests"),
          })),
          execute: async ({
            destination,
            checkInDate,
            checkOutDate,
            guests
          }: {
            destination: string;
            checkInDate: string;
            checkOutDate: string;
            guests: number;
          }) => {
            const hotels = getMockHotels(destination, checkInDate, checkOutDate, guests, marker);
            return { hotels };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function getMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | undefined,
  passengers: number,
  marker: string
) {
  const airlines = [
    { name: "IndiGo", code: "6E" },
    { name: "Air India", code: "AI" },
    { name: "SpiceJet", code: "SG" },
    { name: "Japan Airlines", code: "JL" },
    { name: "All Nippon Airways", code: "NH" },
    { name: "United Airlines", code: "UA" },
    { name: "Delta Air Lines", code: "DL" },
    { name: "British Airways", code: "BA" }
  ];

  const isIndianDomestic =
    ["DEL", "BLR", "BOM", "MAA", "CCU", "HYD", "COK"].includes(origin.toUpperCase()) &&
    ["DEL", "BLR", "BOM", "MAA", "CCU", "HYD", "COK"].includes(destination.toUpperCase());

  const selectedAirlines = isIndianDomestic
    ? airlines.filter(a => ["IndiGo", "Air India", "SpiceJet"].includes(a.name))
    : airlines.filter(a => !["IndiGo", "SpiceJet"].includes(a.name));

  const list = [];
  const baseCurrency = isIndianDomestic ? "INR" : "USD";
  const basePrice = isIndianDomestic ? 5200 : 650;

  for (let i = 0; i < 3; i++) {
    const airline = selectedAirlines[i % selectedAirlines.length] || airlines[0];
    const price = Math.round((basePrice + (i * (isIndianDomestic ? 950 : 120)) + Math.random() * (isIndianDomestic ? 400 : 50)) * passengers);
    const duration = i === 0 ? "2h 45m" : i === 1 ? "4h 10m" : "6h 05m";
    const stops = i === 0 ? 0 : 1;
    const departureTime = i === 0 ? "08:15" : i === 1 ? "13:30" : "18:45";
    const arrivalTime = i === 0 ? "11:00" : i === 1 ? "17:40" : "00:50";
    const flightNo = Math.floor(100 + Math.random() * 900).toString();

    // Web Search link to Jetradar via Travelpayouts
    const targetUrl = `https://www.jetradar.com/search/?origin=${origin}&destination=${destination}&date=${departureDate}${returnDate ? `&return_date=${returnDate}` : ''}&adults=${passengers}&cls=Y`;
    const bookingUrl = `https://tp.media/r?marker=${marker}&trs=534470&p=4110&campaign_id=137&u=${encodeURIComponent(targetUrl)}`;

    list.push({
      id: `f-${origin}-${destination}-${i}-${flightNo}`,
      airlineName: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNo,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureTime,
      arrivalTime,
      duration,
      stops,
      price,
      currency: baseCurrency,
      bookingUrl
    });
  }

  return list;
}

function getMockHotels(
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  guests: number,
  marker: string
) {
  const hotelTemplates = [
    {
      name: "Grand Plaza Resort",
      rating: 4.8,
      stars: 5,
      reviews: 1420,
      price: 180,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuEbHaDd9hzMeAvKZFBYDq8pwMVI2eEI-jxf55NMVypigqJIvaU0vsAbJnHa1pk1mg56QvzOIf8rBIEO5VwPcALlO_hka11uaCVnfngXjQCBXlubpD4Q-MRPSzGDRjRL-ee7nkfhLyT_W4Bug8bdCWGUJG8ZRGefDa7FoFakDMQxAT6Z2RLU5p-9XxLfLVdyC-sTqyVq9SfDfScs-mEdYNSoyisHB9dxwHB2VEUkiLQdl0jpt_nuPv9vKYwMOSDB362kbGObA"
    },
    {
      name: "City Center Suites & Spa",
      rating: 4.5,
      stars: 4,
      reviews: 850,
      price: 120,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO0PQYh2Nu05evh3TNIYEW2aVaufRIM0LE0N8H1KpgoAtAaX8OgesbBdXDZYz6hJPrLv0XvI8h4VySFVCKyPuqhBpcNnL_CfEboa_FjbfMc0T5aCZJ4fjS-suvQPJZiAuWmtTnLj1Ef6VzPlbAOlAT-TS93DSjRjEn3Tzw2-uCAyLTYQdkQt7WtdzCY50tr09pGnFW_PPw8Tv6LRO5D5Pi3VBD4oehExv3PN4PVWscUcPDIveNAzi48LihlRxeYSRiyIa90wm14w"
    },
    {
      name: "Boutique Heritage Inn",
      rating: 4.6,
      stars: 4,
      reviews: 620,
      price: 95,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZtk7U8a5jXVtSYCLnZyhr-RYAk7m0V3P0gjb8upOKniXp1A_mJLgxBdkkbSgmjcNTkYCp-b4yFXVuO_2HTlp90dkDB0H8TDC2eD9PuNOYgC0i-nWpkyW-qVNi8e7uLFPpvO4bSUy9SMb5XWjML9gIoANrHRnGSKRHDNkgWhPqouTNTCwDaYCz7OK_WkSc9jxHBFUqLOK15l0-K0H3U1dzXeB7hvZ2UEnvmLYySFdlWOW2dcRpY6ZRUrGVKwvtvLo06KLXitooOQ"
    }
  ];

  const list = [];
  const isIndia = /delhi|mumbai|bengaluru|bangalore|goa|chennai|kolkata|india/i.test(destination);
  const baseCurrency = isIndia ? "INR" : "USD";
  const rateMultiplier = isIndia ? 80 : 1;

  for (let i = 0; i < hotelTemplates.length; i++) {
    const template = hotelTemplates[i];
    const price = Math.round((template.price + Math.random() * 20) * rateMultiplier);

    let hotelName = template.name;
    const cityClean = destination.split(",")[0].trim();
    hotelName = `${cityClean} ${template.name}`;

    // Booking.com deep link via Travelpayouts
    const targetUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=${guests}`;
    const bookingUrl = `https://tp.media/r?marker=${marker}&p=1904&campaign_id=31&u=${encodeURIComponent(targetUrl)}`;

    list.push({
      id: `h-${encodeURIComponent(destination)}-${i}`,
      name: hotelName,
      location: destination,
      stars: template.stars,
      rating: template.rating,
      reviewsCount: template.reviews,
      pricePerNight: price,
      currency: baseCurrency,
      imageUrl: template.image,
      bookingUrl
    });
  }

  return list;
}

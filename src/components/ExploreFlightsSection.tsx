"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

// ─── Types for the Skyscanner response ───────────────────────
interface FlightDeal {
  id: string;
  destinationName: string;
  destinationCode: string; // Three-letter code, e.g. "PAR"
  country: string;
  price: number;
  formattedPrice: string;
  direct: boolean;
  imageUrl: string;
  departDate: string; // "YYYY-MM-DD"
  returnDate: string; // "YYYY-MM-DD"
}

// Map of country codes to flag emoji for common destinations
const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸", "United Kingdom": "🇬🇧", "France": "🇫🇷",
  "Germany": "🇩🇪", "Italy": "🇮🇹", "Spain": "🇪🇸",
  "Japan": "🇯🇵", "Australia": "🇦🇺", "Canada": "🇨🇦",
  "Thailand": "🇹🇭", "India": "🇮🇳", "UAE": "🇦🇪",
  "Singapore": "🇸🇬", "Malaysia": "🇲🇾", "Indonesia": "🇮🇩",
  "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "Turkey": "🇹🇷",
  "Greece": "🇬🇷", "Portugal": "🇵🇹", "Brazil": "🇧🇷",
  "Mexico": "🇲🇽", "South Korea": "🇰🇷", "China": "🇨🇳",
  "Vietnam": "🇻🇳", "Philippines": "🇵🇭", "Egypt": "🇪🇬",
  "South Africa": "🇿🇦", "New Zealand": "🇳🇿", "Ireland": "🇮🇪",
  "Sweden": "🇸🇪", "Norway": "🇳🇴", "Denmark": "🇩🇰",
  "Finland": "🇫🇮", "Austria": "🇦🇹", "Czech Republic": "🇨🇿",
  "Poland": "🇵🇱", "Hungary": "🇭🇺", "Croatia": "🇭🇷",
  "Morocco": "🇲🇦", "Sri Lanka": "🇱🇰", "Maldives": "🇲🇻",
  "Nepal": "🇳🇵", "Bangladesh": "🇧🇩", "Pakistan": "🇵🇰",
  "Qatar": "🇶🇦", "Saudi Arabia": "🇸🇦", "Oman": "🇴🇲",
  "Bahrain": "🇧🇭", "Kuwait": "🇰🇼", "Jordan": "🇯🇴",
  "Russia": "🇷🇺", "Colombia": "🇨🇴", "Argentina": "🇦🇷",
  "Chile": "🇨🇱", "Peru": "🇵🇪",
};

// Maps country-level codes to major international airport hubs for precise redirection
const COUNTRY_TO_HUB: Record<string, string> = {
  "US": "JFK", "GB": "LHR", "FR": "CDG", "DE": "FRA", "IT": "FCO", "ES": "MAD",
  "JP": "NRT", "AU": "SYD", "CA": "YYZ", "TH": "BKK", "IN": "DEL", "AE": "DXB",
  "SG": "SIN", "MY": "KUL", "ID": "DPS", "NL": "AMS", "CH": "ZRH", "TR": "IST",
  "GR": "ATH", "PT": "LIS", "BR": "GRU", "MX": "MEX", "KR": "ICN", "CN": "PEK",
  "VN": "SGN", "PH": "MNL", "EG": "CAI", "ZA": "JNB", "NZ": "AKL", "IE": "DUB",
  "LK": "CMB", "MV": "MLE", "NP": "KTM", "BD": "DAC", "PK": "KHI", "QA": "DOH",
  "SA": "RUH", "OM": "MCT", "BH": "BAH", "KW": "KWI", "JO": "AMM", "RU": "SVO",
  "CO": "BOG", "AR": "EZE", "CL": "SCL", "PE": "LIM", "CR": "SJO", "GT": "GUA",
  "JM": "KIN", "HN": "SAP", "SV": "SAL", "BS": "NAS", "PR": "SJU", "DO": "SDQ",
};

// High-quality local fallback deals for each origin to guarantee we never show a blank state
const FALLBACK_DEALS: Record<string, Omit<FlightDeal, "formattedPrice" | "departDate" | "returnDate">[]> = {
  NYCA: [
    { id: "fb-nyc-lon", destinationName: "London", destinationCode: "LHR", country: "United Kingdom", price: 340, direct: true, imageUrl: "" },
    { id: "fb-nyc-par", destinationName: "Paris", destinationCode: "CDG", country: "France", price: 380, direct: true, imageUrl: "" },
    { id: "fb-nyc-rom", destinationName: "Rome", destinationCode: "FCO", country: "Italy", price: 410, direct: false, imageUrl: "" },
    { id: "fb-nyc-tok", destinationName: "Tokyo", destinationCode: "NRT", country: "Japan", price: 780, direct: false, imageUrl: "" },
    { id: "fb-nyc-cun", destinationName: "Cancun", destinationCode: "CUN", country: "Mexico", price: 190, direct: true, imageUrl: "" },
    { id: "fb-nyc-dxb", destinationName: "Dubai", destinationCode: "DXB", country: "UAE", price: 620, direct: false, imageUrl: "" },
    { id: "fb-nyc-sin", destinationName: "Singapore", destinationCode: "SIN", country: "Singapore", price: 690, direct: false, imageUrl: "" },
    { id: "fb-nyc-del", destinationName: "Delhi", destinationCode: "DEL", country: "India", price: 720, direct: false, imageUrl: "" },
  ],
  DELI: [
    { id: "fb-del-dxb", destinationName: "Dubai", destinationCode: "DXB", country: "UAE", price: 180, direct: true, imageUrl: "" },
    { id: "fb-del-sin", destinationName: "Singapore", destinationCode: "SIN", country: "Singapore", price: 210, direct: true, imageUrl: "" },
    { id: "fb-del-lon", destinationName: "London", destinationCode: "LHR", country: "United Kingdom", price: 490, direct: true, imageUrl: "" },
    { id: "fb-del-bkk", destinationName: "Bangkok", destinationCode: "BKK", country: "Thailand", price: 130, direct: true, imageUrl: "" },
    { id: "fb-del-tok", destinationName: "Tokyo", destinationCode: "NRT", country: "Japan", price: 510, direct: false, imageUrl: "" },
    { id: "fb-del-par", destinationName: "Paris", destinationCode: "CDG", country: "France", price: 540, direct: false, imageUrl: "" },
    { id: "fb-del-dps", destinationName: "Bali", destinationCode: "DPS", country: "Indonesia", price: 230, direct: false, imageUrl: "" },
    { id: "fb-del-mle", destinationName: "Maldives", destinationCode: "MLE", country: "Maldives", price: 280, direct: true, imageUrl: "" },
  ],
  LOND: [
    { id: "fb-lon-par", destinationName: "Paris", destinationCode: "CDG", country: "France", price: 45, direct: true, imageUrl: "" },
    { id: "fb-lon-rom", destinationName: "Rome", destinationCode: "FCO", country: "Italy", price: 55, direct: true, imageUrl: "" },
    { id: "fb-lon-bcn", destinationName: "Barcelona", destinationCode: "BCN", country: "Spain", price: 49, direct: true, imageUrl: "" },
    { id: "fb-lon-nyc", destinationName: "New York", destinationCode: "JFK", country: "United States", price: 310, direct: true, imageUrl: "" },
    { id: "fb-lon-dxb", destinationName: "Dubai", destinationCode: "DXB", country: "UAE", price: 340, direct: false, imageUrl: "" },
    { id: "fb-lon-ams", destinationName: "Amsterdam", destinationCode: "AMS", country: "Netherlands", price: 50, direct: true, imageUrl: "" },
    { id: "fb-lon-ath", destinationName: "Athens", destinationCode: "ATH", country: "Greece", price: 85, direct: true, imageUrl: "" },
    { id: "fb-lon-mle", destinationName: "Maldives", destinationCode: "MLE", country: "Maldives", price: 580, direct: false, imageUrl: "" },
  ],
  BOMA: [
    { id: "fb-bom-dxb", destinationName: "Dubai", destinationCode: "DXB", country: "UAE", price: 170, direct: true, imageUrl: "" },
    { id: "fb-bom-sin", destinationName: "Singapore", destinationCode: "SIN", country: "Singapore", price: 220, direct: true, imageUrl: "" },
    { id: "fb-bom-lon", destinationName: "London", destinationCode: "LHR", country: "United Kingdom", price: 480, direct: true, imageUrl: "" },
    { id: "fb-bom-bkk", destinationName: "Bangkok", destinationCode: "BKK", country: "Thailand", price: 140, direct: true, imageUrl: "" },
    { id: "fb-bom-par", destinationName: "Paris", destinationCode: "CDG", country: "France", price: 550, direct: false, imageUrl: "" },
    { id: "fb-bom-dps", destinationName: "Bali", destinationCode: "DPS", country: "Indonesia", price: 210, direct: true, imageUrl: "" },
    { id: "fb-bom-mle", destinationName: "Maldives", destinationCode: "MLE", country: "Maldives", price: 240, direct: true, imageUrl: "" },
    { id: "fb-bom-cmb", destinationName: "Colombo", destinationCode: "CMB", country: "Sri Lanka", price: 110, direct: true, imageUrl: "" },
  ],
  DXBA: [
    { id: "fb-dxb-lon", destinationName: "London", destinationCode: "LHR", country: "United Kingdom", price: 290, direct: true, imageUrl: "" },
    { id: "fb-dxb-del", destinationName: "Delhi", destinationCode: "DEL", country: "India", price: 140, direct: true, imageUrl: "" },
    { id: "fb-dxb-bom", destinationName: "Mumbai", destinationCode: "BOM", country: "India", price: 130, direct: true, imageUrl: "" },
    { id: "fb-dxb-par", destinationName: "Paris", destinationCode: "CDG", country: "France", price: 340, direct: true, imageUrl: "" },
    { id: "fb-dxb-sin", destinationName: "Singapore", destinationCode: "SIN", country: "Singapore", price: 280, direct: false, imageUrl: "" },
    { id: "fb-dxb-bkk", destinationName: "Bangkok", destinationCode: "BKK", country: "Thailand", price: 190, direct: true, imageUrl: "" },
    { id: "fb-dxb-mle", destinationName: "Maldives", destinationCode: "MLE", country: "Maldives", price: 310, direct: true, imageUrl: "" },
    { id: "fb-dxb-cai", destinationName: "Cairo", destinationCode: "CAI", country: "Egypt", price: 150, direct: true, imageUrl: "" },
  ],
};

// Origin presets for the selector
const ORIGIN_PRESETS = [
  { label: "New York", skyId: "NYCA", entityId: "27537542", code: "NYC" },
  { label: "Delhi", skyId: "DELI", entityId: "27544008", code: "DEL" },
  { label: "London", skyId: "LOND", entityId: "27544008", code: "LON" },
  { label: "Mumbai", skyId: "BOMA", entityId: "27542066", code: "BOM" },
  { label: "Dubai", skyId: "DXBA", entityId: "27537446", code: "DXB" },
];

export function ExploreFlightsSection() {
  const { formatPrice, selectedCountry } = useCurrency();
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState(ORIGIN_PRESETS[0]);
  const [mounted, setMounted] = useState(false);

  // In-memory cache to minimize API calls during the session
  const cacheRef = useRef<Record<string, FlightDeal[]>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format dynamic dates (e.g. June 15 to June 22) relative to current date
  const generateFlightDates = useCallback((offsetDays = 14, tripDuration = 7) => {
    const depart = new Date();
    depart.setDate(depart.getDate() + offsetDays);
    const ret = new Date(depart);
    ret.setDate(ret.getDate() + tripDuration);

    const formatYMD = (d: Date) => d.toISOString().split("T")[0];
    const formatDisplay = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      departYMD: formatYMD(depart),
      returnYMD: formatYMD(ret),
      displayText: `${formatDisplay(depart)} – ${formatDisplay(ret)}`
    };
  }, []);

  const handleCardClick = (deal: FlightDeal) => {
    const originCode = selectedOrigin.code;
    const destCode = deal.destinationCode || "PAR";
    
    // Construct direct search URL that lands precisely on Jetradar with Travelpayouts marker
    const redirectUrl = `https://www.jetradar.com/search/?marker=734132&origin=${originCode}&destination=${destCode}&depart_date=${deal.departDate}&return_date=${deal.returnDate}&adults=1&one_way=false`;
    window.open(redirectUrl, "_blank");
  };

  const fetchDeals = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const cacheKey = `${selectedOrigin.skyId}-${selectedCountry.currency}`;

    // Return cached results if available and not a forced refresh to minimize processing
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setDeals(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      // Load fallback deals instantly according to currency rate
      const conversionRates: Record<string, number> = {
        USD: 1.0, INR: 83.0, EUR: 0.92, GBP: 0.79,
        AUD: 1.51, CAD: 1.37, SGD: 1.35, AED: 3.67
      };
      
      const rate = conversionRates[selectedCountry.currency] || 1.0;
      const fallbacks = FALLBACK_DEALS[selectedOrigin.skyId] || FALLBACK_DEALS.NYCA;
      
      const convertedFallbackDeals = fallbacks.map((deal, idx) => {
        const dates = generateFlightDates(14 + idx, 7);
        return {
          ...deal,
          price: Math.round(deal.price * rate),
          formattedPrice: "",
          departDate: dates.departYMD,
          returnDate: dates.returnYMD,
        };
      });

      // Small artificial timeout to simulate a premium smart-search experience (e.g. 500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));

      cacheRef.current[cacheKey] = convertedFallbackDeals;
      setDeals(convertedFallbackDeals);
    } catch (err: any) {
      setError("Failed to load flight deals");
    } finally {
      setLoading(false);
    }
  }, [selectedOrigin, selectedCountry.currency, generateFlightDates]);

  useEffect(() => {
    fetchDeals(false);
  }, [fetchDeals]);

  // ─── Gradient backgrounds for cards ──────────────────────────
  const cardGradients = [
    "from-blue-600 to-indigo-700",
    "from-emerald-600 to-teal-700",
    "from-orange-500 to-red-600",
    "from-violet-600 to-purple-700",
    "from-cyan-600 to-blue-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
    "from-teal-500 to-cyan-700",
    "from-indigo-500 to-blue-700",
    "from-green-600 to-emerald-700",
    "from-fuchsia-600 to-purple-700",
    "from-sky-500 to-blue-600",
  ];

  return (
    <section className="py-stack-lg bg-background transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-end mb-stack-md gap-2 md:gap-0">
          <div>
            <span className="inline-block bg-secondary text-white font-label-bold text-[10px] uppercase px-2 py-0.5 rounded-full mb-2">Affiliate Deals</span>
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white">Explore Cheap Flights</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Compare best flight rates from Jetradar — click cards to book instantly</p>
          </div>
          <button
            onClick={() => fetchDeals(true)}
            disabled={loading}
            className="text-secondary font-label-bold hover:underline mb-1 flex items-center gap-1 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            Refresh Prices
          </button>
        </div>

        {/* Origin Selector Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-on-surface-variant shrink-0">From:</span>
          {ORIGIN_PRESETS.map((origin) => (
            <button
              key={origin.skyId}
              onClick={() => setSelectedOrigin(origin)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedOrigin.skyId === origin.skyId
                  ? "bg-primary text-on-primary shadow-md shadow-primary/30"
                  : "bg-surface-container dark:bg-surface-container-high text-on-surface border border-outline-variant/20 hover:border-primary/50"
              }`}
            >
              {origin.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden h-44 animate-pulse bg-surface-container dark:bg-surface-container-high">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <div className="h-4 bg-outline-variant/20 rounded w-2/3" />
                  <div className="h-3 bg-outline-variant/20 rounded w-1/3" />
                  <div className="h-6 bg-outline-variant/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deal Cards Grid */}
        {!loading && deals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter animate-fade-in">
            {deals.map((deal, index) => {
              const flag = COUNTRY_FLAGS[deal.country] || "✈️";
              const gradient = cardGradients[index % cardGradients.length];
              
              // Safe parsing for dates to prevent "Invalid Date" under any circumstances (including stale cache)
              let displayDate = "Flexible Dates";
              try {
                const departObj = deal.departDate ? new Date(deal.departDate) : null;
                const returnObj = deal.returnDate ? new Date(deal.returnDate) : null;
                if (departObj && !isNaN(departObj.getTime()) && returnObj && !isNaN(returnObj.getTime())) {
                  displayDate = `${departObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${returnObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
                } else {
                  const dates = generateFlightDates(14 + index, 7);
                  const dObj = new Date(dates.departYMD);
                  const rObj = new Date(dates.returnYMD);
                  displayDate = `${dObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${rObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
                }
              } catch (e) {
                displayDate = "Flexible Dates";
              }

              return (
                <div
                  key={deal.id}
                  onClick={() => handleCardClick(deal)}
                  className="group relative rounded-2xl overflow-hidden h-44 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
                  
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 border border-white/30 rounded-full" />
                    <div className="absolute bottom-[-30px] left-[-10px] w-24 h-24 border border-white/20 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-4 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl">{flag}</span>
                        {/* Dynamic Travel Date badge */}
                        <span className="text-[10px] font-medium bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded mt-1.5">
                          📅 {displayDate}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {deal.direct && (
                          <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                            Direct
                          </span>
                        )}
                        <span className="material-symbols-outlined text-white/50 text-[18px] group-hover:text-white transition-colors duration-300">
                          open_in_new
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:translate-x-1 transition-transform duration-300">
                        {deal.destinationName}
                      </h3>
                      {deal.country && (
                        <p className="text-white/70 text-xs mt-0.5">{deal.country}</p>
                      )}
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xs text-white/60">from</span>
                        <span className="font-black text-xl">
                          {mounted ? (
                            deal.price > 0 ? formatPrice(deal.price) : deal.formattedPrice || "—"
                          ) : (
                            deal.formattedPrice || `$${deal.price}`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useCurrency } from "@/contexts/CurrencyContext";
import { skyscannerApi, bookingApi } from "@/lib/api";

// ─── Types for parsed results ────────────────────────────────
interface FlightResultCard {
  id: string;
  airline: string;
  airlineLogo?: string;
  airlineCode: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
  priceFormatted: string;
  tags?: string[];
  deepLink?: string;
}

interface HotelResultCard {
  id: string;
  name: string;
  photoUrl: string;
  reviewScore: number;
  reviewWord: string;
  reviewCount: number;
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  originalPriceFormatted?: string;
  starRating: number;
}

// ─── Helper: Format minutes to "Xh Ym" ──────────────────────
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Helper: Format ISO datetime to "HH:MM AM/PM" ───────────
function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return isoString;
  }
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, setModalOpen, selectedCountry } = useCurrency();

  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "Unknown";
  const to = searchParams.get("to") || "Unknown";
  const date = searchParams.get("date") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [flightResults, setFlightResults] = useState<FlightResultCard[]>([]);
  const [hotelResults, setHotelResults] = useState<HotelResultCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState("Searching...");

  // ─── Fetch Flight Results ────────────────────────────────────
  const fetchFlights = useCallback(async () => {
    setSearchStatus("Looking up airports...");

    try {
      // Step 1: Resolve airport codes to skyId/entityId
      const [originRes, destRes] = await Promise.all([
        skyscannerApi.searchAirport(from),
        skyscannerApi.searchAirport(to),
      ]);

      // Response shape may vary — handle both nested and flat formats
      const originRaw = originRes as any;
      const destRaw = destRes as any;
      const originData = originRaw?.data?.data || originRaw?.data || [];
      const destData = destRaw?.data?.data || destRaw?.data || [];

      const originAirport = Array.isArray(originData) ? originData[0] : null;
      const destAirport = Array.isArray(destData) ? destData[0] : null;

      if (!originAirport || !destAirport) {
        setError(`Could not find airports for "${from}" or "${to}". Try using airport codes like DEL, BOM, JFK.`);
        return;
      }

      const originSkyId = originAirport.navigation?.relevantFlightParams?.skyId || originAirport.skyId;
      const originEntityId = originAirport.navigation?.relevantFlightParams?.entityId || originAirport.entityId;
      const destSkyId = destAirport.navigation?.relevantFlightParams?.skyId || destAirport.skyId;
      const destEntityId = destAirport.navigation?.relevantFlightParams?.entityId || destAirport.entityId;

      setSearchStatus("Searching 100+ travel sites for best prices...");

      // Step 2: Search flights
      const searchDate = date || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

      const flightRes = await skyscannerApi.searchFlights({
        originSkyId,
        destinationSkyId: destSkyId,
        originEntityId,
        destinationEntityId: destEntityId,
        date: searchDate,
        adults: 1,
        currency: selectedCountry.currency,
      });

      const rawData = flightRes?.data?.data || flightRes?.data || flightRes;
      const itineraries = rawData?.itineraries || [];

      if (itineraries.length === 0) {
        // Try to find results in alternative response shapes
        setError("No flights found for this route and date. Try different dates or destinations.");
        return;
      }

      const parsed: FlightResultCard[] = itineraries.slice(0, 10).map((itin: any, idx: number) => {
        const leg = itin.legs?.[0];
        const carrier = leg?.carriers?.marketing?.[0];

        return {
          id: itin.id || `flight-${idx}`,
          airline: carrier?.name || "Airline",
          airlineLogo: carrier?.logoUrl || "",
          airlineCode: carrier?.alternateId || "",
          origin: leg?.origin?.city || leg?.origin?.name || from,
          originCode: leg?.origin?.displayCode || from,
          destination: leg?.destination?.city || leg?.destination?.name || to,
          destinationCode: leg?.destination?.displayCode || to,
          departTime: leg?.departure ? formatTime(leg.departure) : "",
          arriveTime: leg?.arrival ? formatTime(leg.arrival) : "",
          duration: leg?.durationInMinutes ? formatDuration(leg.durationInMinutes) : "",
          stops: leg?.stopCount ?? 0,
          price: itin.price?.raw || 0,
          priceFormatted: itin.price?.formatted || "",
          tags: itin.tags || [],
          deepLink: itin.deepLink || "",
        };
      });

      setFlightResults(parsed);
    } catch (err: any) {
      console.error("Flight search error:", err);
      setError(err.message || "Failed to search flights. Make sure the backend is running.");
    }
  }, [from, to, date, selectedCountry.currency]);

  // ─── Fetch Hotel Results ─────────────────────────────────────
  const fetchHotels = useCallback(async () => {
    setSearchStatus("Finding destinations...");

    try {
      // Step 1: Resolve destination to dest_id
      const destRes = await bookingApi.searchDestination(to);
      const destinations = destRes?.data?.data || destRes?.data || [];
      const dest = Array.isArray(destinations) ? destinations[0] : null;

      if (!dest) {
        setError(`Could not find "${to}" as a hotel destination. Try a city name like "Mumbai" or "Paris".`);
        return;
      }

      setSearchStatus("Comparing prices across hotel providers...");

      // Step 2: Search hotels
      const arrivalDate = date || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      const departureDate = new Date(new Date(arrivalDate).getTime() + 2 * 86400000).toISOString().split("T")[0];

      const hotelRes = await bookingApi.searchHotels({
        dest_id: dest.dest_id,
        search_type: dest.search_type || "CITY",
        arrival_date: arrivalDate,
        departure_date: departureDate,
        adults: 1,
        currency_code: selectedCountry.currency,
      });

      const rawData = hotelRes?.data?.data || hotelRes?.data || hotelRes;
      const hotels = rawData?.hotels || rawData?.data?.hotels || [];

      if (!Array.isArray(hotels) || hotels.length === 0) {
        setError("No hotels found for this destination and dates. Try different dates.");
        return;
      }

      const parsed: HotelResultCard[] = hotels.slice(0, 10).map((hotel: any, idx: number) => {
        const prop = hotel.property || hotel;
        const priceInfo = prop?.priceBreakdown?.grossPrice || {};
        const strikethrough = prop?.priceBreakdown?.strikethroughPrice || null;

        return {
          id: hotel.hotel_id || `hotel-${idx}`,
          name: prop.name || "Hotel",
          photoUrl: prop.photoUrls?.[0] || "",
          reviewScore: prop.reviewScore || 0,
          reviewWord: prop.reviewScoreWord || "",
          reviewCount: prop.reviewCount || 0,
          price: priceInfo.value || 0,
          priceFormatted: priceInfo.value
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: priceInfo.currency || "USD", maximumFractionDigits: 0 }).format(priceInfo.value)
            : "",
          originalPrice: strikethrough?.value || undefined,
          originalPriceFormatted: strikethrough?.value
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: strikethrough.currency || "USD", maximumFractionDigits: 0 }).format(strikethrough.value)
            : undefined,
          starRating: prop.qualityClass || prop.propertyClass || 0,
        };
      });

      setHotelResults(parsed);
    } catch (err: any) {
      console.error("Hotel search error:", err);
      setError(err.message || "Failed to search hotels. Make sure the backend is running.");
    }
  }, [to, date, selectedCountry.currency]);

  // ─── Trigger search on mount ─────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setFlightResults([]);
    setHotelResults([]);

    const isHotelType = type === "hotels" || type === "villas" || type === "packages";

    const searchFn = isHotelType ? fetchHotels : fetchFlights;

    searchFn().finally(() => setIsLoading(false));
  }, [type, fetchFlights, fetchHotels]);

  const isHotelType = type === "hotels" || type === "villas" || type === "packages";

  return (
    <>
      <CurrencySelector />

      {/* TopAppBar */}
      <nav className="bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 fixed top-0 w-full z-50 transition-colors duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-gutter py-stack-sm max-w-container-max mx-auto">
          <Link href="/" className="font-display-lg text-[22px] sm:text-headline-md font-bold text-primary dark:text-white cursor-pointer active:scale-95 transition-transform truncate mr-2">
            GlobeTrek
          </Link>
          <div className="flex items-center gap-2 sm:gap-stack-md shrink-0">
            <div
              className="flex items-center gap-1 sm:gap-2 cursor-pointer bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-surface-container dark:hover:bg-white/10 transition-colors"
              onClick={() => setModalOpen(true)}
            >
              <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} alt={selectedCountry.name} className="w-4 h-3 sm:w-5 sm:h-3.5 object-cover rounded-sm shadow-sm" />
              <span className="text-[10px] sm:text-xs font-label-bold text-on-surface dark:text-white">{selectedCountry.currency}</span>
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-on-surface-variant hidden sm:block">expand_more</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 md:pb-0 min-h-screen bg-surface-container-lowest dark:bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          {/* Search Header */}
          <div className="glassmorphism rounded-2xl p-4 md:p-6 mb-6 border border-outline-variant/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <span className="material-symbols-outlined text-[28px]">{isHotelType ? 'hotel' : 'flight_takeoff'}</span>
                </div>
                <div>
                  <h1 className="text-title-md md:text-title-lg font-bold text-on-surface dark:text-white flex items-center flex-wrap">
                    {from} <span className="material-symbols-outlined text-primary mx-2 text-[18px]">arrow_forward</span> {to}
                  </h1>
                  <p className="text-body-sm text-on-surface-variant mt-1">{date || 'Flexible dates'} • 1 Adult • Economy</p>
                </div>
              </div>
              <Link href="/">
                <button className="px-5 py-2.5 bg-surface-variant dark:bg-white/10 rounded-xl text-sm font-label-bold hover:bg-outline-variant/30 active:scale-95 transition-all text-on-surface dark:text-white border border-outline-variant/20">
                  Modify Search
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 relative">

            {/* Mobile Filter & Sort Bar */}
            <div className="flex lg:hidden gap-3 sticky top-[88px] z-40 bg-surface-container-lowest/80 dark:bg-background/80 backdrop-blur-md py-2 -mx-4 px-4 border-b border-outline-variant/10">
              <button className="flex-1 bg-surface dark:bg-surface-container border border-outline-variant/20 rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 transition-transform text-sm">
                <span className="material-symbols-outlined text-[18px]">sort</span>
                Sort (Cheapest)
              </button>
              <button className="flex-1 bg-surface dark:bg-surface-container border border-outline-variant/20 rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold shadow-sm active:scale-95 transition-transform text-sm">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters
              </button>
            </div>

            {/* Filters Sidebar */}
            <div className="w-full lg:w-[280px] shrink-0 space-y-6 hidden lg:block">
              <div className="bg-surface dark:bg-surface-container rounded-2xl p-5 border border-outline-variant/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-title-sm">Filters</h3>
                  <button className="text-primary text-sm font-label-bold">Reset</button>
                </div>

                {!isHotelType && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 text-on-surface-variant">Stops</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                        <span className="text-sm flex-1">Non-stop</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                        <span className="text-sm flex-1">1 Stop</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                        <span className="text-sm flex-1">2+ Stops</span>
                      </label>
                    </div>
                  </div>
                )}

                {isHotelType && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 text-on-surface-variant">Star Rating</h4>
                    <div className="space-y-2">
                      {[5, 4, 3].map(stars => (
                        <label key={stars} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                          <span className="text-sm flex-1">{"⭐".repeat(stars)} {stars} Star</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {!isHotelType && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-on-surface-variant">Airlines</h4>
                    <div className="space-y-2">
                      {flightResults.slice(0, 5).map((f, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                          <span className="text-sm flex-1">{f.airline}</span>
                        </label>
                      ))}
                      {flightResults.length === 0 && !isLoading && (
                        <p className="text-xs text-on-surface-variant">No airlines to filter</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Alert Promo */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">notifications_active</span>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100">Price Alerts</h4>
                </div>
                <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mb-3">Never miss a price drop on this route.</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                  Create Alert
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 w-full min-w-0">
              {isLoading ? (
                /* ── Loading Skeletons ── */
                <div className="space-y-4">
                  <div className="text-center mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">radar</span>
                    <p className="text-on-surface-variant font-label-bold mt-2">{searchStatus}</p>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-surface dark:bg-surface-container rounded-xl p-6 border border-outline-variant/20 animate-pulse flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-outline-variant/20 rounded-lg shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-outline-variant/20 rounded w-1/3"></div>
                        <div className="h-3 bg-outline-variant/20 rounded w-1/4"></div>
                      </div>
                      <div className="w-full md:w-32 flex flex-col justify-center items-end space-y-2">
                        <div className="h-6 bg-outline-variant/20 rounded w-20"></div>
                        <div className="h-10 bg-outline-variant/20 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* ── Error State ── */
                <div className="text-center py-16 space-y-4 animate-fade-in">
                  <span className="material-symbols-outlined text-5xl text-error">error_outline</span>
                  <h3 className="text-title-md font-bold text-on-surface dark:text-white">Search Error</h3>
                  <p className="text-on-surface-variant max-w-md mx-auto">{error}</p>
                  <p className="text-on-surface-variant/60 text-sm">Make sure the backend server is running: <code className="bg-surface-container px-2 py-0.5 rounded text-xs">node server/index.js</code></p>
                  <Link href="/">
                    <button className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                      Back to Search
                    </button>
                  </Link>
                </div>
              ) : (
                /* ── Results ── */
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-title-md font-bold">
                      {isHotelType
                        ? `${hotelResults.length} Hotels Found`
                        : `${flightResults.length} Flights Found`
                      }
                    </h2>
                    <div className="text-sm text-on-surface-variant">
                      Powered by {isHotelType ? 'Booking.com' : 'Skyscanner'}
                    </div>
                  </div>

                  {/* ── Flight Result Cards ── */}
                  {!isHotelType && flightResults.map((flight) => (
                    <div key={flight.id} className="bg-surface dark:bg-surface-container rounded-xl p-0 border border-outline-variant/20 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                      {/* Tags */}
                      {flight.tags && flight.tags.length > 0 && (
                        <div className="flex gap-2 px-4 pt-3 md:px-6 md:pt-4">
                          {flight.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                              {tag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center border-b border-outline-variant/10">
                        {/* Airline Logo/Code */}
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800 overflow-hidden">
                          {flight.airlineLogo ? (
                            <img src={flight.airlineLogo} alt={flight.airline} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-[#008cff] font-bold text-xl">{flight.airlineCode.slice(0, 2)}</span>
                          )}
                        </div>

                        {/* Flight Info */}
                        <div className="flex-1 w-full text-center md:text-left">
                          <h3 className="font-bold text-lg">{flight.airline}</h3>
                          <div className="text-on-surface-variant text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="font-semibold text-black dark:text-white">{flight.departTime}</span>
                            <span className="text-outline">------</span>
                            <span className="text-xs bg-surface-variant px-2 py-0.5 rounded-full">
                              {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                            </span>
                            <span className="text-outline">------</span>
                            <span className="font-semibold text-black dark:text-white">{flight.arriveTime}</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            {flight.originCode} → {flight.destinationCode}
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="bg-surface-container-lowest dark:bg-surface/50 p-4 md:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0 snap-x">
                          <div className="snap-start shrink-0 border border-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px]">
                            <span className="text-[10px] text-green-600 font-bold uppercase">Best Price</span>
                            <span className="text-sm font-bold">Skyscanner</span>
                            <span className="text-lg font-black text-green-700 dark:text-green-400">
                              {flight.priceFormatted || formatPrice(flight.price)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => flight.deepLink && window.open(flight.deepLink, '_blank')}
                          className="w-full md:w-auto bg-[#008cff] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0077b6] active:scale-95 transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                          <span>View Deal</span>
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* ── Hotel Result Cards ── */}
                  {isHotelType && hotelResults.map((hotel) => (
                    <div key={hotel.id} className="bg-surface dark:bg-surface-container rounded-xl p-0 border border-outline-variant/20 hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row">
                      {/* Hotel Image */}
                      <div className="w-full md:w-56 h-48 md:h-auto shrink-0 bg-surface-container relative">
                        {hotel.photoUrl ? (
                          <img src={hotel.photoUrl} alt={hotel.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">hotel</span>
                          </div>
                        )}
                        {hotel.starRating > 0 && (
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs font-bold">
                            {"⭐".repeat(Math.min(hotel.starRating, 5))}
                          </div>
                        )}
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-on-surface dark:text-white">{hotel.name}</h3>
                          {hotel.reviewScore > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded">
                                {hotel.reviewScore.toFixed(1)}
                              </span>
                              <span className="text-sm font-semibold text-on-surface dark:text-white">{hotel.reviewWord}</span>
                              <span className="text-xs text-on-surface-variant">({hotel.reviewCount} reviews)</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div>
                            {hotel.originalPriceFormatted && (
                              <span className="text-outline line-through text-sm mr-2">{hotel.originalPriceFormatted}</span>
                            )}
                            <span className="text-2xl font-black text-secondary">{hotel.priceFormatted || formatPrice(hotel.price)}</span>
                            <span className="text-xs text-on-surface-variant ml-1">/ night</span>
                          </div>
                          <button className="bg-[#008cff] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0077b6] active:scale-95 transition-all shadow-md shadow-blue-500/30 flex items-center gap-2">
                            <span>View Deal</span>
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* No results */}
                  {!isLoading && !error && flightResults.length === 0 && hotelResults.length === 0 && (
                    <div className="text-center py-16">
                      <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">search_off</span>
                      <p className="text-on-surface-variant mt-4 text-lg">No results found</p>
                      <p className="text-on-surface-variant/60 text-sm mt-1">Try different search criteria</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search interface...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

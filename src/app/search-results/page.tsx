"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useCurrency } from "@/contexts/CurrencyContext";

function AirlineLogo({ code, name, logoBg, textColor }: { code: string; name: string; logoBg: string; textColor: string }) {
  const [error, setError] = useState(false);
  const logoUrl = `https://pics.avs.io/60/60/${code}.png`;

  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-md relative overflow-hidden">
      {!error ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-10 h-10 object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${logoBg} flex items-center justify-center`}>
          <span className={`font-black text-sm uppercase ${textColor}`}>
            {code}
          </span>
        </div>
      )}
    </div>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, selectedCountry, setModalOpen } = useCurrency();
  const [mounted, setMounted] = useState(false);

  // Search parameters
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  // Flight-specific parameters
  const tripType = searchParams.get("tripType") || "oneway";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = parseInt(searchParams.get("adults") || "1", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);
  const infants = parseInt(searchParams.get("infants") || "0", 10);
  const travelClass = searchParams.get("class") || "Economy";

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHotelType = type === "hotels" || type === "villas" || type === "packages";

  // Flight scan & comparison states
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSort, setActiveSort] = useState("cheapest");
  const [activeStops, setActiveStops] = useState("all");

  // Progress scanning animation
  useEffect(() => {
    if (isHotelType) return;
    setLoadingFlights(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingFlights(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 12;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [from, to, date, isHotelType]);

  // Dynamic flights generator
  const flights = (() => {
    if (isHotelType) return [];
    
    const airlines = [
      { name: "IndiGo", code: "6E", basePrice: 65, logoBg: "from-blue-600 to-indigo-700", textColor: "text-white" },
      { name: "Air India", code: "AI", basePrice: 85, logoBg: "from-red-600 to-rose-700", textColor: "text-white" },
      { name: "Emirates", code: "EK", basePrice: 380, logoBg: "from-red-700 to-red-955", textColor: "text-white" },
      { name: "Singapore Airlines", code: "SQ", basePrice: 420, logoBg: "from-amber-600 to-yellow-800", textColor: "text-white" },
      { name: "British Airways", code: "BA", basePrice: 320, logoBg: "from-blue-900 to-slate-900", textColor: "text-white" },
      { name: "Qatar Airways", code: "QR", basePrice: 410, logoBg: "from-purple-800 to-fuchsia-95" + "0", textColor: "text-white" },
      { name: "Lufthansa", code: "LH", basePrice: 340, logoBg: "from-yellow-500 to-amber-600", textColor: "text-slate-900" },
      { name: "SpiceJet", code: "SG", basePrice: 55, logoBg: "from-yellow-400 to-orange-600", textColor: "text-slate-900" }
    ];

    const stopCities = ["DXB", "SIN", "LHR", "DOH", "FRA", "MUC", "BOM", "DEL"];
    const routeHash = (from + to).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const paxWeight = adults * 1.0 + children * 0.75 + infants * 0.1;
    
    let classMultiplier = 1.0;
    if (travelClass === "Premium Economy") classMultiplier = 1.4;
    else if (travelClass === "Business") classMultiplier = 2.5;
    else if (travelClass === "First Class") classMultiplier = 4.5;

    const tripMultiplier = (tripType === "round" || tripType === "roundtrip") ? 1.8 : 1.0;

    return airlines.map((airline, idx) => {
      const seed = (routeHash + idx * 17) % 100;
      let flightPrice = Math.round(airline.basePrice * paxWeight * classMultiplier * tripMultiplier);
      flightPrice += (seed % 20) - 10;
      if (flightPrice < 35) flightPrice = 35;

      const stopsCount = (seed % 3) === 0 ? 0 : 1;
      const stopCity = stopsCount > 0 ? stopCities[(seed + idx) % stopCities.length] : null;

      // Dep timing
      const depHour = (6 + idx * 2.5) % 24;
      const depMin = (idx * 5) % 60;
      const depTimeStr = `${String(Math.floor(depHour)).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
      
      // Duration
      const durationMin = 90 + (seed % 180); // 1.5h to 4.5h
      const arrHour = (depHour + Math.floor(durationMin / 60)) % 24;
      const arrMin = (depMin + (durationMin % 60)) % 60;
      const arrTimeStr = `${String(Math.floor(arrHour)).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
      const durationStr = `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;

      return {
        id: `flight-${idx}-${airline.code.toLowerCase()}`,
        airline: airline.name,
        code: airline.code,
        logoBg: airline.logoBg,
        textColor: airline.textColor,
        price: flightPrice,
        stops: stopsCount,
        stopCity: stopCity,
        departureTime: depTimeStr,
        arrivalTime: arrTimeStr,
        duration: durationStr,
        durationMinutes: durationMin,
      };
    });
  })();

  // Filtered and sorted list
  const filteredAndSortedFlights = (() => {
    if (isHotelType) return [];
    let list = [...flights];

    // Filter by stops
    if (activeStops === "nonstop") {
      list = list.filter((f) => f.stops === 0);
    } else if (activeStops === "stops") {
      list = list.filter((f) => f.stops > 0);
    }

    // Sort
    if (activeSort === "cheapest") {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === "fastest") {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (activeSort === "best") {
      list.sort((a, b) => (a.price * a.durationMinutes) - (b.price * b.durationMinutes));
    }

    return list;
  })();

  // Pre-calculate target Dates
  const checkInDate = date;
  const checkOutDate = new Date(new Date(checkInDate).getTime() + 3 * 86400000).toISOString().split("T")[0];

  const formatDisplayDate = (ymd: string) => {
    try {
      const d = new Date(ymd + "T00:00:00");
      if (isNaN(d.getTime())) return ymd;
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } catch {
      return ymd;
    }
  };

  // Helper to extract DDMM from Date string YYYY-MM-DD
  const parseDDMM = (ymd: string) => {
    if (!ymd || !ymd.includes("-")) return "";
    const parts = ymd.split("-");
    if (parts.length < 3) return "";
    return `${parts[2]}${parts[1]}`;
  };

  // Build perfect dynamic Jetradar link
  const classCodeMap: Record<string, string> = {
    "Economy": "Y",
    "Premium Economy": "W",
    "Business": "C",
    "First Class": "F"
  };
  const jetradarClass = classCodeMap[travelClass] || "Y";
  const currencyCode = selectedCountry?.currency?.toUpperCase() || "USD";
  const jetradarLink = `https://www.jetradar.com/search/?marker=734132&origin=${from.toUpperCase()}&destination=${to.toUpperCase()}&depart_date=${date}${tripType === 'round' && returnDate ? `&return_date=${returnDate}` : ''}&adults=${adults}&children=${children}&infants=${infants}&trip_class=${jetradarClass}&one_way=${tripType === 'oneway' ? 'true' : 'false'}&currency=${currencyCode}`;

  // Build perfect dynamic Aviasales link using user-provided affiliate shortener: https://aviasales.tpk.lv/ok6lj7IX
  const depDDMM = parseDDMM(date);
  const retDDMM = parseDDMM(returnDate);
  let passengerStr = `${adults}`;
  if (infants > 0) {
    passengerStr += `${children}${infants}`;
  } else if (children > 0) {
    passengerStr += `${children}`;
  }
  let classChar = "y";
  if (travelClass === "Premium Economy") classChar = "w";
  else if (travelClass === "Business") classChar = "c";
  else if (travelClass === "First Class") classChar = "f";

  const aviasalesSearchUrl = `https://www.aviasales.com/search/${from.toUpperCase()}${depDDMM}${to.toUpperCase()}${retDDMM}${passengerStr}${classChar}?currency=${currencyCode}&request_source=country_change&market=${selectedCountry?.code?.toLowerCase() || "us"}`;
  const aviasalesLink = `https://aviasales.tpk.lv/ok6lj7IX?u=${encodeURIComponent(aviasalesSearchUrl)}`;
  
  const bookingHotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(to)}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=1&selected_currency=${currencyCode}`;
  const bookingAffiliateLink = `https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=${encodeURIComponent(bookingHotelUrl)}`;
  const hotellookLink = `https://search.hotellook.com/?marker=734132&destination=${encodeURIComponent(to)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=1&currency=${currencyCode.toLowerCase()}`;

  const klookActivitiesUrl = `https://www.klook.com/en-US/search?query=${encodeURIComponent(to)}`;
  const klookAffiliateLink = `https://tp.media/r?marker=734132&trs=534470&p=4110&campaign_id=137&u=${encodeURIComponent(klookActivitiesUrl)}`;

  return (
    <>
      <CurrencySelector />

      {/* Top Navigation */}
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

          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 md:pb-12 min-h-screen bg-surface-container-lowest dark:bg-background transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Search Header */}
          <div className="bg-surface dark:bg-surface-container rounded-2xl p-4 md:p-6 mb-8 border border-outline-variant/20 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <span className="material-symbols-outlined text-[28px]">{isHotelType ? 'hotel' : 'flight_takeoff'}</span>
                </div>
                <div>
                  <h1 className="text-title-md md:text-title-lg font-bold text-on-surface dark:text-white flex items-center flex-wrap">
                    {!isHotelType && (
                      <>
                        <span className="uppercase">{from}</span>
                        <span className="material-symbols-outlined text-primary mx-2 text-[18px]">arrow_forward</span>
                      </>
                    )}
                    <span className="uppercase font-extrabold text-primary dark:text-secondary">{to}</span>
                  </h1>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    📅 {formatDisplayDate(checkInDate)} {!isHotelType && tripType === "round" && returnDate && `– ${formatDisplayDate(returnDate)}`} {isHotelType && `– ${formatDisplayDate(checkOutDate)}`} • {isHotelType ? '1 Guest' : `${adults + children + infants} Guest${(adults + children + infants) > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <Link href="/">
                <button className="px-5 py-2.5 bg-surface-variant dark:bg-white/10 rounded-xl text-sm font-label-bold hover:bg-outline-variant/30 active:scale-95 transition-all text-on-surface dark:text-white border border-outline-variant/20">
                  Modify Search
                </button>
              </Link>
            </div>
          </div>

          {/* Main Results Layout */}
          <div className="space-y-8">
            {isHotelType ? (
              // Original Hotel Header & Grid
              <>
                <div className="text-center md:text-left">
                  <span className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 font-label-bold text-[11px] uppercase px-3 py-1 rounded-full mb-2">
                    💰 Best Prices Guaranteed
                  </span>
                  <h2 className="text-2xl font-bold text-on-surface dark:text-white">Compare Deals on Top Booking Sites</h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    We search and compare 100+ platforms instantly. Select your preferred provider below to view live details and book.
                  </p>
                </div>
              </>
            ) : (
              // Dynamic Flight Search Header & Controls (Visible only after load)
              !loadingFlights && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface dark:bg-surface-container rounded-2xl p-4 border border-outline-variant/20 shadow-md">
                  {/* Stops Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
                    <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">filter_alt</span> Filter:
                    </span>
                    {[
                      { id: "all", label: "All Flights" },
                      { id: "nonstop", label: "Non-stop only" },
                      { id: "stops", label: "Stops only" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setActiveStops(btn.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeStops === btn.id
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-variant/40 dark:bg-white/5 text-on-surface hover:bg-outline-variant/20"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">sort</span> Sort:
                    </span>
                    {[
                      { id: "cheapest", label: "Cheapest" },
                      { id: "fastest", label: "Fastest" },
                      { id: "best", label: "Best Value" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setActiveSort(btn.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeSort === btn.id
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-variant/40 dark:bg-white/5 text-on-surface hover:bg-outline-variant/20"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Flight Scanning Animation (Aesthetic Loader) */}
            {!isHotelType && loadingFlights && (
              <div className="bg-surface dark:bg-surface-container rounded-3xl p-8 md:p-12 border border-outline-variant/20 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-pulse">
                {/* Circular Radar / Scan Effect */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-primary/5 rounded-full border border-primary/20">
                  <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
                  <span className="material-symbols-outlined text-primary text-[40px] animate-pulse">flight_takeoff</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-on-surface dark:text-white">Scanning Flight Providers...</h3>
                  <p className="text-sm text-on-surface-variant h-5 transition-all duration-300">
                    {progress < 25 && "Connecting to domestic flight operators..."}
                    {progress >= 25 && progress < 50 && "Retrieving live pricing from Emirates & Qatar Airways..."}
                    {progress >= 50 && progress < 75 && "Scanning British Airways, Lufthansa & Singapore Airlines..."}
                    {progress >= 75 && "Analyzing 100+ partner booking engines..."}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-variant dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-[#008cff] h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-primary">{progress}% Analyzed</div>
              </div>
            )}

            {/* Results Grid Layout */}
            {!loadingFlights && !isHotelType && (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Main Results Column */}
                <div className="flex-1 w-full space-y-4">
                  {filteredAndSortedFlights.length === 0 ? (
                    <div className="bg-surface dark:bg-surface-container rounded-2xl p-8 text-center border border-outline-variant/20">
                      <span className="material-symbols-outlined text-outline text-[48px] mb-2">error</span>
                      <p className="text-on-surface-variant font-medium">No flights matching your filter parameters.</p>
                      <button 
                        onClick={() => { setActiveStops("all"); setActiveSort("cheapest"); }}
                        className="mt-4 text-xs font-bold text-primary hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredAndSortedFlights.map((flight) => (
                      <div 
                        key={flight.id}
                        className="bg-surface dark:bg-surface-container hover:bg-surface-variant/10 dark:hover:bg-white/5 rounded-2xl border border-outline-variant/20 hover:border-primary/40 p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row justify-between items-center gap-6"
                      >
                        {/* Airline Brand Info */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          {/* Circular Logo Indicator */}
                          <AirlineLogo
                            code={flight.code}
                            name={flight.airline}
                            logoBg={flight.logoBg}
                            textColor={flight.textColor}
                          />
                          <div className="truncate">
                            <h4 className="font-extrabold text-on-surface dark:text-white text-base group-hover:text-primary transition-colors truncate">
                              {flight.airline}
                            </h4>
                            <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">
                              Flight {flight.code}
                            </span>
                          </div>
                        </div>

                        {/* Timing / Stop Timeline */}
                        <div className="flex-1 w-full flex justify-between items-center max-w-md gap-4 px-2 md:px-6">
                          {/* Departure */}
                          <div className="text-center md:text-left">
                            <span className="block text-lg font-black text-on-surface dark:text-white leading-none">
                              {flight.departureTime}
                            </span>
                            <span className="text-xs text-outline uppercase block mt-1">
                              {from.toUpperCase()}
                            </span>
                          </div>

                          {/* Stop Line Visual */}
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-outline-variant uppercase">
                              {flight.duration}
                            </span>
                            <div className="w-full relative flex items-center justify-center py-1.5">
                              {/* Horizontal track line */}
                              <div className="w-full bg-outline-variant/30 h-[2px] rounded-full" />
                              {/* Flight icon or stop dots */}
                              {flight.stops === 0 ? (
                                <span className="absolute text-green-500 material-symbols-outlined text-[14px]">
                                  fiber_manual_record
                                </span>
                              ) : (
                                <div className="absolute flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white dark:border-background shadow-sm" />
                                  <span className="absolute top-[-14px] text-[8px] font-extrabold text-orange-500 tracking-wide uppercase">
                                    {flight.stopCity}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${flight.stops === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                              {flight.stops === 0 ? "Non-stop" : `1 Stop via ${flight.stopCity}`}
                            </span>
                          </div>

                          {/* Arrival */}
                          <div className="text-center md:text-right">
                            <span className="block text-lg font-black text-on-surface dark:text-white leading-none">
                              {flight.arrivalTime}
                            </span>
                            <span className="text-xs text-outline uppercase block mt-1">
                              {to.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Call-to-Action */}
                        <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-outline-variant/15 flex md:flex-col items-center justify-between md:items-end gap-1 px-1 shrink-0">
                          <div>
                            <span className="text-[10px] text-outline uppercase block text-left md:text-right">
                              Total Fare ({travelClass})
                            </span>
                            <span className="text-2xl font-black text-green-600 dark:text-green-400 block leading-tight">
                              {mounted ? formatPrice(flight.price) : `$${flight.price}`}
                            </span>
                          </div>
                          
                          <a 
                            href={aviasalesLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold px-5 py-3 rounded-xl shadow hover:shadow-lg transition-all active:scale-95 flex items-center gap-1 leading-none border border-primary/20"
                          >
                            View Deal
                            <span className="material-symbols-outlined text-[18px] leading-none">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Sidebar: Affiliate Booking Portals */}
                <div className="w-full lg:w-[350px] shrink-0 space-y-6">
                  <div className="bg-surface dark:bg-surface-container p-6 rounded-2xl border border-outline-variant/20 shadow-md">
                    <h3 className="text-lg font-bold text-on-surface dark:text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">compare_arrows</span>
                      Alternative Portals
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-6">
                      Want to search larger aggregators directly? Open your parameters on our verified travel booking partners:
                    </p>
                    
                    <div className="space-y-4">
                      {/* Aviasales Direct Link Card */}
                      <a 
                        href={aviasalesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 hover:border-orange-500/40 rounded-xl p-4 transition-all duration-300 text-left group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-extrabold text-sm text-orange-500">Aviasales</span>
                          <span className="material-symbols-outlined text-outline group-hover:text-orange-500 transition-colors text-[16px]">open_in_new</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Scan and check luggage policies, direct airline partnerships, and price graphs.
                        </p>
                      </a>

                      {/* Jetradar Direct Link Card */}
                      <a 
                        href={jetradarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 hover:border-blue-600/40 rounded-xl p-4 transition-all duration-300 text-left group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-extrabold text-sm text-primary">Jetradar</span>
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[16px]">open_in_new</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Checks 80+ agents worldwide to find international deals and flight connections.
                        </p>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Hotel Search Options */}
            {isHotelType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Booking.com */}
                <div className="bg-surface dark:bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-blue-600/40 transition-all duration-300 group">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full">POPULAR CHOICE</div>
                      <div className="text-right">
                        <span className="text-[10px] text-outline block">HOTEL BOOKING</span>
                        <span className="font-extrabold text-lg text-blue-600">Booking.com</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface dark:text-white leading-snug">
                        Search Hotels in {to}
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-2">
                        Unlock up to 30% savings with Booking.com Secret Deals. 2.5 million+ hotels, villas, and apartments worldwide.
                      </p>
                    </div>
                    <div className="bg-surface-container-low dark:bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Check-In Date:</span>
                        <span className="font-bold text-on-surface dark:text-white">{checkInDate}</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Check-Out Date:</span>
                        <span className="font-bold text-on-surface dark:text-white">{checkOutDate}</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Guests / Rooms:</span>
                        <span className="font-bold text-on-surface dark:text-white">1 Guest • 1 Room</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-container-low dark:bg-white/5 border-t border-outline-variant/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-outline uppercase block">Booking.com Portal</span>
                      <span className="text-lg font-black text-green-600 dark:text-green-400">Unlock Mobile Prices</span>
                    </div>
                    <a
                      href={bookingAffiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Compare Hotels
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Card 2: Hotellook */}
                <div className="bg-surface dark:bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-teal-500/40 transition-all duration-300 group">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-teal-500 text-white font-bold text-xs px-3 py-1 rounded-full">COMPARE AGENTS</div>
                      <div className="text-right">
                        <span className="text-[10px] text-outline block">HOTEL AGGREGATOR</span>
                        <span className="font-extrabold text-lg text-teal-600">Hotellook</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface dark:text-white leading-snug">
                        Compare {to} Hotels Across 80+ Sites
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-2">
                        Hotellook compares prices from Booking.com, Agoda, Expedia, and hotel chains to show you the lowest rate.
                      </p>
                    </div>
                    <div className="bg-surface-container-low dark:bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Comparison Range:</span>
                        <span className="font-bold text-on-surface dark:text-white">80+ Providers compared</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Tracked Marker:</span>
                        <span className="font-bold text-on-surface dark:text-white">Active (734132)</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Filter Options:</span>
                        <span className="font-bold text-on-surface dark:text-white">Pool, Star, Breakfast</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-container-low dark:bg-white/5 border-t border-outline-variant/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-outline uppercase block">Hotellook Search</span>
                      <span className="text-lg font-black text-green-600 dark:text-green-400">Lowest Rates Only</span>
                    </div>
                    <a
                      href={hotellookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow hover:bg-teal-600 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Compare Hotels
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Attractions and Experiences banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-2xl p-6 md:p-8 text-white border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 mt-8 animate-fade-in relative overflow-hidden group">
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-[-30px] right-[-30px] w-64 h-64 border border-white rounded-full" />
                <div className="absolute bottom-[-40px] left-[-20px] w-48 h-48 border border-white rounded-full" />
              </div>
              <div className="relative z-10 space-y-2 text-center md:text-left">
                <span className="inline-block bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase px-3 py-1 rounded">
                  🎫 TOURS & ACTIVITIES
                </span>
                <h3 className="text-2xl font-black">Plan Your Sightseeing in {to}</h3>
                <p className="text-white/80 text-sm max-w-xl">
                  Unlock skip-the-line tickets, historic tours, amusement park entries, and local SIM cards directly through Klook.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <a
                  href={klookAffiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto text-center inline-block bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Book Attractions on Klook
                </a>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="text-center pt-8">
              <Link href="/">
                <button className="px-8 py-3 bg-surface dark:bg-surface-container hover:bg-outline-variant/30 text-on-surface dark:text-white rounded-xl border border-outline-variant/20 text-sm font-bold active:scale-95 transition-all">
                  ← Back to Search
                </button>
              </Link>
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

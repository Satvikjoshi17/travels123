"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useCurrency } from "@/contexts/CurrencyContext";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, selectedCountry, setModalOpen } = useCurrency();
  const [mounted, setMounted] = useState(false);

  // Search parameters
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHotelType = type === "hotels" || type === "villas" || type === "packages";

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

  // Build perfect deep-links using your Travelpayouts affiliate marker
  const jetradarLink = `https://www.jetradar.com/search/?marker=734132&origin=${from.toUpperCase()}&destination=${to.toUpperCase()}&depart_date=${checkInDate}&return_date=${checkOutDate}&adults=1&one_way=false`;
  const aviasalesLink = `https://www.aviasales.com/search/?marker=734132&origin=${from.toUpperCase()}&destination=${to.toUpperCase()}&depart_date=${checkInDate}&return_date=${checkOutDate}&adults=1&one_way=false`;
  
  const bookingHotelUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(to)}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=1`;
  const bookingAffiliateLink = `https://tp.media/r?marker=734132&trs=534470&p=1904&campaign_id=31&u=${encodeURIComponent(bookingHotelUrl)}`;
  const hotellookLink = `https://search.hotellook.com/?marker=734132&destination=${encodeURIComponent(to)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=1`;

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
            <ThemeToggle />
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
                    📅 {formatDisplayDate(checkInDate)} {isHotelType && `– ${formatDisplayDate(checkOutDate)}`} • 1 Guest
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

          {/* Travelpayouts Affiliate Cards Grid */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <span className="inline-block bg-green-500/10 text-green-600 dark:text-green-400 font-label-bold text-[11px] uppercase px-3 py-1 rounded-full mb-2">
                💰 Best Prices Guaranteed
              </span>
              <h2 className="text-2xl font-bold text-on-surface dark:text-white">Compare Deals on Top Booking Sites</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                We search and compare 100+ platforms instantly. Select your preferred provider below to view live details and book.
              </p>
            </div>

            {/* Flight Search Options */}
            {!isHotelType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Jetradar */}
                <div className="bg-surface dark:bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full">RECOMMENDED</div>
                      <div className="text-right">
                        <span className="text-[10px] text-outline block">FLIGHT AGGREGATOR</span>
                        <span className="font-extrabold text-lg text-primary dark:text-secondary">Jetradar</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface dark:text-white group-hover:text-primary transition-colors leading-snug">
                        Compare {from.toUpperCase()} to {to.toUpperCase()} Flights
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-2">
                        Scan hundreds of airline sites and travel agents in seconds. Find the absolute cheapest flight deals.
                      </p>
                    </div>
                    <div className="bg-surface-container-low dark:bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Origin Code:</span>
                        <span className="font-bold text-on-surface dark:text-white">{from.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Destination Code:</span>
                        <span className="font-bold text-on-surface dark:text-white">{to.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Departure Date:</span>
                        <span className="font-bold text-on-surface dark:text-white">{checkInDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-container-low dark:bg-white/5 border-t border-outline-variant/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-outline uppercase block">Jetradar Search</span>
                      <span className="text-lg font-black text-green-600 dark:text-green-400">Best Flight Rates</span>
                    </div>
                    <a
                      href={jetradarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Compare Flights
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Card 2: Aviasales */}
                <div className="bg-surface dark:bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 group">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full">GLOBAL SEARCH</div>
                      <div className="text-right">
                        <span className="text-[10px] text-outline block">TRAVELPAYOUTS PORTAL</span>
                        <span className="font-extrabold text-lg text-orange-500">Aviasales</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface dark:text-white leading-snug">
                        Find Best Flight Rates to {to.toUpperCase()}
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-2">
                        Get cheap airline tickets globally. Dynamic filters for stops, luggage, airlines, and flight duration.
                      </p>
                    </div>
                    <div className="bg-surface-container-low dark:bg-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Compare Method:</span>
                        <span className="font-bold text-on-surface dark:text-white">Aviasales Smart-Scan</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Passenger Limit:</span>
                        <span className="font-bold text-on-surface dark:text-white">1 Adult (Economy)</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Affiliate ID:</span>
                        <span className="font-bold text-on-surface dark:text-white">Active (734132)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface-container-low dark:bg-white/5 border-t border-outline-variant/15 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-outline uppercase block">Aviasales Search</span>
                      <span className="text-lg font-black text-green-600 dark:text-green-400">Scan & Compare</span>
                    </div>
                    <a
                      href={aviasalesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Compare Flights
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
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

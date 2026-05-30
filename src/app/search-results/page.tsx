"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useCurrency } from "@/contexts/CurrencyContext";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, setModalOpen, selectedCountry } = useCurrency();
  
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "Unknown";
  const to = searchParams.get("to") || "Unknown";
  const date = searchParams.get("date") || "Anytime";

  const [isLoading, setIsLoading] = useState(true);

  // Fake API delay simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds fake loading
    return () => clearTimeout(timer);
  }, []);

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
                  <span className="material-symbols-outlined text-[28px]">{type === 'hotels' ? 'hotel' : 'flight_takeoff'}</span>
                </div>
                <div>
                  <h1 className="text-title-md md:text-title-lg font-bold text-on-surface dark:text-white flex items-center flex-wrap">
                    {from} <span className="material-symbols-outlined text-primary mx-2 text-[18px]">arrow_forward</span> {to}
                  </h1>
                  <p className="text-body-sm text-on-surface-variant mt-1">{date} • 1 Adult • Economy</p>
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
            
            {/* Mobile Filter & Sort Bar (Visible only on small screens) */}
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

            {/* Filters Sidebar (Left Column) */}
            <div className="w-full lg:w-[280px] shrink-0 space-y-6 hidden lg:block">
              {/* Filter Card */}
              <div className="bg-surface dark:bg-surface-container rounded-2xl p-5 border border-outline-variant/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-title-sm">Filters</h3>
                  <button className="text-primary text-sm font-label-bold">Reset</button>
                </div>
                
                {/* Stops Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-3 text-on-surface-variant">Stops</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                      <span className="text-sm flex-1">Non-stop</span>
                      <span className="text-xs text-on-surface-variant">{formatPrice(120)}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                      <span className="text-sm flex-1">1 Stop</span>
                      <span className="text-xs text-on-surface-variant">{formatPrice(85)}</span>
                    </label>
                  </div>
                </div>

                {/* Airlines Filter */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-on-surface-variant">Airlines</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                      <span className="text-sm flex-1">IndiGo</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                      <span className="text-sm flex-1">Air India</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20" defaultChecked />
                      <span className="text-sm flex-1">Vistara</span>
                    </label>
                  </div>
                </div>
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

            {/* Results Area (Right Column) */}
            <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            // Loading Skeletons
            <div className="space-y-4">
              <div className="text-center mb-6 animate-pulse">
                <span className="material-symbols-outlined text-4xl text-primary animate-bounce">radar</span>
                <p className="text-on-surface-variant font-label-bold mt-2">Searching 100+ sites for the best {type}...</p>
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
          ) : (
            // Aggregator Style Results
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-title-md font-bold">Cheapest {type} Options</h2>
                <div className="text-sm text-on-surface-variant">Showing prices from 50+ providers</div>
              </div>
              
              {/* Result Card 1 */}
              <div className="bg-surface dark:bg-surface-container rounded-xl p-0 border border-outline-variant/20 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center border-b border-outline-variant/10">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#008cff] rounded-lg flex items-center justify-center font-bold text-xl shrink-0 border border-blue-100 dark:border-blue-800">
                    {type === 'hotels' ? 'Taj' : '6E'}
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <h3 className="font-bold text-lg">{type === 'hotels' ? 'Taj Lands End' : 'IndiGo Airlines'}</h3>
                    <div className="text-on-surface-variant text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                      <span className="font-semibold text-black dark:text-white">10:00 AM</span>
                      <span className="text-outline">------</span>
                      <span className="text-xs bg-surface-variant px-2 py-0.5 rounded-full">{type === 'hotels' ? '5 Star' : '2h 30m • Direct'}</span>
                      <span className="text-outline">------</span>
                      <span className="font-semibold text-black dark:text-white">12:30 PM</span>
                    </div>
                  </div>
                </div>
                
                {/* Providers Section (The Aggregator Magic) */}
                <div className="bg-surface-container-lowest dark:bg-surface/50 p-4 md:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0 snap-x">
                    <div className="snap-start shrink-0 border border-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px]">
                      <span className="text-[10px] text-green-600 font-bold uppercase">Cheapest</span>
                      <span className="text-sm font-bold">MakeMyTrip</span>
                      <span className="text-lg font-black text-green-700 dark:text-green-400">{formatPrice(120)}</span>
                    </div>
                    <div className="snap-start shrink-0 border border-outline-variant/20 bg-white dark:bg-surface-container px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px] opacity-70 hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-on-surface-variant uppercase">&nbsp;</span>
                      <span className="text-sm font-bold">Agoda</span>
                      <span className="text-lg font-bold">{formatPrice(125)}</span>
                    </div>
                    <div className="snap-start shrink-0 border border-outline-variant/20 bg-white dark:bg-surface-container px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px] opacity-70 hover:opacity-100 transition-opacity flex sm:flex">
                      <span className="text-[10px] text-on-surface-variant uppercase">&nbsp;</span>
                      <span className="text-sm font-bold">Cleartrip</span>
                      <span className="text-lg font-bold">{formatPrice(128)}</span>
                    </div>
                  </div>
                  <button className="w-full md:w-auto bg-[#008cff] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0077b6] active:scale-95 transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-2">
                    <span>View Deal</span>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </div>
              </div>

              {/* Result Card 2 */}
              <div className="bg-surface dark:bg-surface-container rounded-xl p-0 border border-outline-variant/20 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center border-b border-outline-variant/10">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-[#d32f2f] rounded-lg flex items-center justify-center font-bold text-xl shrink-0 border border-red-100 dark:border-red-800">
                    {type === 'hotels' ? 'IBIS' : 'AI'}
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <h3 className="font-bold text-lg">{type === 'hotels' ? 'Ibis Styles' : 'Air India'}</h3>
                    <div className="text-on-surface-variant text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                      <span className="font-semibold text-black dark:text-white">02:15 PM</span>
                      <span className="text-outline">------</span>
                      <span className="text-xs bg-surface-variant px-2 py-0.5 rounded-full">{type === 'hotels' ? '3 Star' : '4h 15m • 1 Stop'}</span>
                      <span className="text-outline">------</span>
                      <span className="font-semibold text-black dark:text-white">06:30 PM</span>
                    </div>
                  </div>
                </div>
                
                {/* Providers Section */}
                <div className="bg-surface-container-lowest dark:bg-surface/50 p-4 md:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0 snap-x">
                    <div className="snap-start shrink-0 border border-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px]">
                      <span className="text-[10px] text-green-600 font-bold uppercase">Cheapest</span>
                      <span className="text-sm font-bold">Booking.com</span>
                      <span className="text-lg font-black text-green-700 dark:text-green-400">{formatPrice(85)}</span>
                    </div>
                    <div className="snap-start shrink-0 border border-outline-variant/20 bg-white dark:bg-surface-container px-3 py-1.5 rounded-lg flex flex-col items-center min-w-[110px] opacity-70 hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-on-surface-variant uppercase">&nbsp;</span>
                      <span className="text-sm font-bold">Expedia</span>
                      <span className="text-lg font-bold">{formatPrice(89)}</span>
                    </div>
                  </div>
                  <button className="w-full md:w-auto bg-[#008cff] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0077b6] active:scale-95 transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-2">
                    <span>View Deal</span>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </button>
                </div>
              </div>

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

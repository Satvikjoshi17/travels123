"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface LocationObj {
  title: string;
  subtitle: string;
  code?: string;
  searchString: string;
}

/* ───────── Tab definitions ───────── */
interface TabDef {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string;
}

const tabs: TabDef[] = [
  {
    id: "flights", label: "Flights",
    icon: <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />,
  },
  {
    id: "hotels", label: "Hotels",
    icon: <path d="M7 13h10v7H7zm12-8h-2V3H7v2H5c-1.1 0-2 .9-2 2v13h2v-2h14v2h2V7c0-1.1-.9-2-2-2zm0 10H5V7h14v8z" />,
  },
  {
    id: "villas", label: "Villas &\nHomestays",
    icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
  },
  {
    id: "packages", label: "Holiday\nPackages",
    icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />,
  },
  {
    id: "buses", label: "Buses",
    icon: <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 6c0-1.08 2.26-2 7-2s7 .92 7 2v5H5V6z" />,
  },
  {
    id: "cabs", label: "Cabs",
    icon: <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />,
  },
  {
    id: "tours", label: "Tours &\nAttractions",
    icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />,
  },
];



/* ───────── Component ───────── */
export function SearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("flights");

  /* Location state */
  const [fromObj, setFromObj] = useState<LocationObj | null>({ title: "Delhi", subtitle: "DEL, Delhi Airport India", code: "DEL", searchString: "delhi del" });
  const [toObj, setToObj] = useState<LocationObj | null>({ title: "Bengaluru", subtitle: "BLR, Bengaluru International Airport", code: "BLR", searchString: "bengaluru blr" });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");

  const [fromActiveIndex, setFromActiveIndex] = useState(0);
  const [toActiveIndex, setToActiveIndex] = useState(0);

  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  /* Date state */
  const [date, setDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");

  /* Cab pickup time state */
  const [pickupTime, setPickupTime] = useState("09:00 AM");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  /* Traveller state */
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);

  /* Trip type */
  const [tripType, setTripType] = useState("oneway");



  /* Price drop */
  const [priceDropChecked, setPriceDropChecked] = useState(false);

  /* Data */
  const [globalAirports, setGlobalAirports] = useState<LocationObj[]>([]);
  const [globalCities, setGlobalCities] = useState<LocationObj[]>([]);

  /* Refs */
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const travellerRef = useRef<HTMLDivElement>(null);
  const departureDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  /* Initialize default dates on mount */
  useEffect(() => {
    const today = new Date();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + 4);
    const returnDateStr = returnDate.toISOString().split('T')[0];
    
    setDate(tomorrowStr);
    setCheckoutDate(returnDateStr);
  }, []);

  /* Load location data */
  useEffect(() => {
    fetch('/data/airports.json')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((a: any) => ({
          title: a.city || a.name,
          subtitle: `${a.code}, ${a.name}, ${a.country}`,
          code: a.code,
          searchString: `${a.city} ${a.name} ${a.code} ${a.country}`.toLowerCase()
        }));
        setGlobalAirports(formatted);
      })
      .catch(err => console.error("Failed to load airports", err));

    fetch('/data/cities.json')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((c: string) => {
          const parts = c.split(', ');
          return { title: parts[0], subtitle: c, searchString: c.toLowerCase() };
        });
        setGlobalCities(formatted);
      })
      .catch(err => console.error("Failed to load cities", err));
  }, []);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(event.target as Node)) setShowToDropdown(false);
      if (travellerRef.current && !travellerRef.current.contains(event.target as Node)) setShowTravellerDropdown(false);
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) setShowTimeDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Derived variables */
  const isHotel = activeTab === 'hotels' || activeTab === 'villas' || activeTab === 'packages';
  const showFromInput = activeTab !== 'hotels' && activeTab !== 'villas' && activeTab !== 'packages' && activeTab !== 'tours';
  const currentDataset = activeTab === "flights" || activeTab === "trains" ? globalAirports : globalCities;
  const hasReturnField = activeTab !== 'buses' && activeTab !== 'cabs' && activeTab !== 'tours';
  const departureSpan = (activeTab === 'buses' || activeTab === 'tours') 
    ? 'col-span-1 md:col-span-3' 
    : 'col-span-1 md:col-span-2';
  const guestsSpan = (activeTab === 'buses' || activeTab === 'tours') 
    ? 'col-span-1 md:col-span-3' 
    : 'col-span-1 md:col-span-2';

  const filteredFromLocations = fromSearchQuery.trim().length > 0
    ? currentDataset.filter(loc => loc.searchString?.includes(fromSearchQuery.toLowerCase())).slice(0, 20)
    : currentDataset.slice(0, 20);

  const filteredToLocations = toSearchQuery.trim().length > 0
    ? currentDataset.filter(loc => loc.searchString?.includes(toSearchQuery.toLowerCase())).slice(0, 20)
    : currentDataset.slice(0, 20);

  /* Auto-scroll active dropdown item into view */
  useEffect(() => {
    if (showFromDropdown) {
      const activeEl = document.querySelector('.from-dropdown-list .active-item');
      if (typeof activeEl?.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [fromActiveIndex, showFromDropdown]);

  useEffect(() => {
    if (showToDropdown) {
      const activeEl = document.querySelector('.to-dropdown-list .active-item');
      if (typeof activeEl?.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [toActiveIndex, showToDropdown]);

  /* Reset active highlight when query changes */
  useEffect(() => {
    setFromActiveIndex(0);
  }, [fromSearchQuery]);

  useEffect(() => {
    setToActiveIndex(0);
  }, [toSearchQuery]);

  /* Auto-focus dropdown inputs when opened */
  useEffect(() => {
    if (showFromDropdown) {
      setTimeout(() => {
        fromInputRef.current?.focus();
        setFromActiveIndex(0);
      }, 50);
    }
  }, [showFromDropdown]);

  useEffect(() => {
    if (showToDropdown) {
      setTimeout(() => {
        toInputRef.current?.focus();
        setToActiveIndex(0);
      }, 50);
    }
  }, [showToDropdown]);

  /* Keyboard handlers */
  const handleFromKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFromActiveIndex((prev) => Math.min(filteredFromLocations.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFromActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredFromLocations[fromActiveIndex];
      if (selected) {
        setFromObj(selected);
        setShowFromDropdown(false);
        // Advance to To selection
        setShowToDropdown(true);
        setToSearchQuery("");
      }
    } else if (e.key === "Escape") {
      setShowFromDropdown(false);
    }
  };

  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setToActiveIndex((prev) => Math.min(filteredToLocations.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setToActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredToLocations[toActiveIndex];
      if (selected) {
        setToObj(selected);
        setShowToDropdown(false);
        // Advance to Departure date picker
        setTimeout(() => {
          if (departureDateRef.current) {
            departureDateRef.current.focus();
            if (typeof departureDateRef.current.showPicker === 'function') {
              try {
                departureDateRef.current.showPicker();
              } catch (err) {}
            }
          }
        }, 100);
      }
    } else if (e.key === "Escape") {
      setShowToDropdown(false);
    }
  };

  const handleDepartureDateChange = (val: string) => {
    setDate(val);
    if (isHotel || tripType === 'roundtrip') {
      setTimeout(() => {
        if (returnDateRef.current) {
          returnDateRef.current.focus();
          if (typeof returnDateRef.current.showPicker === 'function') {
            try {
              returnDateRef.current.showPicker();
            } catch (err) {}
          }
        }
      }, 100);
    } else {
      // Oneway trip -> Auto-open travellers dropdown
      setTimeout(() => {
        setShowTravellerDropdown(true);
      }, 100);
    }
  };

  const handleReturnDateChange = (val: string) => {
    setCheckoutDate(val);
    // Auto-open travellers dropdown after picking return date
    setTimeout(() => {
      setShowTravellerDropdown(true);
    }, 100);
  };

  const handleSearch = () => {
    if (activeTab === 'flights' || activeTab === 'cars' || activeTab === 'trains') {
      if (!fromObj || !toObj || !date) { alert("Please fill all fields (From, To, Date)"); return; }
    } else {
      if (!toObj || !date) { alert("Please fill destination and date"); return; }
    }
    const fromVal = fromObj ? fromObj.code || fromObj.title : "";
    const toVal = toObj ? toObj.code || toObj.title : "";
    
    if (activeTab === 'flights') {
      const q = new URLSearchParams({
        type: activeTab,
        from: fromVal,
        to: toVal,
        date: date,
        tripType: tripType,
        returnDate: tripType === 'roundtrip' ? checkoutDate : '',
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString(),
        class: travelClass
      });
      router.push(`/search-results?${q.toString()}`);
    } else {
      router.push(`/search-results?type=${activeTab}&from=${encodeURIComponent(fromVal)}&to=${encodeURIComponent(toVal)}&date=${date}`);
    }
  };

  /* ───── Formatted departure display ───── */
  const departureDisplay = (() => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return {
      day: d.getDate(),
      monthYear: `${monthNames[d.getMonth()]}'${String(d.getFullYear()).slice(2)}`,
      dayName: dayNames[d.getDay()],
    };
  })();

  return (
    <div className="max-w-[1200px] mx-auto font-sans relative" data-purpose="search-widget-wrapper">

      {/* ═══════════ TOP NAVIGATION ICONS ═══════════ */}
      <nav className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mb-[-24px] relative z-20 p-2 px-4 md:px-6 mx-auto w-[95%] md:w-fit flex flex-wrap md:flex-nowrap items-center justify-center gap-1 md:gap-2 max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFromObj(null); setToObj(null); }}
              className={`flex flex-col items-center justify-center shrink-0 group relative px-2 py-2 md:px-3 md:py-2.5 min-w-[58px] md:min-w-[72px] rounded-xl transition-all duration-300 ease-out transform ${
                isActive
                  ? 'bg-gradient-to-b from-[#008cff] to-[#005fbe] text-white shadow-[0_8px_16px_rgba(0,140,255,0.3)] -translate-y-1 scale-105'
                  : 'bg-transparent text-gray-500 hover:bg-blue-50 hover:text-[#008cff] hover:-translate-y-0.5'
              }`}
            >
              {/* Badge */}
              {tab.badge && (
                <span className="absolute top-[-6px] right-[-4px] bg-purple-500 text-white text-[8px] font-bold px-1 rounded z-10">{tab.badge}</span>
              )}
              <div className="mb-0.5 relative">
                <svg
                  className={`w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 ${
                    isActive
                      ? (tab.id === 'flights' ? 'animate-flight-takeoff drop-shadow-md text-white'
                        : tab.id === 'hotels' || tab.id === 'villas' ? 'animate-hotel-pop drop-shadow-md text-white'
                        : tab.id === 'trains' || tab.id === 'buses' || tab.id === 'cabs' ? 'animate-vehicle-move drop-shadow-md text-white'
                        : tab.id === 'packages' ? 'animate-package-swing drop-shadow-md text-white'
                        : 'scale-110 drop-shadow-md text-white')
                      : 'opacity-60 group-hover:scale-110 group-hover:opacity-100'
                  }`}
                  fill="currentColor" viewBox="0 0 24 24"
                >
                  {tab.icon}
                </svg>
              </div>
              <span className={`text-[9px] md:text-[10px] whitespace-pre-wrap text-center leading-tight transition-colors duration-300 ${isActive ? 'font-bold' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ═══════════ MAIN SEARCH CONTAINER ═══════════ */}
      <div className="bg-white rounded-xl shadow-[0_1px_30px_0_rgba(0,0,0,0.1)] p-6 md:p-8 pt-10 md:pt-12 relative overflow-visible text-left mb-8 group transition-all duration-700 hover:shadow-[0_8px_40px_rgba(0,140,255,0.15)] focus-within:shadow-[0_8px_40px_rgba(0,140,255,0.2)] focus-within:-translate-y-1">

        {/* ── Promo Banner ── */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-full px-4 md:px-6 py-2 flex items-center shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => document.getElementById('milo-bot')?.click()}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-sm relative overflow-hidden mr-3 shrink-0">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <span className="material-symbols-outlined text-white text-[18px] relative z-10">travel_explore</span>
            </div>
            <div className="text-sm font-medium flex items-center flex-wrap">
              <span className="text-blue-500 italic font-bold">Milo</span>
              <span className="text-blue-400 text-xs ml-0.5">beta</span>
              <span className="text-gray-700 ml-2 hidden sm:inline">Your AI Assistant for Flights &amp; Stays</span>
              <span className="text-gray-700 ml-2 sm:hidden">AI Assistant</span>
              <span className="ml-2 text-[#008cff] font-bold">→</span>
            </div>
          </div>
        </div>

        {/* ── Trip Type & Fares Header (Flights only) ── */}
        {(activeTab === "flights" || activeTab === "trains") && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="flex items-center space-x-5 md:space-x-6 text-sm font-bold text-[#4a4a4a]">
              {[
                { id: "oneway", label: "One Way" },
                { id: "roundtrip", label: "Round Trip" },
                { id: "multicity", label: "Multi City" },
              ].map((tt) => (
                <label key={tt.id} className="flex items-center cursor-pointer" onClick={() => setTripType(tt.id)}>
                  <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-colors ${
                    tripType === tt.id ? 'border-[#008cff] bg-[#008cff]' : 'border-gray-300'
                  }`}>
                    {tripType === tt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className={tripType === tt.id ? 'text-[#4a4a4a]' : 'text-[#9b9b9b]'}>{tt.label}</span>
                </label>
              ))}
            </div>
            <div className="text-xs font-semibold text-[#9b9b9b]">
              Book International and Domestic Flights
            </div>
          </div>
        )}

        {/* ── Main Inputs Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative mb-6">

          {/* FROM & TO CONTAINER */}
          <div className={`col-span-1 md:col-span-6 ${showFromInput ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex'} relative`}>
            {/* FROM */}
            {showFromInput && (
              <div
                className={`flex-1 border border-gray-200 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md ${showFromDropdown ? 'ring-2 ring-[#008cff] border-[#008cff] shadow-md bg-white z-30' : 'z-10 hover:z-20'}`}
                onClick={() => { setShowFromDropdown(true); setFromSearchQuery(""); }}
                ref={fromRef}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{activeTab === 'cabs' ? 'local_taxi' : 'flight_takeoff'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{activeTab === 'cabs' ? 'Pick-up' : 'From'}</div>
                    {fromObj ? (
                      <>
                        <div className="text-lg font-black text-gray-900 truncate leading-tight mt-0.5">{fromObj.title}</div>
                        <div className="text-xs text-gray-500 truncate leading-none mt-0.5">{fromObj.subtitle}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-gray-400 mt-0.5">Select</div>
                        <div className="text-xs text-gray-400 leading-none mt-0.5">{activeTab === 'cabs' ? 'Pick-up Location' : 'Departure City'}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* FROM Dropdown */}
                {showFromDropdown && (
                  <div className="absolute top-[100%] left-0 w-[320px] md:w-[350px] z-50 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden mt-2 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                      <input
                        ref={fromInputRef}
                        type="text" autoFocus
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/20 text-black placeholder-gray-400"
                        placeholder="Search origin..."
                        value={fromSearchQuery} 
                        onChange={e => setFromSearchQuery(e.target.value)}
                        onKeyDown={handleFromKeyDown}
                      />
                    </div>
                    <ul className="max-h-[250px] overflow-y-auto no-scrollbar from-dropdown-list py-1">
                      {filteredFromLocations.length === 0 ? <li className="p-4 text-center text-gray-400 text-xs">No locations found</li> : filteredFromLocations.map((loc, idx) => {
                        const isActive = idx === fromActiveIndex;
                        return (
                          <li 
                            key={idx} 
                            onMouseEnter={() => setFromActiveIndex(idx)}
                            onClick={() => { 
                              setFromObj(loc); 
                              setShowFromDropdown(false); 
                              setShowToDropdown(true);
                              setToSearchQuery("");
                            }} 
                            className={`px-4 py-2.5 cursor-pointer border-b border-gray-50 flex items-center transition-colors duration-150 ${
                              isActive ? 'bg-[#008cff]/10 border-l-4 border-l-[#008cff] pl-3 font-bold active-item' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#008cff]' : 'text-gray-400'}`}>{activeTab === 'cabs' ? 'local_taxi' : 'flight_takeoff'}</span>
                              <div className="truncate">
                                <div className={`text-sm truncate ${isActive ? 'text-[#008cff] font-bold' : 'text-gray-900 font-semibold'}`}>{loc.title} {loc.code && <span className="font-normal text-xs text-gray-500 ml-1">{loc.code}</span>}</div>
                                <div className="text-[11px] text-gray-500 truncate">{loc.subtitle}</div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* SWAP BUTTON */}
            {showFromInput && (
              <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  className="w-9 h-9 bg-white border border-gray-250 rounded-full flex items-center justify-center shadow-lg hover:border-[#008cff] hover:text-[#008cff] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); const temp = fromObj; setFromObj(toObj); setToObj(temp); }}
                >
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </button>
              </div>
            )}

            {/* TO */}
            <div
              className={`flex-1 border border-gray-250 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md ${showToDropdown ? 'ring-2 ring-[#008cff] border-[#008cff] shadow-md bg-white z-30' : 'z-10 hover:z-20'}`}
              onClick={() => { setShowToDropdown(true); setToSearchQuery(""); }}
              ref={toRef}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{isHotel ? 'home_pin' : activeTab === 'cabs' ? 'flag' : 'flight_land'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isHotel ? 'Destination' : activeTab === 'cabs' ? 'Drop-off' : 'To'}</div>
                  {toObj ? (
                    <>
                      <div className="text-lg font-black text-gray-900 truncate leading-tight mt-0.5">{toObj.title}</div>
                      <div className="text-xs text-gray-500 truncate leading-none mt-0.5">{toObj.subtitle}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-gray-400 mt-0.5">Select</div>
                      <div className="text-xs text-gray-400 leading-none mt-0.5">{isHotel ? 'Destination City' : activeTab === 'cabs' ? 'Drop-off Location' : 'Destination'}</div>
                    </>
                  )}
                </div>
              </div>

              {/* TO Dropdown */}
              {showToDropdown && (
                <div className="absolute top-[100%] left-0 w-[320px] md:w-[350px] z-50 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden mt-2 cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                    <input
                      ref={toInputRef}
                      type="text" autoFocus
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/20 text-black placeholder-gray-400"
                      placeholder="Search destination..."
                      value={toSearchQuery} 
                      onChange={e => setToSearchQuery(e.target.value)}
                      onKeyDown={handleToKeyDown}
                    />
                  </div>
                  <ul className="max-h-[250px] overflow-y-auto no-scrollbar to-dropdown-list py-1">
                    {filteredToLocations.length === 0 ? <li className="p-4 text-center text-gray-400 text-xs">No locations found</li> : filteredToLocations.map((loc, idx) => {
                      const isActive = idx === toActiveIndex;
                      return (
                        <li 
                          key={idx} 
                          onMouseEnter={() => setToActiveIndex(idx)}
                          onClick={() => { 
                            setToObj(loc); 
                            setShowToDropdown(false); 
                            // Auto-advance: Focus and trigger departure date picker
                            setTimeout(() => {
                              if (departureDateRef.current) {
                                departureDateRef.current.focus();
                                if (typeof departureDateRef.current.showPicker === 'function') {
                                  try {
                                    departureDateRef.current.showPicker();
                                  } catch (err) {}
                                }
                              }
                            }, 100);
                          }} 
                          className={`px-4 py-2.5 cursor-pointer border-b border-gray-50 flex items-center transition-colors duration-150 ${
                            isActive ? 'bg-[#008cff]/10 border-l-4 border-l-[#008cff] pl-3 font-bold active-item' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#008cff]' : 'text-gray-400'}`}>{isHotel ? 'home_pin' : activeTab === 'cabs' ? 'flag' : 'flight_land'}</span>
                            <div className="truncate">
                              <div className={`text-sm truncate ${isActive ? 'text-[#008cff] font-bold' : 'text-gray-900 font-semibold'}`}>{loc.title} {loc.code && <span className="font-normal text-xs text-gray-500 ml-1">{loc.code}</span>}</div>
                              <div className="text-[11px] text-gray-500 truncate">{loc.subtitle}</div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* DEPARTURE */}
          <div 
            onClick={() => {
              if (departureDateRef.current) {
                departureDateRef.current.focus();
                if (typeof departureDateRef.current.showPicker === 'function') {
                  try {
                    departureDateRef.current.showPicker();
                  } catch (err) {}
                }
              }
            }}
            className={`${departureSpan} border border-gray-200 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md z-10 hover:z-20`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isHotel ? 'Check-In' : activeTab === 'tours' ? 'Visit Date' : 'Departure'}</div>
                <div className="mt-0.5 relative">
                  {departureDisplay ? (
                    <>
                      <div className="flex items-baseline leading-none">
                        <span className="text-xl font-black text-gray-900 leading-none">{departureDisplay.day}</span>
                        <span className="text-xs font-bold ml-1 text-gray-900 leading-none">{departureDisplay.monthYear}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 leading-none mt-1">{departureDisplay.dayName}</div>
                    </>
                  ) : (
                    <div className="text-sm font-bold text-gray-400 mt-1">Select Date</div>
                  )}
                  <input
                    ref={departureDateRef}
                    type="date"
                    value={date}
                    onChange={e => handleDepartureDateChange(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RETURN / CHECK-OUT */}
          {hasReturnField && (
            <div 
              onClick={() => {
                if (isHotel || tripType === 'roundtrip') {
                  if (returnDateRef.current) {
                    returnDateRef.current.focus();
                    if (typeof returnDateRef.current.showPicker === 'function') {
                      try {
                        returnDateRef.current.showPicker();
                      } catch (err) {}
                    }
                  }
                } else {
                  // Flights oneway -> Switch to roundtrip and open return date picker
                  setTripType('roundtrip');
                  setTimeout(() => {
                    if (returnDateRef.current) {
                      returnDateRef.current.focus();
                      if (typeof returnDateRef.current.showPicker === 'function') {
                        try {
                          returnDateRef.current.showPicker();
                        } catch (err) {}
                      }
                    }
                  }, 150);
                }
              }}
              className="col-span-1 md:col-span-2 border border-gray-200 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md z-10 hover:z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isHotel ? 'Check-Out' : 'Return'}</div>
                  <div className="mt-0.5 relative">
                    {isHotel || tripType === 'roundtrip' ? (
                      <>
                        {checkoutDate ? (
                          (() => {
                            const d = new Date(checkoutDate + "T00:00:00");
                            const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                            const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                            return (
                              <>
                                <div className="flex items-baseline leading-none">
                                  <span className="text-xl font-black text-gray-900 leading-none">{d.getDate()}</span>
                                  <span className="text-xs font-bold ml-1 text-gray-900 leading-none">{monthNames[d.getMonth()] + "'" + String(d.getFullYear()).slice(2)}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 leading-none mt-1">{dayNames[d.getDay()]}</div>
                              </>
                            );
                          })()
                        ) : (
                          <div className="text-sm font-bold text-gray-400 mt-1">Select Date</div>
                        )}
                        <input
                          ref={returnDateRef}
                          type="date"
                          value={checkoutDate}
                          onChange={e => handleReturnDateChange(e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </>
                    ) : (
                      <div className="text-[10px] font-semibold text-gray-400 leading-tight mt-1">Tap to add return</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PICK-UP TIME (Cabs only) */}
          {activeTab === 'cabs' && (
            <div 
              ref={timeRef}
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="col-span-1 md:col-span-2 border border-gray-200 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md z-35"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pick-Up Time</div>
                  <div className="text-lg font-black text-gray-900 leading-none mt-1">{pickupTime}</div>
                </div>
              </div>

              {/* Time Dropdown */}
              {showTimeDropdown && (
                <div 
                  className="absolute top-[100%] right-0 md:left-0 md:right-auto w-[180px] max-h-[200px] overflow-y-auto no-scrollbar z-50 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-100 py-2 mt-2 cursor-default"
                  onClick={e => e.stopPropagation()}
                >
                  {[
                    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
                    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
                    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
                    "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM"
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => { setPickupTime(t); setShowTimeDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#008cff]/10 hover:text-[#008cff] transition-colors ${pickupTime === t ? 'bg-[#eaf5ff] text-[#008cff] font-bold' : 'text-gray-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRAVELLERS & CLASS */}
          <div
            className={`${guestsSpan} border border-gray-200 rounded-xl p-4 bg-white hover:border-[#008cff]/50 hover:bg-[#008cff]/5 cursor-pointer transition-all duration-300 relative hover:-translate-y-0.5 hover:shadow-md ${showTravellerDropdown ? 'ring-2 ring-[#008cff] border-[#008cff] shadow-md bg-white z-30' : 'z-10 hover:z-20'}`}
            onClick={() => setShowTravellerDropdown(true)}
            ref={travellerRef}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#008cff] shrink-0">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {isHotel ? 'Guests' :
                   activeTab === 'cabs' ? 'Vehicle' :
                   activeTab === 'buses' ? 'Seats' :
                   'Travellers'}
                </div>

                {isHotel ? (
                  <>
                    <div className="text-lg font-black text-gray-900 leading-none mt-0.5">{rooms} Room{rooms > 1 ? 's' : ''}</div>
                    <div className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{adults + children} Guest{(adults + children) > 1 ? 's' : ''}</div>
                  </>
                ) : activeTab === 'cabs' ? (
                  <div className="text-sm font-bold text-gray-900 truncate mt-1">{travelClass}</div>
                ) : (
                  <>
                    <div className="text-lg font-black text-gray-900 leading-none mt-0.5">{adults + children + infants} Pax</div>
                    <div className="text-[10px] text-gray-500 truncate leading-none mt-0.5">{travelClass}</div>
                  </>
                )}
              </div>
            </div>

            {/* TRAVELLERS Dropdown */}
            {showTravellerDropdown && (
              <div className="absolute top-[100%] right-0 md:left-0 md:right-auto w-[300px] z-50 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-gray-100 p-5 mt-2 cursor-default" onClick={e => e.stopPropagation()}>
                {/* ROOMS (Hotels/Packages only) */}
                {isHotel && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-black text-sm">Rooms</div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">-</button>
                      <span className="font-bold w-4 text-center text-black">{rooms}</span>
                      <button onClick={() => setRooms(rooms + 1)} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">+</button>
                    </div>
                  </div>
                )}
                {/* ADULTS */}
                {activeTab !== 'cabs' && (
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="font-bold text-black text-sm">Adults</div>
                      <div className="text-xs text-gray-500">Aged 12+ yrs</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">-</button>
                      <span className="font-bold w-4 text-center text-black">{adults}</span>
                      <button onClick={() => setAdults(isHotel ? Math.min(rooms * 4, adults + 1) : adults + 1)} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">+</button>
                    </div>
                  </div>
                )}
                {/* CHILDREN */}
                {activeTab !== 'cabs' && activeTab !== 'buses' && (
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="font-bold text-black text-sm">Children</div>
                      <div className="text-xs text-gray-500">Aged 0-12 yrs</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">-</button>
                      <span className="font-bold w-4 text-center text-black">{children}</span>
                      <button onClick={() => setChildren(isHotel ? Math.min(rooms * 3, children + 1) : children + 1)} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">+</button>
                    </div>
                  </div>
                )}
                {/* INFANTS */}
                {(activeTab === 'flights' || activeTab === 'trains') && (
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="font-bold text-black text-sm">Infants</div>
                      <div className="text-xs text-gray-500">Below 2 yrs</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">-</button>
                      <span className="font-bold w-4 text-center text-black">{infants}</span>
                      <button onClick={() => setInfants(infants + 1)} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">+</button>
                    </div>
                  </div>
                )}
                {/* CLASS / VEHICLE TYPE */}
                {(activeTab === 'flights' || activeTab === 'trains' || activeTab === 'cabs') && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="font-bold text-black text-sm mb-2">{activeTab === 'cabs' ? 'Vehicle Type' : 'Travel Class'}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(activeTab === 'flights' ? ["Economy", "Premium Economy", "Business", "First Class"] :
                        activeTab === 'trains' ? ["Sleeper", "AC 3-Tier", "AC 2-Tier", "AC 1st Class", "Chair Car"] :
                        ["Hatchback", "Sedan", "SUV", "Premium SUV"]).map((c) => (
                        <button
                          key={c}
                          onClick={() => setTravelClass(c)}
                          className={`text-xs py-1 px-2 rounded border transition-colors ${travelClass === c ? 'bg-[#eaf5ff] border-[#008cff] text-[#008cff] font-bold' : 'border-gray-200 text-gray-600 hover:border-[#008cff]'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <button onClick={() => setShowTravellerDropdown(false)} className="text-white bg-[#008cff] hover:bg-[#005fbe] px-4 py-1.5 rounded-full font-bold text-sm transition-colors animate-pulse">Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>





        {/* ── Floating Search Button ── */}
        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#008cff] to-[#005fbe] text-white px-12 md:px-16 py-3 rounded-full text-xl md:text-2xl font-black shadow-xl hover:shadow-2xl active:scale-95 transition-all uppercase tracking-wider"
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
}

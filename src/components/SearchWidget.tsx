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
    id: "trains", label: "Trains",
    icon: <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.5-6h-5V6h5v5z" />,
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
  {
    id: "visa", label: "Visa",
    icon: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zm-3-5h1.5v2H17v-2zm-2.5 0H16v2h-1.5v-2zm-2.5 0H13v2h-1.5v-2zm-2.5 0H10v2H7.5v-2z" />,
  },
  {
    id: "cruise", label: "Cruise", badge: "new",
    icon: <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.11-.55 4.36-1.45L20 14V6c-1.25.18-2.43.51-3.5 1V3l-3.5 1v1h-2V3L7.5 4v1H5.5c-.88 0-1.74.07-2.57.19C2.4 5.33 2 5.86 2 6.47V15c0 1.34.41 2.58 1.1 3.63.22.34.5.64.85.37z" />,
  },
  {
    id: "forex", label: "Forex Card\n& Currency",
    icon: <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />,
  },
  {
    id: "insurance", label: "Travel\nInsurance",
    icon: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-4-4 1.41-1.41L11 12.17l4.59-4.59L17 9l-6 6z" />,
  },
];

/* ───────── Special fare chips ───────── */
const specialFares = [
  { id: "regular", label: "Regular", desc: "Regular fares", active: true },
  { id: "student", label: "Student", desc: "Extra discounts/baggage" },
  { id: "armed", label: "Armed Forces", desc: "Up to ₹ 600 off" },
  { id: "gst", label: "Have a GST number ?", desc: "Upto 10% Extra Savings !", badge: "new" },
  { id: "senior", label: "Senior Citizen", desc: "Up to ₹ 600 off" },
  { id: "doctor", label: "Doctor and Nurses", desc: "Up to ₹ 600 off" },
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

  /* Date state */
  const [date, setDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");

  /* Traveller state */
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);

  /* Trip type */
  const [tripType, setTripType] = useState("oneway");

  /* Special fare */
  const [activeFare, setActiveFare] = useState("regular");

  /* Price drop */
  const [priceDropChecked, setPriceDropChecked] = useState(false);

  /* Data */
  const [globalAirports, setGlobalAirports] = useState<LocationObj[]>([]);
  const [globalCities, setGlobalCities] = useState<LocationObj[]>([]);

  /* Refs */
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const travellerRef = useRef<HTMLDivElement>(null);

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Derived */
  const isHotel = activeTab === 'hotels' || activeTab === 'villas' || activeTab === 'packages';
  const showFromInput = !isHotel;
  const currentDataset = activeTab === "flights" || activeTab === "trains" ? globalAirports : globalCities;

  const filteredFromLocations = fromSearchQuery.trim().length > 0
    ? currentDataset.filter(loc => loc.searchString?.includes(fromSearchQuery.toLowerCase())).slice(0, 20)
    : currentDataset.slice(0, 20);

  const filteredToLocations = toSearchQuery.trim().length > 0
    ? currentDataset.filter(loc => loc.searchString?.includes(toSearchQuery.toLowerCase())).slice(0, 20)
    : currentDataset.slice(0, 20);

  const handleSearch = () => {
    if (activeTab === 'flights' || activeTab === 'cars' || activeTab === 'trains') {
      if (!fromObj || !toObj || !date) { alert("Please fill all fields (From, To, Date)"); return; }
    } else {
      if (!toObj || !date) { alert("Please fill destination and date"); return; }
    }
    const fromVal = fromObj ? fromObj.code || fromObj.title : "";
    const toVal = toObj ? toObj.code || toObj.title : "";
    router.push(`/search-results?type=${activeTab}&from=${encodeURIComponent(fromVal)}&to=${encodeURIComponent(toVal)}&date=${date}`);
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
        <div className="grid grid-cols-1 md:grid-cols-12 border border-gray-200 rounded-xl overflow-visible relative mb-6 focus-within:border-[#008cff] focus-within:ring-4 focus-within:ring-[#008cff]/10 transition-all duration-300 shadow-sm">

          {/* FROM */}
          {showFromInput && (
            <div
              className={`col-span-1 ${isHotel ? 'md:col-span-3' : 'md:col-span-3'} border-b md:border-b-0 md:border-r border-gray-200 p-4 hover:bg-[#eaf5ff] cursor-pointer transition-colors md:rounded-l-xl relative`}
              onClick={() => { setShowFromDropdown(true); setFromSearchQuery(""); }}
              ref={fromRef}
            >
              <div className="text-xs font-bold text-[#9b9b9b] mb-1 uppercase">{activeTab === 'cabs' ? 'Pick-up' : 'From'}</div>
              {fromObj ? (
                <>
                  <div className="text-2xl md:text-3xl font-black text-black truncate">{fromObj.title}</div>
                  <div className="text-xs text-[#4a4a4a] truncate">{fromObj.subtitle}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl md:text-3xl font-black text-black">Select</div>
                  <div className="text-xs text-[#4a4a4a] truncate">{activeTab === 'cabs' ? 'Pick-up Location' : 'Departure City'}</div>
                </>
              )}
              {/* FROM Dropdown */}
              {showFromDropdown && (
                <div className="absolute top-[100%] left-0 w-[320px] md:w-[350px] z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden mt-1 cursor-default" onClick={e => e.stopPropagation()}>
                  <div className="p-3 bg-[#eaf5ff] border-b border-gray-200">
                    <input
                      type="text" autoFocus
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#008cff] text-black"
                      placeholder="From"
                      value={fromSearchQuery} onChange={e => setFromSearchQuery(e.target.value)}
                    />
                  </div>
                  <ul className="max-h-[250px] overflow-y-auto no-scrollbar">
                    {filteredFromLocations.length === 0 ? <li className="p-3 text-center text-gray-500">No results found</li> : filteredFromLocations.map((loc, idx) => (
                      <li key={idx} onClick={() => { setFromObj(loc); setShowFromDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="material-symbols-outlined text-gray-400">flight_takeoff</span>
                          <div className="truncate">
                            <div className="font-bold text-black text-sm truncate">{loc.title} {loc.code && <span className="font-normal text-xs text-gray-500 ml-1">{loc.code}</span>}</div>
                            <div className="text-xs text-gray-500 truncate">{loc.subtitle}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SWAP BUTTON */}
          {showFromInput && (
            <div className="hidden md:block absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:border-[#008cff] transition-colors group"
                onClick={() => { const temp = fromObj; setFromObj(toObj); setToObj(temp); }}
              >
                <svg className="w-4 h-4 text-[#008cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
          )}

          {/* TO */}
          <div
            className={`col-span-1 ${isHotel ? 'md:col-span-3' : 'md:col-span-3'} border-b md:border-b-0 md:border-r border-gray-200 p-4 hover:bg-[#eaf5ff] cursor-pointer transition-colors relative ${!showFromInput && 'md:rounded-l-xl'}`}
            onClick={() => { setShowToDropdown(true); setToSearchQuery(""); }}
            ref={toRef}
          >
            <div className="text-xs font-bold text-[#9b9b9b] mb-1 uppercase">{isHotel ? 'Destination' : activeTab === 'cabs' ? 'Drop-off' : 'To'}</div>
            {toObj ? (
              <>
                <div className="text-2xl md:text-3xl font-black text-black truncate">{toObj.title}</div>
                <div className="text-xs text-[#4a4a4a] truncate">{toObj.subtitle}</div>
              </>
            ) : (
              <>
                <div className="text-2xl md:text-3xl font-black text-black">Select</div>
                <div className="text-xs text-[#4a4a4a] truncate">{isHotel ? 'City, Property or Location' : activeTab === 'cabs' ? 'Drop-off Location' : 'Destination City'}</div>
              </>
            )}
            {/* TO Dropdown */}
            {showToDropdown && (
              <div className="absolute top-[100%] left-0 w-[320px] md:w-[350px] z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden mt-1 cursor-default" onClick={e => e.stopPropagation()}>
                <div className="p-3 bg-[#eaf5ff] border-b border-gray-200">
                  <input
                    type="text" autoFocus
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#008cff] text-black"
                    placeholder="To"
                    value={toSearchQuery} onChange={e => setToSearchQuery(e.target.value)}
                  />
                </div>
                <ul className="max-h-[250px] overflow-y-auto no-scrollbar">
                  {filteredToLocations.length === 0 ? <li className="p-3 text-center text-gray-500">No results found</li> : filteredToLocations.map((loc, idx) => (
                    <li key={idx} onClick={() => { setToObj(loc); setShowToDropdown(false); }} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="material-symbols-outlined text-gray-400">flight_land</span>
                        <div className="truncate">
                          <div className="font-bold text-black text-sm truncate">{loc.title} {loc.code && <span className="font-normal text-xs text-gray-500 ml-1">{loc.code}</span>}</div>
                          <div className="text-xs text-gray-500 truncate">{loc.subtitle}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* DEPARTURE */}
          <div className="col-span-1 md:col-span-2 border-b md:border-b-0 md:border-r border-gray-200 p-4 hover:bg-[#eaf5ff] cursor-pointer transition-colors relative">
            <div className="flex items-center">
              <span className="text-xs font-bold text-[#9b9b9b] mb-1 uppercase mr-1">{isHotel ? 'Check-In' : 'Departure'}</span>
              <svg className="w-3 h-3 text-[#008cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div className="mt-1">
              {departureDisplay ? (
                <>
                  <div className="flex items-baseline">
                    <span className="text-2xl md:text-3xl font-black text-black">{departureDisplay.day}</span>
                    <span className="text-base md:text-xl font-bold ml-1 text-black">{departureDisplay.monthYear}</span>
                  </div>
                  <div className="text-xs text-[#4a4a4a]">{departureDisplay.dayName}</div>
                </>
              ) : (
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-transparent border-none outline-none w-full font-black text-[16px] md:text-[20px] lg:text-2xl text-black cursor-pointer focus:ring-0 p-0"
                />
              )}
              {departureDisplay && (
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* RETURN / CHECK-OUT */}
          <div className="col-span-1 md:col-span-2 border-b md:border-b-0 md:border-r border-gray-200 p-4 hover:bg-[#eaf5ff] cursor-pointer transition-colors relative">
            <div className="flex items-center">
              <span className="text-xs font-bold text-[#9b9b9b] mb-1 uppercase mr-1">{isHotel ? 'Check-Out' : 'Return'}</span>
              <svg className="w-3 h-3 text-[#008cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            {isHotel || tripType === 'roundtrip' ? (
              <div className="mt-1">
                <input
                  type="date"
                  value={checkoutDate}
                  onChange={e => setCheckoutDate(e.target.value)}
                  className="bg-transparent border-none outline-none w-full font-black text-[16px] md:text-[20px] lg:text-2xl text-black cursor-pointer focus:ring-0 p-0"
                />
              </div>
            ) : (
              <div className="text-sm font-semibold text-[#9b9b9b] mt-1 leading-snug">Tap to add a return date for bigger discounts</div>
            )}
          </div>

          {/* TRAVELLERS & CLASS */}
          <div
            className="col-span-1 md:col-span-2 p-4 hover:bg-[#eaf5ff] cursor-pointer transition-colors rounded-b-xl md:rounded-bl-none md:rounded-r-xl relative"
            onClick={() => setShowTravellerDropdown(true)}
            ref={travellerRef}
          >
            <div className="flex items-center">
              <span className="text-xs font-bold text-[#9b9b9b] mb-1 uppercase mr-1">
                {isHotel ? 'Rooms & Guests' :
                 activeTab === 'cabs' ? 'Vehicle Type' :
                 activeTab === 'buses' ? 'Travellers' :
                 'Travellers & Class'}
              </span>
              <svg className="w-3 h-3 text-[#008cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>

            {isHotel ? (
              <>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl md:text-3xl font-black text-black">{rooms}</span>
                  <span className="text-base md:text-lg font-bold ml-1 text-black">Room{rooms > 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-[#4a4a4a] truncate">{adults + children} Guest{(adults + children) > 1 ? 's' : ''}</div>
              </>
            ) : activeTab === 'cabs' ? (
              <div className="flex items-baseline mt-1">
                <span className="text-xl md:text-2xl font-black text-black truncate">{travelClass}</span>
              </div>
            ) : (
              <>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl md:text-3xl font-black text-black">{adults + children + infants}</span>
                  <span className="text-base md:text-lg font-bold ml-1 text-black">Traveller{(adults + children + infants) > 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-[#4a4a4a] truncate">{travelClass}</div>
              </>
            )}

            {/* TRAVELLERS Dropdown */}
            {showTravellerDropdown && (
              <div className="absolute top-[100%] right-0 md:left-0 md:right-auto w-[300px] z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 p-4 mt-1 cursor-default" onClick={e => e.stopPropagation()}>
                {/* ROOMS (Hotels/Packages only) */}
                {isHotel && (
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-black text-sm">Rooms</div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-6 h-6 rounded border border-[#008cff] text-[#008cff] flex items-center justify-center font-bold hover:bg-[#eaf5ff]">-</button>
                      <span className="font-bold w-4 text-center">{rooms}</span>
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
                      <span className="font-bold w-4 text-center">{adults}</span>
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
                      <span className="font-bold w-4 text-center">{children}</span>
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
                      <span className="font-bold w-4 text-center">{infants}</span>
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
                  <button onClick={() => setShowTravellerDropdown(false)} className="text-white bg-[#008cff] hover:bg-[#005fbe] px-4 py-1.5 rounded-full font-bold text-sm transition-colors">Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Special Fares (Flights / Trains only) ── */}
        {(activeTab === "flights" || activeTab === "trains") && (
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <span className="text-[10px] font-black text-black uppercase w-16 leading-tight shrink-0">Special Fares</span>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
              {specialFares.map((fare) => (
                <div
                  key={fare.id}
                  onClick={() => setActiveFare(fare.id)}
                  className={`rounded-md p-2 flex flex-col min-w-[100px] cursor-pointer transition-colors relative shrink-0 ${
                    activeFare === fare.id
                      ? 'bg-[#eaf5ff] border border-[#008cff]'
                      : 'bg-gray-50 border border-gray-200 hover:border-[#008cff]'
                  }`}
                >
                  {fare.badge && (
                    <span className="absolute top-[-8px] right-2 bg-purple-100 text-purple-600 text-[9px] font-bold px-1 rounded border border-purple-200">{fare.badge}</span>
                  )}
                  <span className={`text-xs font-bold ${activeFare === fare.id ? 'text-[#008cff]' : 'text-[#4a4a4a]'}`}>{fare.label}</span>
                  <span className="text-[10px] text-[#9b9b9b]">{fare.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom Actions Area ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 gap-4">
          {/* Price Drop Protection Banner */}
          {(activeTab === "flights" || activeTab === "trains") && (
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-50 to-[#eaf5ff] border border-blue-100 rounded-lg p-3 flex items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-blue-100/50 skew-x-[-20deg] translate-x-12" />
                <input
                  className="w-5 h-5 text-[#008cff] border-gray-300 rounded focus:ring-[#008cff] mr-3 shrink-0"
                  id="priceDrop"
                  type="checkbox"
                  checked={priceDropChecked}
                  onChange={() => setPriceDropChecked(!priceDropChecked)}
                />
                <label className="flex flex-col cursor-pointer z-10" htmlFor="priceDrop">
                  <span className="text-xs font-bold text-black">
                    Add Price Drop Protection{' '}
                    <span className="font-normal text-[#4a4a4a] ml-1 hidden sm:inline">If the price drops, we'll refund the difference.</span>
                    <span className="text-[#008cff] ml-2 font-semibold cursor-pointer">View Details</span>
                  </span>
                </label>
                <div className="ml-auto z-10 shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side Utility Buttons */}
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            {/* Flight Tracker */}
            <button className="flex items-center border border-gray-200 rounded-lg px-3 md:px-4 py-3 hover:shadow-md transition-shadow bg-white">
              <svg className="w-5 h-5 text-blue-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
              <span className="text-sm font-bold text-[#4a4a4a] whitespace-nowrap">Flight Tracker</span>
            </button>
            {/* Duty Free */}
            <button className="relative flex items-center border border-gray-200 rounded-lg px-3 md:px-4 py-3 hover:shadow-md transition-shadow bg-white">
              <span className="absolute top-[-10px] left-2 bg-purple-100 text-purple-600 text-[9px] font-bold px-1 rounded">10% off</span>
              <svg className="w-5 h-5 text-blue-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z" /></svg>
              <span className="text-sm font-bold text-[#4a4a4a] whitespace-nowrap">Shop Duty Free</span>
            </button>
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

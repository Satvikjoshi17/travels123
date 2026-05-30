"use client";

import { useState, useRef, useEffect } from "react";

export function HotelHeroSearch() {
  // --- State ---
  const [location, setLocation] = useState("Bangalore");
  const [locationSubtitle, setLocationSubtitle] = useState("Karnataka, India");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const [checkIn, setCheckIn] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [checkOut, setCheckOut] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  });

  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  // Popular destinations
  const popularLocations = [
    { city: "Bangalore", region: "Karnataka, India" },
    { city: "Mumbai", region: "Maharashtra, India" },
    { city: "New Delhi", region: "Delhi, India" },
    { city: "Goa", region: "Goa, India" },
    { city: "Jaipur", region: "Rajasthan, India" },
    { city: "Chennai", region: "Tamil Nadu, India" },
    { city: "Hyderabad", region: "Telangana, India" },
    { city: "Kolkata", region: "West Bengal, India" },
    { city: "Udaipur", region: "Rajasthan, India" },
    { city: "Shimla", region: "Himachal Pradesh, India" },
    { city: "Manali", region: "Himachal Pradesh, India" },
    { city: "Agra", region: "Uttar Pradesh, India" },
    { city: "Varanasi", region: "Uttar Pradesh, India" },
    { city: "Rishikesh", region: "Uttarakhand, India" },
    { city: "Pune", region: "Maharashtra, India" },
    { city: "Dubai", region: "United Arab Emirates" },
    { city: "Singapore", region: "Singapore" },
    { city: "Bangkok", region: "Thailand" },
    { city: "London", region: "United Kingdom" },
    { city: "Paris", region: "France" },
    { city: "Bali", region: "Indonesia" },
    { city: "Maldives", region: "Maldives" },
    { city: "New York", region: "New York, USA" },
    { city: "Tokyo", region: "Japan" },
  ];

  const filteredLocations = locationSearch.trim().length > 0
    ? popularLocations.filter(
        (l) =>
          l.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
          l.region.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : popularLocations;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
      if (checkInRef.current && !checkInRef.current.contains(event.target as Node)) {
        setShowCheckInPicker(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target as Node)) {
        setShowCheckOutPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Format helpers ---
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatDay = (d: Date) => d.getDate();
  const formatMonthYear = (d: Date) => `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
  const formatDayName = (d: Date) => dayNames[d.getDay()];

  const handleSearch = () => {
    const params = new URLSearchParams({
      type: "hotels",
      to: location,
      date: checkIn.toISOString().split("T")[0],
      checkout: checkOut.toISOString().split("T")[0],
      rooms: String(rooms),
      guests: String(guests),
    });
    window.location.href = `/search-results?${params.toString()}`;
  };

  return (
    <section className="relative w-full min-h-[500px] hotel-hero-water-bg flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative Water Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Top Branding */}
      <div className="w-full max-w-6xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-1 tracking-tight">Luminous Stay</h1>
          <p className="text-blue-50 opacity-90">Find your perfect sanctuary</p>
        </div>
        <span className="text-white text-sm md:text-lg font-medium bg-white/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/20">
          Same hotel, Cheapest price
        </span>
      </div>

      {/* Search Bar Container */}
      <div className="w-full max-w-6xl hotel-hero-glass-card rounded-2xl overflow-visible flex flex-col p-2" id="hotel-search-container">
        {/* Row: Input Fields */}
        <div className="flex flex-col md:flex-row w-full bg-white/60 rounded-xl overflow-visible mb-2">

          {/* Section: Location */}
          <div
            ref={locationRef}
            className="flex-1 p-4 border-b md:border-b-0 md:border-r border-white/40 flex flex-col justify-center cursor-pointer hover:bg-white/40 transition-colors min-h-[80px] relative"
            onClick={() => { setShowLocationDropdown(true); setLocationSearch(""); }}
            id="hotel-location-picker"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Where are you going?
              </span>
            </div>
            <div className="pl-6">
              <div className="text-xl font-bold text-gray-900 leading-tight">{location}</div>
              <div className="text-xs text-gray-500 font-medium">{locationSubtitle}</div>
            </div>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <div
                className="absolute top-full left-0 mt-1 w-[340px] z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 bg-blue-50 border-b border-gray-200">
                  <input
                    type="text"
                    autoFocus
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-black text-sm"
                    placeholder="Search city, destination..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
                <ul className="max-h-[280px] overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <li className="p-3 text-center text-gray-500 text-sm">No results found</li>
                  ) : (
                    filteredLocations.map((loc, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setLocation(loc.city);
                          setLocationSubtitle(loc.region);
                          setShowLocationDropdown(false);
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center gap-3"
                      >
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{loc.city}</div>
                          <div className="text-xs text-gray-500">{loc.region}</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Section: Check-In */}
          <div
            ref={checkInRef}
            className="w-full md:w-44 p-4 border-b md:border-b-0 md:border-r border-white/40 flex flex-col justify-center cursor-pointer hover:bg-white/40 transition-colors min-h-[80px] relative"
            onClick={() => setShowCheckInPicker(!showCheckInPicker)}
            id="hotel-checkin-picker"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check-In</span>
            </div>
            <div className="pl-6">
              <div className="text-lg font-bold text-gray-900 leading-tight flex items-baseline gap-1">
                {formatDay(checkIn)}{" "}
                <span className="text-xs font-semibold text-gray-500 uppercase">{formatMonthYear(checkIn)}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{formatDayName(checkIn)}</div>
            </div>
            {showCheckInPicker && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="date"
                  value={checkIn.toISOString().split("T")[0]}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value + "T00:00:00");
                    setCheckIn(newDate);
                    if (newDate >= checkOut) {
                      const nextDay = new Date(newDate);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setCheckOut(nextDay);
                    }
                    setShowCheckInPicker(false);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-black outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Section: Check-Out */}
          <div
            ref={checkOutRef}
            className="w-full md:w-44 p-4 border-b md:border-b-0 md:border-r border-white/40 flex flex-col justify-center cursor-pointer hover:bg-white/40 transition-colors min-h-[80px] relative"
            onClick={() => setShowCheckOutPicker(!showCheckOutPicker)}
            id="hotel-checkout-picker"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check-Out</span>
            </div>
            <div className="pl-6">
              <div className="text-lg font-bold text-gray-900 leading-tight flex items-baseline gap-1">
                {formatDay(checkOut)}{" "}
                <span className="text-xs font-semibold text-gray-500 uppercase">{formatMonthYear(checkOut)}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{formatDayName(checkOut)}</div>
            </div>
            {showCheckOutPicker && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="date"
                  value={checkOut.toISOString().split("T")[0]}
                  min={(() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })()}
                  onChange={(e) => {
                    setCheckOut(new Date(e.target.value + "T00:00:00"));
                    setShowCheckOutPicker(false);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-black outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Section: Rooms & Guests */}
          <div
            ref={guestRef}
            className="w-full md:w-64 p-4 flex flex-col justify-center cursor-pointer hover:bg-white/40 transition-colors min-h-[80px] relative"
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            id="hotel-guests-picker"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Rooms &amp; Guests
              </span>
            </div>
            <div className="pl-6 flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900 leading-tight flex items-baseline gap-2">
                {rooms} <span className="text-xs font-semibold text-gray-500 uppercase">Room{rooms > 1 ? "s" : ""}</span>
                {guests} <span className="text-xs font-semibold text-gray-500 uppercase">Guest{guests > 1 ? "s" : ""}</span>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>

            {/* Guest Dropdown */}
            {showGuestDropdown && (
              <div
                className="absolute top-full right-0 mt-1 w-[280px] z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Rooms */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Rooms</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold w-4 text-center text-gray-900">{rooms}</span>
                    <button
                      onClick={() => setRooms(Math.min(8, rooms + 1))}
                      className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Guests */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Guests</div>
                    <div className="text-xs text-gray-500">Per room</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold w-4 text-center text-gray-900">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(8, guests + 1))}
                      className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => setShowGuestDropdown(false)}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-1.5 rounded-full font-bold text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row: Full-width Search Button */}
        <button
          onClick={handleSearch}
          className="hotel-hero-btn-premium text-white py-4 px-8 rounded-xl font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-orange-500/30 mx-auto w-fit"
          id="hotel-search-action"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          Search
        </button>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-4 mt-8 w-full max-w-6xl justify-center md:justify-start" id="hotel-feature-badges">
        {/* Last Minute Deals Badge */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-lg cursor-pointer hover:bg-white/30 transition-all">
          <div className="bg-orange-500 p-1.5 rounded-full shadow-inner">
            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-wide">Last Minute Deals</span>
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
        </div>

        {/* Lowest Price Guarantee Badge */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-lg cursor-pointer hover:bg-white/30 transition-all">
          <div className="bg-blue-600 p-1.5 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-inner w-6 h-6">
            ₹
          </div>
          <span className="text-sm font-bold text-white tracking-wide">Lowest Price Guarantee</span>
          <svg className="h-4 w-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

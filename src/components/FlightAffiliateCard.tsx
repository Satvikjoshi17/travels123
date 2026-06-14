"use client";

import React from "react";
import { Plane, Clock, ArrowRight, ExternalLink } from "lucide-react";

export interface FlightData {
  id: string;
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  bookingUrl: string;
}

interface FlightAffiliateCardProps {
  flight: FlightData;
}

export function FlightAffiliateCard({ flight }: FlightAffiliateCardProps) {
  const [logoError, setLogoError] = React.useState(false);
  const logoUrl = `https://pics.avs.io/60/60/${flight.airlineCode}.png`;

  return (
    <div className="bg-white dark:bg-surface-container-lowest border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-center justify-between p-5 gap-4 group">
      
      {/* Airline Info */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
          {!logoError ? (
            <img
              src={logoUrl}
              alt={flight.airlineName}
              className="w-10 h-10 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
              <Plane className="w-6 h-6 rotate-45" />
            </div>
          )}
          <div className="absolute inset-0 bg-white/10 hover:bg-white/0 transition-colors" />
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1.5">
            {flight.airlineName}
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-medium">
              {flight.airlineCode}-{flight.flightNumber}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-semibold">
              Economy
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-450 flex items-center gap-0.5" title="Cabin Baggage Included">
              🎒 7kg
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-450 flex items-center gap-0.5" title="Check-in Baggage Included">
              🧳 15kg
            </span>
          </div>
        </div>
      </div>

      {/* Flight Time & Pathway */}
      <div className="flex-1 flex items-center justify-between w-full max-w-sm md:max-w-md px-2 md:px-6">
        <div className="text-left">
          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">{flight.departureTime}</p>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{flight.origin}</p>
        </div>

        <div className="flex-1 px-4 flex flex-col items-center relative">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            {flight.duration}
          </span>
          <div className="w-full h-[2px] bg-gray-250 dark:bg-gray-800 relative flex items-center justify-center">
            {/* Center Plane Icon */}
            <div className="absolute bg-white dark:bg-surface-container-lowest px-1.5">
              <Plane className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 rotate-90" />
            </div>
          </div>
          <span className="text-[9px] font-bold mt-1 text-gray-500 dark:text-gray-400">
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="text-right">
          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">{flight.arrivalTime}</p>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{flight.destination}</p>
        </div>
      </div>

      {/* Pricing & Booking CTA */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto md:border-l border-gray-100 dark:border-gray-800 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
        <div className="text-left md:text-right">
          <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Per Person</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
            {flight.currency === "INR" ? "₹" : flight.currency === "USD" ? "$" : flight.currency}
            {flight.price.toLocaleString()}
          </p>
        </div>
        
        <a
          href={flight.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] shrink-0"
        >
          Book Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}

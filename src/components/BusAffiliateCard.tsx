"use client";

import React from "react";
import { Clock, MapPin, ArrowRight, ExternalLink, Armchair } from "lucide-react";

export interface BusData {
  id: string;
  operatorName: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  rating: number;
  seatsAvailable: number;
  bookingUrl: string;
}

interface BusAffiliateCardProps {
  bus: BusData;
}

export function BusAffiliateCard({ bus }: BusAffiliateCardProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-center justify-between p-5 gap-4 group">

      {/* Operator Info */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-sm">
          <span className="font-black text-sm">{bus.operatorName.substring(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <div className="font-bold text-gray-900 leading-tight flex items-center gap-1.5">
            {bus.operatorName}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-semibold">{bus.busType}</span>
            {bus.rating > 0 && (
              <span className="text-[10px] text-amber-600 font-bold">★ {bus.rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Route & Timing */}
      <div className="flex-1 flex items-center justify-between w-full max-w-sm md:max-w-md px-2 md:px-6">
        <div className="text-left">
          <p className="text-xl font-extrabold text-gray-900 leading-none">{bus.departureTime}</p>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            {bus.origin}
          </p>
        </div>

        <div className="flex-1 px-4 flex flex-col items-center relative">
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            {bus.duration}
          </span>
          <div className="w-full h-[2px] bg-gray-200 relative flex items-center justify-center">
            <div className="absolute bg-white px-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
          <span className="text-[9px] font-bold mt-1 text-emerald-600 flex items-center gap-1">
            <Armchair className="w-3 h-3" />
            {bus.seatsAvailable} seats left
          </span>
        </div>

        <div className="text-right">
          <p className="text-xl font-extrabold text-gray-900 leading-none">{bus.arrivalTime}</p>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center gap-1 justify-end">
            <MapPin className="w-3 h-3 text-red-400" />
            {bus.destination}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
        <div className="text-left md:text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Per Seat</p>
          <p className="text-2xl font-black text-gray-900 leading-tight">
            {bus.currency === "INR" ? "₹" : bus.currency === "USD" ? "$" : bus.currency}
            {bus.price.toLocaleString()}
          </p>
        </div>

        <a
          href={bus.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] shrink-0"
        >
          Book Seat
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}

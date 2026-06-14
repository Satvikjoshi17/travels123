"use client";

import React from "react";
import { Car, MapPin, Clock, ExternalLink, Users } from "lucide-react";

export interface CabData {
  id: string;
  vehicleType: string;
  vehicleCategory: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedTime: string;
  capacity: number;
  price: number;
  currency: string;
  providerName: string;
  bookingUrl: string;
}

interface CabAffiliateCardProps {
  cab: CabData;
}

export function CabAffiliateCard({ cab }: CabAffiliateCardProps) {
  const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
    economy: { bg: "bg-blue-50", text: "text-blue-600", icon: "from-blue-500 to-blue-600" },
    sedan: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "from-indigo-500 to-indigo-600" },
    suv: { bg: "bg-violet-50", text: "text-violet-600", icon: "from-violet-500 to-violet-600" },
    luxury: { bg: "bg-amber-50", text: "text-amber-700", icon: "from-amber-500 to-amber-600" },
  };

  const style = categoryColors[cab.vehicleCategory.toLowerCase()] || categoryColors.sedan;

  return (
    <div className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-5 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Vehicle Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${style.icon} flex items-center justify-center text-white shrink-0 shadow-sm`}>
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900 leading-tight">{cab.vehicleType}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] ${style.bg} ${style.text} px-1.5 py-0.5 rounded font-semibold uppercase`}>
                {cab.vehicleCategory}
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                <Users className="w-3 h-3" /> {cab.capacity} pax
              </span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex-1 flex flex-col gap-1.5 px-2 md:px-6 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span className="font-semibold truncate">{cab.pickupLocation}</span>
          </div>
          <div className="ml-[7px] border-l-2 border-dashed border-gray-200 h-3" />
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-semibold truncate">{cab.dropLocation}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
            <Clock className="w-3 h-3" />
            Est. {cab.estimatedTime} • via {cab.providerName}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2 w-full sm:w-auto">
          <div className="sm:text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estimated Fare</p>
            <p className="text-2xl font-black text-gray-900 leading-tight">
              {cab.currency === "INR" ? "₹" : cab.currency === "USD" ? "$" : cab.currency}
              {cab.price.toLocaleString()}
            </p>
          </div>
          <a
            href={cab.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] shrink-0"
          >
            Book Ride
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

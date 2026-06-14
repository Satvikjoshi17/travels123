"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export interface HotelData {
  id: string;
  name: string;
  location: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
  bookingUrl: string;
}

interface HotelAffiliateCardProps {
  hotel: HotelData;
}

const FALLBACK_HOTEL_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60";

export function HotelAffiliateCard({ hotel }: HotelAffiliateCardProps) {
  const [imgSrc, setImgSrc] = useState(hotel.imageUrl || FALLBACK_HOTEL_IMAGE);

  useEffect(() => {
    setImgSrc(hotel.imageUrl || FALLBACK_HOTEL_IMAGE);
  }, [hotel.imageUrl]);

  // Star rendering helper
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-3.5 h-3.5 ${
          idx < count
            ? "text-amber-500 fill-amber-500"
            : "text-gray-300 dark:text-gray-700"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-surface-container-lowest border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-48 group">
      
      {/* Hotel Image Panel */}
      <div className="relative w-full sm:w-48 h-48 sm:h-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={imgSrc}
          alt={hotel.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_HOTEL_IMAGE)}
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-surface-container/95 backdrop-blur-md text-gray-950 dark:text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 border border-white/20">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{hotel.rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">({hotel.reviewsCount})</span>
        </div>
      </div>

      {/* Hotel Details Panel */}
      <div className="flex-1 p-5 flex flex-col justify-between text-left">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                {hotel.rating.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5">
                {renderStars(hotel.stars)}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="truncate">{hotel.location}</span>
          </div>

          {/* Amenities/Highlights */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Free Cancellation
            </span>
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              Free WiFi
            </span>
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Price per night</span>
            <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
              {hotel.currency === "INR" ? "₹" : hotel.currency === "USD" ? "$" : hotel.currency}
              {hotel.pricePerNight.toLocaleString()}
            </p>
          </div>

          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
          >
            Book Room
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}

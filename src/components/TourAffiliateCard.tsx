"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Clock, MapPin, ExternalLink, Tag } from "lucide-react";

export interface TourData {
  id: string;
  name: string;
  location: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  highlights: string[];
  price: number;
  currency: string;
  imageUrl: string;
  bookingUrl: string;
}

interface TourAffiliateCardProps {
  tour: TourData;
}

const FALLBACK_TOUR_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60";

export function TourAffiliateCard({ tour }: TourAffiliateCardProps) {
  const [imgSrc, setImgSrc] = useState(tour.imageUrl || FALLBACK_TOUR_IMAGE);

  useEffect(() => {
    setImgSrc(tour.imageUrl || FALLBACK_TOUR_IMAGE);
  }, [tour.imageUrl]);

  return (
    <div className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-52 group">

      {/* Image Panel */}
      <div className="relative w-full sm:w-52 h-48 sm:h-full shrink-0 overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={tour.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_TOUR_IMAGE)}
        />
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-950 font-bold text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 border border-white/20">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{tour.rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-500 font-normal">({tour.reviewsCount})</span>
        </div>
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {tour.duration}
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 p-5 flex flex-col justify-between text-left">
        <div>
          <h3 className="font-extrabold text-lg text-gray-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
            {tour.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="truncate">{tour.location}</span>
          </div>

          {/* Highlights */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tour.highlights.slice(0, 3).map((h, i) => (
              <span
                key={i}
                className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"
              >
                <Tag className="w-2.5 h-2.5" />
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">From</span>
            <p className="text-xl font-black text-gray-900 leading-none">
              {tour.currency === "INR" ? "₹" : tour.currency === "USD" ? "$" : tour.currency}
              {tour.price.toLocaleString()}
            </p>
          </div>

          <a
            href={tour.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98]"
          >
            Book Activity
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}

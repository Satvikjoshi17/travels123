"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Calendar, Check, ExternalLink, Plane, Hotel as HotelIcon } from "lucide-react";

export interface PackageData {
  id: string;
  name: string;
  destination: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  inclusions: string[];
  price: number;
  originalPrice: number;
  currency: string;
  imageUrl: string;
  bookingUrl: string;
}

interface PackageAffiliateCardProps {
  pkg: PackageData;
}

const FALLBACK_PACKAGE_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60";

export function PackageAffiliateCard({ pkg }: PackageAffiliateCardProps) {
  const [imgSrc, setImgSrc] = useState(pkg.imageUrl || FALLBACK_PACKAGE_IMAGE);

  useEffect(() => {
    setImgSrc(pkg.imageUrl || FALLBACK_PACKAGE_IMAGE);
  }, [pkg.imageUrl]);

  const discount = pkg.originalPrice > pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image Header */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={pkg.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_PACKAGE_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white font-black text-[10px] px-2 py-1 rounded-lg shadow-md">
              {discount}% OFF
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-md text-gray-900 font-bold text-[10px] px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {pkg.rating.toFixed(1)}
          </span>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="bg-black/60 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {pkg.duration}
          </span>
        </div>

        {/* Destination overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 font-bold text-xs px-2.5 py-1 rounded-lg shadow-md">
            {pkg.destination}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-extrabold text-lg text-gray-900 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
          {pkg.name}
        </h3>

        {/* Inclusions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pkg.inclusions.slice(0, 4).map((item, i) => {
            const icon = item.toLowerCase().includes("flight") ? Plane :
                         item.toLowerCase().includes("hotel") ? HotelIcon : Check;
            const Icon = icon;
            return (
              <span
                key={i}
                className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"
              >
                <Icon className="w-2.5 h-2.5" />
                {item}
              </span>
            );
          })}
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-end justify-between mt-5 pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Starting from</span>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black text-gray-900 leading-none">
                {pkg.currency === "INR" ? "₹" : pkg.currency === "USD" ? "$" : pkg.currency}
                {pkg.price.toLocaleString()}
              </p>
              {pkg.originalPrice > pkg.price && (
                <span className="text-sm text-gray-400 line-through font-semibold">
                  {pkg.currency === "INR" ? "₹" : pkg.currency === "USD" ? "$" : pkg.currency}
                  {pkg.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400">per person</span>
          </div>

          <a
            href={pkg.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98]"
          >
            View Package
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

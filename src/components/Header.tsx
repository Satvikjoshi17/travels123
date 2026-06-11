"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

export function Header() {
  const { setModalOpen, selectedCountry } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Desktop + Mobile Header */}
      <nav className="bg-surface/80 dark:bg-surface/75 backdrop-blur-2xl border-b border-outline-variant/15 dark:border-white/5 fixed top-0 w-full z-50 transition-colors duration-300 shadow-sm dark:shadow-none">
        <div className="max-w-container-max mx-auto">
          {/* Top Row — Logo, Actions */}
          <div className="flex justify-between items-center px-margin-mobile md:px-gutter h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <span className="material-symbols-outlined text-white text-[18px] md:text-[22px] group-hover:rotate-12 transition-transform duration-500">travel_explore</span>
              </div>
              <span className="font-display-lg text-[22px] sm:text-[26px] font-bold text-primary dark:text-white tracking-tight">
                GlobeTrek
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              {/* Country/Currency Selector */}
              {mounted && (
                <button
                  className="flex items-center gap-1.5 cursor-pointer bg-surface-container-low dark:bg-white/5 border border-outline-variant/20 dark:border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-surface-container dark:hover:bg-white/10 transition-all duration-200 hover:shadow-sm"
                  onClick={() => setModalOpen(true)}
                  title="Change Region & Currency"
                >
                  <img
                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-[18px] h-[13px] sm:w-5 sm:h-3.5 object-cover rounded-[2px] shadow-sm"
                  />
                  <span className="text-[11px] sm:text-xs font-label-bold text-on-surface dark:text-white/90">
                    {selectedCountry.currency}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant dark:text-white/50 hidden sm:block">
                    expand_more
                  </span>
                </button>
              )}



              <div className="hidden sm:flex items-center gap-4">
                {/* About Link */}
                <Link
                  href="/about"
                  className="relative text-sm font-label-bold text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors group px-2 py-1"
                >
                  About
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>

                {/* Blog Link */}
                <Link
                  href="/blog"
                  className="relative text-sm font-label-bold text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors group px-2 py-1"
                >
                  Blog
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>

                {/* Careers Link */}
                <Link
                  href="/careers"
                  className="relative text-sm font-label-bold text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors group px-2 py-1"
                >
                  Careers
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>

                {/* Login Button */}
                <Link href="/login" className="flex items-center gap-1.5 bg-transparent border border-outline-variant/30 dark:border-white/15 text-on-surface dark:text-white px-5 py-2.5 rounded-full font-label-bold text-sm hover:bg-surface-container dark:hover:bg-white/5 transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Log in
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container dark:hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="material-symbols-outlined text-on-surface dark:text-white">
                  {mobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-surface dark:bg-surface-container border-b border-outline-variant/20 dark:border-white/10 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* About + Blog + Careers + Login */}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-on-surface dark:text-white hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">info</span>
                <span className="font-label-bold text-[15px]">About Us</span>
              </Link>

              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-on-surface dark:text-white hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">rss_feed</span>
                <span className="font-label-bold text-[15px]">Blog</span>
              </Link>

              <Link
                href="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-on-surface dark:text-white hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">work</span>
                <span className="font-label-bold text-[15px]">Careers</span>
              </Link>

              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary dark:text-white px-4 py-3.5 rounded-xl font-label-bold text-[15px] mt-2 active:scale-[0.98] transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                Log in or Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED";

export interface CountryInfo {
  code: string;
  name: string;
  currency: CurrencyCode;
  symbol: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "EU", name: "European Union", currency: "EUR", symbol: "€" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
];

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.37,
  SGD: 1.35,
  AED: 3.67,
};

interface CurrencyContextType {
  selectedCountry: CountryInfo;
  setCountry: (countryCode: string) => void;
  formatPrice: (priceInUSD: number) => string;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Default USD
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Client-side detection using a free IP API
    const detectLocation = async () => {
      try {
        const storedCountryCode = localStorage.getItem("travelwise_country");
        if (storedCountryCode) {
          const country = COUNTRIES.find(c => c.code === storedCountryCode);
          if (country) setSelectedCountry(country);
        } else {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          const country = COUNTRIES.find(c => c.code === data.country_code);
          if (country) {
            setSelectedCountry(country);
            localStorage.setItem("travelwise_country", country.code);
          }
        }
      } catch (error) {
        console.error("Failed to detect location", error);
      } finally {
        setIsLoaded(true);
      }
    };
    detectLocation();
  }, []);

  const setCountry = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      localStorage.setItem("travelwise_country", country.code);
      setModalOpen(false);
    }
  };

  const formatPrice = (priceInUSD: number) => {
    // If not loaded yet, just show USD to avoid hydration mismatch, or format immediately based on state
    const rate = EXCHANGE_RATES[selectedCountry.currency];
    const converted = priceInUSD * rate;
    
    return new Intl.NumberFormat(selectedCountry.code === 'IN' ? 'en-IN' : 'en-US', {
      style: "currency",
      currency: selectedCountry.currency,
      maximumFractionDigits: 0, // Travel prices usually don't need cents
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCountry, setCountry, formatPrice, isModalOpen, setModalOpen }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

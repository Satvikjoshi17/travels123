"use client";

import { useCurrency, COUNTRIES } from "@/contexts/CurrencyContext";

export function CurrencySelector() {
  const { selectedCountry, setCountry, isModalOpen, setModalOpen } = useCurrency();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-container-lowest dark:bg-surface-container w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 dark:border-white/10">
        <div className="p-stack-md border-b border-outline-variant/20 flex justify-between items-center">
          <h2 className="font-title-lg text-title-lg text-on-surface dark:text-white">Select Region & Currency</h2>
          <button 
            onClick={() => setModalOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-stack-md max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => setCountry(country.code)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  selectedCountry.code === country.code
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-transparent hover:bg-surface-container-low dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-surface-variant rounded overflow-hidden relative">
                    <img 
                      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} 
                      alt={country.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-label-bold text-on-surface dark:text-white">{country.name}</div>
                    <div className="text-xs text-on-surface-variant">{country.currency} ({country.symbol})</div>
                  </div>
                </div>
                {selectedCountry.code === country.code && (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

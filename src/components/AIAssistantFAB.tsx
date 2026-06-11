"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AIAssistantFAB() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChatClick = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      // Grab 'to' from query params if user did a search, or fallback to 'destination'
      const toVal = params.get("to") || params.get("destination") || "";
      const query = toVal ? `?destination=${encodeURIComponent(toVal)}` : "";
      router.push(`/travel-assistant${query}`);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-end">
      {/* FAB Button and Popup */}
      <div className="relative">
        <div 
          className={`absolute bottom-[110%] right-0 mb-2 bg-white dark:bg-surface-container px-4 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-500 flex items-center gap-3 border border-gray-100 dark:border-gray-800 min-w-[200px] origin-bottom-right ${!showPopup ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`} 
          id="welcome-popup"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-[18px]">chat_bubble</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">Compare & Save!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Let <span className="italic font-semibold text-blue-500">Milo</span> find the lowest fares.</p>
          </div>
        </div>

        <button 
          className="group relative flex items-center justify-center w-[60px] h-[60px] md:w-[68px] md:h-[68px] bg-white dark:bg-surface-container-low rounded-full border border-gray-250 dark:border-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 z-50 cursor-pointer" 
          onClick={handleChatClick}
          id="milo-bot"
          aria-label="Ask Milo AI Assistant"
        >
          {/* Custom Animated CSS Bot Icon */}
          <div className="w-[85%] h-[85%] rounded-full flex items-center justify-center relative bg-gradient-to-tr from-blue-600 via-[#008cff] to-cyan-400 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.2)]">
             
             {/* Outer pulsing radar ring */}
             <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-60" style={{ animationDuration: '2.5s' }}></div>
             
             {/* Inner rotating dashed ring */}
             <div className="absolute inset-1 rounded-full border-2 border-dashed border-white/50 animate-[spin_8s_linear_infinite]"></div>
             
             {/* Core glowing icon */}
             <span className="material-symbols-outlined text-white text-[32px] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 animate-pulse" style={{ animationDuration: '2s' }}>
               travel_explore
             </span>
             
             {/* Shine effect */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full"></div>
          </div>
        </button>
      </div>
    </div>
  );
}

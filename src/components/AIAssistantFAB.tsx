"use client";

import { useState, useEffect } from "react";

export function AIAssistantFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-end">
      {/* Chat Overlay */}
      <div 
        className={`${isOpen ? 'flex' : 'hidden'} bg-white dark:bg-surface-container-low w-80 md:w-96 h-[500px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex-col mb-4 overflow-hidden animate-in fade-in duration-300 border border-gray-200 dark:border-gray-800`} 
        id="ai-chat-overlay"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 flex justify-between items-center border-b border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <span className="material-symbols-outlined text-white text-[18px] relative z-10">travel_explore</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-blue-600 dark:text-blue-400 font-bold italic text-lg">Milo</span>
            </div>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-transparent">
          <div className="bg-white dark:bg-surface-container rounded-lg rounded-tl-none p-3 text-gray-800 dark:text-gray-200 text-sm max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-800">
            Hi! I'm <span className="font-bold italic text-blue-500">Milo</span>. Tell me where you want to go, and I'll compare prices across 50+ sites to find you the absolute best fare!
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-container-low">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-surface-container rounded-full px-4 py-2 border border-transparent focus-within:border-blue-400 transition-colors">
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 outline-none text-gray-800 dark:text-white" 
              placeholder="Ask me anything..." 
              type="text"
            />
            <button className="text-gray-400 hover:text-blue-500 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button className="text-blue-500 hover:text-blue-600 p-1 rounded-full flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>

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
          className="group relative flex items-center justify-center w-[60px] h-[60px] md:w-[68px] md:h-[68px] bg-white rounded-full border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 z-50" 
          onClick={() => setIsOpen(!isOpen)}
          id="milo-bot"
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

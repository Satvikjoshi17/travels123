"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Compass, 
  Plane, 
  Hotel, 
  RefreshCw,
  User,
  Bot
} from "lucide-react";
import { FlightAffiliateCard } from "@/components/FlightAffiliateCard";
import { HotelAffiliateCard } from "@/components/HotelAffiliateCard";

function ChatInterface() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Custom input state for Vercel AI SDK 6.x
  const [input, setInput] = useState("");
  const [initialPromptTriggered, setInitialPromptTriggered] = useState(false);

  const { 
    messages, 
    sendMessage,
    status, 
    setMessages
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "welcome",
        role: "assistant" as UIMessage["role"],
        parts: [
          {
            type: "text",
            text: "Hello! I'm Milo, your AI travel concierge. Tell me where you're planning to travel, and I'll find you the best flight deals and hotel stays in seconds!"
          }
        ]
      }
    ]
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Handle destination query param from URL on load
  useEffect(() => {
    if (typeof window !== "undefined" && !initialPromptTriggered) {
      const params = new URLSearchParams(window.location.search);
      const destination = params.get("destination");
      if (destination) {
        setInitialPromptTriggered(true);
        // Clean URL to avoid infinite loops on refreshes
        window.history.replaceState({}, "", "/travel-assistant");
        
        // Auto search flights & hotels
        sendMessage({
          text: `Search flights and hotels for a trip to ${destination}`
        });
      }
    }
  }, [sendMessage, initialPromptTriggered]);

  // Scroll to bottom on new messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  // Recommendation chip quick action
  const handleQuickSearch = (query: string) => {
    if (isLoading) return;
    sendMessage({ text: query });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant" as UIMessage["role"],
        parts: [
          {
            type: "text",
            text: "Hello! I'm Milo, your AI travel concierge. Tell me where you're planning to travel, and I'll find you the best flight deals and hotel stays in seconds!"
          }
        ]
      }
    ]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#080d16] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Top Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-[#0c1424]/85 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 dark:text-white leading-none tracking-tight">Milo</span>
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none tracking-wide uppercase">AI Concierge</span>
              </div>
              <span className="text-[11px] text-green-500 font-semibold flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online &amp; Ready
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleClearChat}
          className="text-xs font-bold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 px-3.5 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Chat
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isLatestMessage = messages[messages.length - 1]?.id === message.id;
              return (
                <div 
                  key={message.id} 
                  className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    <div 
                      className={`p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                        isUser 
                          ? "bg-blue-600 text-white rounded-tr-none text-left" 
                          : "bg-white dark:bg-[#0c1424] text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-150 dark:border-gray-850"
                      }`}
                    >
                      {/* Loop and render message parts natively for Vercel AI SDK 6.x */}
                      {message.parts && message.parts.length > 0 ? (
                        message.parts.map((part: any, partIdx) => {
                          if (part.type === "text") {
                            const showPicker = isLatestMessage && !isUser && (
                              part.text.toLowerCase().includes("date") || 
                              part.text.toLowerCase().includes("depart") || 
                              part.text.toLowerCase().includes("check-in") || 
                              part.text.toLowerCase().includes("check-out") || 
                              part.text.toLowerCase().includes("check in") || 
                              part.text.toLowerCase().includes("check out") || 
                              part.text.toLowerCase().includes("return") || 
                              part.text.toLowerCase().includes("traveling on") ||
                              part.text.toLowerCase().includes("when would you like to")
                            );
                            return (
                              <div key={partIdx}>
                                <p className="whitespace-pre-wrap leading-relaxed mb-2 last:mb-0">
                                  {part.text}
                                </p>
                                {showPicker && (
                                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                                    <div className="flex items-center gap-2">
                                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">calendar_month</span>
                                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Select Date:</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className="bg-white dark:bg-[#0c1424] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-gray-950 dark:text-white font-semibold shadow-sm cursor-pointer"
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          if (val) {
                                            sendMessage({ text: val });
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          if (part.type === "tool-searchFlights") {
                            if (part.state === "output-available") {
                              const result = part.output;
                              return (
                                <div key={partIdx} className="flex flex-col gap-3.5 mt-4">
                                  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                      <Plane className="w-3.5 h-3.5 rotate-45" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                      Top Flight Deals
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    {result.flights && result.flights.length > 0 ? (
                                      result.flights.map((flight: any) => (
                                        <FlightAffiliateCard key={flight.id} flight={flight} />
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No flights found matching criteria.</p>
                                    )}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div 
                                  key={partIdx} 
                                  className="p-5 border border-dashed border-gray-200 dark:border-gray-850 rounded-2xl bg-gray-50/50 dark:bg-[#0e172a]/40 animate-pulse flex flex-col gap-3 w-full mt-4"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                    <span className="text-xs font-bold text-blue-500 tracking-wide">
                                      Scanning airlines for low fares...
                                    </span>
                                  </div>
                                  <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                                  <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl w-[90%]" />
                                </div>
                              );
                            }
                          }

                          if (part.type === "tool-searchHotels") {
                            if (part.state === "output-available") {
                              const result = part.output;
                              return (
                                <div key={partIdx} className="flex flex-col gap-3.5 mt-4">
                                  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                      <Hotel className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                      Top Hotel Recommendations
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    {result.hotels && result.hotels.length > 0 ? (
                                      result.hotels.map((hotel: any) => (
                                        <HotelAffiliateCard key={hotel.id} hotel={hotel} />
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No hotels found matching criteria.</p>
                                    )}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div 
                                  key={partIdx} 
                                  className="p-5 border border-dashed border-gray-200 dark:border-gray-850 rounded-2xl bg-gray-50/50 dark:bg-[#0e172a]/40 animate-pulse flex flex-col gap-3 w-full mt-4"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                    <span className="text-xs font-bold text-blue-500 tracking-wide">
                                      Finding highly rated hotels...
                                    </span>
                                  </div>
                                  <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                                  <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl w-[90%]" />
                                </div>
                              );
                            }
                          }

                          return null;
                        })
                      ) : null}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-blue-900/50">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Skeleton Loading State for Assistant Conversational Text */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div className="bg-white dark:bg-[#0c1424] border border-gray-150 dark:border-gray-850 p-4 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2 w-28 md:w-36 animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestion Chips & Input Section */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-[#080d16] dark:via-[#080d16] dark:to-transparent shrink-0">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Quick Chips (shown when no user queries have started yet) */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {[
                  { label: "Flights to Tokyo", query: "Find cheap flights to Tokyo next month" },
                  { label: "Luxury Hotels in Paris", query: "Search 5-star hotels in Paris for next week" },
                  { label: "Delhi to Bengaluru flights", query: "Compare flights from Delhi (DEL) to Bengaluru (BLR)" },
                  { label: "Weekend getaway stays", query: "Find hotels in Goa" }
                ].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSearch(chip.query)}
                    className="bg-white dark:bg-[#0c1424] hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-900 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
                  >
                    <Compass className="w-3.5 h-3.5 text-blue-500" />
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Form Input Box */}
            <form 
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-[#0c1424] border border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-3xl shadow-lg p-2.5 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0 pl-3">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Milo to search flights (e.g. DEL to BLR) or hotels..."
                  className="w-full bg-transparent border-none outline-none text-sm md:text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-2.5"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                  isLoading || !input.trim()
                    ? "bg-gray-300 dark:bg-gray-800 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/10 hover:shadow-blue-500/25"
                }`}
                aria-label="Send Message"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>

            <p className="text-[10px] md:text-xs text-center text-gray-400 dark:text-gray-500 font-medium">
              Milo uses AI to compare prices. Booking transactions are completed securely on affiliate partner websites.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080d16] text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold animate-pulse">Loading Milo Concierge...</span>
        </div>
      </div>
    }>
      <ChatInterface />
    </Suspense>
  );
}

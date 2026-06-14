"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
  Bus,
  Car,
  Map,
  Package,
  RefreshCw,
  User,
  Bot,
  AlertTriangle,
  Calendar,
  Users,
  Edit2,
  Check,
  Search,
} from "lucide-react";
import { FlightAffiliateCard } from "@/components/FlightAffiliateCard";
import { HotelAffiliateCard } from "@/components/HotelAffiliateCard";
import { BusAffiliateCard } from "@/components/BusAffiliateCard";
import { CabAffiliateCard } from "@/components/CabAffiliateCard";
import { TourAffiliateCard } from "@/components/TourAffiliateCard";
import { PackageAffiliateCard } from "@/components/PackageAffiliateCard";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ──── Loading labels per tool type ──── */
const LOADING_LABELS: Record<string, { icon: React.ReactNode; text: string }> = {
  "tool-searchFlights": {
    icon: <Plane className="w-3.5 h-3.5 rotate-45" />,
    text: "Scanning airlines for the best fares...",
  },
  "tool-searchHotels": {
    icon: <Hotel className="w-3.5 h-3.5" />,
    text: "Finding highly rated hotels...",
  },
  "tool-searchBuses": {
    icon: <Bus className="w-3.5 h-3.5" />,
    text: "Checking intercity bus routes...",
  },
  "tool-searchCabs": {
    icon: <Car className="w-3.5 h-3.5" />,
    text: "Fetching available cabs nearby...",
  },
  "tool-searchTours": {
    icon: <Map className="w-3.5 h-3.5" />,
    text: "Discovering top-rated activities...",
  },
  "tool-searchPackages": {
    icon: <Package className="w-3.5 h-3.5" />,
    text: "Searching holiday package deals...",
  },
};

/* ──── Tool section headers ──── */
const SECTION_HEADERS: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  "tool-searchFlights": {
    icon: <Plane className="w-3.5 h-3.5 rotate-45" />,
    label: "Top Flight Deals",
    color: "text-blue-600 bg-blue-50",
  },
  "tool-searchHotels": {
    icon: <Hotel className="w-3.5 h-3.5" />,
    label: "Top Hotel Recommendations",
    color: "text-blue-600 bg-blue-50",
  },
  "tool-searchBuses": {
    icon: <Bus className="w-3.5 h-3.5" />,
    label: "Bus Routes Found",
    color: "text-emerald-600 bg-emerald-50",
  },
  "tool-searchCabs": {
    icon: <Car className="w-3.5 h-3.5" />,
    label: "Available Cabs",
    color: "text-indigo-600 bg-indigo-50",
  },
  "tool-searchTours": {
    icon: <Map className="w-3.5 h-3.5" />,
    label: "Activities & Experiences",
    color: "text-orange-600 bg-orange-50",
  },
  "tool-searchPackages": {
    icon: <Package className="w-3.5 h-3.5" />,
    label: "Holiday Packages",
    color: "text-purple-600 bg-purple-50",
  },
};

/* ──── Quick Suggestion Chips ──── */
const QUICK_CHIPS = [
  { label: "Flights to Tokyo", query: "Find cheap flights to Tokyo", icon: <Plane className="w-3.5 h-3.5" /> },
  { label: "Hotels in Paris", query: "Search 5-star hotels in Paris", icon: <Hotel className="w-3.5 h-3.5" /> },
  { label: "Buses Delhi to Agra", query: "Find buses from Delhi to Agra", icon: <Bus className="w-3.5 h-3.5" /> },
  { label: "Tours in Goa", query: "Things to do and activities in Goa", icon: <Map className="w-3.5 h-3.5" /> },
  { label: "Airport cab Mumbai", query: "Book an airport cab in Mumbai", icon: <Car className="w-3.5 h-3.5" /> },
  { label: "Bali packages", query: "Holiday packages to Bali", icon: <Package className="w-3.5 h-3.5" /> },
];

/* ─────────────────────────────────────────
   Tool Result Card Renderer
   ───────────────────────────────────────── */
function getDefaultDate(daysFromNow: number = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function ToolResultCards({
  toolType,
  result,
  args,
}: {
  toolType: string;
  result: Record<string, unknown>;
  args?: Record<string, any>;
}) {
  const { selectedCountry } = useCurrency();
  const header = SECTION_HEADERS[toolType];

  const [localResult, setLocalResult] = useState(result);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasConfirmedDefaults, setHasConfirmedDefaults] = useState(false);

  // Parse initial values
  const initOrigin = args?.origin || args?.pickupLocation || (result as any)?.args?.origin || (result as any)?.args?.pickupLocation || "";
  const initDest = args?.destination || args?.dropLocation || (result as any)?.args?.destination || (result as any)?.args?.dropLocation || "";
  const initDate = args?.departureDate || args?.travelDate || args?.checkInDate || (result as any)?.args?.departureDate || (result as any)?.args?.travelDate || (result as any)?.args?.checkInDate || getDefaultDate(7);
  const initReturnDate = args?.returnDate || (result as any)?.args?.returnDate || "";
  const initCheckOutDate = args?.checkOutDate || (result as any)?.args?.checkOutDate || (toolType === "tool-searchHotels" ? getDefaultDate(10) : "");
  const initPassengers = args?.passengers || args?.guests || (result as any)?.args?.passengers || (result as any)?.args?.guests || 1;
  const initDuration = args?.duration || (result as any)?.args?.duration || "5D/4N";
  const initMaxPrice = args?.maxPrice || (result as any)?.args?.maxPrice || undefined;

  const [origin, setOrigin] = useState(initOrigin);
  const [destination, setDestination] = useState(initDest);
  const [departureDate, setDepartureDate] = useState(initDate);
  const [returnDate, setReturnDate] = useState(initReturnDate);
  const [checkOutDate, setCheckOutDate] = useState(initCheckOutDate);
  const [passengers, setPassengers] = useState(initPassengers);
  const [duration, setDuration] = useState(initDuration);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initMaxPrice ? Number(initMaxPrice) : undefined);

  // Sync with initial result
  useEffect(() => {
    setLocalResult(result);
    const resultMaxPrice = (result as any)?.args?.maxPrice || args?.maxPrice;
    if (resultMaxPrice) {
      setMaxPrice(Number(resultMaxPrice));
    }
  }, [result]);

  const handleUpdateSearch = async (forceCurrency?: string) => {
    setIsLoading(true);
    setIsEditing(false);
    setHasConfirmedDefaults(true);
    try {
      let updatedArgs: Record<string, any> = {};
      if (toolType === "tool-searchFlights") {
        updatedArgs = { origin, destination, departureDate, returnDate, passengers, maxPrice };
      } else if (toolType === "tool-searchHotels") {
        updatedArgs = { destination, checkInDate: departureDate, checkOutDate, guests: passengers, maxPrice };
      } else if (toolType === "tool-searchBuses") {
        updatedArgs = { origin, destination, travelDate: departureDate, passengers, maxPrice };
      } else if (toolType === "tool-searchCabs") {
        updatedArgs = { pickupLocation: origin, dropLocation: destination, passengers, maxPrice };
      } else if (toolType === "tool-searchTours") {
        updatedArgs = { destination, maxPrice };
      } else if (toolType === "tool-searchPackages") {
        updatedArgs = { destination, duration, maxPrice };
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType,
          args: updatedArgs,
          currency: forceCurrency || selectedCountry.currency,
        }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setLocalResult(data);
      }
    } catch (e) {
      console.error("Error updating search:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically refresh details if currency changes
    handleUpdateSearch(selectedCountry.currency);
  }, [selectedCountry.currency]);

  // Determine data array key and card component
  let dataArray: unknown[] = [];
  let CardComponent: React.FC<{ data: unknown }> | null = null;

  if (toolType === "tool-searchFlights" && localResult.flights) {
    dataArray = localResult.flights as unknown[];
    CardComponent = ({ data }) => <FlightAffiliateCard flight={data as any} />;
  } else if (toolType === "tool-searchHotels" && localResult.hotels) {
    dataArray = localResult.hotels as unknown[];
    CardComponent = ({ data }) => <HotelAffiliateCard hotel={data as any} />;
  } else if (toolType === "tool-searchBuses" && localResult.buses) {
    dataArray = localResult.buses as unknown[];
    CardComponent = ({ data }) => <BusAffiliateCard bus={data as any} />;
  } else if (toolType === "tool-searchCabs" && localResult.cabs) {
    dataArray = localResult.cabs as unknown[];
    CardComponent = ({ data }) => <CabAffiliateCard cab={data as any} />;
  } else if (toolType === "tool-searchTours" && localResult.tours) {
    dataArray = localResult.tours as unknown[];
    CardComponent = ({ data }) => <TourAffiliateCard tour={data as any} />;
  } else if (toolType === "tool-searchPackages" && localResult.packages) {
    dataArray = localResult.packages as unknown[];
    CardComponent = ({ data }) => <PackageAffiliateCard pkg={data as any} />;
  }

  const renderBadgeSummary = () => {
    let summaryText = "";
    if (toolType === "tool-searchFlights") {
      summaryText = `${origin || "Anywhere"} ➔ ${destination || "Anywhere"} • 📅 ${departureDate} ${returnDate ? `➔ ${returnDate}` : ""} • 👥 ${passengers} Passengers`;
    } else if (toolType === "tool-searchHotels") {
      summaryText = `🏨 ${destination || "Anywhere"} • 📅 ${departureDate} to ${checkOutDate} • 👥 ${passengers} Guest${passengers > 1 ? "s" : ""}`;
    } else if (toolType === "tool-searchBuses") {
      summaryText = `🚌 ${origin || "Anywhere"} ➔ ${destination || "Anywhere"} • 📅 ${departureDate} • 👥 ${passengers} Passengers`;
    } else if (toolType === "tool-searchCabs") {
      summaryText = `🚗 ${origin || "Pickup"} ➔ ${destination || "Dropoff"} • 👥 ${passengers} Passengers`;
    } else if (toolType === "tool-searchTours") {
      summaryText = `🎫 ${destination || "Anywhere"} Activities`;
    } else if (toolType === "tool-searchPackages") {
      summaryText = `📦 ${destination || "Anywhere"} • ⏳ ${duration}`;
    }

    if (maxPrice) {
      const symbol = selectedCountry.currency === "INR" ? "₹" : selectedCountry.currency === "USD" ? "$" : selectedCountry.currency;
      summaryText += ` • 💰 Max ${symbol}${maxPrice}`;
    }

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50/40 via-indigo-50/20 to-blue-50/40 dark:from-slate-900/40 dark:to-slate-800/40 border border-blue-100/50 dark:border-slate-850 px-4 py-2.5 rounded-xl text-xs text-blue-900 dark:text-blue-300 font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-200/80">
        <span className="truncate max-w-[80%] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          {summaryText}
        </span>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setHasConfirmedDefaults(true);
          }}
          className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1 transition-all cursor-pointer text-xs bg-white dark:bg-slate-800 shadow-sm border border-blue-100/80 px-2.5 py-1 rounded-lg hover:scale-105 active:scale-95 duration-200"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Modify
        </button>
      </div>
    );
  };

  const renderEditForm = () => {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 p-5 rounded-2xl shadow-lg space-y-4 mt-2">
        <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <span className="w-1.5 h-3 rounded-full bg-blue-650" />
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modify Search Parameters</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Origin / Pickup (Conditional) */}
          {(toolType === "tool-searchFlights" || toolType === "tool-searchBuses" || toolType === "tool-searchCabs") && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">
                {toolType === "tool-searchCabs" ? "Pickup Location" : "Origin"}
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder="e.g. DEL"
              />
            </div>
          )}

          {/* Destination / Dropoff */}
          <div>
            <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">
              {toolType === "tool-searchCabs" ? "Drop Location" : "Destination"}
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              placeholder="e.g. Mumbai"
            />
          </div>

          {/* Date Picker */}
          {toolType !== "tool-searchTours" && toolType !== "tool-searchPackages" && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">
                {toolType === "tool-searchHotels" ? "Check-in Date" : "Travel Date"}
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          )}

          {/* Return Date (Flights only) */}
          {toolType === "tool-searchFlights" && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">Return Date (Optional)</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          )}

          {/* Check-out Date (Hotels only) */}
          {toolType === "tool-searchHotels" && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">Check-out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          )}

          {/* Passengers / Guests Stepper Counter */}
          {toolType !== "tool-searchTours" && toolType !== "tool-searchPackages" && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">
                {toolType === "tool-searchHotels" ? "Guests" : "Passengers"}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-10 h-10 border border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300 font-extrabold rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-90 select-none bg-white"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-gray-800 select-none bg-gray-50 border border-gray-200 py-2.5 rounded-xl">
                  {passengers}
                </div>
                <button
                  type="button"
                  onClick={() => setPassengers(Math.min(9, passengers + 1))}
                  className="w-10 h-10 border border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300 font-extrabold rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-90 select-none bg-white"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Duration (Packages only) */}
          {toolType === "tool-searchPackages" && (
            <div>
              <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                placeholder="e.g. 5D/4N"
              />
            </div>
          )}

          {/* Budget Limit (All tool types) */}
          <div>
            <label className="block text-xs font-bold text-gray-550 uppercase tracking-wide mb-1.5">
              Max Budget Limit ({selectedCountry.currency === "INR" ? "₹" : selectedCountry.currency === "USD" ? "$" : selectedCountry.currency})
            </label>
            <input
              type="number"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-205 rounded-xl bg-gray-50/50 hover:bg-white text-gray-800 outline-none focus:border-blue-550 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              placeholder="e.g. 2000"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
          <button
            onClick={() => {
              setIsEditing(false);
              setHasConfirmedDefaults(true);
            }}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-gray-200 active:scale-95 duration-200"
          >
            <Check className="w-3.5 h-3.5" />
            OK (Keep Defaults)
          </button>
          <button
            onClick={() => handleUpdateSearch()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 duration-200"
          >
            <Search className="w-3.5 h-3.5" />
            Update Search
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmationPicker = () => {
    if (hasConfirmedDefaults || isEditing) return null;

    const budgetStr = maxPrice
      ? `${selectedCountry.currency === "INR" ? "₹" : selectedCountry.currency === "USD" ? "$" : selectedCountry.currency}${maxPrice.toLocaleString()}`
      : "Not set";

    let labelText = "default settings";
    if (toolType === "tool-searchFlights") {
      labelText = `${passengers} passenger${passengers > 1 ? "s" : ""}, 1-way flight`;
    } else if (toolType === "tool-searchHotels") {
      labelText = `${passengers} guest${passengers > 1 ? "s" : ""}, 3 nights`;
    } else if (toolType === "tool-searchBuses") {
      labelText = `${passengers} passenger${passengers > 1 ? "s" : ""}`;
    }

    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-slate-900/60 dark:to-slate-800/60 border-2 border-blue-500/30 p-4.5 rounded-2xl shadow-sm space-y-3 mt-2 transition-all duration-300">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-gray-800 dark:text-white leading-tight">
              Assumed Search Parameters
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 font-medium leading-relaxed">
              We generated these recommendations assuming a budget of <strong className="text-blue-700 dark:text-blue-300">{budgetStr}</strong> ({labelText}). Is this correct?
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end pt-1">
          <button
            onClick={() => {
              setIsEditing(true);
              setHasConfirmedDefaults(true);
            }}
            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer hover:scale-[1.03] active:scale-95 duration-200"
          >
            Modify Search
          </button>
          <button
            onClick={() => setHasConfirmedDefaults(true)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.03] active:scale-95 duration-200"
          >
            Looks Good, OK!
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <ToolLoadingSkeleton toolType={toolType} />;
  }

  if (!CardComponent || dataArray.length === 0) {
    return (
      <div className="space-y-3 mt-2">
        {renderBadgeSummary()}
        {renderConfirmationPicker()}
        {isEditing && renderEditForm()}
        <p className="text-sm text-gray-500 mt-2">No results found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 mt-4">
      {header && (
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className={`w-6 h-6 rounded-lg ${header.color} flex items-center justify-center`}>
            {header.icon}
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {header.label}
          </span>
        </div>
      )}
      
      {renderBadgeSummary()}
      {renderConfirmationPicker()}
      {isEditing && renderEditForm()}

      <div className="grid grid-cols-1 gap-4">
        {dataArray.map((item: any, idx: number) => (
          <CardComponent key={item?.id || idx} data={item} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Tool Loading Skeleton
   ───────────────────────────────────────── */
function ToolLoadingSkeleton({ toolType }: { toolType: string }) {
  const label = LOADING_LABELS[toolType] || { icon: <Sparkles className="w-3.5 h-3.5" />, text: "Searching..." };
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    "Analyzing search intent & budget context...",
    "Querying live global travel affiliate databases...",
    "Applying local exchange rates & formatting results..."
  ];

  return (
    <div className="p-5 border border-blue-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex flex-col gap-4 w-full mt-4 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-600 animate-spin" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            {label.icon}
            {label.text}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 dark:bg-slate-850 px-2 py-0.5 rounded-md">
          {step === 0 ? "35%" : step === 1 ? "70%" : "95%"}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs">
            {step > idx ? (
              <div className="w-4 h-4 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-500 font-bold text-[9px] shrink-0 border border-green-200">
                ✓
              </div>
            ) : step === idx ? (
              <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 border border-blue-200">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-gray-150" />
            )}
            <span className={`font-semibold ${step === idx ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 rounded-full" 
          style={{ width: step === 0 ? "35%" : step === 1 ? "70%" : "95%" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Chat Interface
   ───────────────────────────────────────── */
function ChatInterface() {
  const router = useRouter();
  const { selectedCountry } = useCurrency();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [initialPromptTriggered, setInitialPromptTriggered] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);

  // Fetch current user city on mount
  useEffect(() => {
    const detectCity = async () => {
      try {
        const cachedCity = localStorage.getItem("travelwise_city");
        if (cachedCity) {
          setUserCity(cachedCity);
          return;
        }
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city) {
          setUserCity(data.city);
          localStorage.setItem("travelwise_city", data.city);
        }
      } catch (e) {
        console.error("Failed to detect city:", e);
      }
    };
    detectCity();
  }, []);

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({
        currency: selectedCountry.currency,
        userCity: userCity,
      })
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant" as UIMessage["role"],
        parts: [
          {
            type: "text",
            text: "Hello! I'm Milo, your AI travel concierge ✈️\n\nI can instantly search and compare:\n• ✈️ Flights   • 🏨 Hotels   • 🚌 Buses\n• 🚗 Cabs   • 🎫 Tours   • 📦 Packages\n\nJust tell me where you want to go!",
          },
        ],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Capture API errors
  useEffect(() => {
    if (error) {
      setApiError(error.message || "Something went wrong. Please try again.");
    }
  }, [error]);

  // Handle destination query param from URL on load
  useEffect(() => {
    if (typeof window !== "undefined" && !initialPromptTriggered) {
      const params = new URLSearchParams(window.location.search);
      const destination = params.get("destination");
      if (destination) {
        setInitialPromptTriggered(true);
        window.history.replaceState({}, "", "/travel-assistant");
        sendMessage({
          text: `I want to travel to ${destination}. Show me flights, hotels, and things to do there.`,
        });
      }
    }
  }, [sendMessage, initialPromptTriggered]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setApiError(null);
    sendMessage({ text: input });
    setInput("");
  };

  const handleQuickSearch = (query: string) => {
    if (isLoading) return;
    setApiError(null);
    sendMessage({ text: query });
  };

  const handleClearChat = () => {
    setApiError(null);
    setMessages([
      {
        id: "welcome",
        role: "assistant" as UIMessage["role"],
        parts: [
          {
            type: "text",
            text: "Hello! I'm Milo, your AI travel concierge ✈️\n\nI can instantly search and compare:\n• ✈️ Flights   • 🏨 Hotels   • 🚌 Buses\n• 🚗 Cabs   • 🎫 Tours   • 📦 Packages\n\nJust tell me where you want to go!",
          },
        ],
      },
    ]);
  };

  const handleRetry = () => {
    setApiError(null);
    // Resend the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      const textPart = lastUserMsg.parts?.find((p: any) => p.type === "text") as any;
      if (textPart?.text) {
        sendMessage({ text: textPart.text });
      }
    }
  };

  /* ─── Render a single message part ─── */
  const renderPart = (part: any, partIdx: number) => {
    // Text content
    if (part.type === "text") {
      return (
        <p key={partIdx} className="whitespace-pre-wrap leading-relaxed mb-2 last:mb-0">
          {part.text}
        </p>
      );
    }

    // Tool result parts (all 6 types follow the same pattern)
    const toolTypes = [
      "tool-searchFlights",
      "tool-searchHotels",
      "tool-searchBuses",
      "tool-searchCabs",
      "tool-searchTours",
      "tool-searchPackages",
    ];

    if (toolTypes.includes(part.type)) {
      if (part.state === "output-available") {
        return <ToolResultCards key={partIdx} toolType={part.type} result={part.output} args={part.args} />;
      } else {
        return <ToolLoadingSkeleton key={partIdx} toolType={part.type} />;
      }
    }

    return null;
  };

  return (
    <div className="h-screen flex flex-col gemini-ai-bg text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      {/* Top Header */}
      <header className="border-b border-gray-200/80 dark:border-slate-800/85 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-850 hover:bg-gray-100/80 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors flex items-center justify-center cursor-pointer"
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
                <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none tracking-wide uppercase">
                  AI Concierge
                </span>
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
          className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3.5 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-800 border border-transparent hover:border-gray-250 dark:hover:border-slate-750 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Chat
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user";
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

                  {/* Custom Welcome Message / Message Bubble */}
                  <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
                    {message.id === "welcome" ? (
                      <div className="bg-white/70 dark:bg-slate-900/70 border border-gray-150/70 dark:border-slate-800/80 backdrop-blur-md rounded-2xl rounded-tl-none p-5 md:p-6 shadow-md max-w-lg space-y-4 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl animate-bounce">👋</span>
                          <h3 className="font-extrabold text-base md:text-lg text-gray-900 dark:text-white leading-tight tracking-tight">
                            Hello! I'm Milo, your AI travel concierge.
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                          I can instantly search and compare options across top travel providers. Click a category below to test, or type your trip details directly:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button
                            onClick={() => handleQuickSearch("Find cheap flights to Goa")}
                            className="flex flex-col items-center justify-center p-3 bg-blue-50/50 hover:bg-blue-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-blue-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Plane className="w-5 h-5 text-blue-500 rotate-45 mb-1" />
                            <span className="text-[10px] font-extrabold text-blue-900 dark:text-blue-300">Flights</span>
                          </button>
                          <button
                            onClick={() => handleQuickSearch("Find best hotels in Darjeeling near attractions")}
                            className="flex flex-col items-center justify-center p-3 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-emerald-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Hotel className="w-5 h-5 text-emerald-500 mb-1" />
                            <span className="text-[10px] font-extrabold text-emerald-900 dark:text-emerald-300">Hotels</span>
                          </button>
                          <button
                            onClick={() => handleQuickSearch("Find buses from Delhi to Jaipur")}
                            className="flex flex-col items-center justify-center p-3 bg-orange-50/50 hover:bg-orange-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-orange-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Bus className="w-5 h-5 text-orange-500 mb-1" />
                            <span className="text-[10px] font-extrabold text-orange-900 dark:text-orange-300">Buses</span>
                          </button>
                          <button
                            onClick={() => handleQuickSearch("Book airport cab transfer in Mumbai")}
                            className="flex flex-col items-center justify-center p-3 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-indigo-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Car className="w-5 h-5 text-indigo-500 mb-1" />
                            <span className="text-[10px] font-extrabold text-indigo-900 dark:text-indigo-300">Cabs</span>
                          </button>
                          <button
                            onClick={() => handleQuickSearch("Sightseeing tours and activities in Goa")}
                            className="flex flex-col items-center justify-center p-3 bg-amber-50/50 hover:bg-amber-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-amber-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Map className="w-5 h-5 text-amber-500 mb-1" />
                            <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-300">Tours</span>
                          </button>
                          <button
                            onClick={() => handleQuickSearch("Holiday packages to Bali")}
                            className="flex flex-col items-center justify-center p-3 bg-purple-50/50 hover:bg-purple-50 dark:bg-slate-850/50 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] border border-purple-100/50 dark:border-slate-800 rounded-2xl text-center transition-all duration-200 cursor-pointer"
                          >
                            <Package className="w-5 h-5 text-purple-500 mb-1" />
                            <span className="text-[10px] font-extrabold text-purple-900 dark:text-purple-300">Packages</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold italic text-center pt-1.5 border-t border-gray-100 dark:border-slate-800">
                          Try saying: "Find flights and hotels in Goa under 5000"
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                          isUser
                            ? "bg-gradient-to-tr from-blue-600 via-blue-550 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-tr-none text-left shadow-md shadow-blue-550/10 font-semibold leading-relaxed"
                            : "bg-white/75 dark:bg-slate-900/75 text-gray-850 dark:text-gray-100 rounded-tl-none border border-gray-150/70 dark:border-slate-800/80 backdrop-blur-md leading-relaxed"
                        }`}
                      >
                        {message.parts && message.parts.length > 0
                          ? message.parts.map((part: any, partIdx: number) => renderPart(part, partIdx))
                          : null}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading State */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div className="bg-white border border-gray-150 p-4 rounded-2xl rounded-tl-none shadow-sm flex flex-col gap-2 w-28 md:w-36 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-4/5" />
                  <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                </div>
              </div>
            )}

            {/* Error State */}
            {apiError && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center text-white shadow-sm shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                  <p className="text-sm text-red-700 font-semibold mb-1">Oops! Something went wrong</p>
                  <p className="text-xs text-red-600 mb-3">{apiError}</p>
                  <button
                    onClick={handleRetry}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestion Chips & Input Section */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-white/30 via-white/5 to-transparent dark:from-slate-950/20 dark:via-slate-950/5 dark:to-transparent backdrop-blur-xs shrink-0">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Quick Chips (when conversation just started) */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {QUICK_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSearch(chip.query)}
                    className="bg-white/80 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98] border border-gray-250 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-blue-500">{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={handleFormSubmit}
              className="bg-white/85 dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800/90 rounded-2xl md:rounded-3xl shadow-xl p-2.5 flex items-center gap-3 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/40 transition-all duration-300"
            >
              <div className="flex-1 min-w-0 pl-3">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Milo — flights, hotels, buses, cabs, tours, or packages..."
                  className="w-full bg-transparent border-none outline-none text-sm md:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-500 py-2.5"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                  isLoading || !input.trim()
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/10 hover:shadow-blue-550/25"
                }`}
                aria-label="Send Message"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>

            <p className="text-[10px] md:text-xs text-center text-gray-400 font-medium">
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
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold animate-pulse">Loading Milo Concierge...</span>
          </div>
        </div>
      }
    >
      <ChatInterface />
    </Suspense>
  );
}

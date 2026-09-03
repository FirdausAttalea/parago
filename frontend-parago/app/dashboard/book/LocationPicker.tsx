"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Navigation,
  ArrowLeftRight,
  X,
  Locate,
  Building2,
  Plane,
  Hotel,
  Clock,
  Route,
  Check,
} from "lucide-react";

export interface LocationOption {
  id: string;
  name: string;
  address: string;
  type: "airport" | "corporate" | "hotel" | "general";
}

const PRESET_LOCATIONS: LocationOption[] = [
  {
    id: "loc-1",
    name: "ParaGo HQ - Corporate Tower",
    address: "Jl. H.R. Rasuna Said Block X-5, Kuningan, Jakarta Selatan",
    type: "corporate",
  },
  {
    id: "loc-2",
    name: "Soekarno-Hatta Int'l Airport (CGK)",
    address: "Terminal 3 Executive Lounge, Tangerang, Banten",
    type: "airport",
  },
  {
    id: "loc-3",
    name: "Halim Perdanakusuma Airport (HLP)",
    address: "Jl. Protokol Halim Perdanakusuma, Jakarta Timur",
    type: "airport",
  },
  {
    id: "loc-4",
    name: "SCBD Equity Tower",
    address: "Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan",
    type: "corporate",
  },
  {
    id: "loc-5",
    name: "Hotel Indonesia Kempinski",
    address: "Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat",
    type: "hotel",
  },
  {
    id: "loc-6",
    name: "Grand Indonesia Menara BCA",
    address: "Jl. M.H. Thamrin No. 1, Jakarta Pusat",
    type: "corporate",
  },
  {
    id: "loc-7",
    name: "BSD Green Office Park 6",
    address: "Jl. BSD Grand Boulevard, Sampora, Tangerang Selatan",
    type: "corporate",
  },
  {
    id: "loc-8",
    name: "The Ritz-Carlton Jakarta, Pacific Place",
    address: "SCBD, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    type: "hotel",
  },
];

const getLocationIcon = (type: LocationOption["type"]) => {
  switch (type) {
    case "airport":
      return <Plane className="h-4 w-4 text-sky-500" />;
    case "hotel":
      return <Hotel className="h-4 w-4 text-amber-500" />;
    case "corporate":
      return <Building2 className="h-4 w-4 text-parago-blue" />;
    default:
      return <MapPin className="h-4 w-4 text-slate-400" />;
  }
};

export default function LocationPicker() {
  const [pickup, setPickup] = useState("ParaGo HQ - Corporate Tower");
  const [destination, setDestination] = useState("Soekarno-Hatta Int'l Airport (CGK)");
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const pickupRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setIsPickupOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwap = () => {
    setPickup(destination);
    setDestination(pickup);
  };

  const handleGeolocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setPickup("Current Location (SCBD Sudirman)");
      setIsLocating(false);
    }, 800);
  };

  const filteredPickupOptions = PRESET_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(pickup.toLowerCase()) ||
      item.address.toLowerCase().includes(pickup.toLowerCase())
  );

  const filteredDestOptions = PRESET_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(destination.toLowerCase()) ||
      item.address.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        {/* PICKUP LOCATION FIELD */}
        <div ref={pickupRef} className="relative">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold tracking-wide text-slate-500">
              PICK-UP LOCATION
            </label>
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={isLocating}
              className="flex items-center gap-1 text-xs font-bold text-parago-blue hover:underline disabled:opacity-50"
            >
              <Locate className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
              {isLocating ? "Locating..." : "Use My Location"}
            </button>
          </div>

          <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 transition-all focus-within:border-parago-blue focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <MapPin className="h-5 w-5 shrink-0 text-amber-600" />
            <input
              type="text"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setIsPickupOpen(true);
              }}
              onFocus={() => setIsPickupOpen(true)}
              placeholder="Search pickup location or airport..."
              className="w-full bg-transparent text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {pickup && (
              <button
                type="button"
                onClick={() => setPickup("")}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Pickup Dropdown */}
          {isPickupOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400">
                RECOMMENDED LOCATIONS
              </p>
              {filteredPickupOptions.length > 0 ? (
                filteredPickupOptions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setPickup(loc.name);
                      setIsPickupOpen(false);
                    }}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <div className="mt-0.5 rounded-md bg-slate-100 p-1.5">
                      {getLocationIcon(loc.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {loc.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {loc.address}
                      </p>
                    </div>
                    {pickup === loc.name && (
                      <Check className="h-4 w-4 text-parago-blue" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  Press enter to use "{pickup}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* SWAP BUTTON */}
        <div className="flex items-center justify-center lg:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Locations"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-parago-blue hover:bg-blue-50 hover:text-parago-blue active:scale-95"
          >
            <ArrowLeftRight className="h-4 w-4 text-slate-500 transition-transform group-hover:rotate-180 group-hover:text-parago-blue" />
          </button>
        </div>

        {/* DESTINATION LOCATION FIELD */}
        <div ref={destRef} className="relative">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold tracking-wide text-slate-500">
              DESTINATION
            </label>
          </div>

          <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3.5 transition-all focus-within:border-parago-blue focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Navigation className="h-5 w-5 shrink-0 text-parago-blue" />
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setIsDestOpen(true);
              }}
              onFocus={() => setIsDestOpen(true)}
              placeholder="Search destination, hotel, or client office..."
              className="w-full bg-transparent text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {destination && (
              <button
                type="button"
                onClick={() => setDestination("")}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Destination Dropdown */}
          {isDestOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400">
                POPULAR DESTINATIONS
              </p>
              {filteredDestOptions.length > 0 ? (
                filteredDestOptions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setDestination(loc.name);
                      setIsDestOpen(false);
                    }}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <div className="mt-0.5 rounded-md bg-slate-100 p-1.5">
                      {getLocationIcon(loc.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {loc.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {loc.address}
                      </p>
                    </div>
                    {destination === loc.name && (
                      <Check className="h-4 w-4 text-parago-blue" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  Press enter to use "{destination}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ESTIMATED ROUTE INFO BADGE */}
      {pickup && destination && (
        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl bg-blue-50/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-blue-100">
          <div className="flex items-center gap-1.5 text-parago-blue font-bold">
            <Route className="h-4 w-4" />
            <span>Route Estimate:</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <Route className="h-3.5 w-3.5 text-slate-400" />
            <span>~28.4 km</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-slate-600">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Est. 35 - 45 mins</span>
          </div>
          <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Optimal Toll Highway Route
          </span>
        </div>
      )}
    </div>
  );
}

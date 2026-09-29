"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Navigation,
  ArrowLeftRight,
  X,
  Locate,
  Building2,
  Plane,
  Hotel,
  Landmark,
  Store,
  Utensils,
  TrainFront,
  Clock,
  Route,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRoute } from "@/hooks/useRoute";
import { geocodeReverse, geocodeForward, LocationResult } from "@/lib/mapbox";
import {
  LocationOption,
  LocationType,
  INDONESIA_LOCATIONS,
} from "@/lib/indonesiaLocations";

const GROUP_ORDER: LocationType[] = [
  "landmark",
  "hotel",
  "mall",
  "restaurant",
  "corporate",
  "airport",
  "station",
  "general",
];

const GROUP_LABELS: Record<LocationType, string> = {
  airport: "AIRPORTS",
  corporate: "CORPORATE & OFFICES",
  hotel: "HOTELS",
  landmark: "LANDMARKS, TEMPLES & TOURIST SPOTS",
  mall: "SHOPPING MALLS",
  restaurant: "RESTAURANTS",
  station: "TRAIN & MRT STATIONS",
  general: "PUBLIC PLACES & PARKS",
};

const getLocationIcon = (type: LocationOption["type"]) => {
  switch (type) {
    case "airport":
      return <Plane className="h-4 w-4 text-sky-500" />;
    case "hotel":
      return <Hotel className="h-4 w-4 text-amber-500" />;
    case "corporate":
      return <Building2 className="h-4 w-4 text-parago-blue" />;
    case "landmark":
      return <Landmark className="h-4 w-4 text-teal-600" />;
    case "mall":
      return <Store className="h-4 w-4 text-fuchsia-500" />;
    case "restaurant":
      return <Utensils className="h-4 w-4 text-rose-500" />;
    case "station":
      return <TrainFront className="h-4 w-4 text-indigo-500" />;
    default:
      return <MapPin className="h-4 w-4 text-slate-400" />;
  }
};

interface LocationPoint {
  name: string;
  address?: string;
  lat: number;
  lng: number;
}

export default function LocationPicker() {
  const [pickup, setPickup] = useState<LocationPoint>({
    name: "ParaGo HQ - Corporate Tower",
    address: "Jl. H.R. Rasuna Said Block X-5, Kuningan, Jakarta Selatan",
    lat: -6.2185,
    lng: 106.8332,
  });
  const [destination, setDestination] = useState<LocationPoint>({
    name: "Soekarno-Hatta Int'l Airport (CGK)",
    address: "Terminal 3 Executive Lounge, Tangerang, Banten",
    lat: -6.1256,
    lng: 106.6558,
  });
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [pickupSearchResults, setPickupSearchResults] = useState<LocationResult[]>([]);
  const [destSearchResults, setDestSearchResults] = useState<LocationResult[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  const { route, loading: routeLoading, error: routeError, getRoute, clear: clearRoute } = useRoute();

  const pickupRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const pickupSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const destSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSwap = useCallback(() => {
    setPickup(destination);
    setDestination(pickup);
    setPickupSearchResults([]);
    setDestSearchResults([]);
    clearRoute();
  }, [pickup, destination, clearRoute]);

  // Debounced forward geocoding search
  const handlePickupSearch = useCallback(async (query: string) => {
    if (pickupSearchTimeoutRef.current) clearTimeout(pickupSearchTimeoutRef.current);
    if (!query.trim()) {
      setPickupSearchResults([]);
      return;
    }
    setIsSearchingPickup(true);
    pickupSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await geocodeForward(query, pickup.lat && pickup.lng ? { lng: pickup.lng, lat: pickup.lat } : undefined);
        setPickupSearchResults(results);
      } catch {
        setPickupSearchResults([]);
      } finally {
        setIsSearchingPickup(false);
      }
    }, 300);
  }, [pickup.lat, pickup.lng]);

  const handleDestSearch = useCallback(async (query: string) => {
    if (destSearchTimeoutRef.current) clearTimeout(destSearchTimeoutRef.current);
    if (!query.trim()) {
      setDestSearchResults([]);
      return;
    }
    setIsSearchingDest(true);
    destSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await geocodeForward(query, destination.lat && destination.lng ? { lng: destination.lng, lat: destination.lat } : undefined);
        setDestSearchResults(results);
      } catch {
        setDestSearchResults([]);
      } finally {
        setIsSearchingDest(false);
      }
    }, 300);
  }, [destination.lat, destination.lng]);

  const handleGeolocate = useCallback(async () => {
    setIsLocating(true);
    setGeocodeError(null);
    if (!navigator.geolocation) {
      setGeocodeError("Geolocation not supported by this browser. Please enter location manually.");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const result = await geocodeReverse(longitude, latitude);
          if (result) {
            setPickup({
              name: result.label,
              address: result.address,
              lat: result.lat,
              lng: result.lng,
            });
          } else {
            setPickup({
              name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              lat: latitude,
              lng: longitude,
            });
          }
        } catch {
          setPickup({
            name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            lat: latitude,
            lng: longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        let message = err.message;
        if (err.code === err.PERMISSION_DENIED) {
          message = "Location access denied. Please enable location permissions in your browser settings, or search for a location manually.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = "Location unavailable. Please try again or search manually.";
        } else if (err.code === err.TIMEOUT) {
          message = "Location request timed out. Please try again or search manually.";
        }
        setGeocodeError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (pickupSearchTimeoutRef.current) clearTimeout(pickupSearchTimeoutRef.current);
      if (destSearchTimeoutRef.current) clearTimeout(destSearchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (pickup.lat && destination.lat) {
      getRoute({ lng: pickup.lng, lat: pickup.lat }, { lng: destination.lng, lat: destination.lat });
    } else {
      clearRoute();
    }
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng, getRoute, clearRoute]);

  const pickLocation = (loc: LocationOption, isPickup: boolean) => {
    const point: LocationPoint = {
      name: loc.name,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
    };
    if (isPickup) {
      setPickup(point);
      setIsPickupOpen(false);
      setPickupSearchResults([]);
    } else {
      setDestination(point);
      setIsDestOpen(false);
      setDestSearchResults([]);
    }
  };

  const filteredPickupOptions = INDONESIA_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(pickup.name.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(pickup.name.toLowerCase()))
  );

  const filteredDestOptions = INDONESIA_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(destination.name.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(destination.name.toLowerCase()))
  );

  const onSelectSearchResult = (result: LocationResult, isPickup: boolean) => {
    const point: LocationPoint = {
      name: result.label,
      address: result.address,
      lat: result.lat,
      lng: result.lng,
    };
    if (isPickup) {
      setPickup(point);
      setIsPickupOpen(false);
      setPickupSearchResults([]);
    } else {
      setDestination(point);
      setIsDestOpen(false);
      setDestSearchResults([]);
    }
  };

  const renderGroupedOptions = (
    options: LocationOption[],
    onSelect: (loc: LocationOption) => void,
    currentName: string
  ) =>
    GROUP_ORDER.map((type) => {
      const group = options.filter((loc) => loc.type === type);
      if (group.length === 0) return null;
      return (
        <div key={type}>
          <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400">
            {GROUP_LABELS[type]}
          </p>
          {group.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc)}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
            >
              <div className="mt-0.5 rounded-md bg-slate-100 p-1.5">
                {getLocationIcon(loc.type)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-800">{loc.name}</p>
                <p className="truncate text-xs text-slate-400">{loc.address}</p>
              </div>
              {currentName === loc.name && <Check className="h-4 w-4 text-parago-blue" />}
            </button>
          ))}
        </div>
      );
    });

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
              value={pickup.name}
              onChange={(e) => {
                const value = e.target.value;
                setPickup({ ...pickup, name: value });
                setIsPickupOpen(true);
                handlePickupSearch(value);
              }}
              onFocus={() => setIsPickupOpen(true)}
              placeholder="Search pickup location or airport..."
              className="w-full bg-transparent text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {pickup.name && (
              <button
                type="button"
                onClick={() => setPickup({ ...pickup, name: "", address: undefined, lat: 0, lng: 0 })}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {geocodeError && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{geocodeError}</span>
            </div>
          )}

          {/* Pickup Dropdown */}
          {isPickupOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {isSearchingPickup && (
                <div className="px-3 py-2 flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-parago-blue" />
                  <span>Searching locations...</span>
                </div>
              )}
              {pickupSearchResults.length > 0 && (
                <>
                  <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400">
                    SEARCH RESULTS
                  </p>
                  {pickupSearchResults.map((result, idx) => (
                    <button
                      key={`search-${idx}`}
                      type="button"
                      onClick={() => onSelectSearchResult(result, true)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                    >
                      <div className="mt-0.5 rounded-md bg-slate-100 p-1.5">
                        <MapPin className="h-4 w-4 text-parago-blue" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-slate-800">{result.label}</p>
                        {result.address && <p className="truncate text-xs text-slate-400">{result.address}</p>}
                      </div>
                    </button>
                  ))}
                  <div className="h-px bg-slate-200 my-1" />
                </>
              )}
              {filteredPickupOptions.length > 0 ? (
                renderGroupedOptions(filteredPickupOptions, (loc) => pickLocation(loc, true), pickup.name)
              ) : pickupSearchResults.length === 0 && !isSearchingPickup && (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  Press enter to use &ldquo;{pickup.name}&rdquo;
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
              value={destination.name}
              onChange={(e) => {
                const value = e.target.value;
                setDestination({ ...destination, name: value });
                setIsDestOpen(true);
                handleDestSearch(value);
              }}
              onFocus={() => setIsDestOpen(true)}
              placeholder="Search destination, hotel, or client office..."
              className="w-full bg-transparent text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {destination.name && (
              <button
                type="button"
                onClick={() => setDestination({ ...destination, name: "", address: undefined, lat: 0, lng: 0 })}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Destination Dropdown */}
          {isDestOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {isSearchingDest && (
                <div className="px-3 py-2 flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-parago-blue" />
                  <span>Searching locations...</span>
                </div>
              )}
              {destSearchResults.length > 0 && (
                <>
                  <p className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400">
                    SEARCH RESULTS
                  </p>
                  {destSearchResults.map((result, idx) => (
                    <button
                      key={`search-${idx}`}
                      type="button"
                      onClick={() => onSelectSearchResult(result, false)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                    >
                      <div className="mt-0.5 rounded-md bg-slate-100 p-1.5">
                        <MapPin className="h-4 w-4 text-parago-blue" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-slate-800">{result.label}</p>
                        {result.address && <p className="truncate text-xs text-slate-400">{result.address}</p>}
                      </div>
                    </button>
                  ))}
                  <div className="h-px bg-slate-200 my-1" />
                </>
              )}
              {filteredDestOptions.length > 0 ? (
                renderGroupedOptions(filteredDestOptions, (loc) => pickLocation(loc, false), destination.name)
              ) : destSearchResults.length === 0 && !isSearchingDest && (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  Press enter to use &ldquo;{destination.name}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ESTIMATED ROUTE INFO BADGE */}
      {(pickup.lat && destination.lat) || routeLoading || routeError ? (
        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl bg-blue-50/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-blue-100">
          <div className="flex items-center gap-1.5 text-parago-blue font-bold">
            <Route className="h-4 w-4" />
            <span>Route Estimate:</span>
          </div>
          {routeLoading && (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-parago-blue" />
              <span>Calculating route...</span>
            </div>
          )}
          {routeError && (
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Failed to load route</span>
            </div>
          )}
          {route && !routeLoading && (
            <>
              <div className="flex items-center gap-1 text-slate-600">
                <Route className="h-3.5 w-3.5 text-slate-400" />
                <span>{route.distanceKm.toFixed(1)} km</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Est. {route.durationMin} mins</span>
              </div>
              <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Real-time traffic route
              </span>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
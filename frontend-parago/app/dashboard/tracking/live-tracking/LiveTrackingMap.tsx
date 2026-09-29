"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  Popup,
  MapRef,
  LayerProps,
} from "react-map-gl/mapbox";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { useRoute } from "@/hooks/useRoute";
import { useVehicles } from "@/hooks/api/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { LiveInfoPanel } from "@/components/LiveInfoPanel";
import { haversineDistance, estimateETA } from "@/lib/geo";
import vehicleIconSvg from "@/public/icons/vehicle.png";
import {
  Car,
  Gauge,
  MapPin,
  Navigation,
  User,
  LocateFixed,
  Compass,
  ShieldCheck,
  Flag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

const trailLayerStyle: LayerProps = {
  id: "vehicle-trail",
  type: "line",
  layout: { "line-cap": "round", "line-join": "round" },
  paint: { "line-color": "#2F5FE0", "line-width": 4, "line-opacity": 0.75 },
};

const routeLayerStyle: LayerProps = {
  id: "planned-route",
  type: "line",
  layout: { "line-cap": "round", "line-join": "round" },
  paint: { "line-color": "#22C55E", "line-width": 3, "line-opacity": 0.8, "line-dasharray": [8, 4] },
};

interface VehicleData {
  id: string;
  plate_number: string;
  brand?: string;
  model?: string | { name?: string; brand?: { name?: string } };
  driver?: { id: string; name: string } | null;
}

function toVehicleData(v: Vehicle): VehicleData {
  return {
    id: String(v.id),
    plate_number: v.plate_number,
    brand: v.brand,
    model: v.model,
    driver: v.driver ? { id: String(v.driver.id), name: v.driver.name } : null,
  };
}

interface DestinationPoint {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

function parseDestinationFromUrl(): DestinationPoint {
  if (typeof window === "undefined") return { lat: -6.1256, lng: 106.6558, name: "Soekarno-Hatta Airport (CGK)" };
  const params = new URLSearchParams(window.location.search);
  const lat = params.get("lat");
  const lng = params.get("lng");
  const name = params.get("dest_name") ?? undefined;
  const address = params.get("dest_addr") ?? undefined;
  if (lat && lng) return { lat: parseFloat(lat), lng: parseFloat(lng), name, address };
  return { lat: -6.1256, lng: 106.6558, name: "Soekarno-Hatta Airport (CGK)" };
}

export default function LiveTrackingMap() {
  const mapRef = useRef<MapRef>(null);
  const [locked, setLocked] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [destination, setDestination] = useState<DestinationPoint>(() => parseDestinationFromUrl());

  const { position, speedKmh, heading, error, trail, simulate, setSimulate } = useLiveLocation();
  const { route, loading: routeLoading, error: routeError, getRoute, clear: clearRoute } = useRoute();
  const { data: vehicles } = useVehicles();

  // Derived status - no need for useState + useEffect
  const status = useMemo(() => {
    if (error) return "weak" as const;
    if (position) return "active" as const;
    return "connecting" as const;
  }, [error, position]);

  // Derive selected vehicle from vehicles data
  const selectedVehicle = useMemo<VehicleData | null>(() => {
    if (!vehicles || vehicles.length === 0) return null;
    const v = vehicles.find((v) => v.driver) || vehicles[0];
    return toVehicleData(v);
  }, [vehicles]);

  // Fetch route when position and destination are available
  useEffect(() => {
    if (position && destination) {
      getRoute({ lng: position.lng, lat: position.lat }, { lng: destination.lng, lat: destination.lat });
    } else {
      clearRoute();
    }
  }, [position, destination, getRoute, clearRoute]);

  const flyToVehicle = useCallback(() => {
    if (position && mapRef.current) {
      mapRef.current.flyTo({ center: [position.lng, position.lat], zoom: 16, duration: 1200 });
    }
  }, [position]);

  const handleLocateVehicle = useCallback(() => {
    setLocked(true);
    flyToVehicle();
  }, [flyToVehicle]);

  const onRecenter = useCallback(() => handleLocateVehicle(), [handleLocateVehicle]);

  const onShare = useCallback(() => {
    const params = new URLSearchParams();
    if (position) { params.set("lat", String(position.lat)); params.set("lng", String(position.lng)); }
    if (destination) { params.set("dest_name", destination.name || ""); params.set("dest_addr", destination.address || ""); }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => alert("Live location link copied!"));
  }, [position, destination]);

  // Follow vehicle when locked
  useEffect(() => {
    if (locked && position && mapRef.current) {
      mapRef.current.panTo([position.lng, position.lat], { duration: 800 });
    }
  }, [position, locked]);

  // Build GeoJSON trail (breadcrumb)
  const trailGeoJSON = useMemo(() => {
    if (trail.length < 2) return null;
    return {
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: trail.map((p) => [p.lng, p.lat]) },
      properties: {},
    };
  }, [trail]);

  // Build GeoJSON planned route
  const routeGeoJSON = useMemo(() => {
    if (!route?.geometry) return null;
    return { type: "Feature" as const, geometry: route.geometry, properties: {} };
  }, [route]);

  // Distance/ETA from real route, fallback to haversine
  const distanceKm = route?.distanceKm ?? (position && destination ? haversineDistance(position.lat, position.lng, destination.lat, destination.lng) : 0);
  const etaMinutes = route?.durationMin ?? (position && destination ? estimateETA(distanceKm, speedKmh) : 0);

  // Status config
  const statusConfig = useMemo(() => {
    if (status === "active" && speedKmh > 0) {
      return { label: "Moving", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", badgeRing: "ring-emerald-600/20", dotColor: "bg-emerald-500", stripeClass: "bg-emerald-500", isPulse: true };
    }
    if (status === "active") {
      return { label: "Idle / Stopped", badgeBg: "bg-amber-50", badgeText: "text-amber-700", badgeRing: "ring-amber-600/20", dotColor: "bg-amber-500", stripeClass: "bg-amber-500", isPulse: false };
    }
    if (status === "weak") {
      return { label: "Signal Weak", badgeBg: "bg-rose-50", badgeText: "text-rose-700", badgeRing: "ring-rose-600/20", dotColor: "bg-rose-500", stripeClass: "bg-rose-500", isPulse: false };
    }
    return { label: "Connecting...", badgeBg: "bg-slate-100", badgeText: "text-slate-600", badgeRing: "ring-slate-400/20", dotColor: "bg-slate-400", stripeClass: "bg-slate-300", isPulse: false };
  }, [status, speedKmh]);

  // Vehicle/driver display data
  const vehicleName = selectedVehicle?.model && typeof selectedVehicle.model === "object" && selectedVehicle.model.name
    ? `${selectedVehicle.model.brand?.name || selectedVehicle.brand || ""} ${selectedVehicle.model.name}`.trim()
    : selectedVehicle?.brand || "Mercedes-Benz S-Class";
  const licensePlate = selectedVehicle?.plate_number || "PRG‑7700";
  const driverName = selectedVehicle?.driver?.name || "Driver not assigned";
  const vehicleId = selectedVehicle?.id || "V-01";

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      {/* Top Left Floating Status & Lock Indicator */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-md ring-1 ring-slate-200/80">
          <span className={`h-2.5 w-2.5 rounded-full ${locked ? "bg-emerald-500 animate-ping" : "bg-slate-300"}`} />
          <span className="text-xs font-semibold text-slate-800">
            {locked ? "Locked on Vehicle" : "Free Roam (Unlocked)"}
          </span>
          <button type="button" onClick={() => setLocked(!locked)} className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            {locked ? "Unlock" : "Lock"}
          </button>
        </div>
      </div>

      {/* Fast Track FAB */}
      <button type="button" onClick={handleLocateVehicle} title="Track Current Vehicle" className="fixed bottom-8 right-8 z-10 group flex items-center gap-2.5 rounded-full bg-parago-blue px-4 py-3 text-white shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-parago-blue/20">
        <LocateFixed className="h-5 w-5 animate-pulse" />
        <span className="text-xs font-bold tracking-wide uppercase">Track Vehicle</span>
      </button>

      {/* Mapbox GL Interactive Map */}
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 106.8, latitude: -6.2, zoom: 13 }}
        style={{ height: "100%", width: "100%" }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        onDragStart={() => setLocked(false)}
      >
        {/* Planned Route Line (green dashed) */}
        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}

        {/* Vehicle Trail Line (blue solid) */}
        {trailGeoJSON && (
          <Source id="trail-source" type="geojson" data={trailGeoJSON}>
            <Layer {...trailLayerStyle} />
          </Source>
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg ring-4 ring-white">
                <Flag className="h-4 w-4 text-white" />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-white bg-slate-900/80 px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                {destination.name || "Destination"}
              </span>
            </div>
          </Marker>
        )}

        {/* Vehicle Marker */}
        {position && (
          <Marker longitude={position.lng} latitude={position.lat} anchor="center" onClick={() => setShowPopup((prev) => !prev)}>
            <div className="relative cursor-pointer" style={{ transform: `rotate(${heading}deg)` }}>
              {statusConfig.isPulse && <span className="absolute inset-0 -m-2 rounded-full bg-emerald-400/25 animate-ping" />}
              <Image src={vehicleIconSvg} alt="Fleet Vehicle" width={48} height={24} className="drop-shadow-xl" priority />
            </div>
          </Marker>
        )}

        {/* Popup Card */}
        {position && showPopup && (
          <Popup longitude={position.lng} latitude={position.lat} anchor="bottom" offset={[0, -14]} closeButton={false} onClose={() => setShowPopup(false)} className="parago-mapbox-popup">
            <div className="w-80 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-slate-900/10 font-sans transition-all duration-300">
              <div className={`h-1.5 w-full ${statusConfig.stripeClass}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                      <Car className="h-3.5 w-3.5 text-parago-blue" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Fleet Unit</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">{vehicleName}</h4>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 shrink-0 ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeRing}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${statusConfig.isPulse ? "animate-pulse" : ""}`} />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-black tracking-wider text-white shadow-inner">{licensePlate}</div>
                    <span className="text-[10px] font-medium text-slate-400">{vehicleId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 ring-2 ring-white"><User className="h-4 w-4" /></div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 font-medium leading-none">Driver</p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{driverName}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><Gauge className="h-3 w-3 text-parago-blue" /><span>Real-time Speed</span></div>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{speedKmh.toFixed(1)} km/h</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><MapPin className="h-3 w-3 text-rose-500" /><span>Coordinates</span></div>
                    <p className="mt-0.5 text-[11px] font-mono font-medium text-slate-600 truncate">{position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><Navigation className="h-3 w-3 text-emerald-500" /><span>Est. ETA</span></div>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{etaMinutes > 0 ? `${etaMinutes} mins` : "Arrived"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><Compass className="h-3 w-3 text-amber-500" /><span>Remaining Dist</span></div>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{distanceKm.toFixed(2)} km</p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><ShieldCheck className="h-3.5 w-3.5" /><span>GPS Verified</span></div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); alert(`Contacting Driver: ${driverName}`); }} className="inline-flex items-center gap-1 rounded-lg bg-parago-blue/10 px-2.5 py-1 text-[11px] font-bold text-parago-blue hover:bg-parago-blue hover:text-white transition-colors"><span>Contact Driver</span></button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Live Info Panel */}
      <LiveInfoPanel
        status={status}
        driverName={driverName}
        driverPhoto="/drivers/marcus-sterling.jpg"
        vehicleName={vehicleName}
        licensePlate={licensePlate}
        speedKmh={speedKmh}
        distanceKm={distanceKm}
        etaMinutes={etaMinutes}
        onRecenter={onRecenter}
        onShare={onShare}
      />

      {/* Destination Search/Set UI */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-2 shadow-md ring-1 ring-slate-200/80">
          <span className="text-xs font-semibold text-slate-500">Destination</span>
          {destination && (
            <span className="text-sm font-medium text-slate-800 truncate max-w-[180px]">{destination.name}</span>
          )}
          {!destination && <span className="text-sm text-slate-400">Not set</span>}
        </div>
        {(routeLoading) && (
          <div className="flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur-md px-3 py-2 shadow-md ring-1 ring-slate-200/80">
            <Loader2 className="h-4 w-4 animate-spin text-parago-blue" />
            <span className="text-xs font-medium text-slate-600">Loading route...</span>
          </div>
        )}
        {routeError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50/90 backdrop-blur-md px-3 py-2 shadow-md ring-1 ring-rose-200/80">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-medium text-rose-700">Route unavailable</span>
          </div>
        )}
      </div>

      {/* Simulation Control */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
        <button type="button" onClick={() => setSimulate(!simulate)} className="rounded-xl bg-slate-900/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 transition-colors">
          {simulate ? "Stop Simulation" : "Simulate Movement"}
        </button>
      </div>
    </div>
  );
}
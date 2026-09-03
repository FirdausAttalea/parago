"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import { useLiveLocation } from "@/hooks/useLiveLocation";
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
} from "lucide-react";

// Rotated vehicle icon
const vehicleIcon = L.icon({
  iconUrl: vehicleIconSvg.src,
  iconSize: [48, 24],
  iconAnchor: [24, 12],
  popupAnchor: [0, -14],
});

// Map Controller for Smooth FlyTo & Auto Follow
function MapCameraController({
  position,
  locked,
  flyToTrigger,
}: {
  position: LatLng | null;
  locked: boolean;
  flyToTrigger: number;
}) {
  const map = useMap();

  // Instant FlyTo when user clicks "Locate Vehicle"
  useEffect(() => {
    if (flyToTrigger > 0 && position) {
      map.flyTo(position, 16, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [flyToTrigger, position, map]);

  // Smooth follow when locked
  useEffect(() => {
    if (locked && position) {
      map.panTo(position, { animate: true, duration: 0.8 });
    }
  }, [position, map, locked]);

  return null;
}

// Map Event Listener component to handle user interactions inside MapContainer
function MapEventsHandler({ onUserDrag }: { onUserDrag: () => void }) {
  useMapEvents({
    dragstart: onUserDrag,
  });
  return null;
}

export default function LiveTrackingMap() {
  const [locked, setLocked] = useState(true);
  const [flyToTrigger, setFlyToTrigger] = useState(0);

  const {
    position,
    speedKmh,
    heading,
    error,
    trail,
    simulate,
    setSimulate,
  } = useLiveLocation();

  const [status, setStatus] = useState<"active" | "connecting" | "weak">(
    "connecting"
  );

  useEffect(() => {
    if (error) {
      setStatus("weak");
    } else if (position) {
      setStatus("active");
    } else {
      setStatus("connecting");
    }
  }, [error, position]);

  const destination = useMemo(() => new LatLng(-6.25, 106.85), []);
  const distanceKm = useMemo(
    () =>
      position
        ? haversineDistance(
            position.lat,
            position.lng,
            destination.lat,
            destination.lng
          )
        : 0,
    [position, destination]
  );
  const etaMinutes = useMemo(
    () => estimateETA(distanceKm, speedKmh),
    [distanceKm, speedKmh]
  );

  const handleLocateVehicle = useCallback(() => {
    setLocked(true);
    setFlyToTrigger((prev) => prev + 1);
  }, []);

  const onRecenter = useCallback(() => {
    handleLocateVehicle();
  }, [handleLocateVehicle]);

  const onShare = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?lat=${position?.lat}&lng=${position?.lng}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Live location link copied to clipboard!");
    });
  }, [position]);

  // Status configuration matching Parago Fleet Booking Design System
  const statusConfig = useMemo(() => {
    if (status === "active" && speedKmh > 0) {
      return {
        label: "Moving",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        badgeRing: "ring-emerald-600/20",
        dotColor: "bg-emerald-500",
        stripeClass: "bg-emerald-500",
        isPulse: true,
      };
    }
    if (status === "active") {
      return {
        label: "Idle / Stopped",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeRing: "ring-amber-600/20",
        dotColor: "bg-amber-500",
        stripeClass: "bg-amber-500",
        isPulse: false,
      };
    }
    if (status === "weak") {
      return {
        label: "Signal Weak",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        badgeRing: "ring-rose-600/20",
        dotColor: "bg-rose-500",
        stripeClass: "bg-rose-500",
        isPulse: false,
      };
    }
    return {
      label: "Connecting...",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-600",
      badgeRing: "ring-slate-400/20",
      dotColor: "bg-slate-400",
      stripeClass: "bg-slate-300",
      isPulse: false,
    };
  }, [status, speedKmh]);

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      {/* ── Top Left Floating Status & Lock Indicator ── */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-md ring-1 ring-slate-200/80">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              locked ? "bg-emerald-500 animate-ping" : "bg-slate-300"
            }`}
          />
          <span className="text-xs font-semibold text-slate-800">
            {locked ? "Locked on Vehicle" : "Free Roam (Unlocked)"}
          </span>
          <button
            type="button"
            onClick={() => setLocked(!locked)}
            className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {locked ? "Unlock" : "Lock"}
          </button>
        </div>
      </div>

      {/* ── Fast Track Floating Action Button (FAB) ── */}
      <button
        type="button"
        onClick={handleLocateVehicle}
        title="Track Current Vehicle"
        className="fixed bottom-8 right-8 z-[500] group flex items-center gap-2.5 rounded-full bg-parago-blue px-4 py-3 text-white shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-parago-blue/20"
      >
        <LocateFixed className="h-5 w-5 animate-pulse" />
        <span className="text-xs font-bold tracking-wide uppercase">
          Track Vehicle
        </span>
      </button>

      {/* ── Leaflet Interactive Map ── */}
      <MapContainer
        center={[-6.2, 106.8]}
        zoom={13}
        scrollWheelZoom={true}
        dragging={true}
        className="h-full w-full"
      >
        <MapEventsHandler onUserDrag={() => setLocked(false)} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          crossOrigin="anonymous"
        />

        {position && (
          <Marker
            position={position}
            icon={vehicleIcon}
            {...({
              rotationAngle: heading,
              rotationOrigin: "center",
            } as any)}
          >
            {/* ══════════════════════════════════════════════════
                FLAWLESS PARAGO FLEET CARD TOOLTIP / HOVER POPUP
               ══════════════════════════════════════════════════ */}
            <Tooltip
              direction="top"
              offset={[0, -12]}
              opacity={1}
              permanent={false}
              className="parago-leaflet-card"
            >
              <div className="w-80 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-slate-900/10 font-sans transition-all duration-300 transform scale-100 hover:scale-[1.01]">
                {/* Visual Top Status Stripe */}
                <div className={`h-1.5 w-full ${statusConfig.stripeClass}`} />

                <div className="p-4">
                  {/* Header: Vehicle Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                        <Car className="h-3.5 w-3.5 text-parago-blue" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Fleet Unit
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                        Mercedes-Benz S-Class
                      </h4>
                    </div>

                    {/* Status Badge Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeRing} shrink-0`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          statusConfig.dotColor
                        } ${statusConfig.isPulse ? "animate-pulse" : ""}`}
                      />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* License Plate & Driver Bar */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-black tracking-wider text-white shadow-inner">
                        PRG‑7700
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        V-01
                      </span>
                    </div>

                    {/* Driver info */}
                    <div className="flex items-center gap-2 text-right">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 ring-2 ring-white">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-400 font-medium leading-none">
                          Driver
                        </p>
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          Marcus G. Sterling
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Grid: Speed, Coords, ETA, Dist */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Gauge className="h-3 w-3 text-parago-blue" />
                        <span>Real-time Speed</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-slate-800">
                        {speedKmh.toFixed(1)} km/h
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span>Coordinates</span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-mono font-medium text-slate-600 truncate">
                        {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Navigation className="h-3 w-3 text-emerald-500" />
                        <span>Est. ETA</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-slate-800">
                        {etaMinutes > 0 ? `${etaMinutes} mins` : "Arrived"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white/80 p-2 shadow-xs">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Compass className="h-3 w-3 text-amber-500" />
                        <span>Remaining Dist</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-slate-800">
                        {distanceKm.toFixed(2)} km
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>GPS Verified</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(
                          "Contacting Driver: Marcus G. Sterling (+62 812-8899-0011)"
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-parago-blue/10 px-2.5 py-1 text-[11px] font-bold text-parago-blue hover:bg-parago-blue hover:text-white transition-colors"
                    >
                      <span>Contact Driver</span>
                    </button>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Marker>
        )}

        {trail.length > 1 && (
          <Polyline
            positions={trail}
            pathOptions={{ color: "#2F5FE0", weight: 4, opacity: 0.7 }}
          />
        )}

        <MapCameraController
          position={position}
          locked={locked}
          flyToTrigger={flyToTrigger}
        />
      </MapContainer>

      {/* ── Live Info Floating Summary Panel ── */}
      <LiveInfoPanel
        status={status}
        driverName="Marcus G. Sterling"
        driverPhoto="/drivers/marcus-sterling.jpg"
        vehicleName="Mercedes-Benz S-Class"
        licensePlate="PRG‑7700"
        speedKmh={speedKmh}
        distanceKm={distanceKm}
        etaMinutes={etaMinutes}
        onRecenter={onRecenter}
        onShare={onShare}
      />

      {/* ── Simulation Control (Dev / Demo) ── */}
      <div className="absolute bottom-6 left-6 z-[400] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSimulate(!simulate)}
          className="rounded-xl bg-slate-900/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800 transition-colors"
        >
          {simulate ? "Stop Simulation" : "Simulate Movement"}
        </button>
      </div>
    </div>
  );
}

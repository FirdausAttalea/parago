"use client";

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { LiveInfoPanel } from "@/components/LiveInfoPanel";
import vehicleIconSvg from "/icons/vehicle.svg";

// Helper imports for distance & ETA
import { haversineDistance, estimateETA } from "@/lib/geo";

// create a rotated marker icon
const vehicleIcon = L.icon({
  iconUrl: vehicleIconSvg,
  iconSize: [48, 24], // width, height
  iconAnchor: [24, 12], // center of the icon
});

function RecenterButton({ position }: { position: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function LiveTrackingMap() {
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

  // Update status based on error / position
  useEffect(() => {
    if (error) {
      setStatus("weak");
    } else if (position) {
      setStatus("active");
    } else {
      setStatus("connecting");
    }
  }, [error, position]);

  // Estimated remaining distance (for demo, we use a fixed destination)
  const destination = new LatLng(-6.25, 106.85); // dummy destination
  const distanceKm = position ? haversineDistance(position.lat, position.lng, destination.lat, destination.lng) : 0;
  const etaMinutes = estimateETA(distanceKm, speedKmh);

  const onRecenter = () => {
    // map recenter handled by RecenterButton component via position change
  };

  const onShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?lat=${position?.lat}&lng=${position?.lng}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Live location link copied to clipboard!");
    });
  };

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[ -6.2, 106.8 ]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {position && (
          <Marker
            position={position}
            icon={vehicleIcon}
            rotationAngle={heading}
            rotationOrigin="center"
          />
        )}
        {trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: "#1e3a8a", weight: 4, opacity: 0.6 }} />
        )}
        {position && <RecenterButton position={position} />}
      </MapContainer>

      {/* Live Info Panel */}
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

      {/* Simulate toggle (dev only) */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          type="button"
          onClick={() => setSimulate(!simulate)}
          className="rounded-xl bg-parago-blue/10 px-3 py-1 text-sm font-medium text-parago-blue"
        >
          {simulate ? "Stop Simulation" : "Simulate Movement"}
        </button>
      </div>
    </div>
  );
}

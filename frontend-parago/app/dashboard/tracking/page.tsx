"use client";

import dynamic from "next/dynamic";
import { useVehicles } from "@/hooks/api/useVehicles";
import { VehicleMarker } from "@/components/maps/VehicleMarker";

// Import Map secara dynamic karena Leaflet butuh akses ke window
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });

export default function TrackingPage() {
  const { data: vehicles } = useVehicles();

  return (
    <div className="h-[calc(100vh-100px)] w-full">
      <MapContainer center={[-6.2, 106.816]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vehicles?.map((vehicle: any) => (
          <VehicleMarker key={vehicle.id} vehicle={vehicle} />
        ))}
      </MapContainer>
    </div>
  );
}
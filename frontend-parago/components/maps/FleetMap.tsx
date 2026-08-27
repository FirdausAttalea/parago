"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { VehicleMarker } from "./VehicleMarker";
import { Vehicle } from "@/types/vehicle";

export default function FleetMap({ vehicles }: { vehicles?: Vehicle[] }) {
  return (
    <MapContainer center={[-6.2, 106.816]} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {vehicles?.map((vehicle) => (
        <VehicleMarker key={vehicle.id} vehicle={vehicle} />
      ))}
    </MapContainer>
  );
}

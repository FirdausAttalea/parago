"use client";

import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { useState, useCallback } from "react";
import { VehicleMarker } from "./VehicleMarker";
import { Vehicle } from "@/types/vehicle";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function FleetMap({ vehicles }: { vehicles?: Vehicle[] }) {
  const [popupVehicleId, setPopupVehicleId] = useState<string | number | null>(null);

  const handleMarkerClick = useCallback((id: string | number) => {
    setPopupVehicleId((prev) => (prev === id ? null : id));
  }, []);

  const handlePopupClose = useCallback(() => {
    setPopupVehicleId(null);
  }, []);

  const vehicleList = Array.isArray(vehicles) ? vehicles : [];

  return (
    <Map
      initialViewState={{
        longitude: 106.816,
        latitude: -6.2,
        zoom: 12,
      }}
      style={{ height: "100%", width: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {vehicleList.map((vehicle) => {
        // Only render markers with valid coordinates
        const lat = Number(vehicle.latitude);
        const lng = Number(vehicle.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <VehicleMarker
            key={String(vehicle.id)}
            vehicle={{
              ...vehicle,
              latitude: lat,
              longitude: lng,
            }}
            isPopupOpen={popupVehicleId === vehicle.id}
            onMarkerClick={handleMarkerClick}
            onPopupClose={handlePopupClose}
          />
        );
      })}
    </Map>
  );
}

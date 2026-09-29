"use client";

import { useVehicles } from "@/hooks/api/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { Card } from "@/components/ui/Card";

function getModelName(model: Vehicle["model"]): string {
  if (!model) return "";
  if (typeof model === "string") return model;
  return model.name || "";
}

export default function VehiclesPage() {
  const { data: vehicles, isLoading, error } = useVehicles();

  if (isLoading) return <p>Memuat data kendaraan...</p>;
  if (error) return <p>Gagal memuat data kendaraan.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {vehicles?.map((vehicle: Vehicle) => (
        <Card key={String(vehicle.id)}>
          <h3 className="text-lg font-semibold">{vehicle.plate_number}</h3>
          <p>{vehicle.brand} {getModelName(vehicle.model)}</p>
          <span className="text-sm text-gray-500">Status: {vehicle.status}</span>
        </Card>
      ))}
    </div>
  );
}
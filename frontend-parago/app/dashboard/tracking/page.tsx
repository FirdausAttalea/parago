"use client";

import dynamic from "next/dynamic";
import { useVehicles } from "@/hooks/api/useVehicles";

const FleetMap = dynamic(() => import("@/components/maps/FleetMap"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-100">Memuat peta...</div>,
});

export default function TrackingPage() {
  const { data: vehicles } = useVehicles();

  return (
    <div className="h-[calc(100vh-100px)] w-full">
      <FleetMap vehicles={vehicles} />
    </div>
  );
}
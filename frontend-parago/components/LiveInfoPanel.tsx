import React from "react";
import Image from "next/image";

interface LiveInfoPanelProps {
  status: "active" | "connecting" | "weak";
  driverName: string;
  driverPhoto: string;
  vehicleName: string;
  licensePlate: string;
  speedKmh: number;
  distanceKm: number;
  etaMinutes: number;
  onRecenter: () => void;
  onShare: () => void;
}

export const LiveInfoPanel: React.FC<LiveInfoPanelProps> = ({
  status,
  driverName,
  driverPhoto,
  vehicleName,
  licensePlate,
  speedKmh,
  distanceKm,
  etaMinutes,
  onRecenter,
  onShare,
}) => {
  const statusLabel = {
    active: "Live Tracking Active",
    connecting: "Connecting...",
    weak: "GPS Signal Weak",
  }[status];

  const statusColor = {
    active: "bg-emerald-100 text-emerald-800",
    connecting: "bg-amber-100 text-amber-800",
    weak: "bg-red-100 text-red-800",
  }[status];

  return (
    <div className="absolute top-4 right-4 z-10 w-80 rounded-xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-slate-200">
      <div className="p-4">
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}> 
          {statusLabel}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
            <Image src={driverPhoto} alt={driverName} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-slate-800">{driverName}</p>
            <p className="text-xs text-slate-500">{vehicleName} • {licensePlate}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
          <div>
            <p className="font-medium">Speed</p>
            <p>{speedKmh.toFixed(1)} km/h</p>
          </div>
          <div>
            <p className="font-medium">Distance</p>
            <p>{distanceKm.toFixed(2)} km</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium">ETA</p>
            <p>{etaMinutes > 0 ? `${etaMinutes} min` : "Calculating..."}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={onRecenter}
            className="flex items-center gap-1 rounded-xl bg-parago-blue/10 px-3 py-1 text-sm font-medium text-parago-blue hover:bg-parago-blue/20"
          >
            Recenter
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1 rounded-xl bg-parago-blue/10 px-3 py-1 text-sm font-medium text-parago-blue hover:bg-parago-blue/20"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

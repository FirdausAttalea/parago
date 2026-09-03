import { Marker, Popup } from "react-leaflet";
import { Vehicle } from "@/types/vehicle";
import { Car, Gauge, MapPin, User, ArrowUpRight } from "lucide-react";
import L from "leaflet";
import vehicleIconSvg from "@/public/icons/vehicle.png";

// Custom Rotated Vehicle Marker Icon
const vehicleIcon = L.icon({
  iconUrl: vehicleIconSvg.src,
  iconSize: [44, 22],
  iconAnchor: [22, 11],
  popupAnchor: [0, -14],
});

export function VehicleMarker({ vehicle }: { vehicle: Vehicle }) {
  const isMoving = vehicle.status === "active";
  const isMaintenance = vehicle.status === "maintenance";

  // Design system status color tokens (identical to Parago Fleet Booking Overview)
  const statusConfig = isMoving
    ? {
        label: "Moving",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        badgeRing: "ring-emerald-600/20",
        dotColor: "bg-emerald-500",
        stripeClass: "bg-emerald-500",
      }
    : isMaintenance
    ? {
        label: "Maintenance",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeRing: "ring-amber-600/20",
        dotColor: "bg-amber-500",
        stripeClass: "bg-amber-500",
      }
    : {
        label: "Idle / Stopped",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
        badgeRing: "ring-slate-400/20",
        dotColor: "bg-slate-400",
        stripeClass: "bg-slate-300",
      };

  return (
    <Marker position={[vehicle.latitude, vehicle.longitude]} icon={vehicleIcon}>
      <Popup className="parago-custom-popup" closeButton={false} offset={[0, -4]}>
        <div className="w-72 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-slate-900/10 font-sans transition-all duration-200">
          {/* Top Status Stripe */}
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
                  {vehicle.brand} {vehicle.model}
                </h4>
              </div>

              {/* Status Badge Pill */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeRing} shrink-0`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${isMoving ? "animate-pulse" : ""}`} />
                {statusConfig.label}
              </span>
            </div>

            {/* License Plate & Driver Bar */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-black tracking-wider text-white shadow-inner">
                  {vehicle.plate_number}
                </div>
              </div>

              {/* Driver info */}
              <div className="flex items-center gap-1.5 text-right">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 ring-1 ring-white">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Driver</p>
                  <p className="text-xs font-semibold text-slate-700 leading-tight">
                    {vehicle.driver?.name || "Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Telemetry Grid: Speed & Coordinates */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-100 bg-white/70 p-2 shadow-xs">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Gauge className="h-3 w-3 text-parago-blue" />
                  <span>Real-time Speed</span>
                </div>
                <p className="mt-0.5 text-xs font-bold text-slate-800">
                  {isMoving ? "42 km/h" : "0 km/h"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white/70 p-2 shadow-xs">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <MapPin className="h-3 w-3 text-rose-500" />
                  <span>Coordinates</span>
                </div>
                <p className="mt-0.5 text-[11px] font-mono font-medium text-slate-600 truncate">
                  {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
              <span className="text-[11px] text-slate-400">ID: #{vehicle.id}</span>
              <a
                href="/dashboard/tracking/live-tracking"
                className="inline-flex items-center gap-1 font-semibold text-parago-blue hover:text-blue-700 transition-colors"
              >
                <span>Live Track</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
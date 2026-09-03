import React from "react";
import { Car } from "lucide-react";

type StatusConfig = {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
  dotColor: string;
  stripeClass: string;
  isPulse: boolean;
};

interface MapTooltipCardProps {
  statusConfig: StatusConfig;
}

const MapTooltipCard: React.FC<MapTooltipCardProps> = ({ statusConfig }) => {
  return (
    <div className="w-80 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-slate-900/10 font-sans transition-all duration-300 transform scale-100 hover:scale-[1.01]">
      {/* Top stripe */}
      <div className={`h-1.5 w-full ${statusConfig.stripeClass}`} />
      <div className="p-4">
        {/* Header with vehicle name and status badge */}
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
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeRing} shrink-0`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${statusConfig.isPulse ? "animate-pulse" : ""}`}
            />
            {statusConfig.label}
          </span>
        </div>
        {/* License plate and driver */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/70">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-black tracking-wider text-white shadow-inner">
              PRG‑7700
            </div>
            <span className="text-[10px] font-medium text-slate-400">V-01</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-600">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTooltipCard;

import { MapPin } from "lucide-react";
import type { Booking } from "@/lib/data";

const statusStyles: Record<Booking["status"], string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function BookingItem({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-400">
          {booking.dateRange}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
            statusStyles[booking.status]
          }`}
        >
          {booking.status}
        </span>
      </div>

      <h4 className="mt-2 text-[17px] font-bold text-slate-900">
        {booking.vehicleName}
      </h4>

      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {booking.location}
        </span>
        <button
          type="button"
          className="text-sm font-semibold text-parago-blue hover:underline"
        >
          {booking.actionLabel}
        </button>
      </div>
    </div>
  );
}
import { CheckCircle2 } from "lucide-react";

type Point = {
  time: string;
  name: string;
  address: string;
  note?: string;
};

export default function TripLogisticsCard({
  pickup,
  destination,
}: {
  pickup: Point;
  destination: Point;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Trip Logistics</h2>
        <button
          type="button"
          className="text-xs font-extrabold tracking-wide text-parago-blue hover:underline"
        >
          EDIT ROUTE
        </button>
      </div>

      <div className="relative mt-6 space-y-8 pl-1">
        {/* connecting line */}
        <div className="absolute left-[9px] top-3 h-[calc(100%-2rem)] w-px bg-slate-200" />

        {/* Pickup */}
        <div className="relative flex gap-4">
          <span className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-parago-navy bg-white">
            <span className="h-2 w-2 rounded-full bg-parago-navy" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-slate-400">
              PICKUP LOCATION • {pickup.time}
            </p>
            <h3 className="mt-1 text-lg font-bold text-parago-navy">
              {pickup.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{pickup.address}</p>
            {pickup.note && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {pickup.note}
              </span>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="relative flex gap-4">
          <span className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-slate-400">
              DESTINATION • ESTIMATED {destination.time.replace(/^Estimated /i, "")}
            </p>
            <h3 className="mt-1 text-lg font-bold text-parago-navy">
              {destination.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {destination.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
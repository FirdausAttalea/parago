type AvailabilityRow = {
  label: string;
  available: number;
  capacity: number;
  barColor: string;
};

const rows: AvailabilityRow[] = [
  {
    label: "Executive Sedans",
    available: 12,
    capacity: 14,
    barColor: "bg-parago-navy",
  },
  {
    label: "Premium SUVs",
    available: 4,
    capacity: 14,
    barColor: "bg-amber-400",
  },
];

export default function FleetAvailabilityCard() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold tracking-widest2 text-slate-900">
          FLEET AVAILABILITY
        </p>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          LIVE
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wide text-slate-500">
                {row.label}
              </span>
              <span className="font-bold text-slate-900">
                {row.available} Available
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${row.barColor}`}
                style={{
                  width: `${Math.min(
                    100,
                    (row.available / row.capacity) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
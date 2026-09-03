export default function TripProgressCard({
  currentKm,
  totalKm,
  percent,
}: {
  currentKm: number;
  totalKm: number;
  percent: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <p className="text-xs font-extrabold tracking-widest2 text-slate-500">
        TRIP PROGRESS
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">
          {currentKm} km / {totalKm.toFixed(1)} km
        </p>
        <p className="text-sm font-extrabold text-parago-navy">{percent}%</p>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-parago-navy"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
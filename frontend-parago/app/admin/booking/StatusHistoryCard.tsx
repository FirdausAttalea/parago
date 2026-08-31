import type { HistoryState } from "@/lib/bookingData";

const dotColor: Record<HistoryState, string> = {
  done: "bg-emerald-500",
  active: "bg-amber-500",
  pending: "bg-slate-300",
};

const textColor: Record<HistoryState, string> = {
  done: "text-slate-900",
  active: "text-slate-900",
  pending: "text-slate-400",
};

export default function StatusHistoryCard({
  history,
}: {
  history: {
    label: string;
    timestamp: string;
    source: string;
    state: HistoryState;
  }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-extrabold tracking-widest2 text-slate-400">
        STATUS HISTORY
      </p>

      <div className="relative mt-5 space-y-5 pl-1">
        <div className="absolute left-[5px] top-2 h-[calc(100%-1.5rem)] w-px bg-slate-100" />
        {history.map((item) => (
          <div key={item.label} className="relative flex gap-3">
            <span
              className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                dotColor[item.state]
              }`}
            />
            <div>
              <p className={`text-[15px] font-bold ${textColor[item.state]}`}>
                {item.label}
              </p>
              <p className="text-xs text-slate-400">
                {item.timestamp}
                {item.source ? ` • ${item.source}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
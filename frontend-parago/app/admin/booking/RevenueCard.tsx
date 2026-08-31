import { TrendingUp } from "lucide-react";

export default function RevenueCard({
  amount,
  note,
  currency = "USD",
}: {
  amount: number;
  note: string;
  currency?: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#4A3110] to-[#241708] p-6 text-white">
      <p className="text-xs font-semibold tracking-widest2 text-amber-200/70">
        ESTIMATED REVENUE
      </p>
      <p className="mt-2 flex items-baseline gap-2 text-3xl font-extrabold">
        ${amount.toLocaleString()}.00
        <span className="text-sm font-medium text-amber-200/60">
          {currency}
        </span>
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-sm text-amber-100/80">{note}</p>
        <TrendingUp className="h-4 w-4 text-emerald-400" />
      </div>
    </div>
  );
}
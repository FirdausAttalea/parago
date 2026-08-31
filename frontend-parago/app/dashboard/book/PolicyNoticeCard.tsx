import { Info } from "lucide-react";

export default function PolicyNoticeCard({
  message = "Bookings made less than 4 hours before departure require manual dispatcher override.",
}: {
  message?: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50 p-6">
      <div className="flex items-center gap-2 text-parago-blue">
        <Info className="h-4 w-4" />
        <p className="text-xs font-extrabold tracking-widest2">
          CORPORATE POLICY
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
    </div>
  );
}
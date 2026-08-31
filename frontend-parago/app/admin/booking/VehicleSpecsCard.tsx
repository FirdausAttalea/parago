import { Wrench } from "lucide-react";

export default function VehicleSpecsCard({
  specs,
}: {
  specs: { label: string; value: string; valueColor?: string }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5">
        <Wrench className="h-5 w-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Vehicle Specs</h3>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
          >
            <span className="text-sm text-slate-500">{spec.label}</span>
            <span
              className={`text-[15px] font-bold ${
                spec.valueColor ?? "text-slate-900"
              }`}
            >
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
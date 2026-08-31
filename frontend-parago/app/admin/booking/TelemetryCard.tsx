import { RadioTower, Thermometer, Gauge, Disc3 } from "lucide-react";

const iconByLabel: Record<string, React.ElementType> = {
  "Cabin Temp": Thermometer,
  "Current Speed": Gauge,
  "Tire Pressure": Disc3,
};

export default function TelemetryCard({
  telemetry,
}: {
  telemetry: { label: string; value: string; valueColor?: string }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5">
        <RadioTower className="h-5 w-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">
          Real-time Telemetry
        </h3>
      </div>

      <div className="mt-5 space-y-5">
        {telemetry.map((item) => {
          const Icon = iconByLabel[item.label] ?? Gauge;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold tracking-wide text-slate-400">
                  {item.label.toUpperCase()}
                </p>
                <p
                  className={`mt-1 text-xl font-extrabold ${
                    item.valueColor ?? "text-parago-navy"
                  }`}
                >
                  {item.value}
                </p>
              </div>
              <Icon className="h-6 w-6 text-blue-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
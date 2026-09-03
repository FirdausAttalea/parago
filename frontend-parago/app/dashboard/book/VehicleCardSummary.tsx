import Image from "next/image";
import { Users, Briefcase, Zap, Wifi } from "lucide-react";

type Spec = { icon: React.ElementType; label: string };

const specs: Spec[][] = [
  [
    { icon: Users, label: "4 Passengers" },
    { icon: Briefcase, label: "2 Large Bags" },
  ],
  [
    { icon: Zap, label: "Priority Status" },
    { icon: Wifi, label: "Onboard 5G" },
  ],
];

export default function VehicleSummaryCard({
  className = "",
  image = "/vehicles/executive-sedan.jpg",
  vehicleName = "Executive Sedan",
  badge = "TOP CHOICE",
}: {
  className?: string;
  image?: string;
  vehicleName?: string;
  badge?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E1D0E] to-[#140C05] p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold tracking-widest2 text-amber-200/70">
          SELECTED CLASS
        </p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold leading-tight tracking-wide text-white">
          {badge}
        </span>
      </div>

      <h3 className="mt-1 text-3xl font-extrabold leading-tight text-white">
        {vehicleName}
      </h3>

      <div className="relative mt-5 h-44 w-full overflow-hidden rounded-xl bg-black/40">
        <Image
          src={image}
          alt={vehicleName}
          fill
          sizes="360px"
          className="object-cover"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-y-4 rounded-2xl bg-white p-5">
        {specs.map((column, colIdx) => (
          <div key={colIdx} className="space-y-4">
            {column.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className="flex items-center gap-2 text-[13px] font-bold leading-tight text-slate-900"
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="uppercase tracking-wide text-[11px] text-slate-700">
                    {spec.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
import Image from "next/image";

export default function VehicleHeroBanner({
  image,
  vehicleName,
  subtitle,
  badges,
}: {
  image: string;
  vehicleName: string;
  subtitle: string;
  badges: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
      <div className="relative h-72 w-full sm:h-80">
        <Image
          src={image}
          alt={vehicleName}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-8 pb-8">
        <div className="flex items-center gap-3">
          {badges.map((badge, i) => (
            <span
              key={badge}
              className={`rounded-md px-2.5 py-1 text-[11px] font-extrabold tracking-wide ${
                i === 0
                  ? "bg-slate-200 text-slate-600"
                  : "bg-transparent text-amber-600"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        <h2 className="mt-2 text-4xl font-extrabold text-parago-navy sm:text-5xl">
          {vehicleName}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
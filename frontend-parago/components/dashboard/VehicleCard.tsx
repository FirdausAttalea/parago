import Image from "next/image";
import Link from "next/link";
import { Users, Cog, Fuel } from "lucide-react";
import type { Vehicle } from "@/lib/data";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative mb-4 h-56 w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} ${vehicle.variant}`}
          fill
          sizes="(min-width: 768px) 400px, 100vw"
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700">
          {vehicle.tag}
        </span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>
          <p className="text-sm text-slate-400">{vehicle.variant}</p>
        </div>
        <p className="whitespace-nowrap text-lg font-bold text-slate-900">
          {typeof vehicle.pricePerDay === "number"
            ? `Rp ${vehicle.pricePerDay.toLocaleString("id-ID")}`
            : vehicle.pricePerDay}
          <span className="text-sm font-medium text-slate-400">/day</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {vehicle.seats} Seats
        </span>
        <span className="flex items-center gap-1.5">
          <Cog className="h-4 w-4" />
          {vehicle.transmission}
        </span>
        <span className="flex items-center gap-1.5">
          <Fuel className="h-4 w-4" />
          {vehicle.fuel}
        </span>
      </div>

      <Link
        href="/dashboard/book/new"
        className="mt-5 block w-full rounded-xl bg-gradient-to-r from-parago-peach to-parago-peachDark py-3.5 text-center text-[15px] font-bold text-slate-900 transition hover:brightness-95 active:scale-[0.99]"
      >
        Book Now
      </Link>
    </div>
  );
}
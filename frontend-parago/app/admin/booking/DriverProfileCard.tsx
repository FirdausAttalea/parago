import Image from "next/image";
import { MessageSquare } from "lucide-react";

export default function DriverProfileCard({
  name,
  title,
  photo,
  rating,
  safeMiles,
  online,
}: {
  name: string;
  title: string;
  photo: string;
  rating: string;
  safeMiles: string;
  online: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
          <Image
            src={photo}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
          {online && (
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>
        <div>
          <h3 className="text-[17px] font-bold leading-tight text-parago-navy">
            {name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{title}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
          <p className="text-[10px] font-bold tracking-wide text-slate-400">
            RATING
          </p>
          <p className="mt-1 text-[15px] font-extrabold text-slate-900">
            {rating}
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
          <p className="text-[10px] font-bold tracking-wide text-slate-400">
            SAFE MILES
          </p>
          <p className="mt-1 text-[15px] font-extrabold text-slate-900">
            {safeMiles}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-parago-navy py-3.5 text-sm font-bold text-white transition hover:bg-parago-navy/90"
      >
        <MessageSquare className="h-4 w-4" />
        Contact Driver
      </button>
    </div>
  );
}
import { Building2, User, Phone, FileText } from "lucide-react";

export default function BookingPartyCard({
  name,
  tier,
  accountId,
  attn,
  phone,
  note,
}: {
  name: string;
  tier: string;
  accountId: string;
  attn: string;
  phone: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <p className="text-xs font-extrabold tracking-widest2 text-slate-400">
        BOOKING PARTY
      </p>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-parago-navy">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold leading-tight text-parago-navy">
            {name}
          </h3>
          <p className="text-xs text-slate-400">
            {tier} • ID: {accountId}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 text-sm text-slate-600">
        <p className="flex items-center gap-2.5">
          <User className="h-4 w-4 shrink-0 text-slate-400" />
          Attn: {attn}
        </p>
        <p className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" />
          {phone}
        </p>
        <p className="flex items-center gap-2.5">
          <FileText className="h-4 w-4 shrink-0 text-slate-400" />
          {note}
        </p>
      </div>
    </div>
  );
}
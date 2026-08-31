import type { ReactNode } from "react";
import StepBadge from "./StepBadge";

type Variant = "peach" | "blue" | "navy";

export default function FormStepCard({
  number,
  variant,
  title,
  children,
}: {
  number: string;
  variant: Variant;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <StepBadge number={number} variant={variant} />
        <h2 className="text-lg font-extrabold tracking-widest2 text-slate-900">
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}
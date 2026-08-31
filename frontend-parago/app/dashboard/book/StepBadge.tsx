type Variant = "peach" | "blue" | "navy";

const variantStyles: Record<Variant, string> = {
  peach: "bg-parago-peach text-slate-900",
  blue: "bg-blue-100 text-parago-blue",
  navy: "bg-parago-navy text-white",
};

export default function StepBadge({
  number,
  variant,
}: {
  number: string;
  variant: Variant;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${variantStyles[variant]}`}
    >
      {number}
    </span>
  );
}
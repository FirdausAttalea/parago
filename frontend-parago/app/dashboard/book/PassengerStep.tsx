"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function PassengerStepper({
  initial = 1,
  min = 1,
  max = 12,
}: {
  initial?: number;
  min?: number;
  max?: number;
}) {
  const [count, setCount] = useState(initial);

  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2.5">
      <button
        type="button"
        onClick={() => setCount((c) => Math.max(min, c - 1))}
        disabled={count <= min}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-base font-bold text-slate-900">{count} Person{count > 1 ? "s" : ""}</span>
      <button
        type="button"
        onClick={() => setCount((c) => Math.min(max, c + 1))}
        disabled={count >= max}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
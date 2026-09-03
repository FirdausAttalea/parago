"use client";

import dynamic from "next/dynamic";

const LiveTrackingMap = dynamic(() => import("./LiveTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-slate-500 animate-pulse">Loading map...</div>
    </div>
  ),
});

export default function Page() {
  return <LiveTrackingMap />;
}

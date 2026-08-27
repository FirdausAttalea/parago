"use client";

import Image from "next/image";
import { Search, Bell, Settings } from "lucide-react";
import { currentUser } from "@/lib/data";

export default function Topbar() {
  return (
    <header className="flex h-[73px] items-center gap-4 border-b border-slate-200 bg-white px-6 md:px-10">
      <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-100 px-4 py-2.5">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder="Search fleet, requests, or logs..."
          className="w-full bg-transparent text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Settings"
        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
      >
        <Settings className="h-5 w-5" />
      </button>

      <div className="h-6 w-px bg-slate-200" />

      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-900">
        <Image
          src={currentUser.avatar}
          alt={currentUser.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    </header>
  );
}
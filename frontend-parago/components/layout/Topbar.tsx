"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Bell, Settings, ChevronRight } from "lucide-react";
import { currentUser, notifications } from "@/lib/data";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useBreadcrumb } from "@/components/layout/BreadcrumbContext";

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.length;
  const { crumbs } = useBreadcrumb();

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 md:px-10">
      {crumbs.length > 0 && (
        <nav className="hidden shrink-0 items-center gap-2 whitespace-nowrap text-xs font-bold tracking-wide md:flex">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
              <span
                className={
                  i === crumbs.length - 1 ? "text-slate-900" : "text-slate-400"
                }
              >
                {crumb.label.toUpperCase()}
              </span>
            </span>
          ))}
        </nav>
      )}

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
        onClick={() => setNotifOpen(true)}
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      <NotificationCenter
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

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
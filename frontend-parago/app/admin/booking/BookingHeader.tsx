"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Bell, Settings } from "lucide-react";
import { notifications, currentUser } from "@/lib/data";
import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function BookingHeader({
  bookingCode,
  status,
  category,
  vehicleName,
}: {
  bookingCode: string;
  status: string;
  category: string;
  vehicleName: string;
}) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.length;

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-5 md:px-10">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-extrabold text-parago-navy">
            Booking #{bookingCode}
          </h1>
          <span className="rounded-md bg-blue-100 px-2 py-1 text-[11px] font-bold tracking-wide text-parago-blue">
            {status}
          </span>
        </div>
        <p className="mt-0.5 text-xs font-semibold tracking-wide text-slate-400">
          {category.toUpperCase()} • {vehicleName.toUpperCase()}
        </p>
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
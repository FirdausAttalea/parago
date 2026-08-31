"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, Map, CalendarPlus } from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/dashboard/book/new", icon: CalendarPlus },
  { label: "Live Tracking", href: "/dashboard/tracking", icon: Map },
  { label: "Kendaraan", href: "/dashboard/vehicle", icon: Truck },
  { label: "Pengemudi", href: "/dashboard/driver", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header Logo dengan tinggi h-[73px] presisi sejajar batas bawah Topbar */}
      <div className="flex h-[73px] items-center border-b border-slate-200 px-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo-parago.png"
            alt="ParaGo Logo"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-blue-50 text-parago-blue shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

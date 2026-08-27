"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Users, Map } from "lucide-react";

const menuItems = [
  { label: "Live Tracking", href: "/tracking", icon: Map },
  { label: "Kendaraan", href: "/vehicles", icon: Truck },
  { label: "Pengemudi", href: "/drivers", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 p-4">
        <LayoutDashboard className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold">Parago Fleet</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
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
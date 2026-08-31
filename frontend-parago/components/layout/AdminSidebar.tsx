"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ClipboardList,
  Archive,
  BarChart3,
  ShieldCheck,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Fleet Overview", href: "/admin", icon: Car },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
  { label: "Inventory", href: "/admin/inventory", icon: Archive },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-6 py-8 md:flex">
      <div>
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-12 items-center justify-center rounded-xl bg-parago-blue">
            <svg width="22" height="15" viewBox="0 0 26 18" fill="none">
              <path
                d="M2 6h22M6 12h14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-xl font-bold text-parago-blue">ParaGo</span>
        </Link>

        {/* Nav */}
        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive
                    ? "bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-slate-200"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-1 border-t border-slate-100 pt-6">
        <Link
          href="/support"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <HelpCircle className="h-5 w-5" />
          Support
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
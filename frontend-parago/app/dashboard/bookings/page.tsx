"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Download,
  Pencil,
  X,
  RotateCcw,
  Navigation,
  Eye,
  CalendarDays,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import {
  bookingOverviews,
  type BookingOverviewItem,
  type BookingOverviewStatus,
} from "@/lib/bookingData";

/* ── Status config ─────────────────────────────── */
const STATUS_CONFIG: Record<
  BookingOverviewStatus,
  { label: string; dotColor: string; badgeBg: string; badgeText: string }
> = {
  ongoing: {
    label: "Ongoing",
    dotColor: "bg-emerald-400",
    badgeBg: "bg-emerald-50 ring-1 ring-emerald-200",
    badgeText: "text-emerald-700",
  },
  upcoming: {
    label: "Upcoming",
    dotColor: "bg-amber-400",
    badgeBg: "bg-amber-50 ring-1 ring-amber-200",
    badgeText: "text-amber-700",
  },
  completed: {
    label: "Completed",
    dotColor: "bg-blue-400",
    badgeBg: "bg-blue-50 ring-1 ring-blue-200",
    badgeText: "text-blue-700",
  },
  cancelled: {
    label: "Cancelled",
    dotColor: "bg-red-400",
    badgeBg: "bg-red-50 ring-1 ring-red-200",
    badgeText: "text-red-700",
  },
};

const FILTER_TABS: Array<{ label: string; value: BookingOverviewStatus | null }> = [
  { label: "All Bookings", value: null },
  { label: "Ongoing", value: "ongoing" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

/* ── Helper: format currency ───────────────────── */
function formatCurrency(amount: number): string {
  return amount === 0
    ? "$0.00"
    : `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

/* ── Badge component ───────────────────────────── */
function StatusBadge({ status }: { status: BookingOverviewStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
      {cfg.label}
    </span>
  );
}

/* ── Action buttons per status ─────────────────── */
function CardActions({ booking }: { booking: BookingOverviewItem }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200";

  switch (booking.status) {
    case "ongoing":
      return (
        <>
          <Link
            href="/dashboard/tracking"
            className={`${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:shadow-sm`}
          >
            <Navigation className="h-3.5 w-3.5" />
            Track Vehicle
          </Link>
          <Link
            href={`/admin/bookings/${booking.id}`}
            className={`${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 hover:shadow-sm`}
          >
            <Eye className="h-3.5 w-3.5" />
            View Detail
          </Link>
        </>
      );
    case "upcoming":
      return (
        <>
          <button
            type="button"
            className={`${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 hover:shadow-sm`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Booking
          </button>
          <button
            type="button"
            className={`${base} bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100 hover:shadow-sm`}
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </>
      );
    case "completed":
      return (
        <>
          <button
            type="button"
            className={`${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 hover:shadow-sm`}
          >
            <Download className="h-3.5 w-3.5" />
            Invoice
          </button>
          <Link
            href="/dashboard/book/new"
            className={`${base} bg-parago-blue/10 text-parago-blue ring-1 ring-parago-blue/20 hover:bg-parago-blue/20 hover:shadow-sm`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rebook
          </Link>
        </>
      );
    case "cancelled":
      return (
        <Link
          href="/dashboard/book/new"
          className={`${base} bg-parago-blue/10 text-parago-blue ring-1 ring-parago-blue/20 hover:bg-parago-blue/20 hover:shadow-sm`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Rebook
        </Link>
      );
  }
}

/* ── Booking Card ──────────────────────────────── */
function BookingCard({ booking }: { booking: BookingOverviewItem }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
      {/* Accent stripe */}
      <div
        className={`h-1 w-full ${
          booking.status === "ongoing"
            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
            : booking.status === "upcoming"
              ? "bg-gradient-to-r from-amber-400 to-amber-500"
              : booking.status === "completed"
                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                : "bg-gradient-to-r from-red-400 to-red-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-sm font-bold text-parago-navy">
            #{booking.bookingCode}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {booking.transactionDate}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-dashed border-slate-100" />

      {/* Body */}
      <div className="flex gap-4 px-5 py-4">
        {/* Vehicle thumbnail */}
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={booking.vehicle.thumbnail}
            alt={booking.vehicle.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Trip info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-slate-900">
            {booking.vehicle.name}
          </h3>
          <p className="text-xs text-slate-400">{booking.vehicle.type}</p>

          <div className="mt-2.5 grid grid-cols-1 gap-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 truncate">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              {booking.startDate} — {booking.endDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              Duration: {booking.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="mx-5 flex flex-wrap gap-x-4 gap-y-1 pb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          {booking.driver}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          {booking.route}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold text-parago-navy">
            {formatCurrency(booking.totalCost)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CardActions booking={booking} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════ */
export default function BookingsOverviewPage() {
  const [activeTab, setActiveTab] = useState<BookingOverviewStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Derived data ─────────────────────────────── */
  const filtered = useMemo(() => {
    let list = bookingOverviews;
    if (activeTab) list = list.filter((b) => b.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.vehicle.name.toLowerCase().includes(q) ||
          b.driver.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  /* ── Stats ─────────────────────────────────────── */
  const totalBookings = bookingOverviews.length;
  const ongoingCount = bookingOverviews.filter((b) => b.status === "ongoing").length;
  const totalRevenue = bookingOverviews
    .filter((b) => b.status === "completed" || b.status === "ongoing")
    .reduce((sum, b) => sum + b.totalCost, 0);

  /* ── Tab counts ────────────────────────────────── */
  const tabCounts: Record<string, number> = {
    all: bookingOverviews.length,
    ongoing: bookingOverviews.filter((b) => b.status === "ongoing").length,
    upcoming: bookingOverviews.filter((b) => b.status === "upcoming").length,
    completed: bookingOverviews.filter((b) => b.status === "completed").length,
    cancelled: bookingOverviews.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="animate-fadeIn">
      {/* ── Page Header ──────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            FLEET MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-parago-navy md:text-4xl">
            Vehicle Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and manage all fleet reservations in one place.
          </p>
        </div>

        <Link
          href="/dashboard/book/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-parago-navy px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-parago-navy/90 hover:shadow-lg"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-xs">+</span>
          New Booking
        </Link>
      </div>

      {/* ── Stats Summary ────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-parago-blue/10">
            <TrendingUp className="h-5 w-5 text-parago-blue" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Bookings</p>
            <p className="text-xl font-extrabold text-parago-navy">{totalBookings}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Active Now</p>
            <p className="text-xl font-extrabold text-parago-navy">{ongoingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
            <DollarSign className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
            <p className="text-xl font-extrabold text-parago-navy">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vehicle, booking ID, or driver…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-parago-blue focus:ring-2 focus:ring-parago-blue/20"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* ── Filter Tabs ──────────────────────────── */}
      <nav className="mt-5 flex gap-1.5 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const countKey = tab.value ?? "all";
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-parago-navy text-white shadow-md"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-md px-1 text-[11px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tabCounts[countKey]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Booking Cards Grid ───────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>

      {/* ── Empty State ──────────────────────────── */}
      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-700">
            No bookings found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            {searchQuery
              ? `No results matching "${searchQuery}". Try a different keyword.`
              : "There are no bookings matching the selected filter."}
          </p>
          <Link
            href="/dashboard/book/new"
            className="mt-5 flex items-center gap-2 rounded-xl bg-parago-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-parago-navy/90"
          >
            Create New Booking
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ── Fade-in animation ────────────────────── */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

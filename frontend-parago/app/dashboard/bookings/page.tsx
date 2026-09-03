"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
  FileText,
  Printer,
  CheckCircle2,
  Car,
} from "lucide-react";
import {
  bookingOverviews as initialBookingOverviews,
  type BookingOverviewItem,
  type BookingOverviewStatus,
} from "@/lib/bookingData";

/* ══════════════════════════════════════════════════
   1. SISTEM PEWARNAAN STATUS CARD (Color-Coding)
   - Completed: Hijau (#22c55e / bg-green-500)
   - Ongoing: Biru (#3b82f6 / bg-blue-500)
   - Cancelled: Merah (#ef4444 / bg-red-500)
   - Upcoming: Kuning/Oranye (#f59e0b / bg-amber-500)
   ══════════════════════════════════════════════════ */
const STATUS_CONFIG: Record<
  BookingOverviewStatus,
  {
    label: string;
    stripeClass: string;
    borderClass: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  completed: {
    label: "Completed",
    stripeClass: "bg-green-500",
    borderClass: "border-green-200 hover:border-green-300",
    dotColor: "bg-green-500",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
    badgeBorder: "ring-1 ring-green-600/20",
  },
  ongoing: {
    label: "Ongoing",
    stripeClass: "bg-blue-500",
    borderClass: "border-blue-200 hover:border-blue-300",
    dotColor: "bg-blue-500",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "ring-1 ring-blue-600/20",
  },
  cancelled: {
    label: "Cancelled",
    stripeClass: "bg-red-500",
    borderClass: "border-red-200 hover:border-red-300",
    dotColor: "bg-red-500",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    badgeBorder: "ring-1 ring-red-600/20",
  },
  upcoming: {
    label: "Upcoming",
    stripeClass: "bg-amber-500",
    borderClass: "border-amber-200 hover:border-amber-300",
    dotColor: "bg-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "ring-1 ring-amber-600/20",
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
  return amount === 0 ? "Rp0" : `Rp${amount.toLocaleString("id-ID")}`;
}

/* ── Status Badge ─────────────────────────────── */
function StatusBadge({ status }: { status: BookingOverviewStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
    >
      <span className={`h-2 w-2 rounded-full ${cfg.dotColor}`} />
      {cfg.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   2. FOTO KENDARAAN LOKAL DENGAN FALLBACK
   ══════════════════════════════════════════════════ */
function VehicleImageWithFallback({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-2 text-slate-400">
        <Car className="h-7 w-7" />
        <span className="mt-1 text-[10px] font-medium text-slate-500">Parago Fleet</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="112px"
      onError={() => {
        setHasError(true);
      }}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}

/* ══════════════════════════════════════════════════
   3. A. MODAL KONFIRMASI CANCEL BOOKING
   ══════════════════════════════════════════════════ */
function CancelConfirmModal({
  booking,
  isOpen,
  onClose,
  onConfirm,
}: {
  booking: BookingOverviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string) => void;
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Pembatalan</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin membatalkan pemesanan kendaraan{" "}
            <span className="font-bold text-slate-900">{booking.vehicle.name}</span> (ID:{" "}
            <span className="font-semibold text-parago-blue">#{booking.bookingCode}</span>)?
          </p>

          <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-100">
            <strong>Perhatian:</strong> Tindakan ini akan mengubah status pemesanan menjadi{" "}
            <span className="font-bold">Cancelled</span> dan membebaskan unit kendaraan ini.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 bg-slate-50/80 px-6 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(booking.id)}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   3. C. MODAL PDF VIEWER INVOICE
   ══════════════════════════════════════════════════ */
function InvoicePdfModal({
  booking,
  isOpen,
  onClose,
}: {
  booking: BookingOverviewItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-parago-blue/20">
              <FileText className="h-5 w-5 text-parago-blue" />
            </div>
            <div>
              <h3 className="text-base font-bold">Invoice #{booking.bookingCode}</h3>
              <p className="text-xs text-slate-400">PDF Document Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-parago-blue px-4 py-2 text-xs font-semibold text-white shadow hover:bg-parago-blue/90 transition disabled:opacity-50"
            >
              {isDownloading ? (
                <>Menyiapkan PDF...</>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  Berhasil Diunduh
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Preview Content (A4 / Document Style) */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6 md:p-10">
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md border border-slate-200 text-slate-800">
            {/* Header Document */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-parago-navy">PARAGO</h2>
                <p className="text-xs font-semibold tracking-wider text-slate-400">FLEET MANAGEMENT SYSTEM</p>
                <p className="mt-2 text-xs text-slate-500">
                  Jl. Jendral Sudirman No. 45, Jakarta Selatan<br />
                  support@paragofleet.com | +62 21 555 9900
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-md bg-green-100 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                  PAID INVOICE
                </span>
                <p className="mt-3 text-sm font-bold text-slate-900">#{booking.bookingCode}</p>
                <p className="text-xs text-slate-400">Tgl: {booking.transactionDate}</p>
              </div>
            </div>

            {/* Billing Info Grid */}
            <div className="mt-6 grid grid-cols-2 gap-6 rounded-xl bg-slate-50 p-4 text-xs">
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wider">Pemesan / Driver</p>
                <p className="mt-1 font-bold text-slate-900 text-sm">{booking.driver}</p>
                <p className="text-slate-500 mt-0.5">Fleet License: Authorized Driver</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wider">Rincian Sewa</p>
                <p className="mt-1 font-semibold text-slate-900">{booking.route}</p>
                <p className="text-slate-500 mt-0.5">{booking.startDate} — {booking.endDate}</p>
              </div>
            </div>

            {/* Detail Unit */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detail Kendaraan</h4>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{booking.vehicle.name}</p>
                    <p className="text-xs text-slate-400">{booking.vehicle.type}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Durasi: {booking.duration}
                </span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rincian Biaya</h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="py-2 font-semibold">Deskripsi</th>
                    <th className="py-2 text-right font-semibold">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3">
                      <p className="font-semibold text-slate-800">Sewa Kendaraan ({booking.vehicle.name})</p>
                      <p className="text-[11px] text-slate-400">Termasuk Asuransi & Fleet Operations</p>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      {formatCurrency(booking.totalCost)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500">Layanan Driver Professional</td>
                    <td className="py-3 text-right font-semibold text-slate-900">Termasuk</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-base font-extrabold text-parago-navy">
                <span>Total Pembayaran</span>
                <span>{formatCurrency(booking.totalCost)}</span>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-8 border-t border-dashed border-slate-200 pt-4 text-center text-[11px] text-slate-400">
              Dokumen ini diterbitkan secara otomatis oleh Parago Fleet Management System dan sah tanpa tanda tangan basah.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CARD ACTIONS COMPONENT
   - Track Vehicle -> Navigasi ke /dashboard/tracking?vehicle_id=...
   - Cancel Booking -> Buka Modal Konfirmasi
   - Invoice -> Buka Modal PDF Viewer
   ══════════════════════════════════════════════════ */
function CardActions({
  booking,
  onOpenCancel,
  onOpenInvoice,
}: {
  booking: BookingOverviewItem;
  onOpenCancel: (booking: BookingOverviewItem) => void;
  onOpenInvoice: (booking: BookingOverviewItem) => void;
}) {
  const router = useRouter();
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer";

  switch (booking.status) {
    case "ongoing":
      return (
        <>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/tracking?vehicle_id=${booking.id}`)}
            className={`${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 hover:shadow-sm`}
          >
            <Navigation className="h-3.5 w-3.5" />
            Track Vehicle
          </button>
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
            className={`${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 hover:shadow-sm`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onOpenCancel(booking)}
            className={`${base} bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100 hover:shadow-sm`}
          >
            <X className="h-3.5 w-3.5" />
            Cancel Booking
          </button>
        </>
      );
    case "completed":
      return (
        <>
          <button
            type="button"
            onClick={() => onOpenInvoice(booking)}
            className={`${base} bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100 hover:shadow-sm`}
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

/* ══════════════════════════════════════════════════
   BOOKING CARD COMPONENT
   ══════════════════════════════════════════════════ */
function BookingCard({
  booking,
  onOpenCancel,
  onOpenInvoice,
}: {
  booking: BookingOverviewItem;
  onOpenCancel: (booking: BookingOverviewItem) => void;
  onOpenInvoice: (booking: BookingOverviewItem) => void;
}) {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Accent stripe per status */}
      <div className={`h-1.5 w-full ${cfg.stripeClass}`} />

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
        {/* Vehicle thumbnail with Fallback */}
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
          <VehicleImageWithFallback
            src={booking.vehicle.thumbnail}
            alt={booking.vehicle.name}
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
            <CardActions
              booking={booking}
              onOpenCancel={onOpenCancel}
              onOpenInvoice={onOpenInvoice}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════ */
export default function BookingsOverviewPage() {
  const [bookingList, setBookingList] = useState<BookingOverviewItem[]>(initialBookingOverviews);
  const [activeTab, setActiveTab] = useState<BookingOverviewStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // State untuk Modals
  const [cancelTarget, setCancelTarget] = useState<BookingOverviewItem | null>(null);
  const [invoiceTarget, setInvoiceTarget] = useState<BookingOverviewItem | null>(null);

  const categories = useMemo(() => {
    const types = new Set(bookingList.map((b) => b.vehicle.type));
    return ["all", ...Array.from(types)];
  }, [bookingList]);

  /* ── Aksi Cancel Booking ──────────────────────── */
  const handleConfirmCancel = (bookingId: string) => {
    setBookingList((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as BookingOverviewStatus } : b
      )
    );
    setCancelTarget(null);
  };

  /* ── Derived Data ─────────────────────────────── */
  const filtered = useMemo(() => {
    let list = bookingList;
    if (activeTab) list = list.filter((b) => b.status === activeTab);
    if (categoryFilter !== "all") {
      list = list.filter((b) => b.vehicle.type === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.vehicle.name.toLowerCase().includes(q) ||
          b.driver.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookingList, activeTab, searchQuery, categoryFilter]);

  /* ── Stats ─────────────────────────────────────── */
  const totalBookings = bookingList.length;
  const ongoingCount = bookingList.filter((b) => b.status === "ongoing").length;
  const totalRevenue = bookingList
    .filter((b) => b.status === "completed" || b.status === "ongoing")
    .reduce((sum, b) => sum + b.totalCost, 0);

  /* ── Tab Counts ────────────────────────────────── */
  const tabCounts: Record<string, number> = {
    all: bookingList.length,
    ongoing: bookingList.filter((b) => b.status === "ongoing").length,
    upcoming: bookingList.filter((b) => b.status === "upcoming").length,
    completed: bookingList.filter((b) => b.status === "completed").length,
    cancelled: bookingList.filter((b) => b.status === "cancelled").length,
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Activity className="h-5 w-5 text-blue-600" />
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
            <p className="text-xs font-semibold text-slate-400">Total Revenue / Active Value</p>
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
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm outline-none transition hover:bg-slate-50 focus:border-parago-blue focus:ring-2 focus:ring-parago-blue/20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
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
          <BookingCard
            key={booking.id}
            booking={booking}
            onOpenCancel={(target) => setCancelTarget(target)}
            onOpenInvoice={(target) => setInvoiceTarget(target)}
          />
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
        </div>
      )}

      {/* ── Modals ───────────────────────────────── */}
      <CancelConfirmModal
        booking={cancelTarget}
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />

      <InvoicePdfModal
        booking={invoiceTarget}
        isOpen={!!invoiceTarget}
        onClose={() => setInvoiceTarget(null)}
      />

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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

import Link from "next/link";
import { Filter, Plus, BadgeCheck, Gauge, ArrowRight } from "lucide-react";
import VehicleCard from "@/components/dashboard/VehicleCard";
import BookingItem from "@/components/dashboard/BookingItem";
import { vehicles, bookings } from "@/lib/data";

const TOTAL_AVAILABLE = 14;
const FLEET_GRADE = "Executive";
const TOTAL_MILES = 12482;

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest2 text-slate-400">
            ACTIVE FLEET STATUS
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-parago-navy md:text-5xl">
            {TOTAL_AVAILABLE} Available Vehicles
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-blue-100 px-5 py-3 text-sm font-semibold text-parago-blue transition hover:bg-blue-200"
          >
            <Filter className="h-4 w-4" />
            Filter Search
          </button>
          <Link
            href="/dashboard/book/new"
            className="flex items-center gap-2 rounded-xl bg-parago-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-parago-navy/90"
          >
            <Plus className="h-4 w-4" />
            Quick Booking
          </Link>
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: available vehicles */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Available Vehicles
            </h2>
            <Link
              href="/dashboard/book"
              className="flex items-center gap-1 text-sm font-semibold text-parago-blue hover:underline"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        {/* Right: bookings + stats */}
        <aside className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Upcoming Bookings
          </h2>

          {bookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}

          <Link
            href="/dashboard/book/new"
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-8 text-slate-400 transition hover:border-parago-blue hover:text-parago-blue"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-semibold tracking-wide">
              PLAN NEW TRIP
            </span>
          </Link>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl bg-parago-navy p-5 text-white">
              <BadgeCheck className="h-6 w-6 text-parago-gold" />
              <p className="mt-4 text-xs font-semibold tracking-wide text-slate-300">
                FLEET GRADE
              </p>
              <p className="text-lg font-bold">{FLEET_GRADE}</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-5">
              <Gauge className="h-6 w-6 text-parago-blue" />
              <p className="mt-4 text-xs font-semibold tracking-wide text-parago-blue/80">
                TOTAL MILES
              </p>
              <p className="text-lg font-bold text-parago-navy">
                {TOTAL_MILES.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Feedback card */}
          <div className="rounded-2xl bg-parago-navy p-6 text-white">
            <h3 className="text-lg font-bold">Fleet Feedback</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Help us improve our premium services by rating your last
              executive ride.
            </p>
            <button
              type="button"
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-parago-gold hover:underline"
            >
              Rate Last Trip
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
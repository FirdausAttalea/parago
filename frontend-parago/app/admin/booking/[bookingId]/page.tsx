import { Printer, ShieldAlert } from "lucide-react";
import { getBookingDetail } from "@/lib/bookingData";
import BookingHeader from "../BookingHeader";
import VehicleHeroBanner from "../VehicleHeroBanner";
import RevenueCard from "../RevenueCard";
import TripProgressCard from "../TripProgressCard";
import TripLogisticsCard from "../TripLogisticsCard";
import VehicleSpecsCard from "../VehicleSpecsCard";
import TelemetryCard from "../TelemetryCard";
import SystemLogsTable from "../SystemLogsTable";
import DriverProfileCard from "../DriverProfileCard";
import BookingPartyCard from "../BookingPartyCard";
import StatusHistoryCard from "../StatusHistoryCard";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId?: string }>;
}) {
  const resolvedParams = await params;
  const booking = getBookingDetail(resolvedParams?.bookingId);

  return (
    <>
      <BookingHeader
        bookingCode={booking.bookingCode}
        status={booking.status}
        category={booking.category}
        vehicleName={booking.vehicleName}
      />

      <main className="flex-1 px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-8">
            <VehicleHeroBanner
              image={booking.vehicleImage}
              vehicleName={booking.vehicleName}
              subtitle={booking.vehicleSubtitle}
              badges={booking.vehicleBadges}
            />

            <TripLogisticsCard
              pickup={booking.pickup}
              destination={booking.destination}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <VehicleSpecsCard specs={booking.vehicleSpecs} />
              <TelemetryCard telemetry={booking.telemetry} />
            </div>

            <SystemLogsTable logs={booking.systemLogs} />
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            <RevenueCard
              amount={booking.estimatedRevenue}
              note={booking.revenueNote}
            />
            <TripProgressCard
              currentKm={booking.tripProgress.currentKm}
              totalKm={booking.tripProgress.totalKm}
              percent={booking.tripProgress.percent}
            />
            <DriverProfileCard {...booking.driver} />
            <BookingPartyCard {...booking.bookingParty} />
            <StatusHistoryCard history={booking.statusHistory} />

            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-100 py-3.5 text-sm font-bold text-parago-blue transition hover:bg-blue-200"
              >
                <Printer className="h-4 w-4" />
                Generate Manifest
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                <ShieldAlert className="h-4 w-4" />
                Emergency Override
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

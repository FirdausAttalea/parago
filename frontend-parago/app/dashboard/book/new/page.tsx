"use client";

import { useState } from "react";
import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { usePageBreadcrumb } from "@/components/layout/BreadcrumbContext";
import FormStepCard from "../FormStepCard";
import LocationPicker from "../LocationPicker";
import { CustomDatePicker, CustomTimePicker } from "../DateTimePicker";
import PassengerStepper from "../PassengerStep";
import VehicleSummaryCard from "../VehicleCardSummary";
import FleetAvailabilityCard from "../FleetAvailabilityCard";
import PolicyNoticeCard from "../PolicyNoticeCard";

export default function NewBookingRequestPage() {
  usePageBreadcrumb([{ label: "Book a Car" }, { label: "New Request" }]);

  const [date, setDate] = useState("2026-09-01");
  const [time, setTime] = useState("09:00");

  return (
    <div>
      {/* Header */}
      <h1 className="text-5xl font-extrabold tracking-tight text-[#241608]">
        Reserve Vehicle
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500">
        Configure your logistics requirements. All requests are subject to
        executive approval workflow.
      </p>

      {/* Content grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          <FormStepCard number="01" variant="peach" title="TRAVEL INTENT">
            <LocationPicker />

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-slate-500">
                PURPOSE OF TRAVEL
              </label>
              <div className="relative">
                <select
                  defaultValue="Executive Board Meeting"
                  className="w-full appearance-none rounded-xl bg-slate-100 px-4 py-3.5 text-[15px] font-medium text-slate-700 focus:outline-none"
                >
                  <option>Executive Board Meeting</option>
                  <option>Client Visit</option>
                  <option>Airport Transfer</option>
                  <option>Site Inspection</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </FormStepCard>

          <FormStepCard number="02" variant="blue" title="SCHEDULING">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-slate-500">
                  DATE
                </label>
                <CustomDatePicker value={date} onChange={setDate} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-slate-500">
                  TIME
                </label>
                <CustomTimePicker value={time} onChange={setTime} />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-slate-500">
                  PASSENGERS
                </label>
                <PassengerStepper initial={1} min={1} max={12} />
              </div>
            </div>
          </FormStepCard>

          <FormStepCard number="03" variant="navy" title="LOGISTICS DETAILS">
            <textarea
              rows={4}
              placeholder="Additional requirements (e.g., luggage count, flight number, preferred chauffeur...)"
              className="w-full resize-none rounded-xl bg-slate-100 px-4 py-3.5 text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </FormStepCard>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 pt-2">
            <button
              type="button"
              className="text-sm font-extrabold tracking-wide text-parago-blue hover:underline"
            >
              SAVE DRAFT
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-parago-blue via-blue-600 to-indigo-700 px-8 py-4 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-105 active:scale-[0.99]"
            >
              SUBMIT REQUEST
            </button>
          </div>
        </form>

        {/* Right: live summary */}
        <aside className="space-y-6">
          <VehicleSummaryCard />
          <FleetAvailabilityCard />
          <PolicyNoticeCard />
        </aside>
      </div>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";

// --- CUSTOM DATE PICKER COMPONENT ---
export function CustomDatePicker({
  value,
  onChange,
}: {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value) : new Date();

  // Helper date calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatOutputDate = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const handleSelectDay = (day: number) => {
    const formatted = formatOutputDate(year, month, day);
    onChange(formatted);
    setIsOpen(false);
  };

  // Quick Presets
  const setQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const formatted = formatOutputDate(d.getFullYear(), d.getMonth(), d.getDate());
    onChange(formatted);
    setCurrentMonth(d);
    setIsOpen(false);
  };

  const formattedDisplay = value
    ? new Date(value).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Pilih Tanggal";

  const todayStr = formatOutputDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  return (
    <div ref={popoverRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-slate-100 px-4 py-3.5 transition-all hover:bg-white ${
          isOpen
            ? "border-parago-blue bg-white ring-2 ring-blue-100 shadow-md"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <CalendarIcon className="h-5 w-5 shrink-0 text-parago-blue" />
          <span className="truncate text-[15px] font-semibold text-slate-800">
            {formattedDisplay}
          </span>
        </div>
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-parago-blue">
          Date
        </span>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Quick Preset Buttons */}
          <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-parago-blue hover:text-white"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-parago-blue hover:text-white"
            >
              Besok
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(3)}
              className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-parago-blue hover:text-white"
            >
              +3 Hari
            </button>
          </div>

          {/* Month Header Navigation */}
          <div className="mb-3 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-bold text-slate-900">
              {monthNames[month]} {year}
            </p>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-bold text-slate-400">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatOutputDate(year, month, day);
              const isSelected = value === dateStr;
              const isToday = todayStr === dateStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    isSelected
                      ? "bg-parago-blue text-white font-bold shadow-md shadow-blue-500/30"
                      : isToday
                      ? "bg-blue-50 text-parago-blue font-bold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- CUSTOM TIME PICKER COMPONENT ---
export function CustomTimePicker({
  value,
  onChange,
}: {
  value: string; // HH:MM
  onChange: (time: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Popular time slots
  const POPULAR_SLOTS = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "19:00", "20:00",
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={popoverRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-slate-100 px-4 py-3.5 transition-all hover:bg-white ${
          isOpen
            ? "border-parago-blue bg-white ring-2 ring-blue-100 shadow-md"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Clock className="h-5 w-5 shrink-0 text-amber-500" />
          <span className="truncate text-[15px] font-semibold text-slate-800">
            {value || "09:00"} WIB
          </span>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
          Time
        </span>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
            <p className="text-xs font-bold tracking-wider text-slate-400">
              POPULAR TIME SLOTS
            </p>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>

          {/* Quick Time Slot Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {POPULAR_SLOTS.map((slot) => {
              const isSelected = value === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                      : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                >
                  {slot}
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>

          {/* Custom Native Input Option */}
          <div className="mt-3 border-t border-slate-100 pt-3">
            <label className="mb-1 block text-[11px] font-bold tracking-wide text-slate-400">
              CUSTOM TIME
            </label>
            <input
              type="time"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800 focus:border-parago-blue focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

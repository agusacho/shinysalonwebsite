"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookedSlots, BookedSlot } from "@/app/actions/bookings";

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];
const MONTHS_FULL_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

type Props = {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
  /** When true, clicking a slot redirects to /booking?date=...&time=... instead of calling onSelect */
  readOnly?: boolean;
};

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function CalendarPicker({ selectedDate, selectedTime, onSelect, readOnly = false }: Props) {
  const today = new Date();
  const [viewStart, setViewStart] = useState<Date>(() => getMonday(today));
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived date range for the current week view
  const endDate = new Date(viewStart);
  endDate.setDate(endDate.getDate() + 6);

  const startMonthKey = `${viewStart.getFullYear()}-${String(viewStart.getMonth() + 1).padStart(2, "0")}`;
  const endMonthKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`;

  const fetchSlots = useCallback(async (key1: string, key2: string) => {
    setLoading(true);
    setError(null);
    try {
      const slots1 = await getBookedSlots(key1);
      let slots2: BookedSlot[] = [];
      if (key1 !== key2) {
        slots2 = await getBookedSlots(key2);
      }
      const all = [...slots1, ...slots2];
      // deduplicate by date+time
      const unique = all.filter(
        (v, i, a) => a.findIndex(t => t.date === v.date && t.time === v.time) === i
      );
      setBookedSlots(unique);
    } catch {
      setError("Gagal memuat data jadwal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(startMonthKey, endMonthKey);
  }, [startMonthKey, endMonthKey, fetchSlots]);

  const prevWeek = () => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() - 7);
    setViewStart(d);
  };
  const nextWeek = () => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() + 7);
    setViewStart(d);
  };
  const jumpToToday = () => setViewStart(getMonday(new Date()));

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const todayStr = today.toISOString().split("T")[0];
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const isPastWeek = endDate < getMonday(today);

  // Header title
  const startM = MONTHS_FULL_ID[viewStart.getMonth()];
  const endM = MONTHS_FULL_ID[endDate.getMonth()];
  const headerTitle =
    viewStart.getMonth() === endDate.getMonth()
      ? `${startM} ${viewStart.getFullYear()}`
      : `${startM} – ${endM} ${endDate.getFullYear()}`;

  const handleCellClick = (dateStr: string, time: string) => {
    if (readOnly) {
      // In read-only mode (standalone Calendar page), redirect to booking with pre-filled params
      window.location.href = `/booking?date=${dateStr}&time=${encodeURIComponent(time)}`;
    } else {
      onSelect(dateStr, time);
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-gray-100 rounded-xl w-full"></div>
        <div className="h-96 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          {/* Today button */}
          <button
            onClick={jumpToToday}
            className="px-4 py-1.5 text-sm font-sans font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
          >
            Hari Ini
          </button>

          {/* Prev / Next */}
          <div className="flex items-center">
            <button
              onClick={prevWeek}
              disabled={isPastWeek}
              aria-label="Minggu sebelumnya"
              className="p-1.5 hover:bg-gray-100 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextWeek}
              aria-label="Minggu berikutnya"
              className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month / Year label */}
          <h2 className="text-lg font-semibold font-sans text-gray-800 flex items-center gap-2">
            {headerTitle}
            {loading && <Loader2 size={15} className="animate-spin text-gray-400" />}
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-sans text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#F3F2F1] border-l-4 border-[#A19F9D] inline-block" />
            Terpesan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#E8F5E9] border-l-4 border-[#66BB6A] inline-block" />
            Tersedia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block opacity-50" />
            Sudah Lewat
          </span>
        </div>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div className="text-center py-4 text-red-500 font-sans text-sm flex items-center justify-center gap-2">
          <span>{error}</span>
          <button
            onClick={() => fetchSlots(startMonthKey, endMonthKey)}
            className="underline text-gold-metallic"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Calendar Grid ── */}
      <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm custom-scrollbar">
        <div className="min-w-[780px]">

          {/* Header: day columns */}
          <div className="grid grid-cols-[72px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200">
            <div className="p-3 border-r border-gray-200 bg-gray-50" />
            {weekDays.map((date, i) => {
              const dateStr = date.toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={i}
                  className={cn(
                    "p-3 border-r border-gray-200 last:border-r-0 text-center flex flex-col items-center justify-center relative",
                    isToday ? "bg-pink-50" : isWeekend ? "bg-gray-50/60" : "bg-white"
                  )}
                >
                  {/* Today indicator bar */}
                  {isToday && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F06292] rounded-t-sm" />}

                  {/* Month label (only if 1st of month or today) */}
                  {(date.getDate() === 1 || isToday) && (
                    <span className={cn("text-[11px] font-sans", isToday ? "text-[#F06292]" : "text-gray-400")}>
                      {MONTHS_ID[date.getMonth()]}
                    </span>
                  )}
                  <span className={cn(
                    "text-2xl leading-tight font-sans",
                    isToday ? "text-[#F06292] font-bold" : "text-gray-700 font-normal"
                  )}>
                    {date.getDate()}
                  </span>
                  <span className={cn(
                    "text-[11px] font-sans font-medium",
                    isToday ? "text-[#F06292]" : "text-gray-400"
                  )}>
                    {DAY_NAMES_ID[date.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {TIMES.map((time) => {
            const [h, m] = time.split(":").map(Number);
            const slotMinutes = h * 60 + m;

            return (
              <div key={time} className="grid grid-cols-[72px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200 last:border-0">
                {/* Time label */}
                <div className="border-r border-gray-200 bg-gray-50 flex items-start justify-end pr-3 pt-2">
                  <span className="text-[11px] font-sans text-gray-400">{time}</span>
                </div>

                {/* Day cells */}
                {weekDays.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const slot = bookedSlots.find(s => s.date === dateStr && s.time === time);
                  const isBooked = !!slot;
                  const isPast =
                    dateStr < todayStr ||
                    (dateStr === todayStr && slotMinutes <= nowMinutes);
                  const isSelected = selectedDate === dateStr && selectedTime === time;
                  const disabled = isBooked || isPast;

                  return (
                    <div
                      key={dateStr}
                      onClick={() => !disabled && handleCellClick(dateStr, time)}
                      className={cn(
                        "border-r border-gray-200 last:border-r-0 h-16 relative group/cell transition-colors",
                        disabled ? "cursor-default" : "cursor-pointer",
                        isSelected ? "bg-pink-50" : isWeekend ? "bg-gray-50/40" : "bg-white",
                        !disabled && !isSelected && "hover:bg-green-50/60"
                      )}
                    >
                      {/* Booked Block */}
                      {isBooked && !isSelected && (
                        <div className="absolute top-1 bottom-1 left-1 right-1 rounded-sm border-l-[4px] border-[#A19F9D] bg-[#F3F2F1] p-1.5 overflow-hidden flex flex-col">
                          <span className="text-[11px] font-semibold font-sans text-[#605E5C] truncate">
                            {slot.service ? slot.service : "Terpesan"}
                          </span>
                          <span className="text-[10px] font-sans text-[#A19F9D]">{time}</span>
                        </div>
                      )}

                      {/* Selected Block */}
                      {isSelected && (
                        <div className="absolute top-1 bottom-1 left-1 right-1 rounded-sm border-l-[4px] border-[#F06292] bg-[#FCE4EC] p-1.5 overflow-hidden flex flex-col z-10 ring-1 ring-[#F8BBD0]">
                          <span className="text-[11px] font-semibold font-sans text-[#880E4F] truncate flex items-center gap-1">
                            Jadwal Anda ✓
                          </span>
                          <span className="text-[10px] font-sans text-[#C2185B]">{time}</span>
                        </div>
                      )}

                      {/* Available hover block */}
                      {!disabled && !isSelected && (
                        <div className="absolute top-1 bottom-1 left-1 right-1 rounded-sm border-l-[4px] border-transparent p-1.5 opacity-0 group-hover/cell:opacity-100 group-hover/cell:border-[#66BB6A] group-hover/cell:bg-[#E8F5E9] transition-all flex flex-col">
                          <span className="text-[11px] font-semibold font-sans text-[#388E3C]">
                            {readOnly ? "Klik untuk Booking" : "Pilih Jadwal"}
                          </span>
                          <span className="text-[10px] font-sans text-[#66BB6A]">{time}</span>
                        </div>
                      )}

                      {/* Past dimmed overlay */}
                      {isPast && !isBooked && (
                        <div className="absolute inset-0 bg-gray-100/60 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Selected confirmation (only in booking flow, not read-only) ── */}
      {!readOnly && selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-pink-50 border border-pink-200 rounded-xl flex items-center justify-center gap-2 text-sm font-sans text-charcoal font-medium shadow-sm"
        >
          <span>✅</span>
          <span>
            Jadwal dipilih:{" "}
            <strong>
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>{" "}
            pukul <strong>{selectedTime}</strong>
          </span>
        </motion.div>
      )}

      {/* Scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}

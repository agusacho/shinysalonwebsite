"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, CalendarDays, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookedSlots } from "@/app/actions/bookings";

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

type Props = {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
};

export function CalendarPicker({ selectedDate, selectedTime, onSelect }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusDate, setFocusDate] = useState<string | null>(selectedDate || null);

  const monthKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;

  const fetchSlots = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const slots = await getBookedSlots(key);
      setBookedSlots(slots);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(monthKey);
  }, [monthKey, fetchSlots]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setFocusDate(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setFocusDate(null);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = today.toISOString().split("T")[0];

  const getDateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getBookedTimesForDate = (dateStr: string) =>
    bookedSlots.filter(s => s.date === dateStr).map(s => s.time);

  const isFullyBooked = (dateStr: string) => {
    const booked = getBookedTimesForDate(dateStr);
    return booked.length >= TIMES.length;
  };

  const isPast = (dateStr: string) => dateStr < todayStr;

  const isToday = (dateStr: string) => dateStr === todayStr;

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const handleDayClick = (day: number) => {
    const dateStr = getDateStr(day);
    if (isPast(dateStr) && dateStr !== todayStr) return;
    if (isFullyBooked(dateStr)) return;
    setFocusDate(dateStr);
    // reset time
    onSelect(dateStr, "");
  };

  const handleTimeClick = (time: string) => {
    if (!focusDate) return;
    const booked = getBookedTimesForDate(focusDate);
    if (booked.includes(time)) return;
    onSelect(focusDate, time);
  };

  return (
    <div className="space-y-5">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button
            onClick={prevMonth}
            disabled={viewYear === today.getFullYear() && viewMonth <= today.getMonth()}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin text-gold-metallic" />}
            <h3 className="text-base font-serif font-semibold text-charcoal">
              {MONTHS_ID[viewMonth]} {viewYear}
            </h3>
          </div>

          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="text-center py-2 text-xs font-bold text-gray-400 font-sans">{d}</div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 p-3 gap-1">
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const dateStr = getDateStr(day);
            const past = isPast(dateStr) && !isToday(dateStr);
            const full = isFullyBooked(dateStr);
            const bookedCount = getBookedTimesForDate(dateStr).length;
            const isSelected = focusDate === dateStr;
            const hasBooking = bookedCount > 0;

            return (
              <motion.button
                key={dateStr}
                whileHover={!past && !full ? { scale: 1.08 } : {}}
                whileTap={!past && !full ? { scale: 0.95 } : {}}
                onClick={() => !past && handleDayClick(day)}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-sans transition-all",
                  past ? "opacity-30 cursor-not-allowed text-gray-400" :
                  full ? "bg-red-50 text-red-400 cursor-not-allowed border border-red-100" :
                  isSelected ? "bg-[#D4AF37] text-white shadow-md font-bold" :
                  isToday(dateStr) ? "border-2 border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37]/10" :
                  "hover:bg-peach-base/30 text-charcoal cursor-pointer"
                )}
              >
                <span>{day}</span>
                {/* Dot indicators */}
                {!past && !full && hasBooking && !isSelected && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(bookedCount, 3) }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-amber-400" />
                    ))}
                  </div>
                )}
                {full && !past && (
                  <span className="text-[9px] leading-tight text-red-400 font-medium">Penuh</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-5 pb-4 flex items-center gap-5 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#D4AF37]" /> Dipilih</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-300" /> Ada booking</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-200" /> Penuh</span>
        </div>
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {focusDate && (
          <motion.div
            key={focusDate}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <CalendarDays size={16} className="text-[#D4AF37]" />
              <h4 className="font-sans font-semibold text-charcoal text-sm">
                Pilih Jam — {new Date(focusDate + "T12:00:00").toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </h4>
            </div>

            <div className="p-4 grid grid-cols-4 gap-2">
              {TIMES.map(time => {
                const booked = getBookedTimesForDate(focusDate);
                const isBooked = booked.includes(time);
                const isPastTime = focusDate === todayStr && time <= `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
                const isSelected = selectedDate === focusDate && selectedTime === time;
                const disabled = isBooked || isPastTime;

                return (
                  <motion.button
                    key={time}
                    whileHover={!disabled ? { scale: 1.04 } : {}}
                    whileTap={!disabled ? { scale: 0.96 } : {}}
                    onClick={() => !disabled && handleTimeClick(time)}
                    className={cn(
                      "relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-sm font-sans transition-all",
                      disabled
                        ? isBooked
                          ? "bg-red-50 border-red-200 cursor-not-allowed"
                          : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-40"
                        : isSelected
                          ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md font-bold"
                          : "bg-green-50 border-green-200 hover:bg-green-100 text-green-800 cursor-pointer"
                    )}
                  >
                    <Clock size={13} className={cn(
                      "mb-1",
                      disabled ? isBooked ? "text-red-400" : "text-gray-300" :
                      isSelected ? "text-white" : "text-green-600"
                    )} />
                    <span className={cn(
                      "font-bold",
                      disabled ? isBooked ? "text-red-500" : "text-gray-400" :
                      isSelected ? "text-white" : "text-green-700"
                    )}>{time}</span>
                    {isBooked && (
                      <span className="text-[9px] text-red-400 mt-0.5 leading-tight">Terpesan</span>
                    )}
                    {!disabled && !isSelected && (
                      <span className="text-[9px] text-green-500 mt-0.5 leading-tight">Tersedia</span>
                    )}
                    {isSelected && (
                      <span className="text-[9px] text-white/80 mt-0.5 leading-tight">✓ Dipilih</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {selectedTime && selectedDate === focusDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-4 mb-4 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl flex items-center gap-2 text-sm font-sans text-[#a87c1f]"
              >
                <span>✅</span>
                <span>Jadwal dipilih: <strong>{new Date(focusDate + "T12:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</strong> pukul <strong>{selectedTime}</strong></span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!focusDate && (
        <p className="text-center text-sm text-gray-400 font-sans py-2">
          👆 Pilih tanggal pada kalender di atas untuk melihat slot waktu
        </p>
      )}
    </div>
  );
}

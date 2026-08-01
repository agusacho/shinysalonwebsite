"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookedSlots } from "@/app/actions/bookings";

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

type Props = {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
};

// Helper: Get Monday of the current week for a given date
function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function CalendarPicker({ selectedDate, selectedTime, onSelect }: Props) {
  const today = new Date();
  // Set initial view to the Monday of the current week
  const [viewStart, setViewStart] = useState<Date>(() => getMonday(today));
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const startMonthKey = `${viewStart.getFullYear()}-${String(viewStart.getMonth() + 1).padStart(2, "0")}`;
  const endDate = new Date(viewStart);
  endDate.setDate(endDate.getDate() + 6);
  const endMonthKey = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}`;

  const fetchSlots = useCallback(async (key1: string, key2: string) => {
    setLoading(true);
    try {
      const slots1 = await getBookedSlots(key1);
      let slots2: any[] = [];
      if (key1 !== key2) {
        slots2 = await getBookedSlots(key2);
      }
      
      // Deduplicate slots just in case
      const allSlots = [...slots1, ...slots2];
      const unique = allSlots.filter((v, i, a) => a.findIndex(t => (t.date === v.date && t.time === v.time)) === i);
      setBookedSlots(unique);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(startMonthKey, endMonthKey);
  }, [startMonthKey, endMonthKey, fetchSlots]);

  const prevWeek = () => {
    const newDate = new Date(viewStart);
    newDate.setDate(newDate.getDate() - 7);
    setViewStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(viewStart);
    newDate.setDate(newDate.getDate() + 7);
    setViewStart(newDate);
  };

  const jumpToToday = () => {
    setViewStart(getMonday(new Date()));
  };

  // Generate the 7 days of the currently viewed week
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(viewStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const todayStr = today.toISOString().split("T")[0];
  const currentHourMinutes = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

  // Header formatting (e.g., "September 2026" or "Sep - Okt 2026")
  const startMonthStr = MONTHS_ID[viewStart.getMonth()];
  const endMonthStr = MONTHS_ID[endDate.getMonth()];
  const headerTitle = startMonthStr === endMonthStr 
    ? `${startMonthStr} ${viewStart.getFullYear()}`
    : `${startMonthStr.slice(0, 3)} - ${endMonthStr.slice(0, 3)} ${endDate.getFullYear()}`;

  const isPastWeek = endDate < getMonday(today);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={prevWeek}
              disabled={isPastWeek}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button
              onClick={jumpToToday}
              className="px-3 py-1.5 text-sm font-medium font-sans text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
            >
              Hari Ini
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
          <h3 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
            <CalendarDays size={18} className="text-gold-metallic" />
            {headerTitle}
          </h3>
          {loading && <Loader2 size={16} className="animate-spin text-gold-metallic" />}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-sans text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-200" /> Kosong</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-100" /> Terpesan</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gold-metallic shadow-sm" /> Dipilih</span>
        </div>
      </div>

      {/* Grid Calendar (Scrollable horizontally) */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm custom-scrollbar">
        <div className="min-w-[750px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
            <div className="p-3 border-r border-gray-200 flex flex-col justify-end items-center pb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Jam</span>
            </div>
            {weekDays.map((date, i) => {
              const dateStr = date.toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              return (
                <div key={i} className={cn(
                  "p-3 border-r border-gray-200 last:border-r-0 text-center flex flex-col items-center justify-center",
                  isToday ? "bg-peach-base/20" : ""
                )}>
                  <div className={cn("text-xs font-sans mb-1", isToday ? "text-gold-metallic font-bold" : "text-gray-500")}>
                    {DAY_NAMES[date.getDay()]}
                  </div>
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-lg font-serif font-bold",
                    isToday ? "bg-gold-metallic text-white shadow-md" : "text-charcoal"
                  )}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="relative">
            {TIMES.map((time, rowIdx) => (
              <div key={time} className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 last:border-0 group">
                {/* Time Label */}
                <div className="p-3 text-xs font-sans font-semibold text-gray-500 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                  {time}
                </div>

                {/* Day Cells */}
                {weekDays.map((date, colIdx) => {
                  const dateStr = date.toISOString().split("T")[0];
                  
                  // Check Status
                  const isBooked = bookedSlots.some(s => s.date === dateStr && s.time === time);
                  const isPast = dateStr < todayStr || (dateStr === todayStr && time <= currentHourMinutes);
                  const isSelected = selectedDate === dateStr && selectedTime === time;
                  
                  const disabled = isBooked || isPast;

                  return (
                    <div 
                      key={`${dateStr}-${time}`} 
                      className={cn(
                        "p-1.5 border-r border-gray-100 last:border-r-0 h-16 transition-colors",
                        dateStr === todayStr ? "bg-peach-base/5" : ""
                      )}
                    >
                      <button
                        onClick={() => !disabled && onSelect(dateStr, time)}
                        disabled={disabled}
                        className={cn(
                          "w-full h-full rounded-lg flex flex-col items-center justify-center transition-all outline-none font-sans text-xs relative overflow-hidden",
                          isSelected 
                            ? "bg-gold-metallic text-white shadow-md ring-2 ring-gold-metallic ring-offset-1 font-bold"
                            : disabled
                              ? isBooked
                                ? "bg-red-50 border border-red-100 text-red-400 cursor-not-allowed"
                                : "bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                              : "bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-sm cursor-pointer"
                        )}
                      >
                        {isSelected && (
                          <motion.div layoutId="selected-indicator" className="absolute inset-0 bg-gold-metallic z-0 rounded-lg" />
                        )}
                        <span className="relative z-10">
                          {isSelected ? "Terpilih" : disabled ? (isBooked ? "Terpesan" : "Berlalu") : "Tersedia"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected Value Indicator */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg p-3 bg-peach-base/20 border border-peach-warm/30 rounded-xl flex items-center justify-center gap-2 text-sm font-sans text-charcoal font-medium shadow-sm"
        >
          <span>✨</span>
          <span>
            Jadwal dipilih: <strong>{new Date(selectedDate + "T12:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</strong> pukul <strong>{selectedTime}</strong>
          </span>
        </motion.div>
      )}

      {/* Add global css for custom scrollbar just for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}

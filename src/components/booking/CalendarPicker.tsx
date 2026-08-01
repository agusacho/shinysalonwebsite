"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookedSlots } from "@/app/actions/bookings";

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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

  const startMonthStr = MONTHS_ID[viewStart.getMonth()];
  const endMonthStr = MONTHS_ID[endDate.getMonth()];
  const headerTitle = startMonthStr === endMonthStr 
    ? `${startMonthStr} ${viewStart.getFullYear()}`
    : `${startMonthStr} - ${endMonthStr} ${endDate.getFullYear()}`;

  const isPastWeek = endDate < getMonday(today);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToToday}
              className="px-4 py-1.5 text-sm font-sans font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
            >
              Today
            </button>
            <div className="flex items-center">
              <button
                onClick={prevWeek}
                disabled={isPastWeek}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextWeek}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-sans text-gray-800 flex items-center gap-3">
            {headerTitle}
            {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
          </h3>
        </div>
      </div>

      {/* Grid Calendar (MS Teams Style) */}
      <div className="w-full overflow-x-auto bg-white border border-gray-200 shadow-sm custom-scrollbar">
        <div className="min-w-[800px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200">
            {/* Empty top-left cell */}
            <div className="p-3 border-r border-gray-200 bg-white" />
            
            {weekDays.map((date, i) => {
              const dateStr = date.toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              
              // Formatting like "Feb 22 Mon" if it's the first of the month or today, else "23 Tue"
              const isFirstOfMonth = date.getDate() === 1;
              const showMonth = isFirstOfMonth || isToday;

              return (
                <div key={i} className="p-3 border-r border-gray-200 last:border-r-0 text-center flex flex-col items-center justify-center bg-white relative">
                  {isToday && <div className="absolute top-0 left-0 right-0 h-1 bg-gold-metallic" />}
                  <div className={cn(
                    "flex items-baseline gap-1.5 font-sans",
                    isToday ? "text-gold-metallic" : "text-gray-600"
                  )}>
                    {showMonth && <span className="text-sm font-medium">{MONTHS_ID[date.getMonth()]}</span>}
                    <span className={cn("text-2xl", isToday ? "font-bold" : "font-normal")}>{date.getDate()}</span>
                    <span className="text-sm font-medium">{DAY_NAMES[date.getDay()]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="relative bg-[#FAFAFA]">
            {TIMES.map((time, rowIdx) => (
              <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200 last:border-0 group">
                {/* Time Label (Left Column) */}
                <div className="p-2 text-[11px] font-sans text-gray-500 border-r border-gray-200 bg-white flex items-start justify-end pr-3">
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
                        "border-r border-gray-200 last:border-r-0 h-16 transition-colors relative group/cell cursor-pointer",
                        dateStr === todayStr ? "bg-[#F3F2F1]/30" : "bg-white",
                        !disabled && !isSelected && "hover:bg-[#F3F2F1]"
                      )}
                      onClick={() => !disabled && onSelect(dateStr, time)}
                    >
                      {/* MS Teams Style Event Block */}
                      {(isBooked || isSelected) && (
                        <div className={cn(
                          "absolute top-1 bottom-1 left-1 right-2 rounded-sm border-l-[4px] p-1.5 flex flex-col overflow-hidden text-[11px] font-sans shadow-sm",
                          isSelected 
                            // Selected: Pink Metallic theme matching MS Teams block layout
                            ? "bg-[#FCE4EC] border-[#F06292] text-[#880E4F] z-10 ring-1 ring-[#F8BBD0]"
                            // Booked: Gray muted theme
                            : "bg-[#F3F2F1] border-[#A19F9D] text-[#605E5C]"
                        )}>
                          <div className="font-semibold truncate flex items-center justify-between">
                            {isSelected ? "Jadwal Anda" : "Terpesan"}
                            {isSelected && <span className="text-[#F06292]">✓</span>}
                          </div>
                          <span className="opacity-80 mt-0.5">{time} - {String(parseInt(time) + 1).padStart(2, '0')}:00</span>
                        </div>
                      )}
                      
                      {/* Hover block for empty available slots */}
                      {!disabled && !isSelected && (
                         <div className="absolute top-1 bottom-1 left-1 right-2 rounded-sm border-l-[4px] border-transparent p-1.5 opacity-0 group-hover/cell:opacity-100 group-hover/cell:bg-[#FCE4EC]/50 transition-all text-[11px] font-sans text-gray-500 flex flex-col">
                           <span className="font-semibold text-charcoal">Pilih Jadwal</span>
                         </div>
                      )}
                      
                      {/* Past indicator */}
                      {isPast && !isBooked && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-full border-t border-gray-200 border-dashed" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected Value Confirmation */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-peach-base/20 border border-peach-warm/30 rounded-xl flex items-center justify-center gap-2 text-sm font-sans text-charcoal font-medium shadow-sm"
        >
          <span>✅</span>
          <span>
            Jadwal reservasi: <strong>{new Date(selectedDate + "T12:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong> pukul <strong>{selectedTime}</strong>
          </span>
        </motion.div>
      )}

      {/* Global CSS for custom scrollbar */}
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

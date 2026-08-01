"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { getBookedSlots, BookedSlot } from "@/app/actions/bookings";

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_FULL_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

type Props = {
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
};

export function DropdownDateTimePicker({ selectedDate, selectedTime, onSelect }: Props) {
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 30 days
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const key1 = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      const key2 = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;

      const slots1 = await getBookedSlots(key1);
      let slots2: BookedSlot[] = [];
      if (key1 !== key2) {
        slots2 = await getBookedSlots(key2);
      }
      const all = [...slots1, ...slots2];
      
      const unique = all.filter(
        (v, i, a) => a.findIndex(t => t.date === v.date && t.time === v.time) === i
      );
      setBookedSlots(unique);
    } catch {
      setError("Gagal memuat ketersediaan jadwal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value, ""); // Reset time when date changes
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(selectedDate, e.target.value);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm font-sans flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchSlots} className="font-semibold underline">Coba Lagi</button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
          <CalendarIcon size={15} /> Pilih Tanggal
        </label>
        <div className="relative">
          <select
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gold-metallic font-sans bg-white appearance-none cursor-pointer"
          >
            <option value="" disabled>-- Pilih Tanggal --</option>
            {availableDates.map(date => {
              const dateStr = date.toISOString().split("T")[0];
              const label = `${DAY_NAMES_ID[date.getDay()]}, ${date.getDate()} ${MONTHS_FULL_ID[date.getMonth()]} ${date.getFullYear()}`;
              return (
                <option key={dateStr} value={dateStr}>
                  {label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
          <Clock size={15} /> Pilih Waktu {loading && <Loader2 size={12} className="animate-spin text-gold-metallic ml-2" />}
        </label>
        <div className="relative">
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            disabled={!selectedDate || loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gold-metallic font-sans bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <option value="" disabled>{selectedDate ? "-- Pilih Waktu --" : "Pilih tanggal terlebih dahulu"}</option>
            {selectedDate && TIMES.map(time => {
              const [h, m] = time.split(":").map(Number);
              const slotMinutes = h * 60 + m;

              const isBooked = bookedSlots.some(s => s.date === selectedDate && s.time === time);
              const isPast = selectedDate === todayStr && slotMinutes <= nowMinutes;
              const disabled = isBooked || isPast;

              let label = time;
              if (isBooked) label += " (Penuh)";
              else if (isPast) label += " (Sudah Lewat)";
              else label += " (Tersedia)";

              return (
                <option key={time} value={time} disabled={disabled}>
                  {label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import { DropdownDateTimePicker } from "@/components/booking/DropdownDateTimePicker";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const FloatingBooking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push(`/booking?date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gold-gradient shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center animate-bob text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Book Now"
      >
        <CalendarDays size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 md:p-8"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-serif text-charcoal font-bold mb-2">Cek Jadwal</h3>
                <p className="text-sm text-gray-500 font-sans">
                  Pilih tanggal dan waktu untuk melihat ketersediaan slot sebelum melakukan booking.
                </p>
              </div>

              <div className="mb-8">
                <DropdownDateTimePicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelect={(d, t) => {
                    setSelectedDate(d);
                    setSelectedTime(t);
                  }}
                />
              </div>

              <Button
                variant="pink-metallic"
                className="w-full"
                disabled={!selectedDate || !selectedTime}
                onClick={handleContinue}
              >
                Lanjutkan Booking
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

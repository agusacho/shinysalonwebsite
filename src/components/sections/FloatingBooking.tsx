"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import { DropdownDateTimePicker } from "@/components/booking/DropdownDateTimePicker";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createBrowserClient } from "@insforge/sdk/ssr";

export const FloatingBooking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && services.length === 0) {
      const fetchServices = async () => {
        setLoading(true);
        try {
          const client = createBrowserClient({
            baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
            anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
          });
          const { data } = await client.database.from("services").select("*");
          if (data) setServices(data);
        } catch (err) {
          console.error("Failed to load services", err);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [isOpen, services.length]);

  const groupedServices = services.reduce<Record<string, any[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  const handleContinue = () => {
    if (selectedService && selectedDate && selectedTime) {
      router.push(`/booking?service=${encodeURIComponent(selectedService)}&date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`);
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
                <h3 className="text-2xl font-serif text-charcoal font-bold mb-2">Cek Jadwal & Layanan</h3>
                <p className="text-sm text-gray-500 font-sans">
                  Pilih layanan, tanggal, dan waktu untuk melihat ketersediaan slot.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
                  Pilih Layanan
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-gold-metallic focus:border-gold-metallic block p-3 outline-none"
                  disabled={loading}
                >
                  <option value="">-- Pilih Layanan --</option>
                  {Object.entries(groupedServices).map(([cat, items]) => (
                    <optgroup label={cat} key={cat}>
                      {items.map(svc => (
                        <option key={svc.id || svc.name} value={svc.name}>
                          {svc.name} - Rp {svc.price.toLocaleString("id-ID")}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
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
                disabled={!selectedService || !selectedDate || !selectedTime}
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

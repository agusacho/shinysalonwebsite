"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CalendarPicker } from "@/components/booking/CalendarPicker";
import { Reveal } from "@/components/animations/Reveal";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />

      {/* ── Hero Header ── */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-600 text-sm font-sans px-4 py-1.5 rounded-full mb-6">
              <CalendarDays size={15} />
              Jadwal Real-Time
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">
              Ketersediaan Jadwal
            </h1>
            <p className="text-lg text-gray-500 font-sans max-w-xl mx-auto">
              Pantau slot yang tersedia dan yang sudah terpesan minggu ini.
              Klik pada slot <span className="text-green-600 font-medium">hijau</span> untuk langsung melakukan reservasi.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Calendar ── */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <Reveal delay={0.1}>
          <CalendarPicker
            selectedDate=""
            selectedTime=""
            onSelect={() => {}}
            readOnly={true}
          />
        </Reveal>
      </section>

      <FloatingBooking />
    </main>
  );
}

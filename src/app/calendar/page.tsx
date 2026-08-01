"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CalendarPicker } from "@/components/booking/CalendarPicker";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/animations/Reveal";
import { FloatingBooking } from "@/components/sections/FloatingBooking";

export default function CalendarPage() {
  const router = useRouter();

  const handleSelect = (date: string, time: string) => {
    // When a user clicks an available slot, redirect them to the booking page
    router.push('/booking');
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />
      <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">
              Ketersediaan Jadwal
            </h1>
            <p className="text-lg text-peach-deep font-sans">
              Pantau jadwal yang sudah terpesan dan temukan waktu kosong untuk Anda. Klik pada slot yang tersedia untuk mulai melakukan reservasi.
            </p>
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <div className="bg-white p-2 sm:p-6 rounded-2xl shadow-lg border border-peach-base/30">
             <CalendarPicker 
               selectedDate="" 
               selectedTime="" 
               onSelect={handleSelect} 
             />
          </div>
        </Reveal>
      </section>

      <FloatingBooking />
    </main>
  );
}

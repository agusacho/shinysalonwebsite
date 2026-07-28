"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export const FloatingBooking = () => {
  return (
    <Link href="/booking">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gold-gradient shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center animate-bob text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Book Now"
      >
        <CalendarDays size={28} />
      </motion.button>
    </Link>
  );
};

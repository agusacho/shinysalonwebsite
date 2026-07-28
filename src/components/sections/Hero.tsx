"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const textToType = "Luminous Elegance.".split("");

export const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background with Peach Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-peach-base/40 via-peach-warm/20 to-peach-base/60 mix-blend-multiply z-10" />
        {/* Placeholder for video - using a subtle animated gradient as fallback */}
        <div className="absolute inset-0 bg-off-white bg-gradient-to-tr from-peach-base/20 to-white z-0" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-peach-deep font-accent italic text-xl md:text-2xl mb-4"
        >
          Welcome to Shiny Salon
        </motion.p>
        
        <h1 className="text-5xl md:text-7xl font-serif text-charcoal font-bold leading-tight mb-8 min-h-[1.2em]">
          {textToType.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                delay: 1 + index * 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <Link href="/booking">
            <Button size="lg" className="animate-pulse-gold">
              Book an Appointment
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

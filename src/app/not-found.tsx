"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    // Trigger whimsical confetti burst
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4AF37", "#FADADD", "#D99058", "#FFFFFF"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4AF37", "#FADADD", "#D99058", "#FFFFFF"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-peach-base/20 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 text-gold-metallic/30"
      >
        <Sparkles size={64} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 text-gold-metallic/30"
      >
        <Sparkles size={48} />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
      >
        <h1 className="text-9xl font-serif text-charcoal font-bold drop-shadow-sm mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-sans text-peach-deep mb-6">Lost in Luxury</h2>
        <p className="text-gray-600 font-sans max-w-md mx-auto mb-10">
          The page you are looking for seems to have gracefully slipped away. 
          Let us guide you back to our world of elegance.
        </p>
        
        <Link href="/">
          <Button size="lg" className="animate-pulse-gold">
            Return to Salon
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

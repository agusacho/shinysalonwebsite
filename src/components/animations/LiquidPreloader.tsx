"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LiquidPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-peach-base"
        >
          {/* Animated Gold Blob */}
          <motion.div
            initial={{ scale: 0.8, borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
            animate={{
              scale: [0.8, 1.1, 0.9, 1],
              borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "50% 50% 20% 80% / 25% 80% 20% 75%",
                "50% 50% 50% 50% / 50% 50% 50% 50%", // Resolves to a circle
              ],
              rotate: [0, 90, 180, 360],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1],
            }}
            className="w-48 h-48 bg-gold-gradient shadow-[0_0_40px_rgba(212,175,55,0.6)] flex items-center justify-center"
          >
            {/* Logo Text that fades in as blob resolves */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-white font-serif text-4xl font-bold tracking-widest drop-shadow-md"
            >
              S
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

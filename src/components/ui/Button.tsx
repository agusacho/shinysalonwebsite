"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-sans overflow-hidden transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    
    const variants = {
      primary: "bg-charcoal text-white rounded-full hover:shadow-lg",
      secondary: "bg-peach-base text-charcoal rounded-full hover:bg-peach-warm",
      outline: "border-2 border-gold-metallic text-charcoal rounded-full hover:bg-gold-metallic/10",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-8 text-base",
      lg: "h-14 px-10 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {variant === "primary" && (
          <span className="absolute inset-0 z-0 bg-gold-gradient animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ backgroundSize: "200% auto" }} />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children as React.ReactNode}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { Reveal } from "@/components/animations/Reveal";

const timelineEvents = [
  { year: "2018", title: "The Beginning", description: "Shiny Salon was founded with a mission to bring premium salon experiences directly to your home." },
  { year: "2020", title: "Home Service Pioneer", description: "Focused our services to cater specifically to female students and young women in Bogor." },
  { year: "2023", title: "Luxury Redefined", description: "Expanded our treatment offerings, maintaining the opulent aesthetics our clients love." },
  { year: "2026", title: "Digital Flagship", description: "Launched our new digital experience, making booking your next home session seamless." },
];

const teamMembers = [
  { name: "Elena Rossi", role: "Master Stylist", image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=600&auto=format&fit=crop" },
  { name: "Marcus Chen", role: "Lead Colorist", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" },
  { name: "Sarah Jenkins", role: "Skincare Specialist", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop" },
];

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yTimeline = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacityTimeline = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative bg-peach-base/20">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-5xl md:text-6xl font-serif text-charcoal font-bold mb-6">Our Story</h1>
            <p className="text-xl text-peach-deep font-sans">
              Exclusive home service designed for female students and young women in Bogor.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Parallax Timeline */}
      <section ref={containerRef} className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gold-gradient opacity-30 -translate-x-1/2" />

          <motion.div style={{ y: yTimeline, opacity: opacityTimeline }} className="space-y-16">
            {timelineEvents.map((event, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1 w-full flex justify-end md:justify-start">
                  <div className={`w-full md:w-3/4 p-6 bg-white rounded-2xl shadow-sm border border-peach-base relative ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold-metallic ${index % 2 === 0 ? "-left-10 md:left-auto md:-right-10" : "-left-10 md:-left-10"}`} />
                    <h3 className="text-3xl font-serif text-gold-metallic mb-2">{event.year}</h3>
                    <h4 className="text-xl font-bold text-charcoal mb-2">{event.title}</h4>
                    <p className="text-gray-600 font-sans">{event.description}</p>
                  </div>
                </div>
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">Meet the Experts</h2>
              <p className="text-peach-deep font-sans">The artists behind the magic.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Reveal key={index} delay={index * 0.2}>
                <div className="group relative overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.image} alt={member.name} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-serif text-white mb-1">{member.name}</h3>
                    <p className="text-peach-warm font-sans">{member.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FloatingBooking />
    </main>
  );
}

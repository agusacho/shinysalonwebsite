"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";

const services = [
  {
    category: "Hair Services",
    items: [
      { id: "h1", name: "Potong + Cuci + Blow + Tonic + Vit", price: "40K", description: "Complete haircut package for a refreshed look." },
      { id: "h2", name: "Cuci + Blow + Tonic + Vit", price: "30K", description: "Refreshing wash and professional blowout." },
      { id: "h3", name: "Cuci + Catok + Tonic + Vit", price: "40K-50K", description: "Wash and flat iron styling for sleek straight hair." },
      { id: "h4", name: "Creambath + Blow + Tonic + Vit", price: "60K", description: "Deep conditioning creambath treatment." },
      { id: "h5", name: "Hair Mask + Blow + Tonic + Vit", price: "70K", description: "Intensive hair mask for damaged or dry hair." },
      { id: "h6", name: "Hair Spa + Blow + Tonic + Vit", price: "85K", description: "Luxurious spa treatment for ultimate hair rejuvenation." },
    ]
  },
  {
    category: "Keratin Treat",
    items: [
      { id: "k1", name: "Hair Mask Keratin + Blow + Tonic + Vit", price: "80K", description: "Keratin infused mask for smooth and manageable hair." },
      { id: "k2", name: "Smoothing Keratin Short", price: "300K-400K", description: "Keratin smoothing treatment for short hair." },
      { id: "k3", name: "Smoothing Keratin Medium", price: "400K-500K", description: "Keratin smoothing treatment for medium length hair." },
      { id: "k4", name: "Smoothing Keratin Long", price: "500K-600K", description: "Keratin smoothing treatment for long hair." },
      { id: "k5", name: "Filler Keratin", price: "350K-650K", description: "Keratin filler to restore hair strength and structure." },
    ]
  },
  {
    category: "Colouring",
    items: [
      { id: "c1", name: "Bleaching all Hair", price: "150K-300K", description: "Full hair bleaching process." },
      { id: "c2", name: "Colouring all Hair", price: "120K-300K", description: "Full hair coloring with premium dye." },
      { id: "c3", name: "Peakaboo or Highlight", price: "220K-450K", description: "Stylish peekaboo or highlight coloring techniques." },
      { id: "c4", name: "Ombre", price: "250K-500K", description: "Beautiful gradient ombre coloring." },
    ]
  }
];

const ServiceCard = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="bg-white border border-peach-base p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
    >
      <motion.div layout className="flex justify-between items-center">
        <h4 className="text-xl font-serif text-charcoal">{item.name}</h4>
        <div className="flex items-center gap-4">
          <span className="text-gold-metallic font-bold font-sans">{item.price}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="text-peach-deep" />
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600 font-sans">{item.description}</p>
            <div className="pt-4">
              <Button size="sm" variant="outline">Book This</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Services() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />
      
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-5xl md:text-6xl font-serif text-charcoal font-bold mb-6">Our Services</h1>
            <p className="text-xl text-peach-deep font-sans">
              Curated treatments designed to elevate and inspire.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 max-w-4xl mx-auto space-y-16">
        {services.map((category, index) => (
          <div key={index}>
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-3xl font-serif text-charcoal mb-8 pb-2 border-b-2 border-peach-base inline-block">
                {category.category}
              </h2>
            </Reveal>
            
            <div className="space-y-4">
              {category.items.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.1}>
                  <ServiceCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>

      <FloatingBooking />
    </main>
  );
}

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
    category: "Hair Styling",
    items: [
      { id: "h1", name: "Signature Blowout", price: "$65+", description: "A luxurious wash, relaxing scalp massage, and our signature voluminous blowout that lasts for days." },
      { id: "h2", name: "Balayage & Color", price: "$180+", description: "Custom hand-painted highlights tailored to enhance your natural beauty with a seamless grow-out." },
      { id: "h3", name: "Precision Cut", price: "$90+", description: "A bespoke haircut designed for your face shape, lifestyle, and hair texture." },
    ]
  },
  {
    category: "Skin Care",
    items: [
      { id: "s1", name: "Gold Radiance Facial", price: "$150", description: "Our 24k gold infused facial stimulates collagen and leaves your skin glowing with a youthful radiance." },
      { id: "s2", name: "Deep Cleansing", price: "$120", description: "A thorough extraction and purification process to reset and clarify congested skin." },
    ]
  },
  {
    category: "Nail Studio",
    items: [
      { id: "n1", name: "Luxe Spa Manicure", price: "$55", description: "Includes shaping, cuticle care, exfoliation, a hydrating massage, and premium polish application." },
      { id: "n2", name: "Gel Extensions", price: "$85", description: "Durable, natural-looking extensions meticulously sculpted for flawless length and shape." },
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

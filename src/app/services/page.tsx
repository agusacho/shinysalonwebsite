"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Clock, Loader2 } from "lucide-react";
import { createBrowserClient } from "@insforge/sdk/ssr";
import Link from "next/link";

type Service = {
  id: string;
  category: string;
  name: string;
  price_from: number;
  price_to: number | null;
  description: string | null;
  duration_minutes: number | null;
  is_active: boolean;
};

type GroupedServices = Record<string, Service[]>;

const formatPrice = (from: number, to: number | null): string => {
  const fmt = (n: number) => {
    if (n >= 1000000) return `${n / 1000000}Jt`;
    if (n >= 1000) return `${n / 1000}K`;
    return `${n}`;
  };
  return to ? `Rp ${fmt(from)}–${fmt(to)}` : `Rp ${fmt(from)}`;
};

const CATEGORY_ORDER = ["Hair Services", "Keratin Treat", "Colouring"];

const ServiceCard = ({ item }: { item: Service }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="bg-white border border-peach-base p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
    >
      <motion.div layout className="flex justify-between items-center gap-4">
        <h4 className="text-lg font-serif text-charcoal leading-tight">{item.name}</h4>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-gold-metallic font-bold font-sans text-sm">
            {formatPrice(item.price_from, item.price_to)}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="text-peach-deep" size={18} />
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
            <div className="pt-4 space-y-3">
              {item.description && (
                <p className="text-gray-600 font-sans text-sm">{item.description}</p>
              )}
              {item.duration_minutes && (
                <p className="flex items-center gap-1.5 text-sm text-peach-deep font-sans">
                  <Clock size={14} />
                  Estimasi {item.duration_minutes} menit
                </p>
              )}
              <Link href={`/booking?service=${encodeURIComponent(item.name)}`}>
                <Button size="sm" variant="outline" className="mt-1">
                  Book Layanan Ini
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-peach-base p-5 rounded-2xl animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-200 rounded w-3/5" />
      <div className="h-5 bg-gray-200 rounded w-16" />
    </div>
  </div>
);

export default function Services() {
  const [grouped, setGrouped] = useState<GroupedServices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = createBrowserClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    });

    client.database
      .from("services")
      .select("*")
      .eq("is_active", true)
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError("Gagal memuat data layanan. Silakan coba lagi.");
        } else {
          const result: GroupedServices = {};
          (data as Service[]).forEach((svc) => {
            if (!result[svc.category]) result[svc.category] = [];
            result[svc.category].push(svc);
          });
          setGrouped(result);
        }
        setLoading(false);
      });
  }, []);

  const categories = CATEGORY_ORDER.filter((cat) => grouped[cat]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />

      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-5xl md:text-6xl font-serif text-charcoal font-bold mb-4">
              Layanan Kami
            </h1>
            <p className="text-xl text-peach-deep font-sans">
              Perawatan rambut terbaik dengan harga terjangkau di Shiny Salon.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 max-w-4xl mx-auto space-y-16 pb-8">
        {error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-sans">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-gold-metallic underline font-sans text-sm"
            >
              Muat Ulang
            </button>
          </div>
        ) : loading ? (
          // Skeleton loader
          [1, 2, 3].map((cat) => (
            <div key={cat}>
              <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-gold-metallic" size={32} />
            <p className="text-gray-500 font-sans">Memuat layanan...</p>
          </div>
        ) : (
          categories.map((cat, index) => (
            <div key={cat}>
              <Reveal direction="up" delay={0.1}>
                <h2 className="text-3xl font-serif text-charcoal mb-8 pb-2 border-b-2 border-peach-base inline-block">
                  {cat}
                </h2>
              </Reveal>
              <div className="space-y-4">
                {grouped[cat].map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.08}>
                    <ServiceCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <FloatingBooking />
    </main>
  );
}

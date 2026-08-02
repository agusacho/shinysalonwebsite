"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { Reveal } from "@/components/animations/Reveal";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Hair Cuts", "Hair Stylist", "Coloring", "Smoothing"];

type GalleryItem = { id: number | string; category: string; src: string; };

export default function GalleryClient({ content }: { content: Record<string, string> }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems: GalleryItem[] = content.gallery_items ? JSON.parse(content.gallery_items) : [
    { id: 1, category: "Hair", src: content.gallery_image_1 || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" },
    { id: 2, category: "Skin", src: content.gallery_image_2 || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
    { id: 3, category: "Nails", src: content.gallery_image_3 || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
    { id: 4, category: "Hair", src: content.gallery_image_4 || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=800&auto=format&fit=crop" },
    { id: 5, category: "Skin", src: content.gallery_image_5 || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
    { id: 6, category: "Hair", src: content.gallery_image_6 || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop" },
  ];

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />
      
      <section className="pt-32 pb-12 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold mb-6">
              {content.gallery_title || "Gallery"}
            </h1>
            <p className="text-xl text-peach-deep font-sans mb-12">
              {content.gallery_subtitle || "A glimpse into our world of beauty and transformation."}
            </p>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full font-sans transition-colors border",
                    activeCategory === cat 
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-transparent text-charcoal border-peach-base hover:border-gold-metallic"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-2xl group"
                onClick={() => setSelectedImage(item.src)}
              >
                {item.src.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video 
                    src={item.src} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    muted loop autoPlay playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={item.src} 
                    alt={item.category} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gold-metallic transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            {selectedImage.match(/\.(mp4|webm|ogg)$/i) ? (
              <motion.video
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                controls autoPlay playsInline
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingBooking />
    </main>
  );
}

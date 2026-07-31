import React from "react";
import { LiquidPreloader } from "@/components/animations/LiquidPreloader";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { FloatingBooking } from "@/components/sections/FloatingBooking";
import { Reveal } from "@/components/animations/Reveal";
import { getContentBySection } from "@/app/actions/content";

export default async function Home() {
  const rawHero = await getContentBySection("Hero");
  const rawServices = await getContentBySection("Home_Services");
  const content = [...rawHero, ...rawServices].reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  return (
    <main className="min-h-screen bg-background relative">
      <LiquidPreloader />
      <Navbar />
      <Hero content={content} />
      
      <section className="py-24 px-6 bg-peach-base/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">{content.home_services_title || "Our Signature Services"}</h2>
              <p className="text-peach-deep font-sans max-w-2xl mx-auto">
                {content.home_services_subtitle || "Discover our curated selection of luxury treatments designed to elevate your natural beauty."}
              </p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: content.home_service_1_title || "Hair Services", desc: content.home_service_1_desc || "Potong, Cuci, Blow, Creambath, Hair Mask & Hair Treatment." },
              { title: content.home_service_2_title || "Keratin Treat", desc: content.home_service_2_desc || "Perawatan Keratin Smoothing dan Filler untuk rambut sehat berkilau." },
              { title: content.home_service_3_title || "Colouring", desc: content.home_service_3_desc || "Bleaching, Peakaboo, Highlight, dan Ombre dengan hasil memukau." }
            ].map((service, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-peach-base group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                  <h3 className="text-2xl font-serif text-charcoal mb-3 group-hover:text-gold-metallic transition-colors">{service.title}</h3>
                  <p className="text-gray-600 font-sans">{service.desc}</p>
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

"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { insforge } from "@/lib/insforge";
import { createBrowserClient } from "@insforge/sdk/ssr";
import { useEffect } from "react";

const steps = ["Service", "Stylist", "Date & Time", "Confirm"];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    service: "",
    stylist: "",
    date: "",
    time: "",
    name: "Guest",
    email: "guest@example.com",
    phone: "1234567890",
    userId: null as string | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const client = createBrowserClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    });
    client.auth.getCurrentUser().then(({ data, error }) => {
      if (!error && data?.user) {
        setSelections(s => ({
          ...s,
          name: data.user?.profile?.name || "Guest",
          email: data.user?.email || "guest@example.com",
          userId: data.user?.id || null
        }));
      }
    });
  }, []);

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      setIsSubmitting(true);
      const client = createBrowserClient({
        baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
        anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      });
      const { error } = await client.database.from('bookings').insert([{
        service_id: selections.service,
        date: selections.date,
        time: selections.time || "TBD",
        name: selections.name,
        email: selections.email,
        phone: selections.phone,
        user_id: selections.userId,
        stylist: selections.stylist
      }]);
      setIsSubmitting(false);

      if (error) {
        console.error("Booking error:", error);
        alert("Failed to confirm booking.");
        return;
      }

      // Final confirm
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#FADADD", "#D99058", "#FFFFFF"]
      });
      setCurrentStep(c => c + 1); // Move to success view
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {[
              "Potong+Cuci+Blow+Tonic+Vit", "Cuci+Blow+Tonic+Vit", "Cuci+Catok+Tonic+Vit",
              "Creambath+Blow+Tonic+Vit", "Hair Mask+Blow+Tonic+Vit", "Hair Spa+Blow+Tonic+Vit",
              "Hair Mask Keratin+Blow+Tonic+Vit", "Smoothing Keratin Short", "Smoothing Keratin Medium",
              "Smoothing Keratin Long", "Filler Keratin", "Bleaching all Hair", "Colouring all Hair", 
              "Peakaboo or Highlight", "Ombre"
            ].map(svc => (
              <div 
                key={svc}
                onClick={() => setSelections({...selections, service: svc})}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                  selections.service === svc ? "border-gold-metallic bg-gold-metallic/5" : "border-gray-200 bg-white"
                )}
              >
                <h4 className="font-sans font-medium text-charcoal">{svc}</h4>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Elena Rossi", "Marcus Chen", "Sarah Jenkins"].map(stylist => (
              <div 
                key={stylist}
                onClick={() => setSelections({...selections, stylist})}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md text-center",
                  selections.stylist === stylist ? "border-gold-metallic bg-gold-metallic/5" : "border-gray-200 bg-white"
                )}
              >
                <div className="w-16 h-16 bg-peach-base/40 rounded-full mx-auto mb-3 flex items-center justify-center font-serif text-xl text-gold-metallic">
                  {stylist.charAt(0)}
                </div>
                <h4 className="font-sans font-medium text-charcoal">{stylist}</h4>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Select Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic"
                onChange={(e) => setSelections({...selections, date: e.target.value})}
                value={selections.date}
              />
            </div>
            {selections.date && (
              <div className="grid grid-cols-3 gap-3">
                {["10:00 AM", "11:30 AM", "2:00 PM", "4:15 PM"].map(time => (
                  <div 
                    key={time} 
                    onClick={() => setSelections({...selections, time})}
                    className={cn(
                      "p-3 border rounded-lg text-center text-sm font-sans cursor-pointer hover:border-gold-metallic",
                      selections.time === time ? "border-gold-metallic bg-gold-metallic/5" : "border-gray-200"
                    )}>
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="bg-peach-base/20 p-6 rounded-2xl border border-peach-base/50">
            <h4 className="text-xl font-serif text-charcoal mb-4">Appointment Summary</h4>
            <div className="space-y-3 font-sans text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Service</span>
                <span className="font-medium text-charcoal">{selections.service || "Not selected"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Stylist</span>
                <span className="font-medium text-charcoal">{selections.stylist || "Not selected"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Date</span>
                <span className="font-medium text-charcoal">{selections.date || "Not selected"}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Time</span>
                <span className="font-medium text-charcoal">{selections.time || "Not selected"}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />
      
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">Book Your Experience</h1>
              <p className="text-lg text-peach-deep font-sans">Secure your moment of luxury.</p>
            </div>

            {currentStep < steps.length ? (
              <div className="bg-white rounded-3xl shadow-lg border border-peach-base p-6 md:p-10">
                {/* Progress Bar */}
                <div className="mb-10 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-100 z-0 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gold-gradient"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500",
                          index <= currentStep ? "bg-gold-metallic text-white" : "bg-white border-2 border-gray-200 text-gray-400"
                        )}>
                          {index < currentStep ? <Check size={16} /> : index + 1}
                        </div>
                        <span className="text-xs font-sans mt-2 text-gray-500 hidden md:block">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[250px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-serif text-charcoal mb-6">{steps[currentStep]}</h3>
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                    className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
                  >
                    <ChevronLeft size={18} /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : (currentStep === steps.length - 1 ? "Confirm Booking" : "Continue")} <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-peach-base p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-serif text-charcoal mb-4">You're All Set!</h2>
                <p className="text-gray-600 font-sans mb-8">
                  We've received your booking request for {selections.service}. A confirmation email has been sent to you.
                </p>
                <Button onClick={() => window.location.href = '/'}>Return Home</Button>
              </motion.div>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

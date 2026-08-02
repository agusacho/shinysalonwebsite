"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { insforge } from "@/lib/insforge";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact({ content }: { content: Record<string, string> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await insforge.database.from('contact_submissions').insert([{
      name: data.name,
      email: data.email,
      message: data.message
    }]);

    if (error) {
      console.error("Failed to submit contact form:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-24">
      <Navbar />
      
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal font-bold mb-6">
              {content.contact_title || "Get in Touch"}
            </h1>
            <p className="text-xl text-peach-deep font-sans whitespace-pre-wrap">
              {content.contact_subtitle || "We would love to hear from you. Book an appointment or simply say hello."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <Reveal direction="left" delay={0.1}>
              <div className="bg-white p-6 rounded-2xl border border-peach-base flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-peach-base/30 rounded-full text-gold-metallic">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal mb-1">Our Location</h3>
                  <p className="text-gray-600 font-sans whitespace-pre-wrap">
                    {content.contact_address || "Jalan Raya Padjajaran No. 54\nGedung Alumni IPB, Bogor"}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.2}>
              <div className="bg-white p-6 rounded-2xl border border-peach-base flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-peach-base/30 rounded-full text-gold-metallic">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal mb-1">Hours</h3>
                  <p className="text-gray-600 font-sans whitespace-pre-wrap">
                    {content.contact_hours || "Mon-Fri: 9am - 8pm\nSat: 10am - 6pm\nSun: Closed"}
                  </p>
                </div>
              </div>
            </Reveal>
            
            <Reveal direction="left" delay={0.3}>
              <div className="bg-white p-6 rounded-2xl border border-peach-base flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-peach-base/30 rounded-full text-gold-metallic">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal mb-1">Phone & Email</h3>
                  <p className="text-gray-600 font-sans whitespace-pre-wrap">
                    {content.contact_email || "hello@shinysalon.com"}<br/>
                    {"+62 858-1146-7467"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <Reveal direction="right" delay={0.2}>
            <div className="bg-white p-8 rounded-2xl border border-peach-base shadow-sm">
              <h3 className="text-2xl font-serif text-charcoal mb-6">Send a Message</h3>
              
              {isSubmitSuccessful ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-sans"
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                    <input 
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic transition-colors"
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                    <input 
                      {...register("email")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic transition-colors"
                      placeholder="jane@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
                    <textarea 
                      {...register("message")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic focus:ring-1 focus:ring-gold-metallic transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>

        </div>
        
        {/* Map Placeholder */}
        <Reveal delay={0.4}>
          <div className="mt-12 w-full h-96 bg-gray-100 rounded-2xl border border-peach-base overflow-hidden relative group flex items-center justify-center">
             <div className="text-gray-400 font-sans flex flex-col items-center gap-2">
               <MapPin size={48} />
               <span>Interactive Map Placeholder</span>
             </div>
             <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </div>
        </Reveal>
      </section>
    </main>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Check, ChevronRight, ChevronLeft, AlertCircle,
  User, Mail, Phone, Upload, X, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@insforge/sdk/ssr";
import { CalendarPicker } from "@/components/booking/CalendarPicker";
import { DropdownDateTimePicker } from "@/components/booking/DropdownDateTimePicker";
import { checkSlotAvailable } from "@/app/actions/bookings";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const steps = ["Service", "Stylist", "Date & Time", "Your Info", "Lampiran", "Konfirmasi"];

const STYLISTS = [{ name: "Shiny Team", initial: "S" }];
const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const isImage = (type: string) => type.startsWith("image/");

function BookingForm({ content }: { content: Record<string, string> }) {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialDate = searchParams.get("date") || "";
  const initialTime = searchParams.get("time") || "";

  let initialStep = 0;
  if (initialService) {
    initialStep = initialDate && initialTime ? 3 : 1;
  }

  const [dbServices, setDbServices] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selections, setSelections] = useState({
    service: initialService, stylist: initialDate && initialTime ? "Shiny Team" : "", 
    date: initialDate, time: initialTime,
    name: "", email: "", phone: "",
    userId: null as string | null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const client = createBrowserClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    });
    
    // Fetch user
    client.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setSelections(s => ({
          ...s,
          name: data.user?.profile?.name || "",
          email: data.user?.email || "",
          userId: data.user?.id || null,
        }));
      }
    });

    // Fetch active services
    client.database
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .then(({ data }) => {
        if (data) setDbServices(data);
      });
  }, []);

  const handleFile = (selected: File) => {
    setFileError("");
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("Format tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    setFile(selected);
    if (isImage(selected.type)) {
      const url = URL.createObjectURL(selected);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    setError("");
    switch (currentStep) {
      case 0: if (!selections.service) { setError("Silakan pilih layanan terlebih dahulu."); return false; } break;
      case 1: if (!selections.stylist) { setError("Silakan pilih stylist terlebih dahulu."); return false; } break;
      case 2:
        if (!selections.date) { setError("Silakan pilih tanggal."); return false; }
        if (!selections.time) { setError("Silakan pilih jam."); return false; }
        break;
      case 3:
        if (!selections.name.trim()) { setError("Nama tidak boleh kosong."); return false; }
        if (!selections.email.trim() || !/\S+@\S+\.\S+/.test(selections.email)) { setError("Masukkan email yang valid."); return false; }
        if (!selections.phone.trim() || selections.phone.length < 8) { setError("Masukkan nomor WhatsApp yang valid."); return false; }
        break;
    }
    return true;
  };

  const nextStep = async () => {
    if (!validate()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      // Submit
      setIsSubmitting(true);
      setSubmitError("");
      try {
        // 0. Double-booking check (race condition protection)
        const slotFree = await checkSlotAvailable(selections.date, selections.time);
        if (!slotFree) {
          setSubmitError(`Maaf! Slot ${selections.time} pada ${selections.date} baru saja dipesan oleh orang lain. Silakan pilih waktu lain.`);
          setCurrentStep(2); // bring user back to calendar
          setIsSubmitting(false);
          return;
        }

        const client = createBrowserClient({
          baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
          anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
        });

        // 1. Upload file if present
        let attachmentUrl: string | null = null;
        let attachmentKey: string | null = null;

        if (file) {
          const { data: uploadData, error: uploadError } = await client.storage
            .from("booking-attachments")
            .uploadAuto(file);

          if (uploadError) {
            setSubmitError("Gagal mengunggah file. Silakan coba lagi.");
            return;
          }
          attachmentKey = uploadData?.key ?? null;
          attachmentUrl = uploadData?.url ?? null;
        }

        // 2. Insert booking record
        const { error: insertError } = await client.database.from("bookings").insert([{
          service_id: selections.service,
          date: selections.date,
          time: selections.time,
          name: selections.name,
          email: selections.email,
          phone: selections.phone,
          user_id: selections.userId,
          stylist: selections.stylist,
          status: "pending",
          attachment_url: attachmentUrl,
          attachment_key: attachmentKey,
        }]);

        if (insertError) {
          console.error("Booking error:", insertError);
          setSubmitError("Gagal menyimpan booking. Silakan coba lagi.");
          return;
        }

        confetti({
          particleCount: 150, spread: 70, origin: { y: 0.6 },
          colors: ["#D4AF37", "#FADADD", "#D99058", "#FFFFFF"],
        });
        setCurrentStep(c => c + 1);
      } catch (e) {
        console.error(e);
        setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => { setError(""); if (currentStep > 0) setCurrentStep(c => c - 1); };

  const groupedServices = dbServices.reduce<Record<string, any[]>>((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});



  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
            {Object.entries(groupedServices).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-xs font-bold tracking-widest text-peach-deep uppercase mb-2">{cat}</p>
                <div className="space-y-2">
                  {items.map(svc => (
                    <div key={svc.name}
                      onClick={() => setSelections({ ...selections, service: svc.name })}
                      className={cn("flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                        selections.service === svc.name ? "border-gold-metallic bg-gold-metallic/5 shadow-md" : "border-gray-200 bg-white"
                      )}>
                      <h4 className="font-sans font-medium text-charcoal text-sm">{svc.name}</h4>
                      <span className={cn("font-bold font-sans text-sm ml-4 shrink-0",
                        selections.service === svc.name ? "text-gold-metallic" : "text-peach-deep")}>
                        Rp {Number(svc.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 gap-4">
            {STYLISTS.map(stylist => (
              <div key={stylist.name}
                onClick={() => setSelections({ ...selections, stylist: stylist.name })}
                className={cn("flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                  selections.stylist === stylist.name ? "border-gold-metallic bg-gold-metallic/5" : "border-gray-200 bg-white"
                )}>
                <div className="w-14 h-14 bg-peach-base/40 rounded-full flex items-center justify-center font-serif text-xl text-gold-metallic shrink-0">
                  {stylist.initial}
                </div>
                <div>
                  <h4 className="font-sans font-medium text-charcoal">{stylist.name}</h4>
                  <p className="text-sm text-gray-500">Tersedia untuk semua layanan</p>
                </div>
                {selections.stylist === stylist.name && <Check className="ml-auto text-gold-metallic" size={20} />}
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <DropdownDateTimePicker
            selectedDate={selections.date}
            selectedTime={selections.time}
            onSelect={(date, time) => setSelections({ ...selections, date, time })}
          />
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2"><User size={15} /> Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama lengkap" value={selections.name}
                onChange={e => setSelections({ ...selections, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic font-sans" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2"><Mail size={15} /> Alamat Email</label>
              <input type="email" placeholder="contoh@email.com" value={selections.email}
                onChange={e => setSelections({ ...selections, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic font-sans" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2"><Phone size={15} /> No. WhatsApp</label>
              <input type="tel" placeholder="085xxxxxxxxx" value={selections.phone}
                onChange={e => setSelections({ ...selections, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-metallic font-sans" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-sans">
              Unggah foto referensi gaya rambut atau dokumen pendukung lainnya (opsional). Format: JPG, PNG, WEBP, PDF. Maks 5MB.
            </p>

            {!file ? (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
                  isDragging ? "border-gold-metallic bg-gold-metallic/5" : "border-gray-200 hover:border-gold-metallic hover:bg-gray-50"
                )}
              >
                <Upload className="mx-auto mb-3 text-peach-deep" size={36} />
                <p className="font-sans font-medium text-charcoal">Klik atau seret file ke sini</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG, WEBP, PDF · Maks 5MB</p>
                <input ref={fileInputRef} type="file" className="hidden"
                  accept={ALLOWED_TYPES.join(",")}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            ) : (
              <div className="border border-peach-base rounded-2xl p-4 bg-white">
                <div className="flex items-start gap-4">
                  {filePreview ? (
                    <img src={filePreview} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-peach-base/20 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="text-peach-deep" size={32} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-charcoal truncate">{file.name}</p>
                    <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-gradient w-full rounded-full" />
                      </div>
                      <span className="text-xs text-green-500 font-sans shrink-0">Siap diunggah</span>
                    </div>
                  </div>
                  <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            {fileError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} /> {fileError}
              </div>
            )}

            <p className="text-xs text-gray-400 font-sans text-center">
              Langkah ini opsional — Anda bisa lewati jika tidak ada lampiran.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="bg-peach-base/20 p-6 rounded-2xl border border-peach-base/50">
            <h4 className="text-xl font-serif text-charcoal mb-4">Ringkasan Reservasi</h4>
            <div className="space-y-3 font-sans text-gray-700 text-sm">
              {[
                { label: "Layanan", value: selections.service },
                { label: "Stylist", value: selections.stylist },
                { label: "Tanggal", value: selections.date },
                { label: "Jam", value: selections.time },
                { label: "Nama", value: selections.name },
                { label: "Email", value: selections.email },
                { label: "WhatsApp", value: selections.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-charcoal text-right ml-4">{value || "—"}</span>
                </div>
              ))}

              {file && (
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-gray-500">Lampiran</span>
                  <div className="flex items-center gap-2 text-right">
                    {filePreview
                      ? <img src={filePreview} alt="att" className="w-8 h-8 object-cover rounded border" />
                      : <FileText size={16} className="text-peach-deep" />
                    }
                    <span className="font-medium text-charcoal text-sm truncate max-w-[140px]">{file.name}</span>
                  </div>
                </div>
              )}
            </div>

            {submitError && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} /> {submitError}
              </div>
            )}
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
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal font-bold mb-4">Buat Reservasi</h1>
              <p className="text-lg text-peach-deep font-sans">Jadwalkan momen kecantikan Anda bersama Shiny Salon.</p>
            </div>

            {currentStep < steps.length ? (
              <div className="bg-white rounded-3xl shadow-lg border border-peach-base p-6 md:p-10">
                {/* Progress */}
                <div className="mb-10 relative">
                  <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 z-0 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gold-gradient"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }} />
                  </div>
                  <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                          index < currentStep ? "bg-gold-metallic text-white scale-90" :
                          index === currentStep ? "bg-gold-metallic text-white scale-110 shadow-md" :
                          "bg-white border-2 border-gray-200 text-gray-400"
                        )}>
                          {index < currentStep ? <Check size={14} /> : index + 1}
                        </div>
                        <span className="text-xs font-sans mt-2 text-gray-500 hidden md:block">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={currentStep === 2 ? "overflow-y-auto max-h-[65vh]" : "min-h-[280px]"}>
                  <AnimatePresence mode="wait">
                    <motion.div key={currentStep}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}>
                      <h3 className="text-2xl font-serif text-charcoal mb-6">{steps[currentStep]}</h3>
                      {renderStepContent()}
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                          <AlertCircle size={16} /> {error}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}
                    className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}>
                    <ChevronLeft size={18} /> Kembali
                  </Button>
                  <Button variant="pink-metallic" onClick={nextStep} disabled={isSubmitting}>
                    {isSubmitting ? "Memproses..." : currentStep === steps.length - 1 ? "Konfirmasi Booking" : "Lanjut"}
                    {!isSubmitting && <ChevronRight size={18} />}
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg border border-peach-base p-12 text-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-serif text-charcoal mb-3">Reservasi Berhasil!</h2>
                <p className="text-gray-600 font-sans mb-2">
                  Terima kasih, <strong>{selections.name}</strong>! Pesanan untuk <strong>{selections.service}</strong> pada <strong>{selections.date}</strong> pukul <strong>{selections.time}</strong> telah kami terima.
                </p>
                {file && (
                  <p className="text-gray-500 font-sans text-sm mb-2">
                    Lampiran <strong>{file.name}</strong> berhasil diunggah. ✅
                  </p>
                )}
                
                <div className="my-8 p-6 bg-gold-metallic/5 border border-gold-metallic/20 rounded-xl">
                  <h3 className="font-serif text-lg text-charcoal mb-2">Langkah Terakhir: Konfirmasi via WhatsApp</h3>
                  <p className="text-sm text-gray-600 font-sans mb-4">
                    Mohon klik tombol di bawah ini untuk mengirim detail booking Anda ke Admin kami via WhatsApp.
                  </p>
                  <Button 
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md"
                    onClick={() => {
                      const adminPhone = "6285811467467";
                      const text = encodeURIComponent(`Halo Shiny Salon, saya ingin konfirmasi booking:\n\n*Nama:* ${selections.name}\n*Layanan:* ${selections.service}\n*Stylist:* ${selections.stylist}\n*Tanggal:* ${selections.date}\n*Jam:* ${selections.time}\n*No. HP:* ${selections.phone}\n*Email:* ${selections.email}\n\nTerima kasih!`);
                      window.open(`https://wa.me/${adminPhone}?text=${text}`, "_blank");
                    }}
                  >
                    Kirim ke WhatsApp Admin
                  </Button>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => window.location.href = "/my-bookings"}>Lihat Booking Saya</Button>
                  <Button variant="outline" onClick={() => window.location.href = "/"}>Kembali ke Beranda</Button>
                </div>
              </motion.div>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default function BookingClient({ content }: { content: Record<string, string> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-peach-base/5">
        <div className="animate-spin text-gold-metallic w-8 h-8 border-4 border-current border-t-transparent rounded-full" />
      </div>
    }>
      <BookingForm content={content} />
    </Suspense>
  );
}

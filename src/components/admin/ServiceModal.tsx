"use client";

import { useState, useTransition } from "react";
import { upsertService } from "@/app/admin/actions";
import { Loader2, Plus, X } from "lucide-react";

type Service = {
  id?: string;
  category?: string;
  name?: string;
  price_from?: number;
  price_to?: number | null;
  description?: string | null;
  duration_minutes?: number | null;
};

export function ServiceModal({
  service,
  triggerBtn,
}: {
  service?: Service;
  triggerBtn?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await upsertService(formData);
        setIsOpen(false);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menyimpan data");
      }
    });
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {triggerBtn || (
          <button className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg font-sans text-sm hover:bg-[#D4AF37] transition-colors">
            <Plus size={16} /> Tambah Layanan
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif text-[#2C2C2C]">
                {service ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {service?.id && <input type="hidden" name="id" value={service.id} />}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan *</label>
                  <input required name="name" defaultValue={service?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <select required name="category" defaultValue={service?.category || "Hair Services"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm bg-white">
                    <option value="Hair Services">Hair Services</option>
                    <option value="Keratin Treat">Keratin Treat</option>
                    <option value="Colouring">Colouring</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Mulai (Rp) *</label>
                  <input required type="number" name="price_from" defaultValue={service?.price_from}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sampai (Opsional)</label>
                  <input type="number" name="price_to" defaultValue={service?.price_to || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit)</label>
                  <input type="number" name="duration_minutes" defaultValue={service?.duration_minutes || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea name="description" defaultValue={service?.description || ""} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] font-sans text-sm resize-none" />
              </div>

              {error && <p className="text-red-500 text-sm font-sans">{error}</p>}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-sans hover:bg-gray-200">
                  Batal
                </button>
                <button type="submit" disabled={isPending}
                  className="px-4 py-2 bg-[#2C2C2C] text-white rounded-lg text-sm font-sans hover:bg-[#D4AF37] disabled:opacity-50 flex items-center gap-2">
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

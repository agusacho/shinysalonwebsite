import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { ServiceModal } from "@/components/admin/ServiceModal";
import { ServiceActions } from "@/components/admin/ServiceActions";
import { Clock, Scissors, Edit2 } from "lucide-react";

type Service = {
  id: string; category: string; name: string;
  price_from: number; price_to: number | null;
  description: string | null; duration_minutes: number | null;
  is_active: boolean;
};

export default async function ServicesTab() {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data } = await insforge.database
    .from("services")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  const services: Service[] = (data ?? []) as Service[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#2C2C2C] font-bold">Layanan</h1>
          <p className="text-gray-500 font-sans mt-1">Kelola daftar layanan salon dan harga</p>
        </div>
        <ServiceModal />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {services.length === 0 ? (
          <div className="py-16 text-center">
            <Scissors size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-sans">Belum ada layanan yang ditambahkan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left font-sans font-medium w-1/4">Nama Layanan</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Kategori</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Harga (Rp)</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Durasi</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Aktif</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-sans font-semibold text-[#2C2C2C]">{s.name}</p>
                      {s.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-sans text-gray-700">
                      {s.price_from.toLocaleString('id-ID')}
                      {s.price_to && ` - ${s.price_to.toLocaleString('id-ID')}`}
                    </td>
                    <td className="px-5 py-4">
                      {s.duration_minutes ? (
                        <p className="flex items-center gap-1.5 text-gray-500 text-xs font-sans">
                          <Clock size={13} /> {s.duration_minutes} mnt
                        </p>
                      ) : (
                        <span className="text-gray-300 text-xs font-sans">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <ServiceActions serviceId={s.id} isActive={s.is_active} />
                    </td>
                    <td className="px-5 py-4">
                      <ServiceModal 
                        service={s} 
                        triggerBtn={
                          <button className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                            <Edit2 size={16} />
                          </button>
                        } 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

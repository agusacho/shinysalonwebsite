import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Calendar, CheckCircle2, Clock, Users,
  TrendingUp, MessageSquare, Scissors, ArrowRight
} from "lucide-react";

type Booking = {
  id: string; service_id: string; date: string; time: string;
  name: string; email: string; status: string; created_at: string;
  stylist: string | null; attachment_url: string | null;
};

type Contact = {
  id: string; name: string; email: string; message: string; created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu", confirmed: "Dikonfirmasi",
  completed: "Selesai", cancelled: "Dibatalkan",
};

export default async function DashboardTab() {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const [bookingsRes, contactsRes, servicesRes] = await Promise.all([
    insforge.database.from("bookings").select("*").order("created_at", { ascending: false }),
    insforge.database.from("contact_submissions").select("*").order("created_at", { ascending: false }),
    insforge.database.from("services").select("id, is_active"),
  ]);

  const bookings: Booking[] = (bookingsRes.data ?? []) as Booking[];
  const contacts: Contact[] = (contactsRes.data ?? []) as Contact[];

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const activeServices = (servicesRes.data ?? []).filter((s: any) => s.is_active).length;
  const recentBookings = bookings.slice(0, 5);
  const recentContacts = contacts.slice(0, 3);

  // Booking per day (last 7 days)
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("id-ID", { weekday: "short" });
    days.push({ label, count: bookings.filter((b) => b.date === key).length });
  }
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#2C2C2C] font-bold">Dashboard</h1>
        <p className="text-gray-500 font-sans mt-1">Selamat datang di panel admin Shiny Salon</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Booking", value: total, icon: Calendar, color: "bg-purple-100 text-purple-600", border: "border-purple-200" },
          { label: "Menunggu", value: pending, icon: Clock, color: "bg-yellow-100 text-yellow-600", border: "border-yellow-200" },
          { label: "Dikonfirmasi", value: confirmed, icon: CheckCircle2, color: "bg-green-100 text-green-600", border: "border-green-200" },
          { label: "Selesai", value: completed, icon: TrendingUp, color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
        ].map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-3xl font-bold font-serif text-[#2C2C2C]">{value}</p>
              <p className="text-sm text-gray-500 font-sans">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-serif text-[#2C2C2C] font-semibold mb-6">Booking 7 Hari Terakhir</h2>
          <div className="flex items-end gap-3 h-36">
            {days.map(({ label, count }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-700">{count > 0 ? count : ""}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#D4AF37] to-[#f0d060] transition-all"
                  style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? "8px" : "2px", opacity: count > 0 ? 1 : 0.2 }} />
                <span className="text-xs text-gray-400 font-sans">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                <Scissors size={18} />
              </div>
              <p className="text-sm text-gray-500 font-sans">Layanan Aktif</p>
            </div>
            <p className="text-4xl font-bold font-serif text-[#2C2C2C]">{activeServices}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <p className="text-sm text-gray-500 font-sans">Pesan Masuk</p>
            </div>
            <p className="text-4xl font-bold font-serif text-[#2C2C2C]">{contacts.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-serif text-[#2C2C2C] font-semibold">Booking Terbaru</h2>
            <Link href="/admin?tab=bookings" className="text-sm text-[#D4AF37] hover:underline font-sans flex items-center gap-1">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-sans font-medium">Nama</th>
                <th className="px-6 py-3 text-left font-sans font-medium">Layanan</th>
                <th className="px-6 py-3 text-left font-sans font-medium">Tanggal</th>
                <th className="px-6 py-3 text-left font-sans font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 font-sans">Belum ada booking</td></tr>
              ) : recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-sans font-medium text-[#2C2C2C]">{b.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-sans max-w-[160px] truncate">{b.service_id}</td>
                  <td className="px-6 py-4 text-gray-500 font-sans">{b.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-serif text-[#2C2C2C] font-semibold">Pesan Terbaru</h2>
            <Link href="/admin?tab=contacts" className="text-sm text-[#D4AF37] hover:underline font-sans flex items-center gap-1">
              Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-400 font-sans text-sm">Belum ada pesan</p>
            ) : recentContacts.map((c) => (
              <div key={c.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <p className="font-sans font-semibold text-sm text-[#2C2C2C]">{c.name}</p>
                <p className="text-xs text-gray-400 font-sans mb-2">{c.email}</p>
                <p className="text-sm text-gray-600 font-sans line-clamp-2">{c.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

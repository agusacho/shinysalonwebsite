import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { BookingStatusUpdater } from "@/components/admin/BookingStatusUpdater";
import { Calendar, Clock, Paperclip, Phone, Mail } from "lucide-react";

type Booking = {
  id: string; service_id: string; date: string; time: string;
  name: string; email: string; phone: string; status: string;
  stylist: string | null; attachment_url: string | null;
  phone_number: string | null; created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const filterStatus = params.status ?? "all";
  const query = params.q ?? "";

  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  let dbQuery = insforge.database
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (filterStatus !== "all") {
    dbQuery = dbQuery.eq("status", filterStatus);
  }

  const { data } = await dbQuery;
  let bookings: Booking[] = (data ?? []) as Booking[];

  if (query) {
    const q = query.toLowerCase();
    bookings = bookings.filter(
      (b) => b.name?.toLowerCase().includes(q) || b.service_id?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q)
    );
  }

  const statuses = ["all", "pending", "confirmed", "completed", "cancelled"];
  const labels: Record<string, string> = {
    all: "Semua", pending: "Menunggu", confirmed: "Dikonfirmasi",
    completed: "Selesai", cancelled: "Dibatalkan",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#2C2C2C] font-bold">Manajemen Booking</h1>
        <p className="text-gray-500 font-sans mt-1">{bookings.length} booking ditemukan</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <a key={s} href={`/admin/bookings?status=${s}${query ? `&q=${query}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                filterStatus === s
                  ? "bg-[#D4AF37] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {labels[s]}
            </a>
          ))}
        </div>
        <form method="GET" action="/admin/bookings" className="ml-auto flex gap-2">
          <input type="hidden" name="status" value={filterStatus} />
          <input name="q" defaultValue={query} placeholder="Cari nama / layanan..."
            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-sans focus:outline-none focus:border-[#D4AF37] w-56" />
          <button type="submit"
            className="px-4 py-2 bg-[#2C2C2C] text-white rounded-full text-sm font-sans hover:bg-[#D4AF37] transition-colors">
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-sans">Tidak ada booking ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Pelanggan</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Layanan</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Jadwal</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Stylist</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Status</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Ubah Status</th>
                  <th className="px-5 py-3.5 text-left font-sans font-medium">Lampiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-sans font-semibold text-[#2C2C2C]">{b.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Mail size={11} /> {b.email}
                      </p>
                      {(b.phone || b.phone_number) && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone size={11} /> {b.phone || b.phone_number}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <p className="text-gray-700 font-sans leading-snug">{b.service_id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1.5 text-gray-700 font-sans">
                        <Calendar size={13} className="text-[#D4AF37]" /> {b.date}
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-500 text-xs font-sans mt-1">
                        <Clock size={13} className="text-[#D4AF37]" /> {b.time}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-sans">{b.stylist ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {labels[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <BookingStatusUpdater bookingId={b.id} currentStatus={b.status} />
                    </td>
                    <td className="px-5 py-4">
                      {b.attachment_url ? (
                        <a href={b.attachment_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#D4AF37] hover:underline text-xs font-sans">
                          <Paperclip size={13} /> Lihat
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs font-sans">—</span>
                      )}
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

import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Calendar, Clock, Paperclip, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

type Booking = {
  id: string;
  service_id: string;
  date: string;
  time: string;
  name: string;
  status: string;
  stylist: string | null;
  attachment_url: string | null;
  attachment_key: string | null;
  created_at: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };
  const labels: Record<string, string> = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${styles[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {labels[status] ?? status}
    </span>
  );
};

const isImage = (url: string) =>
  /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url);

export default async function MyBookingsPage() {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: bookings, error: dbError } = await insforge.database
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif text-charcoal font-bold">Booking Saya</h1>
            <p className="text-peach-deep font-sans mt-1">Riwayat dan jadwal reservasi Anda</p>
          </div>
          <Link href="/booking"
            className="bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-sans hover:bg-gold-metallic transition-colors">
            + Booking Baru
          </Link>
        </div>

        {dbError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-sans">
            Gagal memuat data: {dbError.message}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-5">
            {(bookings as Booking[]).map((booking) => (
              <div key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-peach-base overflow-hidden hover:shadow-md transition-shadow">
                {/* Main content */}
                <div className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-sans font-semibold text-charcoal">{booking.service_id}</h3>
                    {booking.stylist && (
                      <p className="text-sm text-gray-500 mt-0.5 font-sans">Stylist: {booking.stylist}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-peach-deep" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={15} className="text-peach-deep" /> {booking.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <StatusBadge status={booking.status} />
                    <span className="text-xs text-gray-400 font-sans">
                      {new Date(booking.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {/* Attachment section */}
                {booking.attachment_url && (
                  <div className="border-t border-peach-base/50 bg-peach-base/10 px-6 py-4">
                    <p className="text-xs font-bold tracking-wider text-peach-deep uppercase mb-3 flex items-center gap-1.5">
                      <Paperclip size={13} /> Lampiran
                    </p>
                    {isImage(booking.attachment_url) ? (
                      <div className="flex items-start gap-4">
                        <a href={booking.attachment_url} target="_blank" rel="noopener noreferrer"
                          className="block group relative">
                          <img
                            src={booking.attachment_url}
                            alt="Lampiran"
                            className="w-32 h-32 object-cover rounded-xl border border-peach-base shadow-sm group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                            <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </a>
                        <div>
                          <p className="text-sm font-sans text-charcoal font-medium">Foto Referensi</p>
                          <a href={booking.attachment_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-gold-metallic hover:underline font-sans flex items-center gap-1 mt-1">
                            Buka gambar penuh <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <a href={booking.attachment_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white border border-peach-base px-4 py-3 rounded-xl hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 bg-peach-base/30 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-peach-deep" />
                        </div>
                        <div>
                          <p className="text-sm font-sans font-medium text-charcoal">Dokumen Lampiran</p>
                          <p className="text-xs text-gray-400 font-sans group-hover:text-gold-metallic transition-colors">
                            Klik untuk membuka dokumen
                          </p>
                        </div>
                        <ExternalLink size={16} className="text-gray-400 ml-2 group-hover:text-gold-metallic transition-colors" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-peach-base text-center">
            <div className="w-16 h-16 bg-peach-base/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <Calendar size={28} className="text-peach-deep" />
            </div>
            <p className="text-gray-500 mb-2 text-lg font-sans">Belum ada reservasi.</p>
            <p className="text-gray-400 text-sm font-sans mb-8">Buat reservasi pertama Anda sekarang!</p>
            <Link href="/booking"
              className="inline-block bg-charcoal text-white px-8 py-3 rounded-full hover:bg-gold-metallic transition-colors shadow-md font-sans">
              Buat Reservasi
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

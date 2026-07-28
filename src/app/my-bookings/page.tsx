import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Calendar, Clock } from "lucide-react";

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
    <main className="min-h-screen bg-sand pt-32 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-charcoal mb-8">My Bookings</h1>
        
        {dbError ? (
          <p className="text-red-500">Failed to load bookings: {dbError.message}</p>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-peach-base flex justify-between items-center transition-all hover:shadow-md">
                <div>
                  <h3 className="text-xl font-sans font-semibold text-charcoal capitalize">{booking.service_id.replace('-', ' ')}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={16} /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> {booking.time}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold-metallic/10 text-gold-metallic border border-gold-metallic/20 capitalize">
                    {booking.status}
                  </span>
                  <span className="text-xs text-gray-400">Booked: {new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-peach-base text-center">
            <p className="text-gray-500 mb-6 text-lg">You don't have any bookings yet.</p>
            <a href="/booking" className="inline-block bg-charcoal text-white px-8 py-3 rounded-full hover:bg-gold-metallic transition-colors shadow-md">
              Book an Appointment
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

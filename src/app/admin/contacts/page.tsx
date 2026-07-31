import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { Mail, MessageSquare } from "lucide-react";

type Contact = {
  id: string; name: string; email: string;
  message: string; created_at: string;
};

export default async function AdminContactsPage() {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data } = await insforge.database
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const contacts: Contact[] = (data ?? []) as Contact[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#2C2C2C] font-bold">Pesan Kontak</h1>
        <p className="text-gray-500 font-sans mt-1">Daftar pesan dari form Hubungi Kami</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {contacts.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-sans">Belum ada pesan masuk</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contacts.map((c) => (
              <div key={c.id} className="p-6 hover:bg-[#FAFAFA] transition-colors flex flex-col md:flex-row gap-6">
                <div className="md:w-64 shrink-0">
                  <p className="font-sans font-semibold text-[#2C2C2C]">{c.name}</p>
                  <p className="text-sm text-gray-500 font-sans flex items-center gap-1.5 mt-1">
                    <Mail size={13} />
                    <a href={`mailto:${c.email}`} className="hover:text-[#D4AF37] hover:underline">
                      {c.email}
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 font-sans mt-2">
                    {new Date(c.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-700 font-sans text-sm whitespace-pre-wrap">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

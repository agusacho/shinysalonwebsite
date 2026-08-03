import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { Users, Mail } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export default async function CustomersTab() {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data } = await insforge.database
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const customers: Profile[] = (data ?? []) as Profile[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#2C2C2C] font-bold">Data Pelanggan</h1>
        <p className="text-gray-500 font-sans mt-1">Daftar akun pelanggan yang telah mendaftar di sistem</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-sans">Belum ada pelanggan terdaftar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama & Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Bergabung</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-[#2C2C2C]">{c.name || 'User'}</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <Mail size={13} />
                        <span>{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(c.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right font-mono">
                      {c.id.substring(0, 8)}...
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

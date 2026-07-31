import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data: { user }, error } = await insforge.auth.getCurrentUser();

  if (error || !user) redirect("/login");

  const adminEmailsRaw = process.env.ADMIN_EMAILS ?? "anisa.ardiansari@gmail.com";
  const adminEmails = adminEmailsRaw ? adminEmailsRaw.split(",").map((e) => e.trim().toLowerCase()) : [];
  const isAdmin = adminEmails.length > 0
    ? adminEmails.includes((user.email ?? "").toLowerCase())
    : true; // fallback: if no env set, allow any logged-in user

  if (!isAdmin) redirect("/");


  return (
    <div className="min-h-screen bg-[#F9F5F0] flex">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

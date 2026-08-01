"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Calendar, Scissors,
  MessageSquare, LogOut, ChevronRight, FileText, Briefcase, Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", tab: "dashboard", icon: LayoutDashboard },
  { label: "Bookings", tab: "bookings", icon: Calendar },
  { label: "Services", tab: "services", icon: Briefcase },
  { label: "Pesan Kontak", tab: "contacts", icon: MessageSquare },
  { label: "Web Content", tab: "content", icon: FileText },
  { label: "Settings", tab: "settings", icon: Settings },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#1C1C1E] flex flex-col shadow-2xl z-50">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#D4AF37] to-[#a87c1f] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-serif font-bold text-sm">S</span>
          </div>
          <div>
            <p className="text-white font-serif font-bold text-sm tracking-wide">SHINY SALON</p>
            <p className="text-[#D4AF37] text-xs font-sans">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ label, tab, icon: Icon }) => {
          const isActive = currentTab === tab;
          const href = tab === "dashboard" ? "/admin" : `/admin?tab=${tab}`;
          return (
            <Link key={tab} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-[#D4AF37] text-[#1C1C1E]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}>
              <Icon size={18} className="shrink-0" />
              <span className="font-sans text-sm font-medium">{label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
            <span className="text-[#D4AF37] text-xs font-bold uppercase">
              {userEmail.charAt(0)}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans truncate">{userEmail}</p>
        </div>
        <Link href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all group">
          <LogOut size={16} />
          <span className="font-sans text-sm">Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}

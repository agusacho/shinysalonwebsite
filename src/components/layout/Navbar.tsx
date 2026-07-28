"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { createBrowserClient } from "@insforge/sdk/ssr";
import { signOut } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const insforge = createBrowserClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    });
    
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (!error && data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-peach-base flex flex-col">
      <div className="bg-charcoal text-white text-xs text-center py-1.5 w-full flex items-center justify-center font-sans tracking-wider">
         SHINY SALON | WA: 085811467467
      </div>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-3 font-serif text-2xl tracking-widest text-gold-gradient font-bold">
          <Image src="/logo.png" alt="Shiny Salon Logo" width={48} height={48} className="object-contain drop-shadow-md" />
          SHINY SALON & SPA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link key={link.name} href={link.href} className="relative group text-charcoal hover:text-gold-metallic transition-colors">
              <span className="font-sans font-medium">{link.name}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-gradient transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-6 border-l pl-8 border-gray-200">
              <Link href="/my-bookings" className="text-sm font-medium hover:text-gold-metallic transition-colors">
                My Bookings
              </Link>
              <span className="text-sm font-medium flex items-center gap-2 text-charcoal">
                <User size={16} /> {user.profile?.name || user.email}
              </span>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
              <Link href="/login" className="text-sm font-medium hover:text-gold-metallic transition-colors">
                Log In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-charcoal text-white px-4 py-2 rounded-full hover:bg-gold-metallic transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-charcoal" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
        className="md:hidden overflow-hidden bg-background"
      >
        <div className="flex flex-col px-6 py-4 gap-4 border-b border-peach-base">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-sans text-charcoal hover:text-gold-metallic"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-px bg-gray-200 my-2" />
          
          {user ? (
            <>
              <span className="text-lg font-sans text-charcoal flex items-center gap-2">
                <User size={18} /> {user.profile?.name || user.email}
              </span>
              <Link href="/my-bookings" onClick={() => setIsOpen(false)} className="text-lg font-sans text-charcoal hover:text-gold-metallic">
                My Bookings
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="text-left text-lg font-sans text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-sans text-charcoal hover:text-gold-metallic">
                Log In
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="text-lg font-sans text-gold-metallic">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </header>
  );
};

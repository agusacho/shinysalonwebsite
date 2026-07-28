"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await register(formData);
    
    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-sand">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-charcoal mb-2">Create Account</h1>
          <p className="text-gray-500">Join Shiny Salon & Spa</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-metallic focus:border-transparent outline-none transition-all"
              placeholder="Jane Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-metallic focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-metallic focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-metallic font-medium hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

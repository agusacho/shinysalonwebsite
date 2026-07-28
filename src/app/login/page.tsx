"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);
    
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
          <h1 className="text-3xl font-serif text-charcoal mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your Shiny Salon account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-gold-metallic font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

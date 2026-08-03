"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

async function getAuthActions() {
  const cookieStore = await cookies();
  return createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const auth = await getAuthActions();
    const result = await auth.signInWithPassword({ email, password });
    
    if (result.error) {
      return { error: { message: result.error.message } };
    }
    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message || "Gagal masuk" } };
  }
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const auth = await getAuthActions();
    const result = await auth.signUp({ 
      email, 
      password,
      name 
    });
    
    if (result.error) {
      return { error: { message: result.error.message } };
    }
    return { success: true };
  } catch (err: any) {
    return { error: { message: err.message || "Gagal mendaftar" } };
  }
}

export async function signOut() {
  try {
    const auth = await getAuthActions();
    await auth.signOut();
    return { success: true };
} catch (err: any) {
    return { error: { message: err.message || "Gagal keluar" } };
  }
}

export async function signInWithGoogle(origin: string) {
  try {
    const cookieStore = await cookies();
    // We instantiate raw client to access .auth directly because getAuthActions only exposes wrappers
    // for password and sign up.
    const { createServerClient } = await import("@insforge/sdk/ssr");
    const insforge = createServerClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
      cookies: cookieStore,
    });

    const { data, error } = await insforge.auth.signInWithOAuth('google', {
      redirectTo: `${origin}/api/auth/callback`,
    });

    if (error) {
      return { error: { message: error.message } };
    }
    
    return { url: data?.url };
  } catch (err: any) {
    return { error: { message: err.message || "Gagal login Google" } };
  }
}

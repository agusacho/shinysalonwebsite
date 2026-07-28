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
  
  const auth = await getAuthActions();
  return await auth.signInWithPassword({ email, password });
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const auth = await getAuthActions();
  return await auth.signUp({ 
    email, 
    password,
    name 
  });
}

export async function signOut() {
  const auth = await getAuthActions();
  return await auth.signOut();
}

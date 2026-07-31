"use server";

import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { error } = await insforge.database
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function deleteService(serviceId: string) {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { error } = await insforge.database
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
}

export async function toggleServiceActive(serviceId: string, isActive: boolean) {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { error } = await insforge.database
    .from("services")
    .update({ is_active: isActive })
    .eq("id", serviceId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
}

export async function upsertService(formData: FormData) {
  const id = formData.get("id") as string | null;
  const category = formData.get("category") as string;
  const name = formData.get("name") as string;
  const price_from = parseInt(formData.get("price_from") as string, 10);
  const price_to_raw = formData.get("price_to") as string;
  const price_to = price_to_raw ? parseInt(price_to_raw, 10) : null;
  const description = formData.get("description") as string;
  const duration_minutes = parseInt(formData.get("duration_minutes") as string, 10);

  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  if (id) {
    const { error } = await insforge.database
      .from("services")
      .update({ category, name, price_from, price_to, description, duration_minutes })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await insforge.database
      .from("services")
      .insert([{ category, name, price_from, price_to, description, duration_minutes, is_active: true }]);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

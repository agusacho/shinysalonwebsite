"use server";

import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

export type BookedSlot = {
  date: string;
  time: string;
};

export async function getBookedSlots(month: string): Promise<BookedSlot[]> {
  // month format: "YYYY-MM"
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const startDate = `${month}-01`;
  // Get last day of month
  const [year, mon] = month.split("-").map(Number);
  const lastDay = new Date(year, mon, 0).getDate();
  const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await insforge.database
    .from("bookings")
    .select("date, time, status")
    .gte("date", startDate)
    .lte("date", endDate)
    .in("status", ["pending", "confirmed"]);

  if (error || !data) return [];

  return data.map((b: any) => ({ date: b.date, time: b.time }));
}

export async function checkSlotAvailable(date: string, time: string): Promise<boolean> {
  const cookieStore = await cookies();
  const insforge = createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });

  const { data } = await insforge.database
    .from("bookings")
    .select("id")
    .eq("date", date)
    .eq("time", time)
    .in("status", ["pending", "confirmed"]);

  return !data || data.length === 0;
}

"use server";

import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    cookies: cookieStore,
  });
}

// Fetch all content for a specific section
export async function getContentBySection(section: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("section", section);
    
  if (error) {
    console.error(`Error fetching content for ${section}:`, error);
    return [];
  }
  
  return data || [];
}

// Fetch all content grouped by section
export async function getAllContent() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("site_content")
    .select("*");
    
  if (error) {
    console.error("Error fetching all content:", error);
    return [];
  }
  
  return data || [];
}

// Update a specific content value
export async function updateContent(id: string, value: string) {
  const supabase = await getSupabase();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getCurrentUser();
  if (!user) return { error: "Unauthorized" };
  
  const adminEmailsRaw = process.env.ADMIN_EMAILS ?? "anisa.ardiansari@gmail.com";
  const adminEmails = adminEmailsRaw ? adminEmailsRaw.split(",").map(e => e.trim().toLowerCase()) : [];
  if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? "").toLowerCase())) {
    return { error: "Forbidden" };
  }

  const { error } = await supabase
    .from("site_content")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id);
    
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

// Upload a new image to storage and update content
export async function uploadImageAndUpdateContent(id: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  
  const supabase = await getSupabase();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getCurrentUser();
  if (!user) return { error: "Unauthorized" };
  
  const adminEmailsRaw = process.env.ADMIN_EMAILS ?? "anisa.ardiansari@gmail.com";
  const adminEmails = adminEmailsRaw ? adminEmailsRaw.split(",").map(e => e.trim().toLowerCase()) : [];
  if (adminEmails.length > 0 && !adminEmails.includes((user.email ?? "").toLowerCase())) {
    return { error: "Forbidden" };
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${id}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(filePath, file);
    
  if (uploadError) {
    return { error: uploadError.message };
  }
  
  const { data } = supabase.storage
    .from("site-assets")
    .getPublicUrl(filePath);
    
  const publicUrl = data.publicUrl;
  
  const { error: updateError } = await supabase
    .from("site_content")
    .update({ value: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", id);
    
  if (updateError) {
    return { error: updateError.message };
  }
  
  return { success: true, url: publicUrl };
}

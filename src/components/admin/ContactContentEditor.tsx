"use client";

import { useState } from "react";
import { upsertContent } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";

type ContentItem = {
  id: string;
  section: string;
  type: string;
  value: string;
};

export default function ContactContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const contentMap = initialContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  const [title, setTitle] = useState(contentMap["contact_title"] || "Get in Touch");
  const [subtitle, setSubtitle] = useState(contentMap["contact_subtitle"] || "We would love to hear from you. Book an appointment or simply say hello.");
  const [address, setAddress] = useState(contentMap["contact_address"] || "Jalan Raya Padjajaran No. 54\nGedung Alumni IPB, Bogor");
  const [hours, setHours] = useState(contentMap["contact_hours"] || "Mon-Fri: 9am - 8pm\nSat: 10am - 6pm\nSun: Closed");
  const [email, setEmail] = useState(contentMap["contact_email"] || "hello@shinysalon.com");
  
  const [loading, setLoading] = useState(false);

  const saveContact = async () => {
    setLoading(true);
    await upsertContent("contact_title", "Contact", "text", title);
    await upsertContent("contact_subtitle", "Contact", "text", subtitle);
    await upsertContent("contact_address", "Contact", "text", address);
    await upsertContent("contact_hours", "Contact", "text", hours);
    await upsertContent("contact_email", "Contact", "text", email);
    alert("Contact page content saved!");
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-12 bg-white">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Contact Page Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <textarea value={hours} onChange={e => setHours(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
              </div>
            </div>
          </div>
          <Button onClick={saveContact} disabled={loading}>Save Contact Section</Button>
        </div>
      </section>
    </div>
  );
}

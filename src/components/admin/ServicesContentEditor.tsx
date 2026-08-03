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

export default function ServicesContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const contentMap = initialContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  const [title, setTitle] = useState(contentMap["services_title"] || "Layanan Kami");
  const [subtitle, setSubtitle] = useState(contentMap["services_subtitle"] || "Kami menyediakan berbagai layanan kecantikan premium yang disesuaikan dengan kebutuhan Anda.");
  
  const [loading, setLoading] = useState(false);

  const saveServices = async () => {
    setLoading(true);
    await upsertContent("services_title", "Services", "text", title);
    await upsertContent("services_subtitle", "Services", "text", subtitle);
    alert("Services page content saved!");
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-12 bg-white">
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Services Page Text</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
            <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
          </div>
          <Button onClick={saveServices} disabled={loading}>Save Services Section</Button>
        </div>
      </section>
    </div>
  );
}

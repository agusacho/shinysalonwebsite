"use client";

import { useState } from "react";
import { upsertContent, uploadImageAndUpdateContent } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";

type ContentItem = {
  id: string;
  section: string;
  type: string;
  value: string;
};

const defaultGalleryItems = [
  { id: 1, category: "Hair Cuts", src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" },
  { id: 2, category: "Hair Stylist", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop" },
  { id: 3, category: "Coloring", src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
  { id: 4, category: "Smoothing", src: "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=800&auto=format&fit=crop" },
  { id: 5, category: "Hair Cuts", src: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" },
  { id: 6, category: "Hair Stylist", src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop" },
];

export default function GalleryContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const contentMap = initialContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  const [title, setTitle] = useState(contentMap["gallery_title"] || "Gallery");
  const [subtitle, setSubtitle] = useState(contentMap["gallery_subtitle"] || "A glimpse into our world of beauty and transformation.");
  
  const initialGallery = contentMap["gallery_items"] ? JSON.parse(contentMap["gallery_items"]) : defaultGalleryItems;
  const [gallery, setGallery] = useState(initialGallery);
  
  const [loading, setLoading] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  const saveHero = async () => {
    setLoading(true);
    await upsertContent("gallery_title", "Gallery", "text", title);
    await upsertContent("gallery_subtitle", "Gallery", "text", subtitle);
    alert("Header section saved!");
    setLoading(false);
  };

  const saveGallery = async () => {
    setLoading(true);
    await upsertContent("gallery_items", "Gallery", "json", JSON.stringify(gallery));
    alert("Gallery items saved!");
    setLoading(false);
  };

  const handleUploadGalleryImage = async (index: number, file: File) => {
    setUploadingImageIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadImageAndUpdateContent(`gallery_${Date.now()}`, formData);
    
    if (result.error) {
      alert(result.error);
    } else if (result.url) {
      const newGallery = [...gallery];
      newGallery[index].src = result.url;
      setGallery(newGallery);
      alert("Image uploaded. Remember to click Save Gallery!");
    }
    setUploadingImageIndex(null);
  };

  return (
    <div className="p-8 space-y-12 bg-white">
      {/* Hero Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Gallery Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
          </div>
          <Button onClick={saveHero} disabled={loading}>Save Header Section</Button>
        </div>
      </section>

      {/* Gallery Items Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-serif text-charcoal">Gallery Images</h2>
          <Button onClick={() => setGallery([{ id: Date.now(), category: "Hair", src: "" }, ...gallery])}>+ Add Image</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item: any, index: number) => (
            <div key={item.id} className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50 relative">
              <button onClick={() => setGallery(gallery.filter((_: any, i: number) => i !== index))} className="absolute top-2 right-2 text-red-500 text-sm hover:underline z-10 bg-white/80 px-2 rounded">Remove</button>
              
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative">
                {item.src ? (
                  item.src.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={item.src} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  ) : (
                    <img src={item.src} alt="Gallery" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">No Media</div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Upload New Media</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => { if(e.target.files?.[0]) handleUploadGalleryImage(index, e.target.files[0]) }} className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold-light file:text-gold-metallic" disabled={uploadingImageIndex === index} />
                  {uploadingImageIndex === index && <p className="text-xs text-gold-metallic mt-1">Uploading...</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select value={item.category} onChange={e => { const g = [...gallery]; g[index].category = e.target.value; setGallery(g); }} className="w-full px-2 py-2 rounded-md border text-sm">
                    <option value="Hair Cuts">Hair Cuts</option>
                    <option value="Hair Stylist">Hair Stylist</option>
                    <option value="Coloring">Coloring</option>
                    <option value="Smoothing">Smoothing</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={saveGallery} disabled={loading}>Save Gallery</Button>
      </section>
    </div>
  );
}

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

const defaultServices = [
  { title: "Hair Services", desc: "Potong, Cuci, Blow, Creambath, Hair Mask & Hair Treatment." },
  { title: "Keratin Treat", desc: "Perawatan Keratin Smoothing dan Filler untuk rambut sehat berkilau." },
  { title: "Colouring", desc: "Bleaching, Peakaboo, Highlight, dan Ombre dengan hasil memukau." }
];

export default function HomeContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const contentMap = initialContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  const [heroTitle, setHeroTitle] = useState(contentMap["hero_title"] || "Elevate Your Beauty at Home");
  const [heroSubtitle, setHeroSubtitle] = useState(contentMap["hero_subtitle"] || "Premium salon experience exclusively for young women and students in Bogor.");
  const [servicesTitle, setServicesTitle] = useState(contentMap["home_services_title"] || "Our Signature Services");
  const [servicesSubtitle, setServicesSubtitle] = useState(contentMap["home_services_subtitle"] || "Discover our curated selection of luxury treatments designed to elevate your natural beauty.");
  
  const initialServices = contentMap["home_services_list"] ? JSON.parse(contentMap["home_services_list"]) : defaultServices;
  const [services, setServices] = useState(initialServices);
  
  const [heroImages, setHeroImages] = useState([
    contentMap["hero_image_1"] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    contentMap["hero_image_2"] || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=800&auto=format&fit=crop",
    contentMap["hero_image_3"] || "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop"
  ]);

  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const saveHero = async () => {
    setLoading(true);
    await upsertContent("hero_title", "Hero", "text", heroTitle);
    await upsertContent("hero_subtitle", "Hero", "text", heroSubtitle);
    
    // Save hero images as well since they belong to Hero section
    await upsertContent("hero_image_1", "Hero", "image", heroImages[0]);
    await upsertContent("hero_image_2", "Hero", "image", heroImages[1]);
    await upsertContent("hero_image_3", "Hero", "image", heroImages[2]);
    
    alert("Hero section saved!");
    setLoading(false);
  };

  const saveServices = async () => {
    setLoading(true);
    await upsertContent("home_services_title", "Home_Services", "text", servicesTitle);
    await upsertContent("home_services_subtitle", "Home_Services", "text", servicesSubtitle);
    await upsertContent("home_services_list", "Home_Services", "json", JSON.stringify(services));
    alert("Home Services saved!");
    setLoading(false);
  };

  const handleUploadHeroImage = async (index: number, file: File) => {
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadImageAndUpdateContent(`hero_image_${index + 1}`, formData);
    
    if (result.error) {
      alert(result.error);
    } else if (result.url) {
      const newImages = [...heroImages];
      newImages[index] = result.url;
      setHeroImages(newImages);
      alert("Image uploaded. Make sure to Save Hero Section!");
    }
    setUploadingIndex(null);
  };

  return (
    <div className="p-8 space-y-12 bg-white">
      {/* Hero Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[80px]" />
          </div>
          
          <div className="pt-4">
            <h3 className="text-lg font-serif text-charcoal mb-4">Hero Images (Rotating)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="space-y-2 border p-3 rounded-xl bg-gray-50">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                    <img src={heroImages[idx]} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) handleUploadHeroImage(idx, e.target.files[0]) }} className="text-xs w-full" disabled={uploadingIndex === idx} />
                  {uploadingIndex === idx && <p className="text-xs text-gold-metallic">Uploading...</p>}
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={saveHero} disabled={loading}>Save Hero Section</Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Featured Services (Home)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input type="text" value={servicesTitle} onChange={e => setServicesTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
            <textarea value={servicesSubtitle} onChange={e => setServicesSubtitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[80px]" />
          </div>
          
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-serif text-charcoal">Service Cards</h3>
              <Button onClick={() => setServices([...services, { title: "", desc: "" }])} size="sm">+ Add Card</Button>
            </div>
            
            {services.map((svc: any, index: number) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl bg-gray-50 relative">
                <button onClick={() => setServices(services.filter((_: any, i: number) => i !== index))} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={svc.title} onChange={e => { const s = [...services]; s[index].title = e.target.value; setServices(s); }} className="w-full px-2 py-2 rounded-md border" />
                </div>
                <div className="flex-[2] space-y-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={svc.desc} onChange={e => { const s = [...services]; s[index].desc = e.target.value; setServices(s); }} className="w-full px-2 py-2 rounded-md border min-h-[60px]" />
                </div>
              </div>
            ))}
          </div>

          <Button onClick={saveServices} disabled={loading}>Save Home Services</Button>
        </div>
      </section>
    </div>
  );
}

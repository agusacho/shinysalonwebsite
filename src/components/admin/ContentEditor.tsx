"use client";

import { useState } from "react";
import { updateContent, uploadImageAndUpdateContent } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";
import AboutContentEditor from "./AboutContentEditor";
import HomeContentEditor from "./HomeContentEditor";
import GalleryContentEditor from "./GalleryContentEditor";
import ServicesContentEditor from "./ServicesContentEditor";
import ContactContentEditor from "./ContactContentEditor";

type ContentItem = {
  id: string;
  section: string;
  type: string;
  value: string;
  updated_at: string;
};

export default function ContentEditor({ initialSections }: { initialSections: Record<string, ContentItem[]> }) {
  const availableTabs = Object.keys(initialSections);
  const [activeTab, setActiveTab] = useState<string>(availableTabs.length > 0 ? availableTabs[0] : "");
  const [sections, setSections] = useState(initialSections);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleTextChange = (id: string, value: string) => {
    setSections(prev => {
      const next = { ...prev };
      const section = next[activeTab];
      const itemIndex = section.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        section[itemIndex] = { ...section[itemIndex], value };
      }
      return next;
    });
  };

  const saveText = async (id: string, value: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    const result = await updateContent(id, value);
    if (result.error) {
      alert(result.error);
    } else {
      alert("Content updated successfully!");
    }
    setLoading(prev => ({ ...prev, [id]: false }));
  };

  const uploadImage = async (id: string, file: File) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadImageAndUpdateContent(id, formData);
    
    if (result.error) {
      alert(result.error);
    } else if (result.url) {
      handleTextChange(id, result.url);
      alert("Image updated successfully!");
    }
    
    setLoading(prev => ({ ...prev, [id]: false }));
  };

  if (!activeTab) return <div className="p-8">No content sections found.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px]">
      <div className="w-full lg:w-64 bg-sand border-r border-gray-100 flex flex-col">
        {Object.keys(sections).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-left font-medium transition-colors ${activeTab === tab ? "bg-white text-gold-metallic border-l-4 border-gold-metallic" : "text-gray-600 hover:bg-white/50 border-l-4 border-transparent"}`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>
      
      <div className="flex-1 bg-white">
        {activeTab === "About" ? (
          <AboutContentEditor initialContent={sections["About"] || []} />
        ) : activeTab === "Home" || activeTab === "Hero" || activeTab === "Home_Services" ? (
          <HomeContentEditor initialContent={[...(sections["Hero"] || []), ...(sections["Home_Services"] || [])]} />
        ) : activeTab === "Gallery" ? (
          <GalleryContentEditor initialContent={sections["Gallery"] || []} />
        ) : activeTab === "Services" ? (
          <ServicesContentEditor initialContent={sections["Services"] || []} />
        ) : activeTab === "Contact" ? (
          <ContactContentEditor initialContent={sections["Contact"] || []} />
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-serif text-charcoal mb-6">{activeTab} Content</h2>
            
            <div className="space-y-8">
              {(sections[activeTab] || []).map(item => (
                <div key={item.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.id.replace(activeTab.toLowerCase() + "_", "").replace(/_/g, " ").toUpperCase()}
                  </label>
                  
                  {item.type === "text" ? (
                    <div className="flex gap-4 items-start">
                      {item.value.length > 50 ? (
                        <textarea 
                          value={item.value || ""}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-metallic focus:border-transparent outline-none transition-all min-h-[120px]"
                        />
                      ) : (
                        <input 
                          type="text"
                          value={item.value || ""}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-metallic focus:border-transparent outline-none transition-all"
                        />
                      )}
                      <Button 
                        onClick={() => saveText(item.id, item.value)}
                        disabled={loading[item.id]}
                      >
                        {loading[item.id] ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  ) : item.type === "image" ? (
                    <div className="flex gap-6 items-center">
                      {item.value && (
                        <img src={item.value} alt={item.id} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                      )}
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadImage(item.id, e.target.files[0]);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-light file:text-gold-metallic hover:file:bg-gold-metallic hover:file:text-white transition-colors"
                          disabled={loading[item.id]}
                        />
                        {loading[item.id] && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

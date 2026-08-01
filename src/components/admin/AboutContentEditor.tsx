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

const defaultTimeline = [
  { year: "2018", title: "The Beginning", description: "Shiny Salon was founded with a mission to bring premium salon experiences directly to your home." },
  { year: "2020", title: "Home Service Pioneer", description: "Focused our services to cater specifically to female students and young women in Bogor." },
  { year: "2023", title: "Luxury Redefined", description: "Expanded our treatment offerings, maintaining the opulent aesthetics our clients love." },
  { year: "2026", title: "Digital Flagship", description: "Launched our new digital experience, making booking your next home session seamless." }
];

const defaultTeam = [
  { name: "Elena Rossi", role: "Master Stylist", image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=600&auto=format&fit=crop" },
  { name: "Marcus Chen", role: "Lead Colorist", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" },
  { name: "Sarah Jenkins", role: "Skincare Specialist", image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop" }
];

export default function AboutContentEditor({ initialContent }: { initialContent: ContentItem[] }) {
  const contentMap = initialContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  const [title, setTitle] = useState(contentMap["about_title"] || "Our Story");
  const [desc1, setDesc1] = useState(contentMap["about_description_1"] || "Exclusive home service designed for female students and young women in Bogor.");
  
  const initialTimeline = contentMap["about_timeline"] ? JSON.parse(contentMap["about_timeline"]) : defaultTimeline;
  const initialTeam = contentMap["about_team"] ? JSON.parse(contentMap["about_team"]) : defaultTeam;

  const [timeline, setTimeline] = useState(initialTimeline);
  const [team, setTeam] = useState(initialTeam);
  
  const [loading, setLoading] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  const saveHero = async () => {
    setLoading(true);
    await upsertContent("about_title", "About", "text", title);
    await upsertContent("about_description_1", "About", "text", desc1);
    alert("Hero section saved!");
    setLoading(false);
  };

  const saveTimeline = async () => {
    setLoading(true);
    await upsertContent("about_timeline", "About", "json", JSON.stringify(timeline));
    alert("Timeline saved!");
    setLoading(false);
  };

  const saveTeam = async () => {
    setLoading(true);
    await upsertContent("about_team", "About", "json", JSON.stringify(team));
    alert("Team saved!");
    setLoading(false);
  };

  const handleUploadTeamImage = async (index: number, file: File) => {
    setUploadingImageIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    
    // Upload image but don't bind it to a DB content directly. 
    // We'll use a dummy ID to get the URL back.
    const result = await uploadImageAndUpdateContent(`team_${Date.now()}`, formData);
    
    if (result.error) {
      alert(result.error);
    } else if (result.url) {
      const newTeam = [...team];
      newTeam[index].image = result.url;
      setTeam(newTeam);
      alert("Image uploaded. Remember to click Save Team!");
    }
    setUploadingImageIndex(null);
  };

  return (
    <div className="p-8 space-y-12 bg-white">
      {/* Hero Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-charcoal border-b pb-2">Hero Text</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
            <textarea value={desc1} onChange={e => setDesc1(e.target.value)} className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-gold-metallic min-h-[100px]" />
          </div>
          <Button onClick={saveHero} disabled={loading}>Save Hero Section</Button>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-serif text-charcoal">Timeline Events</h2>
          <Button onClick={() => setTimeline([...timeline, { year: "", title: "", description: "" }])}>+ Add Event</Button>
        </div>
        <div className="space-y-6">
          {timeline.map((event: any, index: number) => (
            <div key={index} className="flex gap-4 p-4 border rounded-xl bg-gray-50 relative">
              <button onClick={() => setTimeline(timeline.filter((_: any, i: number) => i !== index))} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                <input type="text" value={event.year} onChange={e => { const t = [...timeline]; t[index].year = e.target.value; setTimeline(t); }} className="w-full px-2 py-2 rounded-md border" />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={event.title} onChange={e => { const t = [...timeline]; t[index].title = e.target.value; setTimeline(t); }} className="w-full px-2 py-2 rounded-md border" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={event.description} onChange={e => { const t = [...timeline]; t[index].description = e.target.value; setTimeline(t); }} className="w-full px-2 py-2 rounded-md border text-sm min-h-[60px]" />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={saveTimeline} disabled={loading}>Save Timeline</Button>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-serif text-charcoal">Team Members</h2>
          <Button onClick={() => setTeam([...team, { name: "", role: "", image: "" }])}>+ Add Member</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member: any, index: number) => (
            <div key={index} className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50 relative">
              <button onClick={() => setTeam(team.filter((_: any, i: number) => i !== index))} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
              <div className="flex gap-4 items-center">
                {member.image && <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border" />}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Upload Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) handleUploadTeamImage(index, e.target.files[0]) }} className="text-sm w-full" disabled={uploadingImageIndex === index} />
                  {uploadingImageIndex === index && <p className="text-xs text-gold-metallic">Uploading...</p>}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={member.name} onChange={e => { const t = [...team]; t[index].name = e.target.value; setTeam(t); }} className="w-full px-2 py-2 rounded-md border" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role / Title</label>
                  <input type="text" value={member.role} onChange={e => { const t = [...team]; t[index].role = e.target.value; setTeam(t); }} className="w-full px-2 py-2 rounded-md border" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={saveTeam} disabled={loading}>Save Team</Button>
      </section>

    </div>
  );
}

import { getAllContent } from "@/app/actions/content";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function ContentTab() {
  const allContent = await getAllContent();

  // Group content by section
  const sections: Record<string, any[]> = {
    Home: [],
    About: [],
    Gallery: [],
    Contact: []
  };
  
  for (const item of allContent) {
    // Map Hero and Home_Services to Home for simplicity in the sidebar
    const tabName = item.section === "Hero" || item.section === "Home_Services" ? "Home" : item.section;
    if (!sections[tabName]) {
      sections[tabName] = [];
    }
    sections[tabName].push(item);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-charcoal mb-2">Web Content</h1>
        <p className="text-gray-500">Edit text and images across your website</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ContentEditor initialSections={sections} />
      </div>
    </div>
  );
}

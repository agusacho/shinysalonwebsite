import { getAllContent } from "@/app/actions/content";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function ContentTab() {
  const allContent = await getAllContent();

  // Group content by section
  const sections: Record<string, any[]> = {};
  for (const item of allContent) {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push(item);
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

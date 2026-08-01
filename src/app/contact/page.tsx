import { getContentBySection } from "@/app/actions/content";
import ContactClient from "./ContactClient";

export default async function Contact() {
  const rawContent = await getContentBySection("Contact");
  const content = rawContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  return <ContactClient content={content} />;
}

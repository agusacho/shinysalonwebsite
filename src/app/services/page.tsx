import { getContentBySection } from "@/app/actions/content";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  const rawContent = await getContentBySection("Services");
  const content = rawContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {});

  return <ServicesClient content={content} />;
}

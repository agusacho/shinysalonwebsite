import { getContentBySection } from "@/app/actions/content";
import AboutClient from "./AboutClient";

export default async function About() {
  const rawContent = await getContentBySection("About");
  const content = rawContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {});

  return <AboutClient content={content} />;
}

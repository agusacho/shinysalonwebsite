import { getContentBySection } from "@/app/actions/content";
import GalleryClient from "./GalleryClient";

export default async function Gallery() {
  const rawContent = await getContentBySection("Gallery");
  const content = rawContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {});

  return <GalleryClient content={content} />;
}

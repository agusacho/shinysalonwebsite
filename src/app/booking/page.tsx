import { getContentBySection } from "@/app/actions/content";
import BookingClient from "./BookingClient";

export default async function Booking() {
  const rawContent = await getContentBySection("Contact");
  const content = rawContent.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {} as Record<string, string>);

  return <BookingClient content={content} />;
}

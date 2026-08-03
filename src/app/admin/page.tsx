import DashboardTab from "@/components/admin/DashboardTab";
import BookingsTab from "@/components/admin/BookingsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import ContactsTab from "@/components/admin/ContactsTab";
import ContentTab from "@/components/admin/ContentTab";
import CustomersTab from "@/components/admin/CustomersTab";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentTab = params.tab || "dashboard";

  return (
    <>
      {currentTab === "dashboard" && <DashboardTab />}
      {currentTab === "bookings" && (
        <BookingsTab searchParams={{ status: params.status, q: params.q }} />
      )}
      {currentTab === "services" && <ServicesTab />}
      {currentTab === "customers" && <CustomersTab />}
      {currentTab === "contacts" && <ContactsTab />}
      {currentTab === "content" && <ContentTab />}
    </>
  );
}

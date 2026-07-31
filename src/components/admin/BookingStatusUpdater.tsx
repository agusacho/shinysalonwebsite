"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/app/admin/actions";
import { Loader2 } from "lucide-react";

const statuses = [
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export function BookingStatusUpdater({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, newStatus);
      } catch (err) {
        console.error("Gagal update status", err);
        alert("Gagal update status booking");
      }
    });
  };

  return (
    <div className="relative flex items-center">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs font-sans border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] disabled:opacity-50 appearance-none pr-8 bg-white"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        {isPending ? (
          <Loader2 size={12} className="animate-spin text-[#D4AF37]" />
        ) : (
          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        )}
      </div>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { toggleServiceActive, deleteService } from "@/app/admin/actions";
import { Loader2, Trash2 } from "lucide-react";

export function ServiceActions({
  serviceId,
  isActive,
}: {
  serviceId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleServiceActive(serviceId, !isActive);
      } catch (err) {
        alert("Gagal update status layanan");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Yakin ingin menghapus layanan ini secara permanen?")) return;
    startTransition(async () => {
      try {
        await deleteService(serviceId);
      } catch (err) {
        alert("Gagal menghapus layanan");
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
          isActive ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Hapus Layanan"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}

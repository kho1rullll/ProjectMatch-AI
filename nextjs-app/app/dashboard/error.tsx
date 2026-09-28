// app/dashboard/error.tsx — Error Boundary khusus segmen /dashboard
// Wajib "use client" karena error.tsx selalu berupa Client Component
// (menangani reset() interaktif dari React Error Boundary).
"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl bg-[#FFF2EE] border border-[#C95D36]/40">
      <h3 className="text-sm font-bold text-[#C95D36]">Gagal memuat data dashboard</h3>
      <p className="text-xs text-slate-600 mt-1">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-3 text-xs font-bold text-white bg-[#C95D36] px-3 py-1.5 rounded-lg"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}

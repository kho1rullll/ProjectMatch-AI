// app/dashboard/error.tsx — Error Boundary khusus segmen /dashboard
// Wajib "use client" karena error.tsx selalu berupa Client Component
// (menangani reset() interaktif dari React Error Boundary).
'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-200 shadow-xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Gagal Memuat Data Dashboard</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {error.message || 'Terjadi gangguan konektivitas atau sesi telah berakhir.'}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Muat Ulang</span>
        </button>
      </div>
    </div>
  );
}

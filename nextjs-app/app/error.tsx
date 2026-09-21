'use client';

// app/error.tsx — Root Global Error Boundary (Modul 6)
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ProjectMatch AI Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-black text-slate-900 font-display">
          Terjadi Gangguan pada Sistem
        </h2>
        <p className="text-xs text-slate-600">
          {error.message || 'Aplikasi mengalami kesalahan tak terduga. Silakan coba muat ulang halaman.'}
        </p>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => reset()}
          className="cursor-pointer"
        >
          Coba Muat Ulang
        </Button>
      </div>
    </div>
  );
}

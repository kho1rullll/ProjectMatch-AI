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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-light/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-border-light shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-center space-y-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center text-3xl mx-auto shadow-sm">
          ⚠️
        </div>
        <h2 className="text-xl font-headline-md font-extrabold text-text-heading tracking-tight">
          Terjadi Gangguan pada Sistem
        </h2>
        <p className="text-xs sm:text-sm text-text-body leading-relaxed">
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

// app/loading.tsx — Root Global Loading Boundary (Modul 6)
import React from 'react';

export default function RootLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-pulse">
      <div className="h-64 bg-slate-100 rounded-3xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="h-24 bg-slate-100 rounded-2xl" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-slate-100 rounded-3xl" />
        <div className="h-48 bg-slate-100 rounded-3xl" />
        <div className="h-48 bg-slate-100 rounded-3xl" />
      </div>
    </div>
  );
}

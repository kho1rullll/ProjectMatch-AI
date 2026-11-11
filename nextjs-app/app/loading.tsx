// app/loading.tsx — Root Global Loading Boundary (Modul 6)
import React from 'react';

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 sm:h-80 bg-white/80 rounded-3xl border border-border-light shadow-sm flex flex-col justify-center p-8 space-y-4">
        <div className="h-6 w-48 bg-primary-light/60 rounded-full" />
        <div className="h-10 w-3/4 max-w-lg bg-surface-container-high rounded-2xl" />
        <div className="h-4 w-1/2 max-w-md bg-surface-container rounded-full" />
      </div>

      {/* Metric Tiles skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/80 rounded-2xl border border-border-light shadow-sm p-4 space-y-2">
            <div className="h-4 w-12 bg-surface-container rounded-full" />
            <div className="h-8 w-20 bg-surface-container-high rounded-xl" />
          </div>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-56 bg-white/80 rounded-3xl border border-border-light shadow-sm p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-high" />
            <div className="h-5 w-3/4 bg-surface-container-high rounded-xl" />
            <div className="h-3 w-full bg-surface-container rounded-full" />
            <div className="h-3 w-5/6 bg-surface-container rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

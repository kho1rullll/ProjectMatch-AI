// app/dashboard/loading.tsx — Streaming Skeleton Fallback UI
// Otomatis ditampilkan Next.js saat Server Component di app/dashboard/page.tsx
// masih menunggu data (Suspense boundary implisit dari file konvensi ini).
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] p-6 lg:p-10 space-y-8 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="h-20 bg-white/80 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between px-6">
        <div className="h-6 w-48 bg-slate-200 rounded-full" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="w-10 h-10 rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="h-56 bg-slate-900/10 rounded-3xl border border-slate-200/60 p-8 space-y-4">
        <div className="h-6 w-32 bg-purple-200/50 rounded-full" />
        <div className="h-8 w-80 bg-slate-300 rounded-2xl" />
        <div className="h-4 w-96 bg-slate-200 rounded-xl" />
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-white/80 rounded-3xl border border-slate-200/80 p-6 space-y-3">
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-64 bg-white/80 rounded-3xl border border-slate-200/80 p-6 space-y-3">
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-64 bg-white/80 rounded-3xl border border-slate-200/80 p-6 space-y-3">
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

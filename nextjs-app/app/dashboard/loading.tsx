// app/dashboard/loading.tsx — Streaming Skeleton Fallback UI
// Otomatis ditampilkan Next.js saat Server Component di app/dashboard/page.tsx
// masih menunggu data (Suspense boundary implisit dari file konvensi ini).
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="h-40 bg-slate-200 rounded-2xl" />
      <div className="h-40 bg-slate-200 rounded-2xl" />
    </div>
  );
}

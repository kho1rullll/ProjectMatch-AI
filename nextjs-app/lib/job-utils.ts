// lib/job-utils.ts — Utilitas tautan lamaran riil & styling badge platform (LinkedIn, Freelancer.com, Kalibrr, Remotive)

export function getValidExternalJobUrl(job: {
  platform_source?: string;
  external_url?: string;
  title?: string;
}): string {
  const rawUrl = (job.external_url || '').trim();
  if (rawUrl.startsWith('https://') || rawUrl.startsWith('http://')) {
    return rawUrl;
  }
  return '#';
}

export function getPlatformDisplayName(platform?: string): string {
  const p = (platform || '').toLowerCase();
  switch (p) {
    case 'linkedin':
      return 'LinkedIn';
    case 'freelancer':
      return 'Freelancer.com';
    case 'kalibrr':
      return 'Kalibrr';
    case 'remotive':
      return 'Remotive';
    default:
      return platform ? platform.toUpperCase() : 'PLATFORM';
  }
}

export function getPlatformBadgeStyle(platform?: string): string {
  const p = (platform || '').toLowerCase();
  switch (p) {
    case 'linkedin':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'freelancer':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'kalibrr':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'remotive':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

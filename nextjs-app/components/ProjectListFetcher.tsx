// components/ProjectListFetcher.tsx — Server Component (async RSC) (Modul 6)
// Mengambil data langsung dari data layer server (lib/db.ts) tanpa mengirim JavaScript ke bundle klien
import React from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/db';
import { Building2, Sparkles, ArrowRight } from 'lucide-react';

export default async function ProjectListFetcher() {
  const projects = getAllProjects();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Rekomendasi Proyek Teratas (Direct Server-Side Data Layer)</span>
        </h3>
        <span className="text-xs font-bold text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300 self-start sm:self-auto shadow-xs">
          RSC Zero-JS Payload
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.slice(0, 3).map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  {proj.category}
                </span>
                <span className="font-black text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300 shadow-xs">
                  {proj.matchScore}% Match
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2">
                {proj.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{proj.company} • {proj.workType}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">{proj.stipend}</span>
              <Link
                href={`/projects/${proj.id}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-600/25 transition-all flex items-center gap-1"
              >
                <span>Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

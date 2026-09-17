// components/ProjectListFetcher.tsx — Server Component (async RSC) (Modul 6)
// Mengambil data langsung dari data layer server (lib/db.ts) tanpa mengirim JavaScript ke bundle klien
import React from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/db';

export default async function ProjectListFetcher() {
  const projects = getAllProjects();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">
          Rekomendasi Proyek Teratas (Direct Server-Side Data Layer)
        </h3>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          RSC Zero-JS Payload
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.slice(0, 3).map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {proj.category}
                </span>
                <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {proj.matchScore}% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                {proj.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                🏢 {proj.company} • {proj.workType}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{proj.stipend}</span>
              <Link
                href={`/projects/${proj.id}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Detail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

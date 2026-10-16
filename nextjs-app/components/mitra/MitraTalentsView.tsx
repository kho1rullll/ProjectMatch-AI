'use client';

import React, { useState } from 'react';
import type { Student } from '@/services/adminApi';

interface MitraTalentsViewProps {
  students: Student[];
  onScoutStudent?: (studentName: string) => void;
}

export default function MitraTalentsView({
  students,
  onScoutStudent,
}: MitraTalentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((stud) => {
    return (
      stud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stud.nim && stud.nim.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (stud.university && stud.university.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🎯</span>
              <span>Eksplorasi Talent Pool Mahasiswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tinjau talenta mahasiswa kampus terverifikasi dan tawarkan proyek secara langsung.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            Total Talenta: <strong>{students.length} Mahasiswa</strong>
          </span>
        </div>

        {/* Search */}
        <div className="relative max-w-md pt-2 border-t border-slate-100">
          <span className="absolute inset-y-0 left-0 pl-3.5 pt-2 flex items-center pointer-events-none text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari talenta berdasarkan nama, NIM, atau program studi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Talents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            <div className="text-4xl mb-2">🔍</div>
            <p className="font-bold text-slate-700 text-sm">Talenta Tidak Ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
          </div>
        ) : (
          filteredStudents.map((stud) => (
            <div
              key={stud.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                      {stud.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{stud.name}</h3>
                      <p className="text-[11px] text-blue-600 font-mono font-medium">
                        {stud.nim || 'NIM: V3925028'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    ✓ Valid
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prodi:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px] text-right">
                      {stud.university || 'D3 Teknik Informatika, UNS'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IPK &amp; Semester:</span>
                    <strong className="text-slate-800">
                      IPK {stud.gpa || '3.88'} • {stud.semester || 'Semester 6'}
                    </strong>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                    AI/ML 92%
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                    Backend 90%
                  </span>
                  <span className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-100">
                    Frontend 85%
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onScoutStudent?.(stud.name)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🎯</span>
                <span>Tawarkan Proyek</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

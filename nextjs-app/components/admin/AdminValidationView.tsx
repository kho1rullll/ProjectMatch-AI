'use client';

import React, { useState } from 'react';
import type { Student } from '@/services/adminApi';

interface AdminValidationViewProps {
  students: Student[];
  onVerifyStudent: (studentId: string, currentStatus: boolean) => void;
  isUpdating?: boolean;
}

export default function AdminValidationView({
  students,
  onVerifyStudent,
  isUpdating = false,
}: AdminValidationViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified'>('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nim && s.nim.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.university && s.university.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'pending') return !s.academicVerified;
    if (filterStatus === 'verified') return s.academicVerified;
    return true;
  });

  const verifiedCount = students.filter((s) => s.academicVerified).length;
  const pendingCount = students.length - verifiedCount;

  return (
    <div className="space-y-6">
      {/* Header Info & Filters */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span>
              <span>Validasi Akademik &amp; Identitas Mahasiswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verifikasi keabsahan data IPK, program studi, dan UID kartu RFID KTM untuk akses Smart Kiosk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              Menunggu: <strong>{pendingCount}</strong>
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              Terverifikasi: <strong>{verifiedCount}</strong>
            </span>
          </div>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama mahasiswa, NIM, atau program studi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('verified')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === 'verified'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terverifikasi ({verifiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Students Validation Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 pl-6">Mahasiswa &amp; NIM</th>
                <th className="py-3.5 px-4">Program Studi</th>
                <th className="py-3.5 px-4">IPK &amp; Semester</th>
                <th className="py-3.5 px-4">UID Kartu RFID KTM</th>
                <th className="py-3.5 px-4">Status Akademik</th>
                <th className="py-3.5 pr-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="font-semibold text-xs text-slate-700">Tidak ada mahasiswa ditemukan</p>
                    <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-50 to-blue-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-200/50">
                          {stud.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{stud.name}</p>
                          <p className="text-[11px] text-indigo-600 font-mono font-semibold">
                            {stud.nim || 'NIM: V3925028'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {stud.university || 'D3 Teknik Informatika PSDKU Madiun, UNS'}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">IPK: {stud.gpa || '3.88'}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{stud.semester || 'Semester 6'}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 font-semibold">
                        {stud.rfidUid || '0x8F3A29B1'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {stud.academicVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          Menunggu Validasi
                        </span>
                      )}
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onVerifyStudent(stud.id, stud.academicVerified)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          stud.academicVerified
                            ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                            : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs'
                        }`}
                      >
                        {stud.academicVerified ? 'Batalkan Validasi' : 'Setujui Validasi'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import type { Student } from '@/services/adminApi';
import { Search, CheckCircle2, Clock, ShieldCheck, XCircle } from 'lucide-react';

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
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Verifikasi Akademik &amp; Identitas Mahasiswa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Validasi Profil &amp; Akses Terminal Smart Kiosk
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verifikasi keabsahan data IPK, program studi, dan UID kartu RFID KTM untuk akses Smart Kiosk.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Menunggu: <strong>{pendingCount}</strong></span>
            </span>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-lime-100 text-lime-900 border border-lime-300 shadow-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-700" />
              <span>Terverifikasi: <strong>{verifiedCount}</strong></span>
            </span>
          </div>
        </div>

        {/* Search & Status Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama mahasiswa, NIM, atau program studi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pending')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('verified')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filterStatus === 'verified'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terverifikasi ({verifiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Students Validation Table */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 pl-6">Mahasiswa &amp; NIM</th>
                <th className="py-4 px-4">Program Studi</th>
                <th className="py-4 px-4">IPK &amp; Semester</th>
                <th className="py-4 px-4">UID Kartu RFID KTM</th>
                <th className="py-4 px-4">Status Akademik</th>
                <th className="py-4 pr-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-slate-700">Tidak ada mahasiswa ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/20">
                          {stud.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{stud.name}</p>
                          <p className="text-[11px] text-purple-600 font-mono font-semibold">
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
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200/80 font-semibold">
                        {stud.rfidUid || '0x8F3A29B1'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {stud.academicVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-600" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
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
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          stud.academicVerified
                            ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-xs'
                            : 'text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-600/25'
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

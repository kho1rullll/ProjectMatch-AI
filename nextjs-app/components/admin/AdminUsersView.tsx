'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { AdminUserItem } from '@/types/admin';
import { Users, Shield, Check, X, RefreshCw, AlertCircle, CheckCircle2, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersView() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch {
      // Mock data akun pengguna
      setUsers([
        {
          id: 'u-1',
          email: 'satria@student.itb.ac.id',
          role: 'mahasiswa',
          is_active: true,
          created_at: new Date().toISOString(),
          full_name: 'Raden Satria',
          nim: 'V3925028',
          github_username: 'kho1rullll',
        },
        {
          id: 'u-2',
          email: 'admin@projectmatch.ac.id',
          role: 'admin',
          is_active: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          full_name: 'Administrator Kampus UNS',
        },
        {
          id: 'u-3',
          email: 'budi.santoso@student.uns.ac.id',
          role: 'mahasiswa',
          is_active: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          full_name: 'Budi Santoso',
          nim: 'V3925012',
          github_username: 'budisantoso-dev',
        },
        {
          id: 'u-4',
          email: 'alisa.rahma@student.uns.ac.id',
          role: 'mahasiswa',
          is_active: false,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          full_name: 'Alisa Rahmawati',
          nim: 'V3925044',
          github_username: 'alisarahma',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    setFeedback(null);
    try {
      await api.admin.updateUser({
        user_id: userId,
        is_active: !currentActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u))
      );
      setFeedback({
        type: 'success',
        text: `Status akun berhasil diubah menjadi ${!currentActive ? 'Aktif' : 'Nonaktif'}.`,
      });
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Gagal mengubah status aktivasi akun.' });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'mahasiswa' | 'admin') => {
    setFeedback(null);
    try {
      await api.admin.updateUser({
        user_id: userId,
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setFeedback({
        type: 'success',
        text: `Role akun berhasil diubah menjadi '${newRole}'.`,
      });
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Gagal mengubah role pengguna.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>FR-11: Manajemen Akun & Hak Akses (RBAC)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengelolaan Akun Pengguna & Otorisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administrator dapat mengaktifkan atau menonaktifkan akses akun pengguna serta mengelola penetapan peran (Mahasiswa atau Administrator).
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors self-start md:self-auto cursor-pointer"
          title="Segarkan Data Pengguna"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
            <p className="text-xs font-semibold text-slate-500">Memuat daftar akun pengguna...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Identitas Pengguna</th>
                  <th className="py-4 px-6">NIM / GitHub</th>
                  <th className="py-4 px-6">Role (Hak Akses)</th>
                  <th className="py-4 px-6">Status Akun</th>
                  <th className="py-4 px-6 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nama & Email */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">
                        {u.full_name || 'Tidak ada nama'}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {u.email}
                      </div>
                    </td>

                    {/* NIM & GitHub */}
                    <td className="py-4 px-6">
                      {u.nim ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-slate-800 font-semibold block">
                            NIM: {u.nim}
                          </span>
                          {u.github_username && (
                            <span className="text-[11px] text-blue-600 font-mono">
                              @{u.github_username}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Akun Sistem</span>
                      )}
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border cursor-pointer focus:outline-none ${
                          u.role === 'admin'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status Aktivasi */}
                    <td className="py-4 px-6">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          <Check className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          <X className="w-3 h-3" /> Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Tombol Aksi */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                          u.is_active
                            ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.is_active ? 'Nonaktifkan' : 'Aktifkan Akun'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

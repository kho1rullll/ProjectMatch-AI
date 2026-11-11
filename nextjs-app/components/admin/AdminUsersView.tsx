'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { AdminUserItem } from '@/types/admin';
import { Users, RefreshCw, AlertCircle, CheckCircle2, Lock, KeyRound, Trash2 } from 'lucide-react';

export default function AdminUsersView() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminUserItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const isLockedAdminAccount = (target: AdminUserItem): boolean => {
    const isSelf = Boolean(
      currentUser &&
        (target.id === currentUser.id ||
          (currentUser.email && target.email.toLowerCase() === currentUser.email.toLowerCase()))
    );
    return Boolean(target.is_permanent_admin || isSelf);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch {
      setUsers([]);
      setFeedback({ type: 'error', text: 'Gagal memuat daftar akun pengguna dari server backend.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    const target = users.find((u) => u.id === userId);
    if (target && isLockedAdminAccount(target)) {
      setFeedback({
        type: 'error',
        text: 'Akun administrator utama/sendiri bersifat paten dan tidak dapat dinonaktifkan.',
      });
      return;
    }

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
    const target = users.find((u) => u.id === userId);
    if (target && isLockedAdminAccount(target)) {
      setFeedback({
        type: 'error',
        text: 'Status peran administrator bersifat paten dan tidak dapat diubah pada akun sendiri.',
      });
      return;
    }

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

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    if (isLockedAdminAccount(resetTarget)) {
      setFeedback({ type: 'error', text: 'Akun administrator paten tidak dapat direset melalui daftar pengguna.' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setFeedback({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }

    setIsActionSubmitting(true);
    setFeedback(null);
    try {
      await api.admin.resetUserPassword(resetTarget.id, newPasswordInput);
      setFeedback({
        type: 'success',
        text: `Kata sandi untuk ${resetTarget.email} berhasil direset.`,
      });
      setResetTarget(null);
      setNewPasswordInput('');
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Gagal mereset kata sandi pengguna.' });
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleDeleteUser = async (target: AdminUserItem) => {
    if (isLockedAdminAccount(target)) {
      setFeedback({ type: 'error', text: 'Akun administrator utama/sendiri bersifat paten dan tidak dapat dihapus.' });
      return;
    }

    setIsActionSubmitting(true);
    setFeedback(null);
    try {
      await api.admin.deleteUser(target.id);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      setDeleteConfirmId(null);
      setFeedback({
        type: 'success',
        text: `Akun ${target.email} berhasil dihapus dari sistem.`,
      });
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Gagal menghapus akun pengguna.' });
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-3 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Manajemen Akun &amp; Hak Akses</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengelolaan Akun Pengguna &amp; Otorisasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administrator dapat mengaktifkan atau menonaktifkan akses akun pengguna serta mengelola penetapan peran pengguna.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300 text-slate-700 transition-all flex items-center justify-center shadow-xs cursor-pointer shrink-0 self-start md:self-auto"
          title="Segarkan Data Pengguna"
        >
          <RefreshCw className="w-4 h-4 text-purple-600" />
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-xs ${
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
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="text-center py-14 space-y-3">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto text-purple-600" />
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
                {users.map((u) => {
                  const locked = isLockedAdminAccount(u);
                  return (
                  <tr key={u.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Nama & Email */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/20">
                          {(u.full_name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {u.full_name || 'Tidak ada nama'}
                          </div>
                          <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                            {u.email}
                          </div>
                        </div>
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
                            <span className="text-[11px] text-purple-600 font-mono font-medium">
                              @{u.github_username}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Akun Sistem</span>
                      )}
                    </td>

                    {/* Role Dropdown / Paten */}
                    <td className="py-4 px-6">
                      {locked ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider border bg-purple-50 border-purple-200 text-purple-700"
                          title="Status peran administrator utama bersifat paten dan tidak dapat diubah"
                        >
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>{u.role === 'admin' ? 'Admin (Paten)' : 'Mahasiswa (Terkunci)'}</span>
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${
                            u.role === 'admin'
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <option value="mahasiswa">Mahasiswa</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    {/* Status Aktivasi */}
                    <td className="py-4 px-6">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-900 border border-lime-300 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-600" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          <span>Nonaktif</span>
                        </span>
                      )}
                    </td>

                    {/* Tombol Aksi */}
                    <td className="py-4 px-6 text-right">
                      {locked ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-semibold text-xs"
                          title="Akun administrator utama/sendiri bersifat paten dan tidak dapat dinonaktifkan"
                        >
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span>Terkunci (Paten)</span>
                        </span>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setResetTarget(u);
                              setNewPasswordInput('');
                              setDeleteConfirmId(null);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer border bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
                            title="Reset Kata Sandi Pengguna"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Reset Sandi</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(u.id, u.is_active)}
                            className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer border ${
                              u.is_active
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-sm shadow-purple-600/25'
                            }`}
                          >
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan Akun'}
                          </button>

                          {deleteConfirmId === u.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={isActionSubmitting}
                                onClick={() => handleDeleteUser(u)}
                                className="px-3 py-1.5 rounded-full font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer disabled:opacity-50"
                              >
                                Konfirmasi Hapus
                              </button>
                              <button
                                type="button"
                                disabled={isActionSubmitting}
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2.5 py-1.5 rounded-full font-semibold text-xs border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(u.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer border bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                              title="Hapus Akun Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inline Reset Password Panel */}
      {resetTarget && (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-purple-200 shadow-[0_10px_30px_rgba(124,58,237,0.1)]">
          <form onSubmit={handleResetPasswordSubmit} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Reset Kata Sandi Pengguna
              </div>
              <p className="text-xs text-slate-600">
                Tetapkan kata sandi baru untuk <span className="font-mono font-bold text-slate-900">{resetTarget.email}</span> (min. 6 karakter).
              </p>
              <input
                type="text"
                minLength={6}
                required
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi baru..."
                className="w-full sm:max-w-sm mt-2 px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setResetTarget(null);
                  setNewPasswordInput('');
                }}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isActionSubmitting}
                className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Simpan Sandi Baru
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

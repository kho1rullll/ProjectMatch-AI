'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api-client';
import { Bell, CheckCheck, Sparkles, AlertCircle, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  match_id?: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil notifikasi dari REST API
  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch {
      // Mock data jika backend offline
      const mockNotifs: NotificationItem[] = [
        {
          id: 'notif-1',
          type: 'match_result',
          title: '🎯 Rekomendasi Lowongan Baru Cocok (92%)!',
          message: "Lowongan 'Junior AI & Python Backend Engineer' di BioInformatika Nusantara sangat cocok dengan repositori GitHub Anda.",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'notif-2',
          type: 'system',
          title: '✅ Portofolio GitHub Berhasil Disinkronkan',
          message: 'Sintesis kompetensi repositori GitHub Anda telah selesai diproses oleh Groq Llama 3.1.',
          is_read: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setNotifications(mockNotifs);
      setUnreadCount(mockNotifs.filter((n) => !n.is_read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Koneksi WebSocket ke backend (FR-09: WSS /ws/notifications)
    const token = typeof window !== 'undefined' ? localStorage.getItem('projectmatch_token') : null;
    if (token) {
      try {
        const wsUrl = `ws://localhost:8000/ws/notifications?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'match_result' || data.type === 'system') {
              setNotifications((prev) => [data, ...prev]);
              setUnreadCount((c) => c + 1);
            }
          } catch {}
        };

        return () => {
          ws.close();
        };
      } catch {}
    }
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Notifikasi Real-time"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="font-bold text-sm text-slate-900">Notifikasi Real-Time (FR-09)</h4>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {unreadCount} Belum Dibaca
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Belum ada notifikasi yang masuk.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 text-xs transition-colors flex items-start justify-between gap-3 ${
                    n.is_read ? 'bg-white opacity-70' : 'bg-blue-50/60'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      {n.type === 'match_result' ? (
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <p className="font-bold text-slate-900">{n.title}</p>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      className="p-1 rounded-md text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
                      title="Tandai Sudah Dibaca"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

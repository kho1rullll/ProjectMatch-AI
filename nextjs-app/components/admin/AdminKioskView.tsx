'use client';

import React from 'react';
import type { Kiosk } from '@/services/adminApi';
import AdminKioskGrid from './AdminKioskGrid';

interface AdminKioskViewProps {
  kiosks: Kiosk[];
  onSimulateRfidTap: (kioskName: string) => void;
  onKioskToggle: (kioskId: string, newStatus: string) => void;
}

export default function AdminKioskView({
  kiosks,
  onSimulateRfidTap,
  onKioskToggle,
}: AdminKioskViewProps) {
  const onlineCount = kiosks.filter((k) => k.status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      {/* Top IoT Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IoT Subsystem: ESP32 Engine &amp; RFID RC522 Duplex WebSocket</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Konfigurasi &amp; Pemantauan Terminal Smart Campus Kiosk
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jalur duplex real-time WebSocket (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-[11px]">/ws/kiosk/&#123;device_id&#125;</code>) untuk penyajian grafik Hero RPG dan rekomendasi proyek instan (&lt; 1 detik) saat kartu KTM mahasiswa di-tap.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSimulateRfidTap('Lobby Utama Kampus')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>⚡</span>
              <span>Uji Simulasi Tap Kartu KTM</span>
            </button>
          </div>
        </div>

        {/* Kiosks Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Terminal</span>
            <span className="text-xl font-black text-slate-900">{kiosks.length} Unit</span>
          </div>
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
            <span className="text-[11px] font-semibold text-emerald-700 block">Status Online</span>
            <span className="text-xl font-black text-emerald-800">{onlineCount} Unit</span>
          </div>
          <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200/60">
            <span className="text-[11px] font-semibold text-indigo-700 block">Rata-rata Respon</span>
            <span className="text-xl font-black text-indigo-800">420 ms</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500 block">Protokol Keamanan</span>
            <span className="text-xs font-mono font-bold text-slate-800 mt-1 block">TLS + AES-128</span>
          </div>
        </div>
      </div>

      {/* Kiosk Grid Card View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Terminal Fisik Aktif
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Auto-refresh setiap 5 detik
          </span>
        </div>

        <AdminKioskGrid
          kiosks={kiosks}
          onSimulateRfidTap={onSimulateRfidTap}
          onKioskToggle={onKioskToggle}
        />
      </div>
    </div>
  );
}

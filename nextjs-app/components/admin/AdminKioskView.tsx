'use client';

import React from 'react';
import type { Kiosk } from '@/services/adminApi';
import AdminKioskGrid from './AdminKioskGrid';
import { Radio, Zap, Shield, Clock, Cpu } from 'lucide-react';

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
      {/* Top IoT Banner - Deep Space Navy High Contrast */}
      <div className="relative bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden space-y-6">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 border border-lime-400/30 text-lime-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>IoT Subsystem: ESP32 Engine &amp; RFID RC522 Duplex WebSocket</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Konfigurasi &amp; Pemantauan Terminal Smart Campus Kiosk
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Jalur komunikasi real-time WebSocket untuk penyajian grafik portofolio dan rekomendasi proyek secara instan saat kartu KTM mahasiswa di-tap.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSimulateRfidTap('Lobby Utama Kampus')}
              className="px-5 py-3 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/35 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#a3e635]" />
              <span>Uji Simulasi Tap Kartu KTM</span>
            </button>
          </div>
        </div>

        {/* Kiosks Summary Metrics */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block">Total Terminal</span>
            <span className="text-xl sm:text-2xl font-black text-white">{kiosks.length} Unit</span>
          </div>
          <div className="p-4 bg-lime-500/10 backdrop-blur-md rounded-2xl border border-lime-500/20">
            <span className="text-[11px] font-semibold text-lime-400 block">Status Online</span>
            <span className="text-xl sm:text-2xl font-black text-lime-300">{onlineCount} Unit</span>
          </div>
          <div className="p-4 bg-purple-500/10 backdrop-blur-md rounded-2xl border border-purple-500/20">
            <span className="text-[11px] font-semibold text-purple-300 block">Rata-rata Respon</span>
            <span className="text-xl sm:text-2xl font-black text-purple-200">420 ms</span>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block">Protokol Keamanan</span>
            <span className="text-xs font-mono font-bold text-slate-200 mt-1 block">TLS + AES-128</span>
          </div>
        </div>
      </div>

      {/* Kiosk Grid Card View */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-600" />
            <span>Daftar Terminal Fisik Aktif</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200/70">
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

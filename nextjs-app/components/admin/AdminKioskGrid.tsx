import React from 'react';
import type { Kiosk } from '@/services/adminApi';

interface AdminKioskGridProps {
  kiosks: Kiosk[];
  onSimulateRfidTap?: (kioskName: string) => void;
  onKioskToggle?: (kioskId: string, newStatus: string) => void;
}

export default function AdminKioskGrid({
  kiosks,
  onSimulateRfidTap,
  onKioskToggle,
}: AdminKioskGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kiosks.map((kiosk) => {
        const isOnline = kiosk.status === 'ONLINE';
        return (
          <div
            key={kiosk.id}
            className={`p-6 rounded-3xl border transition-all ${
              isOnline
                ? 'bg-gradient-to-b from-white to-blue-50/40 border-blue-200 shadow-sm'
                : 'bg-slate-50 border-slate-200 opacity-80'
            } space-y-4 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {kiosk.id}
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                    isOnline
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                  <span>{kiosk.status}</span>
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{kiosk.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">📍 {kiosk.location}</p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 text-[11px] text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Alamat IP ESP32:</span>
                  <span className="font-mono font-bold text-slate-800">{kiosk.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versi Firmware:</span>
                  <span className="font-mono text-slate-700">{kiosk.firmware}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heartbeat Terakhir:</span>
                  <span className="text-emerald-700 font-bold">{kiosk.lastHeartbeat}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span>Total Tap Hari Ini:</span>
                  <span className="font-black text-blue-600">{kiosk.totalTapsToday} kali</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSimulateRfidTap?.(kiosk.name)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                📡 Test Tap KTM
              </button>
              <button
                type="button"
                onClick={() => onKioskToggle?.(kiosk.id, isOnline ? 'STANDBY' : 'ONLINE')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {isOnline ? 'Standby' : 'Aktifkan'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

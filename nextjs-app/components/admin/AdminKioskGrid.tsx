import React from 'react';
import type { Kiosk } from '@/services/adminApi';
import { MapPin, Cpu, Activity, Zap, Power } from 'lucide-react';

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
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${
              isOnline
                ? 'bg-white/95 backdrop-blur-xl border-purple-200/90 shadow-[0_4px_25px_rgba(15,23,42,0.04)]'
                : 'bg-slate-50/90 border-slate-200/80 opacity-80'
            } space-y-5`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
                  {kiosk.id}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    isOnline
                      ? 'bg-lime-100 text-lime-900 border border-lime-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-lime-600 animate-ping' : 'bg-amber-500'}`} />
                  <span>{kiosk.status}</span>
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{kiosk.name}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{kiosk.location}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Alamat IP ESP32:</span>
                  <span className="font-mono font-bold text-slate-800">{kiosk.ipAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Versi Firmware:</span>
                  <span className="font-mono text-slate-700">{kiosk.firmware}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Heartbeat:</span>
                  <span className="text-lime-700 font-bold">{kiosk.lastHeartbeat}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">Total Tap Hari Ini:</span>
                  <span className="font-black text-purple-600">{kiosk.totalTapsToday} kali</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSimulateRfidTap?.(kiosk.name)}
                className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-[#a3e635]" />
                <span>Test Tap KTM</span>
              </button>
              <button
                type="button"
                onClick={() => onKioskToggle?.(kiosk.id, isOnline ? 'STANDBY' : 'ONLINE')}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Power className="w-3.5 h-3.5 text-slate-500" />
                <span>{isOnline ? 'Standby' : 'Aktifkan'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

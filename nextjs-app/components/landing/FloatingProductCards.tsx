import React from 'react';

export default function FloatingProductCards() {
  return (
    <>
      {/* ========================================================================= */}
      {/* CARD 1: AI SEMANTIC MATCH (Left Floating Card)                            */}
      {/* ========================================================================= */}
      <div
        className="hidden xl:block absolute top-[44%] left-4 lg:left-8 2xl:left-14 max-w-[240px] z-20 pointer-events-none select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="hero-floating-card rounded-2xl p-3.5 -rotate-2 animate-float-1 space-y-2.5 transition-transform hover:rotate-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-[11px] font-black text-slate-900 tracking-tight">
                AI Semantic Match
              </span>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              94.2%
            </span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between text-slate-600">
              <span>NLP / Deep Learning</span>
              <span className="font-bold text-slate-900">98%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[98%]" />
            </div>

            <div className="flex justify-between text-slate-600 pt-0.5">
              <span>Cloud &amp; Pipeline</span>
              <span className="font-bold text-slate-900">88%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[88%]" />
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
            <span>Cosine Vector: 1536 dim</span>
            <span className="text-blue-600 font-bold">Kecocokan Tinggi</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: HERO RPG 5D RADAR (Right Floating Card)                           */}
      {/* ========================================================================= */}
      <div
        className="hidden xl:block absolute top-[42%] right-4 lg:right-8 2xl:left-auto 2xl:right-14 max-w-[240px] z-20 pointer-events-none select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="hero-floating-card rounded-2xl p-3.5 rotate-2 animate-float-2 space-y-2 transition-transform hover:rotate-0">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🎮</span>
              <span className="text-[11px] font-black text-slate-900 tracking-tight">
                Hero RPG 5D Radar
              </span>
            </div>
            <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              Tier S
            </span>
          </div>

          {/* Mini 5D Radar SVG Graphic */}
          <div className="flex items-center justify-center py-1">
            <svg width="100" height="90" viewBox="0 0 100 90" className="overflow-visible">
              {/* Reference outer web */}
              <polygon
                points="50,5 95,35 80,85 20,85 5,35"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <polygon
                points="50,22 75,40 68,68 32,68 25,40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              {/* Skill polygon */}
              <polygon
                points="50,10 90,38 74,80 26,82 12,38"
                fill="rgba(37, 99, 235, 0.2)"
                stroke="#2563EB"
                strokeWidth="2"
              />
              {/* Skill vertex dots */}
              <circle cx="50" cy="10" r="2.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="90" cy="38" r="2.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="74" cy="80" r="2.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="26" cy="82" r="2.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="12" cy="38" r="2.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
            <span className="text-slate-600 font-medium">Raden Satria (Lv 42)</span>
            <span className="font-bold text-slate-900">Skor: 91%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: SMART CAMPUS KIOSK RFID (Bottom-Left Floating Card)               */}
      {/* ========================================================================= */}
      <div
        className="hidden lg:block absolute bottom-32 left-6 lg:left-14 2xl:left-24 max-w-[220px] z-20 pointer-events-none select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="hero-floating-card rounded-2xl p-3 -rotate-1 animate-float-3 space-y-1.5 transition-transform hover:rotate-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-600 text-xs">📡</span>
              <span className="text-[10px] font-bold text-slate-800">Smart Campus Kiosk</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
              ESP32 Online
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px] space-y-0.5">
            <p className="text-slate-500">Otentikasi Kartu Mahasiswa:</p>
            <p className="font-bold text-slate-800">Raden Satria • NIM 230501</p>
          </div>

          <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
            <span>✓</span> Terverifikasi &lt; 0.8 detik
          </p>
        </div>
      </div>
    </>
  );
}

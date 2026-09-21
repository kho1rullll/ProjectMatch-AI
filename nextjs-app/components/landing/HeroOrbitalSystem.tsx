import React from 'react';

export default function HeroOrbitalSystem() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Centered concentric orbital container */}
      <div className="relative w-[1300px] h-[1300px] flex items-center justify-center">
        
        {/* Ring 1 - Innermost (approx 440px) */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-200/70" />

        {/* Ring 2 - Rotating with subtle blue accent arc (approx 680px) */}
        <div className="absolute w-[680px] h-[680px] rounded-full border border-slate-200/60 animate-orbit-slow">
          {/* Blue accent arc segment */}
          <svg className="absolute inset-0 w-full h-full -rotate-45" viewBox="0 0 680 680">
            <circle
              cx="340"
              cy="340"
              r="339.5"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeDasharray="90 2040"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating node: Infinity / Cosine Math Vector */}
          <div className="absolute top-[28%] -left-[14px] -translate-y-1/2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-blue-600 font-black text-sm">
              ∞
            </div>
          </div>

          {/* Floating node: ESP32 IoT */}
          <div className="absolute top-[72%] -right-[14px] -translate-y-1/2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-cyan-600 font-bold text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ring 3 - Counter rotating (approx 940px) */}
        <div className="absolute w-[940px] h-[940px] rounded-full border border-slate-200/60 animate-orbit-reverse-slow">
          {/* Subtle blue accent arc */}
          <svg className="absolute inset-0 w-full h-full rotate-60" viewBox="0 0 940 940">
            <circle
              cx="470"
              cy="470"
              r="469.5"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1.5"
              strokeDasharray="120 2820"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating node: Asterisk / AI Model Spark */}
          <div className="absolute top-[16%] left-[18%]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-amber-500 font-bold text-base">
              ✱
            </div>
          </div>

          {/* Floating node: Next.js / React */}
          <div className="absolute top-[20%] right-[18%]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-900 font-black text-xs">
              <span className="tracking-tighter">N<span className="text-blue-600">▲</span></span>
            </div>
          </div>

          {/* Floating node: PyTorch / Tensor */}
          <div className="absolute bottom-[22%] left-[16%]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-rose-500 font-bold text-xs">
              🔥
            </div>
          </div>
        </div>

        {/* Ring 4 - Outer static reference ring (approx 1200px) */}
        <div className="absolute w-[1200px] h-[1200px] rounded-full border border-slate-200/50">
          {/* Subtle blue accent arc */}
          <svg className="absolute inset-0 w-full h-full rotate-120" viewBox="0 0 1200 1200">
            <circle
              cx="600"
              cy="600"
              r="599.5"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="140 3600"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating node: Cloud / AWS */}
          <div className="absolute top-[42%] right-[4%]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[11px]">
              aws
            </div>
          </div>

          {/* Floating node: Prisma / DB */}
          <div className="absolute bottom-[35%] right-[9%]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
              ◬
            </div>
          </div>
        </div>

        {/* Ring 5 - Outermost subtle fade ring (approx 1460px) */}
        <div className="absolute w-[1460px] h-[1460px] rounded-full border border-slate-100/60" />

      </div>
    </div>
  );
}

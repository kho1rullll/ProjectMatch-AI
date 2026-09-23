'use client';

import React, { useState } from 'react';

interface RadarData {
  frontend: number;
  backend: number;
  uiux: number;
  aiml: number;
  architecture: number;
}

export default function HeroRpgRadar({ initialData }: { initialData?: Partial<RadarData> }) {
  const [stats, setStats] = useState<RadarData>({
    frontend: initialData?.frontend ?? 85,
    backend: initialData?.backend ?? 90,
    uiux: initialData?.uiux ?? 78,
    aiml: initialData?.aiml ?? 92,
    architecture: initialData?.architecture ?? 84,
  });

  const [compareMode, setCompareMode] = useState(true);

  // Industry Benchmark stats
  const industryBenchmark: RadarData = {
    frontend: 70,
    backend: 80,
    uiux: 65,
    aiml: 85,
    architecture: 75,
  };

  // Dimensions configuration for 5-gon radar
  const dimensions = [
    { key: 'aiml' as const, label: 'AI & Data', angle: -90 },
    { key: 'frontend' as const, label: 'Frontend & Web', angle: -18 },
    { key: 'uiux' as const, label: 'UI / UX Design', angle: 54 },
    { key: 'backend' as const, label: 'Backend & Cloud', angle: 126 },
    { key: 'architecture' as const, label: 'System Arch', angle: 198 },
  ];

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;

  // Convert polar coordinates to Cartesian
  const getCoordinates = (angleInDegrees: number, value: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angleInRadians);
    const y = center + r * Math.sin(angleInRadians);
    return { x, y };
  };

  // Build polygon path points
  const makePoints = (data: RadarData) => {
    return dimensions
      .map((d) => {
        const { x, y } = getCoordinates(d.angle + 90, data[d.key]);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const studentPolygon = makePoints(stats);
  const benchmarkPolygon = makePoints(industryBenchmark);

  // Average Score
  const avgScore = Math.round(
    (stats.frontend + stats.backend + stats.uiux + stats.aiml + stats.architecture) / 5
  );

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Hero RPG Competency Radar
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            5 Dimensi Vektor Keahlian Mahasiswa vs Standar Kualifikasi Industri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              compareMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {compareMode ? '✓ Benchmark Industri On' : '+ Bandingkan Benchmark'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar SVG Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} className="overflow-visible select-none">
            {/* Concentric Web Rings (20%, 40%, 60%, 80%, 100%) */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => {
              const points = dimensions
                .map((d) => {
                  const { x, y } = getCoordinates(d.angle + 90, level * 100);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={idx}
                  points={points}
                  fill={idx === 4 ? 'rgba(239, 246, 255, 0.4)' : 'transparent'}
                  stroke="rgba(203, 213, 225, 0.7)"
                  strokeWidth="1"
                  strokeDasharray={idx < 4 ? '3,3' : 'none'}
                />
              );
            })}

            {/* Axis Spokes from Center to Outer Edge */}
            {dimensions.map((d, idx) => {
              const { x, y } = getCoordinates(d.angle + 90, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(203, 213, 225, 0.8)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Industry Benchmark Polygon (Subtle Dashed) */}
            {compareMode && (
              <polygon
                points={benchmarkPolygon}
                fill="rgba(148, 163, 184, 0.15)"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            )}

            {/* Student Skill Polygon with Gradient Fill */}
            <polygon
              points={studentPolygon}
              fill="rgba(37, 99, 235, 0.25)"
              stroke="#2563EB"
              strokeWidth="2.5"
            />

            {/* Points and Labels */}
            {dimensions.map((d, idx) => {
              const { x, y } = getCoordinates(d.angle + 90, stats[d.key]);
              const labelPos = getCoordinates(d.angle + 90, 126);
              return (
                <g key={idx}>
                  {/* Point circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#1D4ED8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {/* Text Label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[11px] font-bold fill-slate-700 font-sans"
                  >
                    {d.label} ({stats[d.key]})
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-md bg-blue-600 border border-blue-400 inline-block shadow-xs" />
              <span className="text-slate-800">Raden Satria (Skor: {avgScore}%)</span>
            </div>
            {compareMode && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-300 border border-dashed border-slate-500 inline-block" />
                <span className="text-slate-500">Standar Industri</span>
              </div>
            )}
          </div>
        </div>

        {/* Skill Controls & Breakdown */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Uji Penyesuaian Skill
            </h4>
            <span className="text-xs font-black text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
              Hero Tier S
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {dimensions.map((d) => (
              <div key={d.key} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{d.label}</span>
                  <span className="text-blue-700">{stats[d.key]} / 100</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={stats[d.key]}
                  onChange={(e) =>
                    setStats((prev) => ({ ...prev, [d.key]: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-900">Indeks Kemiripan Global</p>
                <p className="text-[10px] text-slate-500">Kesesuaian dengan 24 lowongan aktif</p>
              </div>
              <span className="text-lg font-black text-blue-600 font-display">{avgScore + 3}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

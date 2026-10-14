'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { SkillRadarScore } from '@/types/matching';

interface CompetencyRadarChartProps {
  studentData?: Record<string, number>;
  comparisonData?: Record<string, number>;
  comparisonTitle?: string;
  scoreBreakdown?: SkillRadarScore[];
}

export default function CompetencyRadarChart({
  studentData,
  comparisonData,
  comparisonTitle = 'Kualifikasi Lowongan',
  scoreBreakdown,
}: CompetencyRadarChartProps) {
  const [showOverlay, setShowOverlay] = useState(Boolean(comparisonData));
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Default values dari hasil sintesis repositori GitHub
  const defaultStudent = {
    'AI & Machine Learning': 88,
    'Frontend Engineering': 86,
    'Backend Services': 92,
    'Database & Cloud': 87,
    'Software Architecture': 85,
  };

  const defaultComparison = {
    'AI & Machine Learning': 80,
    'Frontend Engineering': 85,
    'Backend Services': 90,
    'Database & Cloud': 75,
    'Software Architecture': 80,
  };

  const sMap = (studentData || defaultStudent || {}) as Record<string, any>;
  const tMap = (comparisonData || defaultComparison || {}) as Record<string, any>;

  // Format data untuk Recharts
  const chartData = [
    {
      subject: 'AI & ML',
      fullName: 'AI & Machine Learning',
      student: sMap['AI & Machine Learning'] || sMap['AI_ML'] || 85,
      required: tMap['AI & Machine Learning'] || tMap['AI_ML'] || 80,
      description: 'Penguasaan NLP, HuggingFace Transformers, dan integrasi inferensi LLM.',
    },
    {
      subject: 'Frontend',
      fullName: 'Frontend Engineering',
      student: sMap['Frontend Engineering'] || sMap['Frontend'] || 86,
      required: tMap['Frontend Engineering'] || tMap['Frontend'] || 85,
      description: 'Pengembangan web responsif dengan Next.js App Router, TypeScript, dan visualisasi grafik.',
    },
    {
      subject: 'Backend',
      fullName: 'Backend Services',
      student: sMap['Backend Services'] || sMap['Backend'] || 92,
      required: tMap['Backend Services'] || tMap['Backend'] || 90,
      description: 'Pembuatan REST API berkinerja tinggi FastAPI, RBAC, JWT, dan WebSocket real-time.',
    },
    {
      subject: 'Database',
      fullName: 'Database & Cloud',
      student: sMap['Database & Cloud'] || sMap['Database_Cloud'] || 87,
      required: tMap['Database & Cloud'] || tMap['Database_Cloud'] || 75,
      description: 'Manajemen basis data PostgreSQL, indeks vektor HNSW pgvector, dan optimasi query.',
    },
    {
      subject: 'Architecture',
      fullName: 'Software Architecture',
      student: sMap['Software Architecture'] || sMap['Software_Architecture'] || 85,
      required: tMap['Software Architecture'] || tMap['Software_Architecture'] || 80,
      description: 'Desain Three-Tier modular, decoupling asinkronus, dan clean code pattern.',
    },
  ];

  const avgStudent = Math.round(
    chartData.reduce((acc, curr) => acc + curr.student, 0) / chartData.length
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden">
      {/* Header Visualisasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Radar Chart Kompetensi GitHub (Recharts)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            FR-07: Visualisasi interaktif hasil sintesis repositori GitHub vs kebutuhan lowongan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showOverlay
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showOverlay ? `✓ Overlay ${comparisonTitle} Aktif` : `+ Tampilkan Overlay ${comparisonTitle}`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart Recharts Canvas */}
        <div className="lg:col-span-7 h-[320px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />

              {/* Radar Mahasiswa */}
              <Radar
                name="Portofolio Mahasiswa"
                dataKey="student"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.4}
                strokeWidth={2.5}
              />

              {/* Overlay Kualifikasi Lowongan */}
              {showOverlay && (
                <Radar
                  name={comparisonTitle}
                  dataKey="required"
                  stroke="#ef4444"
                  fill="#f87171"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length && payload[0]?.payload) {
                    const data = payload[0].payload as (typeof chartData)[0];
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                        <p className="font-bold text-blue-300">{data.fullName}</p>
                        <p>Keahlian Mahasiswa: <span className="font-bold text-white">{data.student}%</span></p>
                        {showOverlay && (
                          <p>Kualifikasi Dibutuhkan: <span className="font-bold text-rose-300">{data.required}%</span></p>
                        )}
                        <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-700">{data.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Drill-down Kompetensi & Keterangan Rinci (FR-07) */}
        <div className="lg:col-span-5 space-y-3 bg-slate-50/90 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Drill-Down Kategori Skill
            </h4>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
              Rata-rata: {avgStudent}%
            </span>
          </div>

          <div className="space-y-2.5">
            {chartData.map((item) => {
              const isSelected = selectedSkill === item.subject;
              return (
                <div
                  key={item.subject}
                  onClick={() => setSelectedSkill(isSelected ? null : item.subject)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer border text-xs ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-900">{item.fullName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">{item.student}%</span>
                      {showOverlay && (
                        <span className="text-rose-500 font-mono text-[11px]">
                          (req: {item.required}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-blue-100 text-[11px] text-slate-600">
                      <p>{item.description}</p>
                      <p className="mt-1 font-mono text-[10px] text-blue-700">
                        {item.student >= item.required
                          ? '✓ Memenuhi atau melampaui kualifikasi target.'
                          : `Perlu peningkatan sekitar +${item.required - item.student}% untuk kecocokan optimal.`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-1">
            Klik salah satu kategori di atas untuk melihat detail drill-down kecocokan.
          </p>
        </div>
      </div>
    </div>
  );
}

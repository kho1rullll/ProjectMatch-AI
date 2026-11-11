import React from 'react';

export default function WorkflowProcessGrid() {
  const steps = [
    {
      num: '01',
      title: 'Lengkapi Profil & GitHub',
      desc: 'Tautkan repositori GitHub, unggah portofolio proyek riil, dan tentukan minat karier untuk membentuk grafik kompetensi terpadu.',
      badgeColor: 'bg-purple-600',
    },
    {
      num: '02',
      title: 'Analisis Cerdas AI',
      desc: 'Sistem memproses data portofolio secara otomatis dan menghasilkan rekomendasi proyek yang paling relevan.',
      badgeColor: 'bg-indigo-600',
    },
    {
      num: '03',
      title: 'Review Skor Kemiripan',
      desc: 'Pilih lowongan dengan skor kecocokan tertinggi (0–100%) dan tinjau kebutuhan teknis yang spesifik dari mitra industri.',
      badgeColor: 'bg-[#65a30d]',
    },
    {
      num: '04',
      title: 'Kolaborasi & Sertifikasi',
      desc: 'Terhubung langsung dengan tim industri, kerjakan proyek riil, dan peroleh verifikasi akademik terstandarisasi.',
      badgeColor: 'bg-slate-900',
    },
  ];

  return (
    <div className="pt-12 border-t border-slate-200/80 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
          ✦ Alur Kerja Sederhana
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight flex items-center justify-center flex-wrap gap-2">
          <span>Bagaimana</span>
          <span className="inline-flex items-center">
            <span>Project</span>
            <span className="text-purple-600">Match</span>
            <span className="bg-[#84CC16] text-slate-950 font-black text-xs sm:text-sm px-2 py-0.5 rounded-lg ml-1.5 shadow-xs">AI</span>
          </span>
          <span>Bekerja</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Hanya butuh 4 langkah mudah untuk menghubungkan portofolio coding riil mahasiswa dengan lowongan industri impian.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div
            key={s.num}
            className="capsule-card rounded-[36px] p-7 space-y-4 border border-purple-100/90 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className={`w-11 h-11 rounded-2xl ${s.badgeColor} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                {s.num}
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {s.desc}
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-purple-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>Langkah {s.num}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

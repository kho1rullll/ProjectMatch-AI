import React from 'react';

export default function HeroFeaturesGrid() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
          ✨ Solusi &amp; Teknologi Utama
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
          Fitur Unggulan ProjectMatch AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Ekosistem terintegrasi yang menggabungkan inferensi kecerdasan buatan, gamifikasi talenta, dan terminal fisik kampus modern.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fitur 1: Hero RPG Gamifikasi */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
              🎮
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Hero RPG &amp; 5D Radar</h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Gamifikasi Talenta
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualisasi portofolio dan riwayat repositori mahasiswa dalam bentuk matriks kompetensi 5 dimensi interaktif (AI/ML, Frontend, Backend, UI/UX, dan Arsitektur).
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Visualisasi 3D WebGL &amp; Spider Chart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Kalkulasi Hero Tier &amp; Status Level</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Overlay kecocokan terhadap kualifikasi proyek</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fitur 2: AI Semantic Matching */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-500/20">
              🤖
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">AI Semantic Matching</h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Cosine Similarity
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencocokan kualifikasi proyek mitra dengan profil talenta berbasis ekstraksi vektor LLM berdimensi tinggi untuk menghasilkan skor relevansi matematis 0–100%.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Ekstraksi entitas teknis &amp; NER otomatis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Tingkat akurasi inferensi mencapai 94.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Rekomendasi penutupan skill gap talenta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fitur 3: Smart Campus Kiosk IoT */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-700 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-cyan-500/20">
              📡
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Smart Campus Kiosk</h3>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                  ESP32 + RC522 IoT
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrasi perangkat keras terminal interaktif di lingkungan kampus berbasis RFID KTM untuk otentikasi identitas cepat dan verifikasi status akademik mahasiswa.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Waktu respon pembacaan kartu &lt; 1 detik</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Validasi identitas &amp; keaslian KTM terpusat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Pemantauan heartbeat perangkat real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'validation' | 'analytics' | 'kiosks'>('validation');
  const [students, setStudents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalStudents: 1240,
    totalProjects: 6,
    totalMatches: 890,
    activeKiosks: 2,
    averageMatchRate: '92.4%',
  });

  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [simulatedTapMsg, setSimulatedTapMsg] = useState('');

  // Fetch admin data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (json.success) {
        setStudents(json.students || []);
        setProjects(json.projects || []);
        setApplications(json.applications || []);
        setKiosks(json.kiosks || []);
        setStats(json.stats || stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Verify Student
  const handleVerify = async (studentId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_student',
          studentId,
          verified: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(data.message);
        setTimeout(() => setFeedbackMsg(''), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Kiosk Action
  const handleKioskToggle = async (kioskId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_kiosk',
          kioskId,
          kioskStatus: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(data.message);
        setTimeout(() => setFeedbackMsg(''), 3000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate RFID Tap on Kiosk
  const handleSimulateRfidTap = (kioskName: string) => {
    setSimulatedTapMsg(`⚡ [WS Broadcast] Kartu KTM Raden Satria (UID: 0x8F3A29B1) berhasil di-tap pada ${kioskName}! Response Time: 420ms (< 1 detik).`);
    setTimeout(() => setSimulatedTapMsg(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. ADMIN HEADER & SYSTEM SUMMARY STATS (SKPL §2 & §3)                      */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <span>🛡️ Administrator Kampus &amp; Pengawas Link-and-Match</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Dasbor Administrasi &amp; Kontrol Sistem Kampus
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Pengelolaan validasi data mahasiswa, pemantauan rekrutmen industri, dan konfigurasi terminal Smart Campus Kiosk (SKPL).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">Biro Kemahasiswaan &amp; Kerjasama</span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                ● Server Backend Operasional
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white shrink-0">
              ADM
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <p className="text-2xl font-black text-slate-900 font-display">{stats.totalStudents}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Total Mahasiswa Terdaftar</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <p className="text-2xl font-black text-blue-600 font-display">{projects.length}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Lowongan Mitra Aktif</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <p className="text-2xl font-black text-indigo-600 font-display">{stats.averageMatchRate}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Rata-rata Akurasi AI (UAT)</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <p className="text-2xl font-black text-emerald-600 font-display">
              {kiosks.filter((k) => k.status === 'ONLINE').length} / {kiosks.length} Online
            </p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Terminal Smart Kiosk</p>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Simulated Tap Toast */}
      {simulatedTapMsg && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono rounded-2xl shadow-md animate-in slide-in-from-top-2 flex items-center gap-2">
          <span>{simulatedTapMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB CONTROLS (3 FITUR UTAMA ADMINISTRATOR SKPL)                        */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 max-w-fit overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'validation'
              ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📋</span>
          <span>Validasi Akademik &amp; Data Mahasiswa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📊</span>
          <span>Monitoring Link &amp; Match Rekrutmen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kiosks')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'kiosks'
              ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>📡</span>
          <span>Konfigurasi Smart Campus Kiosk (IoT)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VALIDASI STATUS AKADEMIK & IDENTITAS MAHASISWA (SKPL §2 & §3)       */}
      {/* ========================================================================= */}
      {activeTab === 'validation' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Daftar Mahasiswa &amp; Verifikasi Status Akademik
              </h3>
              <p className="text-xs text-slate-500">
                Administrator memverifikasi keabsahan data IPK, semester, dan pairing kartu RFID KTM mahasiswa untuk akses Smart Kiosk.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Total Talenta: <strong>{students.length} Mahasiswa</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Mahasiswa &amp; NIM</th>
                  <th className="pb-3">Program Studi</th>
                  <th className="pb-3">IPK &amp; Semester</th>
                  <th className="pb-3">UID Kartu RFID KTM</th>
                  <th className="pb-3">Status Verifikasi</th>
                  <th className="pb-3 text-right pr-2">Aksi Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stud) => (
                  <tr key={stud.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-slate-900 text-sm">{stud.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{stud.nim || 'NIM: V3925028'}</div>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">
                      {stud.university || 'D3 Teknik Informatika PSDKU Madiun, UNS'}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-800">IPK: {stud.gpa || '3.88'}</div>
                      <div className="text-[10px] text-slate-500">{stud.semester || 'Semester 6'}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                        {stud.rfidUid || '0x8F3A29B1'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {stud.academicVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          ✓ Terverifikasi Kampus
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          ⏳ Menunggu Validasi
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        type="button"
                        onClick={() => handleVerify(stud.id, stud.academicVerified)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          stud.academicVerified
                            ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                            : 'text-white bg-blue-600 hover:bg-blue-700 shadow-xs'
                        }`}
                      >
                        {stud.academicVerified ? 'Batalkan' : 'Validasi Akademik'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MONITORING LINK & MATCH & ANALISIS REKRUTMEN (SKPL §2 & §3)        */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Status Lamaran Real-Time */}
            <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Log Rekam Jejak Lamaran Mahasiswa ke Mitra
                  </h3>
                  <p className="text-xs text-slate-500">Pemantauan seleksi proyek dan skor kemiripan semantik</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {applications.length} Pengajuan Aktif
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{app.studentName || 'Raden Satria (V3925028)'}</span>
                      <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {app.matchScore}% Match
                      </span>
                    </div>
                    <div className="text-slate-600">
                      <p className="font-medium text-slate-800">{app.projectTitle}</p>
                      <p className="text-[11px] text-slate-500">Mitra: {app.companyName}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>Diajukan: {app.appliedAt}</span>
                      <span className="font-bold text-blue-600 uppercase tracking-wider">{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekap Distribusi Kategori & Indikator Kinerja */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Indikator Kinerja Sistem (SKPL §1.3)
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Akurasi AI Semantic Matching</span>
                      <span className="text-blue-600">94.2% (Target: &ge; 85%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '94.2%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Tingkat Keberhasilan Kiosk RFID</span>
                      <span className="text-emerald-600">98.5% (Target: &ge; 95%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '98.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Kepuasan Antarmuka (User Rating)</span>
                      <span className="text-indigo-600">4.8 / 5.0 (Target: &ge; 4.0)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ringkasan Kategori Proyek Terbuka
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-100">
                    AI &amp; Machine Learning (2 Proyek)
                  </span>
                  <span className="bg-cyan-50 text-cyan-700 font-bold px-3 py-1.5 rounded-xl border border-cyan-100">
                    Frontend &amp; UI/UX (1 Proyek)
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100">
                    Backend &amp; Cloud (1 Proyek)
                  </span>
                  <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-100">
                    Blockchain &amp; Web3 (1 Proyek)
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KONFIGURASI TERMINAL SMART CAMPUS KIOSK (SKPL §1.2, §3, §5, §7)    */}
      {/* ========================================================================= */}
      {activeTab === 'kiosks' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
                <span>IoT Subsystem: ESP32 Engine &amp; RFID RC522 (SKPL §5)</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Terminal Smart Campus Kiosk di Area Kampus
              </h3>
              <p className="text-xs text-slate-500">
                Jalur duplex real-time WebSocket (<code>/ws/kiosk/&#123;device_id&#125;</code>) untuk penyajian grafik hero dan rekomendasi dalam &lt; 1 detik saat kartu KTM di-tap.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSimulateRfidTap('Lobby Utama')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white btn-primary-shimmer shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⚡ Uji Simulasi Tap Kartu KTM Mahasiswa</span>
            </button>
          </div>

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
                      onClick={() => handleSimulateRfidTap(kiosk.name)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                    >
                      📡 Test Tap KTM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKioskToggle(kiosk.id, isOnline ? 'STANDBY' : 'ONLINE')}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {isOnline ? 'Standby' : 'Aktifkan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

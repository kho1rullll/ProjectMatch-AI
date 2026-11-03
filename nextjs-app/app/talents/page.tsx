'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';

export interface TalentItem {
  id: string;
  name: string;
  nim: string;
  role: string;
  category: 'AI & Machine Learning' | 'Fullstack Web' | 'Cloud & Backend' | 'UI/UX & Design' | 'Mobile & IoT';
  university: string;
  semester: string;
  gpa: string;
  matchScore: number;
  skills: string[];
  bio: string;
  github: {
    username: string;
    repoCount: number;
    commitCount: number;
    topLanguage: string;
  };
  radarStats: {
    aiml: number;
    frontend: number;
    backend: number;
    uiux: number;
    architecture: number;
  };
  badges: string[];
  verified: boolean;
}

const TALENTS_DATA: TalentItem[] = [
  {
    id: 'talent-001',
    name: 'Raden Satria',
    nim: 'V3925028',
    role: 'Fullstack ML & Systems Fellow',
    category: 'AI & Machine Learning',
    university: 'Institut Teknologi Bandung (ITB)',
    semester: 'Semester 6',
    gpa: '3.88 / 4.00',
    matchScore: 98,
    skills: ['Python', 'PyTorch', 'FastAPI', 'Next.js', 'Docker', 'pgvector'],
    bio: 'Fokus pada fine-tuning model LLM lokal dan arsitektur backend asynchronous berkinerja tinggi. Berpengalaman membangun pipeline ekstraksi data rekam medis terenkripsi.',
    github: {
      username: 'radensatria',
      repoCount: 22,
      commitCount: 540,
      topLanguage: 'Python / TypeScript',
    },
    radarStats: {
      aiml: 94,
      frontend: 88,
      backend: 92,
      uiux: 78,
      architecture: 86,
    },
    badges: ['Top 2% Match', 'Verified Coder', 'Open Source Contributor'],
    verified: true,
  },
  {
    id: 'talent-002',
    name: 'Sarah Althea',
    nim: '13521045',
    role: 'Computer Vision & Deep Learning Specialist',
    category: 'AI & Machine Learning',
    university: 'Institut Teknologi Bandung (ITB)',
    semester: 'Semester 8',
    gpa: '3.92 / 4.00',
    matchScore: 96,
    skills: ['PyTorch', 'YOLOv8', 'OpenCV', 'TensorRT', 'Python', 'CUDA'],
    bio: 'Peneliti pemrosesan citra medis dan edge AI inspection. Menulis implementasi deteksi cacat mutu mikro pada perakitan manufaktur dengan latensi sub-15ms.',
    github: {
      username: 'sarahalthea',
      repoCount: 19,
      commitCount: 620,
      topLanguage: 'Python / C++',
    },
    radarStats: {
      aiml: 98,
      frontend: 62,
      backend: 80,
      uiux: 60,
      architecture: 84,
    },
    badges: ['Dean’s Honor List', 'AI Hackathon Finalist', 'Research Fellow'],
    verified: true,
  },
  {
    id: 'talent-003',
    name: 'Budi Pratama',
    nim: '2106721900',
    role: 'Distributed Systems & Cloud Architect',
    category: 'Cloud & Backend',
    university: 'Universitas Indonesia (UI)',
    semester: 'Semester 6',
    gpa: '3.84 / 4.00',
    matchScore: 95,
    skills: ['Go / Golang', 'Kafka', 'Kubernetes', 'PostgreSQL', 'gRPC', 'Redis'],
    bio: 'Mengembangkan arsitektur financial ledger dengan idempotency key, streaming event Kafka berkekuatan 12,000 QPS, dan fault-tolerant replication database.',
    github: {
      username: 'budipratama-dev',
      repoCount: 31,
      commitCount: 890,
      topLanguage: 'Go',
    },
    radarStats: {
      aiml: 55,
      frontend: 60,
      backend: 96,
      uiux: 45,
      architecture: 98,
    },
    badges: ['CKA Certified', 'High-Throughput Expert', 'Backend Core'],
    verified: true,
  },
  {
    id: 'talent-004',
    name: 'Nabila Putri Azzahra',
    nim: 'V3925044',
    role: 'Modern Frontend & Web Interaction Lead',
    category: 'Fullstack Web',
    university: 'Universitas Sebelas Maret (UNS)',
    semester: 'Semester 6',
    gpa: '3.82 / 4.00',
    matchScore: 94,
    skills: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'REST/GraphQL'],
    bio: 'Membangun antarmuka web performan tinggi dengan transisi kinetik 60fps, server components Next.js, dan arsitektur visual tokens terstandarisasi.',
    github: {
      username: 'nabilaputri',
      repoCount: 26,
      commitCount: 670,
      topLanguage: 'TypeScript',
    },
    radarStats: {
      aiml: 65,
      frontend: 96,
      backend: 84,
      uiux: 90,
      architecture: 78,
    },
    badges: ['UI Engineering Lead', 'WCAG Specialist', 'Hackathon Winner'],
    verified: true,
  },
  {
    id: 'talent-005',
    name: 'Dewi Anggraini',
    nim: '17520032',
    role: 'Product Designer & HCI Researcher',
    category: 'UI/UX & Design',
    university: 'Institut Teknologi Bandung (ITB)',
    semester: 'Semester 8',
    gpa: '3.89 / 4.00',
    matchScore: 92,
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Interactive Prototyping', 'User Research'],
    bio: 'Menciptakan alur pengguna intuitif untuk platform SaaS enterprise dan dashboard telemetri IoT. Berfokus pada cognitive load reduction dan micro-interactions.',
    github: {
      username: 'dewi-design',
      repoCount: 14,
      commitCount: 310,
      topLanguage: 'Design / HTML/CSS',
    },
    radarStats: {
      aiml: 40,
      frontend: 82,
      backend: 52,
      uiux: 98,
      architecture: 70,
    },
    badges: ['Figma Community Creator', 'UX Benchmark Specialist', 'Design Sprint Lead'],
    verified: true,
  },
  {
    id: 'talent-006',
    name: 'Kevin Sanjaya',
    nim: '20/463200/TK/51200',
    role: 'Smart IoT & Embedded Telemetry Engineer',
    category: 'Mobile & IoT',
    university: 'Universitas Gadjah Mada (UGM)',
    semester: 'Semester 6',
    gpa: '3.76 / 4.00',
    matchScore: 91,
    skills: ['C/C++', 'ESP32', 'FreeRTOS', 'MQTT', 'Python', 'PCB Design', 'Edge AI'],
    bio: 'Merancang kiosk cerdas kampus dan modul akuisisi sensor lingkungan berdaya rendah dengan enkripsi hardware dan sinkronisasi cloud real-time.',
    github: {
      username: 'kevinsanjaya-iot',
      repoCount: 18,
      commitCount: 440,
      topLanguage: 'C++ / C',
    },
    radarStats: {
      aiml: 72,
      frontend: 52,
      backend: 82,
      uiux: 44,
      architecture: 88,
    },
    badges: ['Hardware Hacker', 'RFID Kiosk Lead', 'Robotics Champion'],
    verified: true,
  },
];

const CATEGORIES = [
  'Semua Bidang',
  'AI & Machine Learning',
  'Fullstack Web',
  'Cloud & Backend',
  'UI/UX & Design',
  'Mobile & IoT',
] as const;

export default function TalentsDirectoryPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Bidang');
  const [selectedTalent, setSelectedTalent] = useState<TalentItem | null>(null);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [collaborateSuccess, setCollaborateSuccess] = useState<string | null>(null);

  // Filtered talent records
  const filteredTalents = useMemo(() => {
    return TALENTS_DATA.filter((talent) => {
      const matchesCategory =
        selectedCategory === 'Semua Bidang' || talent.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        talent.name.toLowerCase().includes(q) ||
        talent.university.toLowerCase().includes(q) ||
        talent.role.toLowerCase().includes(q) ||
        talent.skills.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  // Handle clicking "Lihat Detail Profil"
  const handleOpenTalentDetail = (talent: TalentItem) => {
    setSelectedTalent(talent);
    if (!user) {
      // Unauthenticated visitor -> trigger Auth Gate
      setShowAuthGateModal(true);
    }
  };

  const handleSendCollaboration = () => {
    if (!selectedTalent) return;
    setCollaborateSuccess(`Undangan kolaborasi resmi berhasil dikirim ke ${selectedTalent.name}!`);
    setTimeout(() => {
      setCollaborateSuccess(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900 pb-24 relative overflow-x-hidden">
      
      {/* Ambient background light gradients */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-500/15 via-primary-container/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-[600px] -right-20 w-[450px] h-[450px] bg-accent-lime-glow/10 rounded-full blur-3xl" aria-hidden="true" />

      {/* Hero Header Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        
        {/* Navigation Breadcrumb back to Home */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Beranda Utama</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Masuk sebagai: <strong>{user.name || user.email}</strong></span>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-container bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              <span>Masuk untuk Akses Penuh</span>
            </Link>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-primary-container text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-ping" />
            <span className="uppercase tracking-wider">Public Talent Directory • Verified Campus Engineers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Direktori Talenta Kampus &amp;{' '}
            <span className="relative inline-block">
              <span className="inline-block bg-primary-container text-white px-3.5 py-0.5 rounded-2xl shadow-lg shadow-purple-600/30">
                Inovator Digital
              </span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Eksplorasi profil mahasiswa dan kandidat peneliti teknologi dari berbagai perguruan tinggi unggulan.
            Tinjau spesialisasi keahlian secara publik, atau <strong>masuk ke akun Anda</strong> untuk meninjau audit repositori GitHub, radar kompetensi 5D, serta mengirim tawaran proyek riset langsung.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-8 space-y-4 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          
          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari talenta berdasarkan nama, kampus (ITB, UI, UNS, dsb.), keahlian (Python, Next.js, PyTorch)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕ Hapus
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-white shadow-md shadow-purple-600/25 scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Result counter indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menampilkan <strong>{filteredTalents.length} talenta mahasiswa</strong> terverifikasi
            </span>
            <span className="font-mono text-primary-container font-bold text-[11px]">
              Kualifikasi: 100% Akademik Sah
            </span>
          </div>

        </div>

      </section>

      {/* Talents Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        {filteredTalents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_search</span>
            <h3 className="text-base font-bold text-slate-800">Tidak Ada Talenta Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian atau ubah kategori filter Anda.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua Bidang');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent) => (
              <motion.div
                key={talent.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group"
              >
                {/* Top Subtle Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

                <div className="space-y-4">
                  
                  {/* Card Header: Avatar & Match Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E1B4B] to-primary-container text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20 border border-white/20">
                        {talent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-primary-container transition-colors">
                          {talent.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                          {talent.university}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-lime-100 text-lime-900 border border-lime-300 font-mono">
                        {talent.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Role Title */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800">{talent.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {talent.bio}
                    </p>
                  </div>

                  {/* Technical Skills Pills */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keahlian Utama:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {talent.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[11px] font-bold border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 4 && (
                        <span className="px-2 py-1 rounded-lg bg-purple-50 text-primary-container text-[11px] font-bold">
                          +{talent.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Public Stats Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
                      <span className="text-slate-400 block text-[10px]">Indeks Prestasi:</span>
                      <strong className="text-slate-800 font-mono">{talent.gpa}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
                      <span className="text-slate-400 block text-[10px]">GitHub Activity:</span>
                      <strong className="text-slate-800 font-mono">{talent.github.repoCount} Repos</strong>
                    </div>
                  </div>

                </div>

                {/* Card Action Button */}
                <button
                  type="button"
                  onClick={() => handleOpenTalentDetail(talent)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    user
                      ? 'bg-slate-900 hover:bg-primary-container text-white shadow-sm'
                      : 'bg-purple-50 hover:bg-primary-container text-primary-container hover:text-white border border-purple-200/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {user ? 'visibility' : 'lock'}
                  </span>
                  <span>{user ? 'Lihat Profil Lengkap & Kontak' : 'Lihat Detail (Perlu Login)'}</span>
                </button>

              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* AUTH GATE MODAL (Triggered when non-logged-in user clicks "Lihat Detail") */}
      <AnimatePresence>
        {showAuthGateModal && selectedTalent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthGateModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6"
            >
              
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => setShowAuthGateModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>

              {/* Glowing Lock Icon */}
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-primary-container flex items-center justify-center shadow-lg shadow-purple-500/15">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>

              {/* Header Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-lime-glow bg-[#0B0F19] px-3 py-1 rounded-full">
                  Akses Terproteksi Akademik
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Login Diperlukan untuk Mengakses Profil Lengkap
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Untuk melindungi privasi data mahasiswa, audit commit GitHub, dan kontak langsung{' '}
                  <strong className="text-slate-900">{selectedTalent.name}</strong>, silakan masuk ke akun kampus atau mitra Anda.
                </p>
              </div>

              {/* Key Features Unlocked Upon Login */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span><strong>Matriks Radar 5D:</strong> Analisis mendalam AI/ML, Backend, UI/UX, &amp; Arsitektur.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span><strong>Audit Repositori:</strong> Rincian {selectedTalent.github.repoCount} repositori &amp; {selectedTalent.github.commitCount} komit GitHub.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span><strong>Tawaran Proyek:</strong> Saluran langsung untuk mengirim undangan kolaborasi riset.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/auth?redirect=/talents"
                  className="w-full py-3.5 rounded-full bg-primary-container hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk ke Akun Anda</span>
                </Link>

                <Link
                  href="/auth?register=true&redirect=/talents"
                  className="w-full py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Daftar Akun Baru (Gratis)</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowAuthGateModal(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Tetap di Pratinjau Publik
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL TALENT PROFILE MODAL (Available when user IS LOGGED IN) */}
      <AnimatePresence>
        {user && selectedTalent && !showAuthGateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTalent(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTalent(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm"
              >
                ✕
              </button>

              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E1B4B] to-primary-container text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/25 border border-white/20">
                    {selectedTalent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">{selectedTalent.name}</h3>
                      <span className="text-[10px] font-bold text-lime-900 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-300">
                        ✓ Terverifikasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{selectedTalent.role}</p>
                    <p className="text-[11px] text-primary-container font-mono">{selectedTalent.university} • {selectedTalent.semester}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-mono font-extrabold px-3 py-1.5 rounded-full bg-purple-50 text-primary-container border border-purple-200">
                    Match Skor: {selectedTalent.matchScore}%
                  </span>
                </div>
              </div>

              {/* Toast Notification if collaboration sent */}
              {collaborateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>{collaborateSuccess}</span>
                </div>
              )}

              {/* Bio & Academic Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Ringkasan Profil &amp; Riset</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedTalent.bio}
                </p>
              </div>

              {/* 5D Competency Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Matriks Radar Kompetensi 5D (Inferensi AI)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>AI &amp; Machine Learning</span>
                      <span className="font-mono text-purple-600">{selectedTalent.radarStats.aiml}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${selectedTalent.radarStats.aiml}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Backend &amp; Distributed</span>
                      <span className="font-mono text-blue-600">{selectedTalent.radarStats.backend}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedTalent.radarStats.backend}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Frontend &amp; Kinetik Web</span>
                      <span className="font-mono text-emerald-600">{selectedTalent.radarStats.frontend}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedTalent.radarStats.frontend}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Arsitektur Sistem</span>
                      <span className="font-mono text-amber-600">{selectedTalent.radarStats.architecture}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: `${selectedTalent.radarStats.architecture}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Telemetry Breakdown */}
              <div className="bg-[#0B0F19] text-white p-4 rounded-2xl space-y-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-lime-glow text-[18px]">terminal</span>
                    <span className="text-xs font-bold font-mono">github.com/{selectedTalent.github.username}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Status: Repo Vektor Terhubung</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-3">
                  <div>
                    <div className="text-lg font-mono font-extrabold text-white">{selectedTalent.github.repoCount}</div>
                    <span className="text-[10px] text-slate-400">Total Repositori</span>
                  </div>
                  <div>
                    <div className="text-lg font-mono font-extrabold text-accent-lime-glow">{selectedTalent.github.commitCount}+</div>
                    <span className="text-[10px] text-slate-400">Verified Commits</span>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-extrabold text-purple-300 mt-1">{selectedTalent.github.topLanguage}</div>
                    <span className="text-[10px] text-slate-400">Dominan Bahasa</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  NIM: <strong>{selectedTalent.nim}</strong> • IPK: <strong>{selectedTalent.gpa}</strong>
                </span>
                
                <button
                  type="button"
                  onClick={handleSendCollaboration}
                  className="px-6 py-3 rounded-full bg-primary-container hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Ajak Kolaborasi Proyek Ini</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

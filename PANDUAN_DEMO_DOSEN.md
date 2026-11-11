# 🎓 Panduan Pengujian & Demonstrasi ProjectMatch AI ke Dosen Pembimbing / Penguji

Dokumen ini memuat panduan lengkap arsitektur, cara kerja penghubung frontend dan backend, serta skenario langkah demi langkah untuk mendemonstrasikan sistem **ProjectMatch AI** (*Link-and-Match Kebutuhan Industri dengan Portofolio Mahasiswa*) di hadapan dosen.

---

## 🏗️ 1. Ringkasan Arsitektur Sistem (*Three-Tier Architecture*)

Sistem ProjectMatch AI dibangun dengan standar arsitektur industri *three-tier decoupled*:

```
┌─────────────────────────────────────────────────────────────┐
│                 PRESENTATION TIER (FRONTEND)                │
│  - Next.js 16 (App Router) + React 19 + TypeScript         │
│  - Tailwind CSS v4 + Recharts (5-D Radar Chart Kompetensi)  │
│  - Client Central HTTP Client (lib/api-client.ts)           │
│  - Real-Time WebSocket Listener (NotificationBell)          │
│  - Alamat: http://localhost:3000                            │
└──────────────────────────────┬──────────────────────────────┘
                               │
            HTTP REST API & WebSocket (JWT Bearer Token)
            Reverse Proxy Route: /api/v1/* -> :8000/api/v1/*
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  APPLICATION TIER (BACKEND)                 │
│  - FastAPI (Python 3.11+) + Uvicorn ASGI Server             │
│  - Autentikasi Argon2id Hashing + PyJWT                     │
│  - AI Engine: Groq Cloud Llama 3.1 & Sentence Transformers  │
│  - Semantic Cosine Similarity & Score Breakdown Engine       │
│  - Real-time WebSocket Broadcast Manager                    │
│  - Alamat: http://127.0.0.1:8000 (Swagger: /api/v1/docs)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                     SQLAlchemy ORM 2.0
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    DATA TIER (DATABASE)                     │
│  - SQLite (Lokal Dev: projectmatch_ai.db)                   │
│  - PostgreSQL 15 + pgvector (Ekstensi Vektor HNSW Produksi) │
│  - Tabel: users, mahasiswa_profiles, job_vacancies,         │
│           embeddings, matches, job_bookmarks, notifications │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ 2. Titik Sambungan Frontend & Backend

Frontend (`ProjectMatch-AI\nextjs-app`) dan Backend (`ProjectMatch-AI\backend`) terhubung melalui mekanisme berikut:

1. **HTTP Client Terpusat (`lib/api-client.ts`):**
   - Mengarahkan seluruh pemanggilan API ke `NEXT_PUBLIC_API_URL` (`http://localhost:8000/api/v1`).
   - Menyertakan header `Authorization: Bearer <JWT_TOKEN>` secara otomatis setelah login.
   - Dilengkapi fallback otomatis ke Next.js Reverse Proxy jika direct cross-origin gagal.
2. **Reverse Proxy Next.js (`next.config.ts`):**
   - Menghubungkan jalur internal Next.js `/api/v1/:path*` ke `http://localhost:8000/api/v1/:path*` sehingga mencegah kendala CORS.
3. **CORS Middleware FastAPI (`app/main.py`):**
   - Mengizinkan origin `http://localhost:3000`, `http://127.0.0.1:3000`, serta regex localhost port berapapun dengan credentials enabled.
4. **WebSocket Real-Time Notification (`ws://localhost:8000/ws/notifications`):**
   - Komponen `NotificationBell.tsx` membuka koneksi WebSocket terautentikasi JWT untuk menerima notifikasi instan ketika lowongan baru yang cocok ditemukan (kecocokan $\ge 80\%$) atau ketika sinkronisasi repositori GitHub selesai.
5. **Autentikasi Terintegrasi (`lib/auth-context.tsx`):**
   - Fungsi login dan pergantian akun cepat (*switch role*) langsung memicu request ke endpoint FastAPI `/api/v1/auth/login` untuk menerbitkan token JWT riil bertanda tangan Argon2id.

---

## 🚀 3. Cara Menjalankan Sistem untuk Demonstrasi

### Cara 1: Sekali Klik (Rekomendasi untuk Demo Dosen)
Cukup jalankan file peluncur di direktori utama:
- Klik ganda file: `start-all.bat`  
  *(Atau jalankan di PowerShell: `.\start-all.ps1`)*

Skrip ini akan secara otomatis:
1. Memastikan port 8000 dan 3000 bersih.
2. Menjalankan Backend FastAPI pada port 8000.
3. Menjalankan Frontend Next.js pada port 3000.
4. Membuka peramban secara otomatis di `http://localhost:3000`.

### Cara 2: Manual Terminal
Jika dosen ingin melihat terminal backend dan frontend terpisah:

**Terminal 1 (Backend):**
```powershell
cd D:\MANPRO1\ProjectMatch-AI\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```powershell
cd D:\MANPRO1\ProjectMatch-AI\nextjs-app
npm run dev
```

---

## 🔑 4. Data Akun Pengujian (Demo Credentials)

| Peran (*Role*) | Email | Kata Sandi | Deskripsi Profil |
| :--- | :--- | :--- | :--- |
| **Mahasiswa** | `satria@student.itb.ac.id` | `password123` | Raden Satria (NIM: V3925028, D3 TI Madiun UNS, Akun GitHub: `kho1rullll`) |
| **Admin Kampus** | `admin@projectmatch.ac.id` | `password123` | Biro Kemahasiswaan & Kerjasama Industri UNS |

---

## 🎬 5. Skenario Demo Langkah Demi Langkah ke Dosen

### Skenario A: Fitur Mahasiswa & AI Semantic Matching (FR-01 s.d. FR-08)
1. **Buka Halaman Utama:** Akses `http://localhost:3000`. Tunjukkan tampilan beranda modern bertema Link-and-Match.
2. **Login Mahasiswa:**
   - Klik tombol **"Masuk"** di kanan atas atau buka `http://localhost:3000/auth`.
   - Gunakan email `satria@student.itb.ac.id` dan kata sandi `password123`.
3. **Review Radar Kompetensi 5 Dimensi (FR-07):**
   - Pada halaman **Ringkasan Dasbor**, tunjukkan **Radar Chart Interaktif** (*AI/ML, Frontend, Backend, Database, Architecture*).
   - Jelaskan ke dosen bahwa data ini dihasilkan dari analisis repositori GitHub mahasiswa yang diekstraksi ke vektor embedding.
4. **Rekomendasi Lowongan AI (FR-06):**
   - Tunjukkan kartu rekomendasi teratas yang memiliki skor kecocokan tinggi (misal: *Junior AI & Python Backend Engineer*).
   - Klik kartu untuk membuka **Modal Drill-Down**.
   - Tunjukkan **Visualisasi Radar Overlay** (*Perbandingan Kompetensi Mahasiswa vs Syarat Lowongan*).
5. **Eksplorasi Lowongan Multi-Platform (FR-04, FR-08):**
   - Pindah ke tab **"Eksplorasi Lowongan"**.
   - Tunjukkan filter platform: **LinkedIn**, **Upwork**, dan **Fiverr**.
   - Klik tombol **Simpan Bookmark** pada salah satu lowongan.
6. **Lowongan Tersimpan / Bookmark (FR-08):**
   - Buka tab **"Lowongan Tersimpan"**.
   - Tunjukkan bahwa lowongan yang disimpan langsung tercatat di database backend melalui API `/api/v1/bookmarks/me`.
7. **Sinkronisasi Portofolio GitHub (FR-02, FR-03):**
   - Buka tab **"Tautkan GitHub"**.
   - Tunjukkan data repositori, bahasa pemrograman, dan komit yang ditarik dari GitHub REST API.
   - Klik **"Sinkronkan Portofolio GitHub"** untuk memicu background pipeline.

### Skenario B: Real-Time WebSocket Notification (FR-09)
1. Perhatikan ikon lonceng (**NotificationBell**) di bilah navigasi kanan atas.
2. Saat ada lowongan dengan kecocokan $\ge 80\%$, notifikasi dikirimkan langsung secara real-time via WebSocket tanpa perlu memuat ulang (*refresh*) halaman.

### Skenario C: Panel Administrator Kampus (FR-11, FR-12)
1. Klik avatar profil di kanan atas, pilih **"Beralih ke Administrator"** (atau logout dan login dengan `admin@projectmatch.ac.id`).
2. Masuk ke halaman **Admin Panel** (`http://localhost:3000/admin`).
3. **Statistik Agregasi (FR-12):**
   - Tunjukkan total lowongan dari LinkedIn, Upwork, dan Fiverr.
   - Tunjukkan rata-rata skor kecocokan semantik dan interaksi mahasiswa.
   - Tunjukkan tombol **"Sinkronkan Job Feed (FR-10)"** yang memicu ingestion data lowongan baru.
4. **Manajemen Pengguna (FR-11):**
   - Buka tab **"Manajemen Akun Pengguna"**.
   - Tunjukkan daftar mahasiswa, status aktivasi (*Aktif/Nonaktif*), dan role.
   - Tunjukkan tombol toggle untuk mengaktifkan/menonaktifkan akun.

---

## 🧪 6. Bukti Verifikasi Otomatis (Test Suite)

Dosen dapat ditunjukkan hasil uji otomatis (*automated testing*) yang membuktikan keandalan sistem:

### 1. Uji End-to-End Penghubung Frontend <-> Backend
Jalankan di terminal utama:
```powershell
python test_e2e.py
```
**Hasil:**
- [x] Backend Direct Status: Operational
- [x] Frontend Next.js HTTP Status: 200 OK
- [x] Next.js Reverse Proxy to Backend: Berfungsi
- [x] Autentikasi Mahasiswa via Proxy: Sukses
- [x] Pengambilan Profil & Ekstraksi Skill: Sukses
- [x] Rekomendasi Semantik Cosine Similarity: Sukses (6 lowongan matched)
- [x] Modul Admin Statistics via Proxy: Sukses
- [x] Real-Time WebSocket Handshake & Heartbeat: Sukses (Ping -> Pong)

### 2. Uji Unit Frontend (Next.js / Vitest)
```powershell
cd D:\MANPRO1\ProjectMatch-AI\nextjs-app
npm run test
```
**Hasil:** 7 file pengujian lulus 100% (**49 dari 49 test passed**).

### 3. Uji Integrasi Backend (FastAPI / TestClient)
```powershell
cd D:\MANPRO1\ProjectMatch-AI\backend
python tests/test_backend.py
```
**Hasil:** Seluruh pengujian endpoint REST API lulus (**ALL BACKEND TESTS PASSED**).

---

## 🛑 7. Menghentikan Layanan Setelah Selesai
Cukup klik ganda file:
`stop-all.bat`
Maka seluruh proses pada port 8000 dan port 3000 akan ditutup secara aman dan bersih.


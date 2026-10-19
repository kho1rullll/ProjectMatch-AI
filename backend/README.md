# ProjectMatch AI - Backend Service

Repositori mandiri untuk **Backend REST API, AI Matching Engine, dan Real-time WebSocket** dari sistem **ProjectMatch AI** (Link-and-Match Kebutuhan Industri dengan Portofolio Mahasiswa).

---

## 🚀 Fitur Utama Backend

- **Autentikasi & Otorisasi:** JWT Authentication dengan hashing *Argon2id* untuk role `mahasiswa` dan `admin`.
- **Ekstraksi Keahlian Berbasis AI:** Integrasi Groq Cloud LLM (`llama-3.1-8b-instant`) untuk mengekstrak keahlian dari portofolio GitHub dan deskripsi pekerjaan.
- **Semantic Matching Engine:** Perhitungan skor kecocokan (*Cosine Similarity* + *Score Breakdown*) antara profil mahasiswa dan lowongan pekerjaan.
- **Sinkronisasi Portofolio GitHub:** Scraping metrik repositori, bahasa pemrograman, dan komit secara otomatis.
- **Ingestion Lowongan Industri:** Mendukung platform LinkedIn, Fiverr, dan Upwork (termasuk filter freelance/part-time).
- **Notifikasi Real-time & WebSocket:** Mengirimkan update status matching dan notifikasi sistem seketika ke klien.
- **Panel Admin:** Dashboard statistik agregat lowongan, platform, mahasiswa, dan validasi data.

---

## 🛠️ Tech Stack

- **Framework:** FastAPI (Python 3.11+)
- **ASGI Server:** Uvicorn
- **ORM / Database:** SQLAlchemy 2.0 (SQLite untuk dev lokal, PostgreSQL 15+ dengan ekstensi `pgvector` untuk produksi)
- **AI & NLP:** Groq SDK (`llama-3.1-8b-instant`), NumPy untuk komputasi vektor
- **Keamanan:** Argon2-cffi, PyJWT
- **Klien HTTP:** HTTPX
- **Kontainerisasi:** Docker & Docker Compose
- **Deployment:** Render Blueprint (`render.yaml`)

---

## 📁 Struktur Direktori

```text
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI automated tests
├── app/
│   ├── core/                   # Konfigurasi, Database Engine, dan Keamanan JWT
│   ├── models/                 # SQLAlchemy Database Models
│   ├── routers/                # Endpoint Router (Auth, Profile, Jobs, Admin, WS)
│   ├── schemas/                # Pydantic Schemas (Request/Response DTO)
│   ├── services/               # Matching Engine, GitHub Scraper, Job Ingestion
│   └── main.py                 # Inisialisasi FastAPI & Lifespan Seeding
├── tests/
│   └── test_backend.py         # End-to-end integration tests
├── .dockerignore
├── .env.example                # Template variabel lingkungan
├── .gitignore
├── Dockerfile                  # Kontainerisasi backend
├── docker-compose.yml          # Compose untuk backend & PostgreSQL pgvector
├── projectmatch_schema.sql     # Skema DDL lengkap (PostgreSQL + pgvector)
├── render.yaml                 # Spesifikasi deployment Render
├── requirements.txt            # Dependensi Python
└── README.md
```

---

## ⚡ Memulai (Local Setup)

### 1. Prasyarat
- Python 3.11 atau lebih baru
- Git
- (Opsional) Docker & Docker Compose

### 2. Setup Virtual Environment
```bash
# Buat virtual environment
python -m venv .venv

# Aktivasi virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependensi
pip install -r requirements.txt
```

### 3. Konfigurasi Variabel Lingkungan
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilainya jika diperlukan:
- `GROQ_API_KEY`: Dapatkan gratis di [console.groq.com](https://console.groq.com) (opsional untuk fitur ekstraksi AI).
- `GITHUB_TOKEN`: Personal Access Token GitHub (opsional untuk menghindari rate limit scraping publik).
- `DATABASE_URL`: Bawaan `sqlite:///./projectmatch_ai.db`.

### 4. Menjalankan Server
```bash
uvicorn app.main:app --reload --port 8000
```
Server akan berjalan di: `http://localhost:8000`

---

## 🐳 Menjalankan dengan Docker

### Mode Default (SQLite)
```bash
docker compose up --build -d
```
Akses server di `http://localhost:8000`.

### Mode PostgreSQL + pgvector
```bash
docker compose --profile postgres up --build -d
```

---

## 🧪 Pengujian Otomatis (Testing)

Jalankan skrip integrasi end-to-end untuk memverifikasi seluruh fungsi backend:
```bash
python tests/test_backend.py
```

Output yang diharapkan:
```text
[OK] Test Root Status Passed
[OK] Test Login Mahasiswa Passed
[OK] Test Login Admin Passed
[OK] Test Get Jobs Passed (6 jobs loaded)
[OK] Test Recommendations Passed (6 recommendations loaded)
[OK] Test Bookmark Job Passed
[OK] Test Admin Statistics Passed

ALL BACKEND TESTS PASSED SUCCESSFULLY!
```

---

## 📖 Dokumentasi API Interaktif

Setelah server aktif, dokumentasi interaktif dapat diakses melalui browser:
- **Swagger UI:** [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- **ReDoc:** [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)
- **OpenAPI Schema (JSON):** [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## 🤝 Panduan Integrasi Rekan Frontend

Bagi rekan pengembang frontend (Next.js / React), gunakan panduan berikut untuk menghubungkan antarmuka ke backend:

### 1. Base URL
- **Lokal:** `http://localhost:8000/api/v1`
- **Produksi (Render):** `https://<nama-app-anda>.onrender.com/api/v1`

### 2. Akun Bawaan untuk Pengujian
Data awal otomatis terisi (*auto-seeded*) saat server pertama kali dinyalakan:
| Role | Email | Password |
|---|---|---|
| **Mahasiswa** | `satria@student.itb.ac.id` | `password123` |
| **Admin** | `admin@projectmatch.ac.id` | `password123` |

### 3. Format Autentikasi
Kirim token JWT pada request header untuk endpoint yang terproteksi:
```http
Authorization: Bearer <access_token>
```

### 4. Daftar Endpoint Utama
| Kategori | Method | Endpoint | Keterangan |
|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Login user & dapatkan token JWT |
| **Auth** | `POST` | `/auth/register` | Pendaftaran akun mahasiswa baru |
| **Profil** | `GET` | `/profile/me` | Ambil profil mahasiswa saat ini |
| **Profil** | `POST` | `/profile/sync-github` | Trigger sinkronisasi data repositori GitHub |
| **Lowongan** | `GET` | `/jobs` | Ambil daftar lowongan industri |
| **Lowongan** | `POST` | `/jobs/{id}/bookmark` | Simpan lowongan favorit |
| **Rekomendasi** | `GET` | `/recommendations/me` | Ambil lowongan dengan skor kecocokan tertinggi |
| **Notifikasi** | `GET` | `/notifications/me` | Ambil daftar notifikasi mahasiswa |
| **Admin** | `GET` | `/admin/statistics` | Ambil ringkasan statistik platform & mahasiswa |
| **WebSocket** | `WS` | `/ws/{user_id}` | Koneksi real-time untuk update status matching |

---

## ☁️ Deployment ke Render

Repositori ini sudah dilengkapi file konfigurasi [render.yaml](file:///render.yaml).
1. Hubungkan repositori GitHub ini ke dashboard [Render](https://dashboard.render.com).
2. Pilih **Blueprints** -> **New Blueprint Instance**.
3. Render akan secara otomatis membaca `render.yaml`, menyetel database PostgreSQL, dan men-deploy web service FastAPI secara otomatis.

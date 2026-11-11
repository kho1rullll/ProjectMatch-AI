# ProjectMatch AI — Mobile Front-end (Flutter)

Aplikasi mobile resmi **ProjectMatch AI** yang dibangun menggunakan Flutter, mengadaptasi seluruh visual blueprint, color palette, dan liquid glassmorphism dari platform web Next.js (`nextjs-app`).

---

## 🎨 Visual Identity & Design System

Aplikasi ini mengadopsi standar **Single Source of Truth** dari web Next.js:

| Token / Komponen | Nilai Warna / Styling | Penggunaan di Aplikasi |
| :--- | :--- | :--- |
| **Electric Purple** | `#7C3AED` / `#6D28D9` | Warna primer, gradient tombol CTA, ring avatar, dan aksen glowing |
| **Fluorescent Lime** | `#84CC16` / `#A3E635` | Badge AI, highlight ikon aktif di navbar, match score counter (98.4%) |
| **Dark Navy / Dim** | `#0B0F19` / `#120B22` | Latar belakang kanvas gelap (Deep Obsidian & Amethyst) |
| **Light Canvas** | `#FAFAFC` / `#FFFFFF` | Pilihan tema terang bersih |
| **Liquid Glass** | `BackdropFilter` + blur 16–20px + border putih 12% | Kartu kaca (`LiquidGlassCard`) & floating navbar |
| **Pill Buttons** | `borderRadius: 999` | Tombol CTA magnetic & filter chips |
| **Rounded Inputs** | `borderRadius: 16` (`rounded-xl`) | Field input formulir login & register |
| **Tipografi** | Google Fonts `Plus Jakarta Sans` | Teks heading, display, dan body |
| **Ikon** | `lucide_icons` | Konsisten 100% dengan paket `lucide-react` pada web |

---

## 📁 Struktur Direktori Proyek

```text
flutter-app/
├── assets/
│   └── images/
│       └── logo.png                        # Asset logo resmi ProjectMatch AI
├── lib/
│   ├── main.dart                           # Entry point & deklarasi rute
│   ├── core/
│   │   ├── theme/
│   │   │   ├── app_colors.dart             # Palet warna & gradien resmi
│   │   │   └── app_theme.dart              # Konfigurasi ThemeData (Dark & Light)
│   │   └── widgets/
│   │       ├── brand_logo.dart             # BrandTitle ("ProjectMatch [AI]") & BrandLogo
│   │       ├── ambient_background.dart     # Mesh radial glowing background
│   │       ├── liquid_glass_card.dart      # Reusable glassmorphic container (ImageFilter.blur)
│   │       └── liquid_glass_button.dart    # Capsule magnetic button (Purple / Lime / Frosted)
│   └── features/
│       ├── splash/
│       │   └── splash_screen.dart          # Layar pembuka animasi kinetic (flutter_animate)
│       ├── auth/
│       │   ├── login_page.dart             # Login form, quick demo preset & SSO
│       │   └── register_page.dart          # Register mahasiswa dengan GitHub sync
│       └── main/
│           ├── main_layout.dart            # Floating Frosted Glass Bottom Navigation Bar
│           ├── home_page.dart              # Live AI Match Widget & Horizontal Carousel
│           ├── projects_page.dart          # Eksplorasi katalog lowongan mitra industri
│           ├── messages_page.dart          # Percakapan & diskusi mentor proyek
│           └── profile_page.dart           # Profil mahasiswa, radar 5-D & tags skills
├── analysis_options.yaml
├── pubspec.yaml
└── README.md
```

---

## 🚀 Fitur Utama yang Telah Diimplementasikan

### 1. Splash Screen Beranimasi (`splash_screen.dart`)
- Latar gradien Dark Navy/Purple dengan ambient glowing orbs.
- Logo dan teks "ProjectMatch AI" beranimasi dengan efek fade in, scale-up kinetik, rotating particle ring, dan shimmer menggunakan `flutter_animate`.
- Transisi otomatis (cross-fade) setelah 2.8 detik menuju halaman Login.

### 2. Halaman Login & Register (`login_page.dart` & `register_page.dart`)
- Desain mobile-first dengan kontainer kartu kaca **Liquid Glass**.
- Form input bersudut membulat (`rounded-xl`) dengan ikon Lucide.
- **Pilihan Cepat (Quick Demo Presets)**: Tombol sekali ketuk untuk akun `satria@student.itb.ac.id` (Mahasiswa) atau `admin@projectmatch.ac.id` (Admin).
- Tombol SSO untuk GitHub & Google.
- Tombol CTA kapsul ungu dengan efek animasi sentuh dan loading indicator.

### 3. Halaman Home / Overview (`home_page.dart`)
- **Header Personal**: Sapaan pengguna "Halo, Raden Satria 👋" dengan status aktif dan bel notifikasi interaktif.
- **Live AI Match Widget**: Kartu kaca hologram menampilkan Match Score (98.4%) dengan simulasi pemilihan kategori (Web & Mobile, ML & AI, IoT, UI/UX).
- **Horizontal Scroll Carousel**: Daftar proyek rekomendasi mitra industri yang dapat digeser menyamping (menampilkan persentase kecocokan, uang saku, dan tag teknologi).
- **Alur Kerja Sistem**: Kartu tahapan otomatisasi karier 4 langkah.

### 4. Halaman Profil / My Account (`profile_page.dart`)
- Avatar bulat dengan border gradien ganda (Electric Purple & Fluorescent Lime).
- Informasi akademik lengkap: Raden Satria, NIM V3925028, D3 TI PSDKU Madiun UNS, IPK 3.88, KTM RFID `0x8F3A29B1`.
- Indikator progres kelengkapan profil (85% Selesai).
- **Keahlian (Skills)** dalam bentuk badge pil (tags): PyTorch, Transformers, Next.js 15, FastAPI, Golang, Docker, Flutter, Figma, dll.
- Evaluasi kompetensi 5-Dimensi dengan progress bar interaktif.
- Menu pengaturan vertikal: Preferensi Tema (Dark Navy, Deep Dim, Light Canvas), KTM Digital, Bantuan, dan Konfirmasi Keluar (Logout).

### 5. Floating Frosted Glass Bottom Navigation Bar (`main_layout.dart`)
- Kerangka navigasi menempel melayang (*floating*) di atas layar dengan efek `BackdropFilter` (blur 20px).
- 4 Menu utama: **Home**, **Proyek**, **Pesan** (dengan counter unread), dan **Akun**.
- Highlight tab aktif menggunakan pil Fluorescent Lime (`#84CC16`) dengan animasi transisi yang mulus.

---

## 💻 Cara Menjalankan Proyek Flutter

1. Buka terminal dan masuk ke direktori `flutter-app`:
   ```bash
   cd flutter-app
   ```

2. Unduh seluruh dependensi paket:
   ```bash
   flutter pub get
   ```

3. Jalankan aplikasi pada emulator atau perangkat fisik (Android / iOS / Web / Desktop):
   ```bash
   flutter run
   ```

Untuk menjalankan di browser (Chrome) dengan mode mobile viewport:
```bash
flutter run -d chrome
```


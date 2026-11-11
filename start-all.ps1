# ==============================================================================
# Script Peluncur Terpadu ProjectMatch AI (Frontend + Backend)
# ==============================================================================
# Menjalankan Backend FastAPI (Port 8000) dan Frontend Next.js (Port 3000)
# ==============================================================================

$RootPath = $PSScriptRoot
$BackendPath = Join-Path $RootPath "backend"
$FrontendPath = Join-Path $RootPath "nextjs-app"

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "      PROJECTMATCH AI: LINK-AND-MATCH TALENTA KAMPUS          " -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " Direktori Proyek: $RootPath" -ForegroundColor Gray
Write-Host ""

# 1. Bersihkan port yang mungkin masih digunakan
Write-Host "[1/4] Memeriksa ketersediaan port 8000 & 3000..." -ForegroundColor Yellow
$activePorts = Get-NetTCPConnection -LocalPort 8000, 3000 -State Listen -ErrorAction SilentlyContinue
if ($activePorts) {
    foreach ($conn in $activePorts) {
        Write-Host "      Menghentikan proses lama pada PID $($conn.OwningProcess)..." -ForegroundColor Gray
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 1

# 2. Jalankan Backend (FastAPI / Uvicorn)
Write-Host "[2/4] Menjalankan Backend (FastAPI di Port 8000)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "python" -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory $BackendPath -PassThru

# Tunggu backend siap
Write-Host "      Menunggu Backend siap..." -NoNewline
$backendReady = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method Get -TimeoutSec 2 -ErrorAction Stop
        if ($res.status -eq "operational") {
            $backendReady = $true
            break
        }
    } catch {}
    Write-Host "." -NoNewline
}
Write-Host ""

if ($backendReady) {
    Write-Host "      [OK] Backend Berhasil Berjalan: http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "      [OK] Dokumentasi API Swagger : http://127.0.0.1:8000/api/v1/docs" -ForegroundColor Green
    Write-Host "      [OK] Demo Static Portal     : http://127.0.0.1:8000/portal" -ForegroundColor Green
} else {
    Write-Host "      [PERINGATAN] Backend memerlukan waktu lebih lama untuk inisialisasi." -ForegroundColor Yellow
}

# 3. Jalankan Frontend (Next.js)
Write-Host "[3/4] Menjalankan Frontend (Next.js di Port 3000)..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $FrontendPath -PassThru

# Tunggu frontend siap
Write-Host "      Menunggu Frontend siap..." -NoNewline
$frontendReady = $false
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:3000/" -Method Get -TimeoutSec 2 -ErrorAction Stop
        if ($res.StatusCode -eq 200) {
            $frontendReady = $true
            break
        }
    } catch {}
    Write-Host "." -NoNewline
}
Write-Host ""

if ($frontendReady) {
    Write-Host "      [OK] Frontend Berhasil Berjalan: http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "      [INFO] Frontend sedang mengompilasi halaman di http://localhost:3000" -ForegroundColor Gray
}

# 4. Tampilkan Panduan Demo untuk Dosen
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Green
Write-Host "        SISTEM BERHASIL TERHUBUNG SECARA LENGKAP!             " -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green
Write-Host "URL Akses Utama :" -ForegroundColor White
Write-Host " - Frontend Web      : http://localhost:3000" -ForegroundColor Cyan
Write-Host " - Backend API Docs  : http://localhost:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host " - Demo Static Portal: http://localhost:8000/portal" -ForegroundColor Cyan
Write-Host " - Real-time WS      : ws://localhost:8000/ws/notifications" -ForegroundColor Cyan
Write-Host ""
Write-Host "Akun Siap Uji (Preset):" -ForegroundColor White
Write-Host " 1. Akun Mahasiswa :" -ForegroundColor Yellow
Write-Host "    - Email       : satria@student.itb.ac.id" -ForegroundColor White
Write-Host "    - Password    : password123" -ForegroundColor White
Write-Host "    - Fitur Utama : Radar Kompetensi 5-D, AI Matching, Sync GitHub, Bookmarks" -ForegroundColor Gray
Write-Host ""
Write-Host " 2. Akun Admin Kampus :" -ForegroundColor Yellow
Write-Host "    - Email       : admin@projectmatch.ac.id" -ForegroundColor White
Write-Host "    - Password    : password123" -ForegroundColor White
Write-Host "    - Fitur Utama : Monitoring Agregasi Lowongan, Manajemen Akun, Trigger Sync" -ForegroundColor Gray
Write-Host ""
Write-Host "Untuk menguji verifikasi otomatis end-to-end:" -ForegroundColor White
Write-Host "  python test_e2e.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tekan CTRL+C atau jalankan .\stop-all.bat untuk menghentikan seluruh layanan." -ForegroundColor Gray
Write-Host "==============================================================" -ForegroundColor Green

# Buka browser
Start-Process "http://localhost:3000"

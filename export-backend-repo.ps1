# ==============================================================================
# Script Ekspor Repositori Mandiri Backend ProjectMatch AI
# ==============================================================================
# Skrip ini menyalin seluruh aset backend ke direktori repositori mandiri baru
# dan menginisialisasi Git repo terpisah untuk pengembang backend.
# ==============================================================================

param(
    [string]$TargetDir = "$PSScriptRoot\..\ProjectMatch-Backend"
)

$ErrorActionPreference = "Stop"

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host " Mempersiapkan Repositori Mandiri Backend ProjectMatch AI" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan

$ResolvedTarget = [System.IO.Path]::GetFullPath($TargetDir)
Write-Host "[1/4] Target direktori: $ResolvedTarget" -ForegroundColor Yellow

if (-not (Test-Path $ResolvedTarget)) {
    New-Item -ItemType Directory -Path $ResolvedTarget -Force | Out-Null
    Write-Host "      Direktori berhasil dibuat." -ForegroundColor Green
} else {
    Write-Host "      Direktori tujuan sudah ada, menyelaraskan file..." -ForegroundColor Green
}

# Daftar file & folder yang akan disalin
$BackendSource = Join-Path $PSScriptRoot "backend"

Write-Host "[2/4] Menyalin file backend ke repositori mandiri..." -ForegroundColor Yellow

# Salin folder app dan tests
$FoldersToCopy = @("app", "tests", ".github")
foreach ($folder in $FoldersToCopy) {
    $src = Join-Path $BackendSource $folder
    $dest = Join-Path $ResolvedTarget $folder
    if (Test-Path $src) {
        if (-not (Test-Path $dest)) {
            New-Item -ItemType Directory -Path $dest -Force | Out-Null
        }
        Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force -Exclude @("__pycache__", "*.pyc", ".pytest_cache")
        Write-Host "      + Tersalin: $folder/" -ForegroundColor Gray
    }
}

# Salin file konfigurasi root
$FilesToCopy = @(
    "Dockerfile",
    ".dockerignore",
    ".gitignore",
    ".env.example",
    "docker-compose.yml",
    "projectmatch_schema.sql",
    "render.yaml",
    "requirements.txt",
    "README.md",
    "test_app.py"
)

foreach ($file in $FilesToCopy) {
    $src = Join-Path $BackendSource $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $ResolvedTarget $file) -Force
        Write-Host "      + Tersalin: $file" -ForegroundColor Gray
    }
}

# Salin .env jika ada (agar variabel lokal tetap tersimpan)
$EnvSrc = Join-Path $BackendSource ".env"
if (Test-Path $EnvSrc) {
    Copy-Item -Path $EnvSrc -Destination (Join-Path $ResolvedTarget ".env") -Force
    Write-Host "      + Tersalin: .env (Lokal)" -ForegroundColor Gray
}

Write-Host "[3/4] Menginisialisasi Git Repository di repositori mandiri..." -ForegroundColor Yellow
Push-Location $ResolvedTarget
try {
    if (-not (Test-Path ".git")) {
        git init -b main | Out-Null
        Write-Host "      + Git repository berhasil diinisialisasi (branch: main)" -ForegroundColor Green
    }
    git add .
    git commit -m "feat: setup standalone ProjectMatch Backend repository with FastAPI, Docker, and CI" --quiet
    Write-Host "      + Commit inisial berhasil dibuat!" -ForegroundColor Green
} catch {
    Write-Host "      (Perubahan file sudah diperbarui di git lokal)" -ForegroundColor Gray
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Green
Write-Host " SUKSES! Repositori Backend Mandiri Siap Digunakan" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green
Write-Host "Lokasi folder: $ResolvedTarget" -ForegroundColor White
Write-Host ""
Write-Host "Langkah selanjutnya untuk menghubungkan ke GitHub Anda:" -ForegroundColor Cyan
Write-Host "1. Buat repositori baru di GitHub (misal: ProjectMatch-Backend)" -ForegroundColor White
Write-Host "2. Jalankan perintah berikut di terminal:" -ForegroundColor White
Write-Host "   cd `"$ResolvedTarget`"" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/<USERNAME-ANDA>/ProjectMatch-Backend.git" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "Buka repositori baru ini di jendela baru:" -ForegroundColor Cyan
Write-Host "   code `"$ResolvedTarget`"" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Green

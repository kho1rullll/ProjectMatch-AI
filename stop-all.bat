@echo off
title ProjectMatch AI - Penghenti Layanan
cls
echo ==============================================================
echo       PROJECTMATCH AI: MENGHENTIKAN SELURUH LAYANAN
echo ==============================================================
echo Menghentikan proses pada port 8000 dan 3000...

powershell -NoProfile -Command ^
  "$ports = Get-NetTCPConnection -LocalPort 8000, 3000 -State Listen -ErrorAction SilentlyContinue;" ^
  "if ($ports) { foreach ($p in $ports) { Stop-Process -Id $p.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host ('Menghentikan PID ' + $p.OwningProcess) } } else { Write-Host 'Tidak ada proses yang berjalan pada port 8000 dan 3000.' }"

echo.
echo Seluruh layanan berhasil dihentikan.
echo.
pause


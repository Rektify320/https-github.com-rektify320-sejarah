@echo off
setlocal
title Deploy Game Sejarah Nusantara ke Vercel

echo ========================================================
echo   DEPLOY GAME SEJARAH NUSANTARA KE VERCEL (PUBLIC LINK)
echo ========================================================
echo.

if "%VERCEL_TOKEN%"=="" (
  echo Token Vercel belum aktif.
  echo Jalankan login dulu dengan:
  echo   npx vercel login
  echo atau set variable VERCEL_TOKEN terlebih dahulu.
  echo.
  echo Setelah login berhasil, jalankan ulang file ini.
  echo ========================================================
  pause
  exit /b 1
)

echo Sedang menyiapkan deploy ke Vercel...
echo.

npx vercel --prod --token "%VERCEL_TOKEN%"

echo.
echo ========================================================
echo Selesai! Salin link website Vercel di atas.
echo ========================================================
pause
endlocal

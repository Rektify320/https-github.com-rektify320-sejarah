@echo off
echo ===================================================
echo     UPLOAD PROJECT SEJARAH NUSANTARA KE GITHUB
echo ===================================================
echo.
set /p REPO_URL="Masukkan URL Repository GitHub Anda (contoh: https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] URL repository tidak boleh kosong.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Mengunggah ke GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo     BERHASIL DIUNGGAH KE GITHUB!
    echo ===================================================
) else (
    echo.
    echo [GAGAL] Terjadi kesalahan saat upload. Pastikan Anda sudah login ke Git/GitHub.
)
echo.
pause

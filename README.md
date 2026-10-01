# Sejarah Nusantara Game

Game edukasi berbasis web tentang sejarah Nusantara dan perjuangan bangsa.

## Fitur
- Peta perjalanan sejarah
- Sistem quest dan dialog
- Pemain dan progres game
- Data quest yang dapat diperluas
- Desain responsif untuk browser

## Cara menjalankan

Pastikan Node.js sudah terinstal.

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di browser dengan server lokal.

## Deploy ke GitHub

1. Buat repository baru di GitHub.
2. Jalankan perintah berikut di folder ini:

```bash
git init
git remote add origin https://github.com/NAMA_USER/NAMA_REPO.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

Jika repo GitHub Anda sudah ada dan Anda ingin memperbarui, cukup jalankan:

```bash
git add .
git commit -m "Update game"
git push origin main
```

## Deploy ke GitHub Pages

Game ini sudah dibuat agar bisa dipublikasikan dengan GitHub Pages secara statis.

Langkahnya:

1. Upload project ke repository GitHub.
2. Buka repository di GitHub.
3. Masuk ke Settings -> Pages.
4. Pada Source pilih `Deploy from a branch`.
5. Pilih branch `main` dan folder `/root`.
6. Simpan.
7. GitHub akan memberikan URL publik seperti:
   `https://username.github.io/nama-repo/`

Catatan penting:
- Game ini tidak memerlukan backend Node.js saat dipublikasi.
- Penyimpanan pemain dan leaderboard disimpan di browser menggunakan `localStorage`, agar bisa berjalan di GitHub Pages.

## Struktur utama
- `index.html` : halaman utama
- `css/` : stylesheet
- `js/` : logika game
- `data/` : data pemain dan quest
- `quests/` : data quest sejarah
- `server.js` : server lokal untuk menjalankan aplikasi

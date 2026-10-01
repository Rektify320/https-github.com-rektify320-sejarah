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
git branch -M master
git push -u origin master
```

Jika repo GitHub Anda menggunakan branch `main`, ganti `master` dengan `main`.

## Deploy ke GitHub Pages

Untuk hosting statis, aktifkan GitHub Pages pada repository dan pilih branch yang berisi file HTML/CSS/JS, atau gunakan branch `gh-pages` jika Anda mengatur sendiri.

## Struktur utama
- `index.html` : halaman utama
- `css/` : stylesheet
- `js/` : logika game
- `data/` : data pemain dan quest
- `quests/` : data quest sejarah
- `server.js` : server lokal untuk menjalankan aplikasi

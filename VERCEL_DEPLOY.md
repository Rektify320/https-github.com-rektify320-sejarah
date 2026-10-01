# Deploy ke Vercel

Proyek ini merupakan situs statis HTML/CSS/JS, jadi cocok untuk deploy di Vercel tanpa build tool.

## 1) Login ke Vercel

```bash
npm run login
```

Atau langsung:

```bash
npx vercel login
```

## 2) Deploy ke production

```bash
npm run deploy
```

Atau:

```bash
npx vercel --prod
```

## 3) Jika punya token Vercel

```bash
set VERCEL_TOKEN=TOKEN_ANDA
npx vercel --prod
```

## 4) Link publik

Setelah deploy berhasil, Vercel akan memberikan URL seperti:

```text
https://nama-proyek-anda.vercel.app
```

## Catatan

- Project ini sudah menggunakan konfigurasi dasar di `vercel.json`.
- Jika belum login, Vercel CLI akan menolak deploy dengan error token invalid.
- Setelah login berhasil, deploy bisa dilakukan dengan cepat kapan saja.

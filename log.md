# Dokumentasi Prompt — ResponSetara

**Kompetisi:** BITSMIKRO Innovative Vibecode 2026  
**Nama Proyek:** ResponSetara  
**Kategori:** Vibe Coding / Front-End Product Experience  
**Domain Produksi:** https://afnicode.me  
**AI Coding Assistant:** Antigravity  
**Framework:** Laravel 13 + React 19 + Inertia.js + TypeScript + Tailwind CSS  
**Tanggal Finalisasi:** 10 Agustus 2026  

> Dokumen ini berisi rangkuman prompt utama yang digunakan selama proses perancangan, pengembangan, revisi UI/UX, pengujian, dan persiapan deployment ResponSetara. Credential, API key, password database, APP_KEY, dan data rahasia tidak dicantumkan.

---

## 1. Tujuan Proyek

ResponSetara adalah platform komunikasi darurat inklusif yang dirancang untuk membantu pengguna yang mengalami hambatan berbicara, mendengar, atau menyusun pesan saat kondisi darurat.

Fitur utama:
- Bantuan Darurat / penyusunan pesan terstruktur
- Mode Tidak Dapat Berbicara
- Mode Tidak Dapat Mendengar
- Text-to-Speech
- Speech-to-Text
- Quick Phrase
- Emergency Contact
- Gemini AI refinement dengan fallback
- CMS Admin
- Statistik penggunaan agregat
- Zero-data-retention untuk pesan, audio, transkripsi, dan lokasi pengguna

---

# LOG PROMPT

## Prompt 01 — Arsitektur dan Guardrail Produk

**Tujuan:** Menetapkan arah pengembangan ResponSetara agar fitur publik, AI, aksesibilitas, privasi, serta admin CMS memiliki batas yang jelas.

```text
Bangun ResponSetara sebagai aplikasi komunikasi darurat inklusif.

Stack utama:
- Laravel
- React + TypeScript
- Inertia.js
- Tailwind CSS / shadcn
- PostgreSQL/Supabase pada arsitektur utama
- Gemini API hanya melalui backend
- Browser Web Speech API untuk TTS/STT

Mode publik:
1. Bantuan Darurat
2. Tidak Dapat Berbicara
3. Tidak Dapat Mendengar

Prinsip:
- Tidak perlu login untuk fitur publik.
- Jangan menyimpan isi pesan darurat.
- Jangan menyimpan audio.
- Jangan menyimpan transkripsi.
- Jangan menyimpan lokasi.
- Statistik hanya agregat anonim.
- Jika Gemini gagal, gunakan template fallback.
- API key tidak boleh masuk frontend.
- Admin CMS terpisah dari halaman publik.

Pastikan aksesibilitas menjadi prioritas:
- semantic HTML
- keyboard navigation
- focus visible
- screen-reader labels
- text size control
- reduced motion
- WCAG AA

Jangan mengubah kontrak fitur tanpa alasan.
Lakukan testing sebelum menyatakan selesai.
```

**Hasil:** Fondasi aplikasi, tiga mode komunikasi publik, admin CMS, serta guardrail privasi berhasil dibangun.

---

## Prompt 02 — Persiapan Deployment Namecheap Shared Hosting

**Tujuan:** Menyiapkan deployment Laravel + React/Inertia ke Namecheap Shared Hosting secara aman.

```text
Siapkan paket deployment Namecheap Shared Hosting untuk ResponSetara.

Struktur server final:

/home/CPANEL_USER/
├── responsetara-app/
└── public_html/

Aplikasi Laravel harus berada di luar public_html.

public_html hanya berisi:
- index.php
- .htaccess
- build/
- favicon / asset publik

Frontend harus dibuild lokal menggunakan npm run build.

Jangan memasukkan ke ZIP:
- .env
- node_modules
- .git
- database.sqlite
- public/hot
- credential
- test-results
- playwright-report

Buat:
- panduan deployment
- environment checklist
- first deploy guide
- rollback guide
- script packaging PowerShell

Pastikan index.php public_html membaca:
../responsetara-app/vendor/autoload.php
../responsetara-app/bootstrap/app.php

Jangan melakukan deployment otomatis.
```

**Hasil:** Paket deployment Namecheap berhasil dibuat dan struktur aplikasi dipisahkan dari web root.

---

## Prompt 03 — Koreksi Konfigurasi Produksi Namecheap

**Tujuan:** Menyesuaikan deployment dengan domain dan hosting final.

```text
Perbaiki paket deployment Namecheap yang baru dibuat.

Konfigurasi final:
- Domain production: https://afnicode.me
- Registrar domain: Namecheap
- Hosting: Namecheap Shared Hosting Trial
- Primary domain hosting: afnicode.me

Lakukan:
1. Ganti referensi domain lama menjadi afnicode.me.
2. Hapus instruksi DNS provider lama.
3. Gunakan Namecheap SSL.
4. Hapus plain PHP test yang menggunakan helper env().
5. Gunakan php artisan migrate:status atau php artisan db:show.
6. Rollback tidak boleh menggunakan rm -rf public_html.
7. Jangan mengganti APP_KEY jika sudah valid.
8. Validasi ZIP tidak mengandung secret.
9. Generate ulang deployment ZIP.

Jangan mengubah DNS atau melakukan deployment.
```

**Hasil:** Dokumentasi deployment menjadi sesuai dengan kondisi produksi aktual.

---

## Prompt 04 — Front-End Competition Redesign

**Tujuan:** Mengalihkan fokus utama ke kualitas front-end setelah technical meeting menyatakan arsitektur backend tidak menjadi komponen penilaian utama.

```text
Project ResponSetara sudah berhasil berjalan.

Sekarang kerjakan hanya:

RESPONSETARA FRONTEND COMPETITION REDESIGN,
BRAND IDENTITY, ACCESSIBILITY, DAN MICRO-INTERACTIONS.

Jangan mengubah:
- backend
- database
- authentication
- route
- Gemini
- TTS/STT
- API contract
- .env

Tujuan:
1. Terlihat seperti produk digital modern.
2. Tidak terlihat seperti template Laravel default.
3. Memiliki logo dan brand identity sendiri.
4. Landing page lebih interaktif.
5. Disability-friendly.
6. Cepat dipahami dalam kondisi panik.
7. Micro-interaction ringan.
8. Responsive.
9. Konsisten public, login, dan admin.
10. Tidak merusak fitur existing.

Arah visual:
“Modern, humanis, tenang, inklusif, jelas, aman, dan cepat digunakan.”

Redesign:
- logo ResponSetara
- landing navbar
- hero
- mode komunikasi
- cara kerja
- panduan penolong
- kontak darurat
- privacy section
- footer
- login page
- auth layout
- admin branding ringan

Accessibility:
- WCAG 2.2 AA
- skip link
- focus visible
- 44x44 touch target
- reduced motion
- text-size control
- semantic landmarks

Jalankan:
php artisan test
npm run lint
npm run types:check
npm run build
npm run test:e2e:ci

Jangan melakukan deployment.
```

**Hasil:** Identitas ResponSetara diperkuat, login page di-redesign, landing page dibuat lebih modern, dan micro-interaction ditambahkan.

---

## Prompt 05 — Light-First Accessibility Refinement

**Tujuan:** Memperbaiki keterbacaan karena dark theme terlalu dominan pada fitur operasional.

```text
Lakukan refinement tahap kedua Frontend Competition Redesign.

Masalah:
- halaman mode komunikasi terlalu gelap
- form dan quick phrase tampak seperti disabled
- placeholder terlalu pucat
- hierarki visual kurang jelas
- login masih terlalu kecil dibanding area layar

Gunakan:
LIGHT-FIRST OPERATIONAL INTERFACE
DENGAN DARK BRAND SHELL.

Public operational pages:
- background terang
- card putih
- text gelap
- aksen teal/coral
- navbar/footer tetap navy

Landing:
- hero boleh navy/teal
- section berikutnya bergantian putih dan soft teal

Login:
- dark premium
- ukuran card, input, heading, dan copy diperbesar

Perbaiki:
- Assistance Mode
- Nonverbal Mode
- Deaf Mode
- Quick Phrase
- Voice Controls
- Login
- typography
- state enabled/disabled
- reduced motion

Jangan mengubah backend atau route.

Setelah implementasi:
php artisan test
npm run lint
npm run types:check
npm run build
npm run test:e2e:ci
```

**Hasil:** Form operasional menjadi lebih terbaca dan login mendapat refinement ukuran serta spacing.

---

## Prompt 06 — Final Single Light Theme Cleanup

**Tujuan:** Menghapus konflik multi-theme pada halaman publik dan menggunakan satu tema terang yang stabil.

```text
Lakukan FINAL SINGLE LIGHT THEME CLEANUP.

Tujuan final:
ResponSetara hanya menggunakan SATU TEMA TERANG pada seluruh halaman publik.

Hapus:
- public dark mode
- public high contrast theme switching
- theme selector publik
- theme localStorage publik
- data-public-theme
- class dark global untuk public

Pertahankan:
- Teks Besar
- keyboard accessibility
- focus visible
- reduced motion
- animation ringan
- responsive design

Landing:
- navbar navy
- hero navy
- section content terang
- footer navy

Bantuan Darurat:
- background light
- white card
- dark text
- teal selected state
- red emergency CTA

Nonverbal:
- white composer
- readable quick phrase
- visible placeholder

Mode Tuli:
- white/light operational panels
- readable transcript
- visible manual input

Jangan mengubah backend, database, route, migration, seeder,
Gemini, authentication, TTS/STT, atau .env.

Build ulang dan verifikasi runtime sebelum selesai.
```

**Hasil:** Public UI distabilkan pada satu tema terang agar tidak terjadi benturan warna antar-theme.

---

## Prompt 07 — Admin Dark Mode Scope Repair

**Tujuan:** Membuat area admin tetap dark tanpa memengaruhi landing page maupun login.

```text
PERBAIKI KESALAHAN SCOPE PADA REVISI ADMIN.

Tujuan:
1. Landing page tidak boleh berubah.
2. Login page tidak boleh berubah.
3. Hanya area admin/settings yang boleh menggunakan dark mode.
4. Jangan redesign landing atau login.
5. Jangan mengubah backend.

Gunakan whitelist file admin/settings saja.

Jangan mengubah:
- resources/js/pages/public/**
- resources/js/components/public/**
- PublicLayout
- auth pages
- AuthBrandLayout
- branding public

Dark admin harus di-scope lokal:

<div className="admin-shell dark min-h-screen">
    ...
</div>

Jangan memasang dark pada:
- html
- body
- document.documentElement

Admin dark harus mencakup:
- sidebar
- header
- dashboard
- cards
- tables
- user dropdown
- settings

Appearance Settings hanya berlaku pada admin.

Uji:
- landing tidak berubah
- login tidak berubah
- admin dark
- settings dark
- tidak ada dark class global

Jangan melakukan deployment.
```

**Hasil:** Dark mode admin dipisahkan dari public/login sehingga scope visual tidak saling memengaruhi.

---

## Prompt 08 — Perbaikan Kontras Warna dan Accessibility Testing

**Tujuan:** Menyelesaikan masalah color contrast yang terdeteksi melalui axe-core / Playwright.

```text
Audit seluruh kegagalan color contrast dari E2E.

Masalah utama:
- text teal pada background teal transparan
- coral text pada coral background transparan
- white text pada teal button kurang kontras
- teal accent pada dark background kurang kontras

Perbaiki menggunakan semantic color variables.

Pastikan:
- teal primary memiliki kontras AA terhadap background terang
- coral emergency memiliki kontras AA
- accent terang digunakan pada background navy
- CTA solid memiliki contrast ratio cukup
- header background solid agar axe-core dapat membaca computed background
- logo menggunakan warna berbeda untuk konteks terang/gelap

Jalankan ulang:
npm run build
npm run test:e2e:ci

Jika Firefox/WebKit gagal karena environment lokal,
jangan mengubah kode aplikasi hanya untuk menyembunyikan error.

Tambahkan Chromium-only test sebagai fallback validasi lokal bila perlu.
```

**Hasil:** Seluruh 26 test Chromium desktop + mobile lulus, termasuk accessibility audit.

---

## Prompt 09 — Final Frontend Namecheap Production Package

**Tujuan:** Membuat paket update front-end tanpa menyentuh backend/database produksi.

```text
FINALIZE RESPONSETARA FRONTEND FOR NAMECHEAP PRODUCTION UPDATE.

Project:
D:\ResponSetara\web-app

Production:
https://afnicode.me

Server:
 /home/afnivqow/
 ├── responsetara-app/
 └── public_html/

Frontend sudah final.
JANGAN redesign lagi.

Tujuan:
1. validasi final
2. clean production build
3. package frontend runtime
4. package source sync opsional
5. dokumentasi rollback

Jangan mengubah:
- backend
- database
- SQLite
- migration
- seeder
- authentication
- route
- Gemini
- TTS/STT
- .env
- APP_KEY
- index.php
- .htaccess

Validasi:
npm.cmd run lint
npm.cmd run types:check
php artisan test
npm.cmd run test:e2e:chromium

Clean build:
Remove-Item .\public\hot -Force -ErrorAction SilentlyContinue
Remove-Item .\public\build -Recurse -Force -ErrorAction SilentlyContinue
npm.cmd run build

Buat:
responsetara-frontend-final-runtime.zip

Isi:
public_html/
└── build/
    ├── manifest.json
    └── assets/

Buat juga:
responsetara-frontend-final-source.zip

Source hanya:
- resources/css
- resources/js
- package.json
- package-lock.json
- vite.config.ts jika relevan

Dilarang memasukkan:
- .env
- database.sqlite
- vendor
- node_modules
- storage/logs
- .git
- credential

Jangan melakukan deployment.
```

**Hasil:** Frontend siap diperbarui pada Namecheap tanpa migration, seeder, Composer install, atau perubahan credential.

---

# 2. Workflow Build Final

Perintah lokal final:

```powershell
cd D:\ResponSetara\web-app

Remove-Item .\public\hot -Force -ErrorAction SilentlyContinue
Remove-Item .\public\build -Recurse -Force -ErrorAction SilentlyContinue

npm.cmd run lint
npm.cmd run types:check
npm.cmd run build

php artisan optimize:clear
php artisan serve
```

Validasi local:
- `/`
- `/bantuan-darurat`
- `/tidak-dapat-berbicara`
- `/tidak-dapat-mendengar`
- `/login`
- `/dashboard`
- `/settings/appearance`

---

# 3. Deployment Front-End ke Namecheap

Update production dilakukan tanpa deploy ulang seluruh Laravel.

Mapping utama:

```text
LOCAL:
D:\ResponSetara\web-app\public\build

            ↓

NAMECHEAP:
/home/afnivqow/public_html/build
```

Workflow:
1. Backup folder `public_html/build`.
2. Upload runtime ZIP.
3. Extract di `/home/afnivqow/`.
4. Verifikasi `public_html/build/manifest.json`.
5. Jalankan:

```bash
cd ~/responsetara-app
php artisan optimize:clear
php artisan config:cache
php artisan view:cache
```

6. Hard refresh / Incognito.
7. Test semua route utama.
8. Database tidak disentuh.

---

# 4. Guardrail Produksi

Perintah berikut **tidak dijalankan** untuk update frontend:

```bash
php artisan migrate
php artisan migrate:fresh
php artisan db:seed
composer install
npm install
```

Database production tetap berada pada server dan tidak ditimpa oleh paket frontend.

---

# 5. Pengujian

Validasi yang digunakan selama pengembangan:

- Laravel PHPUnit
- ESLint
- TypeScript type checking
- Vite production build
- Playwright E2E
- axe-core accessibility checks
- Chromium desktop
- Mobile Chrome
- Manual desktop QA
- Manual responsive/mobile QA

Catatan: kegagalan Firefox/WebKit pada salah satu pengujian lokal berasal dari environment Windows / browser binary, bukan dari logika aplikasi. Chromium desktop dan mobile digunakan sebagai verifikasi utama lokal.

---

# 6. Prinsip Vibe Coding yang Digunakan

Selama proses pengembangan, prompt ditulis dengan pola:

1. Menjelaskan konteks proyek.
2. Memberikan scope perubahan.
3. Menentukan file/area yang boleh disentuh.
4. Menentukan file/area yang tidak boleh disentuh.
5. Menentukan acceptance criteria.
6. Meminta automated test.
7. Meminta runtime verification.
8. Meminta output perubahan secara eksplisit.
9. Memisahkan development, build, dan deployment.
10. Tidak memasukkan credential ke prompt/dokumentasi.

Pendekatan ini digunakan untuk mengurangi perubahan di luar scope dan menjaga stabilitas fitur yang sudah berjalan.

---

# 7. Status Final

**Frontend:** Final  
**Deployment:** Online  
**Domain:** https://afnicode.me  
**Backend functionality:** Aktif  
**AI feature:** Aktif dengan fallback  
**Accessibility:** Diuji  
**Admin CMS:** Aktif  
**Production database:** Tidak dimasukkan ke dokumentasi prompt  
**Credential:** Tidak dicantumkan  

---

## Catatan untuk Penilaian

Dokumentasi ini berfokus pada bagaimana AI coding assistant digunakan dalam proses Vibe Coding, mulai dari perancangan, implementasi, revisi berdasarkan hasil testing, perbaikan aksesibilitas, hingga persiapan production build.

Sebagian besar iterasi dilakukan menggunakan pola **prompt → implementasi AI → runtime review → automated test → refinement**, sehingga hasil akhir tidak hanya mengandalkan generated code, tetapi juga melalui validasi dan revisi berulang berdasarkan perilaku aplikasi aktual.

---

**ResponSetara — Komunikasi Darurat Inklusif**  
BITSMIKRO Innovative Vibecode 2026

# ResponSetara: Platform Kedaruratan Inklusi & Aksesibel (Web-App Workspace)

**ResponSetara** adalah sistem web tangkas yang merespons situasi kedaruratan nasional (medis, kebakaran, keamanan, bencana alam) dengan desain khusus berprinsip *Universal & Inclusive Design* bagi seluruh lapisan warga Indonesia, termasuk para penyandang disabilitas ketunaan rungu (*deaf*) maupun hambatan verbal (*nonverbal/speech impaired*).

---

## 1. Arsitektur & Teknologi Pilar

- **Backend / Core API**: Laravel 11 dengan arsitektur **Template-First Deterministic** dan **Gemini AI Emergency Refinement** berfondasikan *zero retention* data.
- **Frontend & Presentasi**: React 19 + TypeScript + Inertia.js dan Vite, diolah menggunakan Tailwind CSS dengan palet warna harmonis bertingkat tinggi (*Oklch color system*) untuk kontras optimal.
- **Basis Data & Integrasi**: Supabase PostgreSQL dengan pengontrol hak akses superketat berbasis Eloquent Property Explicit Assignment (kebijakan *Anti-Mass Assignment*).
- **Keamanan & Aksesibilitas Web**: Middleware kustom `SecurityHeaders`, Content Security Policy (CSP) mode ketat (*script-src self*), isolasi *No-Store Cache Control* bagi halaman berizin sensitif, serta audit otomatis standar WCAG AA dengan `@axe-core/playwright`.

---

## 2. Instruksi Pengoperasion & Instalasi Lingkungan Kerja

### A. Persiapan Prasyarat (Prerequisites)
Pastikan lingkungan terminal memiliki instalasi:
- PHP >= 8.3
- Node.js >= 20.x & npm
- Composer

### B. Pengaturan Variabel Lingkungan & Database Local
1. Salin berkas konfigurasi sampel:
   ```bash
   cp .env.example .env
   ```
2. Generate kunci aplikasi Laravel dan migrasi tabel refrence:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
3. Pasang paket ketergantungan PHP dan JavaScript:
   ```bash
   composer install
   npm install
   ```

---

## 3. Menjalankan Server Aplikasi (Development)
Untuk mode pengembangan sehari-hari dengan *hot-reload* cepat:
```bash
# Terminal 1: Laravel Development Server
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2: Vite React Hot-Module Replacement
npm run dev
```

---

## 4. Panduan Eksekusi Suite Pengujian Otomatis (Comprehensive Test Suite)

ResponSetara mengadopsi standar validasi ganda untuk menjaga keandalan saat momen genting kedaruratan: **PHPUnit Backend Assurance** dan **Playwright + Axe E2E Testing**.

### A. Pengujian Backend Laravel & Keamanan (PHPUnit / Pest Test)
Menjalankan verifikasi perlindungan otorisasi massal, validasi header `no-store`, dan pengujian orchestrator pesan darurat AI / Template:
```bash
# Menjalankan seluruh test suite Laravel
php artisan test

# Menjalankan secara spesifik suite uji remedi keamanan dan cache-control
php artisan test --filter="UserMassAssignmentRemediationTest|SecurityHeadersAndCacheControlTest"
```

### B. Pengujian Kualitas & Sintaksis Frontend (TypeScript & ESLint)
Memastikan 0 (nihil) kesalahan tipe data dan nihil peringatan gaya penulisan:
```bash
npm run lint
npm run types:check
```

### C. Pengujian End-to-End & Aksesibilitas (Playwright & Axe-Core)
Pengujian E2E dijalankan pada lingkungan SQLite terisolasi dengan performa hemat sumber daya (*workers: 1*):
1. **Instalasi Binary Browser Playwright (Sekali di Awal):**
   ```bash
   npx playwright install
   ```
2. **Setup Server & Database E2E Khusus:**
   Aplikasi secara otomatis membangun server lokal `http://127.0.0.1:8010` dan memanfaatkan `.env.e2e`. Apabila ingin menjalankan server manual di terminal terpisah:
   ```bash
   php artisan migrate:fresh --seed --env=e2e
   php artisan serve --host=127.0.0.1 --port=8010 --env=e2e
   ```
3. **Eksekusi Perintah Test E2E via NPM Scripts:**
   - `npm run test:e2e`: Menjalankan suite pengujian lengkap secara ekstensif pada 5 profil desktop dan mobile modern (Chromium, Firefox, WebKit, Mobile Chrome Pixel 5, Mobile Safari iPhone 12).
   - `npm run test:e2e:a11y`: Spesifik mengaudit nihilnya pelanggaran aksesibilitas WCAG AA menggunakan mesin Axe-Core.
   - `npm run test:e2e:ui`: Memperingati antarmuka UI Playwright untuk analisa interaktif.
   - `npm run test:e2e:ci`: Eksekusi non-interaktif hemat resource berpenampil ringkas siap sistem Continuous Integration (CI).

---

## 5. Dokumentasi Terikat (Pilar Referensi Resmi)
- **[Keamanan & Remedi Celah (docs/SECURITY.md)](docs/SECURITY.md)**: Rincian remediasi *Mass Assignment*, mitigasi kebocoran rahasia AI, dan konfirmasi kebijakan *No-Store Cache Control*.
- **[Arus Data & Privasi (docs/PRIVACY_DATA_FLOW.md)](docs/PRIVACY_DATA_FLOW.md)**: Dokumentasi kebijakan *Zero-Retention*, skema pemanggilan Gemini API mandiri tanpa log persisten, serta arsitektur data lintas batas browser.
- **[Panduan Eksekusi E2E & Mocking (docs/E2E_TESTING.md)](docs/E2E_TESTING.md)**: Metodologi intersepsi perangkat keras (mikrofon, panggilan telepon rasmi, WhatsApp) dan isolasi eksekusi pengujian.
- **[Checklist Penerimaan Manual Aksesibilitas (docs/MANUAL_ACCEPTANCE_TEST.md)](docs/MANUAL_ACCEPTANCE_TEST.md)**: Matriks pengesahan pengujian navigasi keyboard murni, pembaca layar (NVDA/VoiceOver/TalkBack), dan degradasi offline di lapangan.
- **[Spesifikasi API Publik (docs/PUBLIC_API.md)](docs/PUBLIC_API.md)** & **[OpenAPI Schema (docs/openapi.yaml)](docs/openapi.yaml)**: Dokumentasi antarmuka JSON yang terbuka untuk integrasi mitra layanan tanggap darurat nasional.

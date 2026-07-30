# Panduan Eksekusi, Arsitektur Mocking, & Isolasi Pengujian End-to-End (E2E_TESTING.md)

Dokumen ini menjadi pedoman operasional dan spesifikasi teknis untuk otomatisasi uji validasi ujung ke ujung (*End-to-End Testing*) pada **ResponSetara** menggunakan kombinasi **`@playwright/test`** dan audit aksesibilitas otomatis **`@axe-core/playwright`**.

---

## 1. Arsitektur Isolasi Eksekusi & Mode Hemat Sumber Daya

ResponSetara dirancang untuk melayani lingkungan tanggapan kritis namun harus efisien saat diuji secara konsisten di jalur pengembangan maupun pipa integrasi CI/CD.

### A. Desain Hemat Sumber Daya (Resource-Efficient Execution)
Konfigurasi `playwright.config.ts` distandarkan secara eksplisit untuk mencegah beban CPU eksponensial maupun *race condition* di antara sesi pengujian:
- `workers: 1` : Mengeksekusi pengujian dalam satu antrean sekuensial dan stabil.
- `fullyParallel: false` : Mencegah benturan state antar file spesifikasi, menjamin prediktabilitasi hasil pembacaan DOM.
- **Dukungan Cross-Browser Komprehensif**: Mendistribusikan penelusuran secara adil melintasi 5 profil standar global:
  1. Desktop Chromium
  2. Desktop Firefox
  3. Desktop WebKit
  4. Mobile Chrome (Profil resolusi dan layar emulasi *Pixel 5*)
  5. Mobile Safari (Profil emulasi dan agen navigasi *iPhone 12*)
- `trace: 'on-first-retry'` & `screenshot: 'only-on-failure'` : Pemanfaatan rekam jejak disk hemat ruang yang langsung menangkap bukti visual secara otomatis begitu terjadi penyimpangan hasil pengujian.

### B. Isolasi Mutlak Environment dan Basis Data
1. **Pemanfaatan `.env.e2e` & `database/e2e.sqlite`**: Pengujian tidak pernah melepaskan kueri tulis atau operasi destruktif ke instance basis data Supabase PostgreSQL produksi maupun staging asli. Seluruh kueri Eloquent diposisikan ke file piringan statis SQLite lokal (`database/e2e.sqlite`).
2. **Ketiadaan Ketergantungan AI Murni**: Parameter konfigurasi E2E secara langsung membisukan eksekusi rahasia nyata dengan mengondisikan `GEMINI_ENABLED=false`, menghilangkan kebergantungan penagihan biaya API eksternal saat proses integrasi harian berlangsung.

---

## 2. Paradigma Wajib Mocking Perangkat Keras & Aplikasi Luar (Mandatory Mocking Paradigm)

Dalam mengejar keandalan pengujian tanpa gangguan atas perangkat keras tester dan keamanan lingkungan kerja, ResponSetara menerapkan hukum pemisahan dan rekayasa tiruan (*stubbing/mocking*) berseni tinggi:

### A. Mocking Lokasi Satelit GPS (Geolocation Isolation)
- **Problem**: Pemanggilan `navigator.geolocation.getCurrentPosition` secara konvensional akan meloloskan dialog perizinan pop-up browser tingkat OS atau menggantung karena ketiadaan sinyal satelit di server CI.
- **Intervensi**: Playwright memompa konteks perizinan buatan secara atomik melalui perintah `await context.grantPermissions(['geolocation'])` dan langsung menginjeksikan koordinat simulasi presisi `await context.setGeolocation({ latitude: -6.200000, longitude: 106.816666 })`.

### B. Isolasi Mikrofon Suara & Speaker (STT & TTS API Interception)
- **Problem Test Mode Tidak Dapat Mendengar (STT)**: Sistem pembaca suara `SpeechRecognition` asli di peramban menuntut input audio nyata dari mikrofon keras PC yang berujung fatalitas pada pengujian nirsentuh (*headless CI*).
- **Intervensi**: Eksekusi mengesampingkan rute perangkat keras dengan menyematkan objek kelas simulasi (`page.addInitScript(...)`) untuk `window.SpeechRecognition` dan `window.webkitSpeechRecognition` yang mentransfer *payload text transcript* akurat ("Tolong kirimkan ambulans sekarang...") dengan status `isFinal: true` dalam jeda asinkron 300ms sesudah pemanggilan metode `.start()`.
- **Intervensi Mode Tidak Dapat Berbicara (TTS)**: Demikian pula, output ucapan hardware `window.speechSynthesis` diredam melalui pelacak simulasi yang memutar callback `onend` serta mendeteksi eksistensi leksikon resmi kontol kendali suara **"Berhenti"** (menihilkan sebutan cacamarita "Setop").

### C. pencegahan Pemutakhiran Aplikasi Panggilan Telepon dan WhatsApp (External App Interception)
- **Problem**: Pengklikan tombol bertolak belakang seperti "Hubungi 119 Sekarang" (`tel:119`) atau "Kirim ke WhatsApp" (`https://wa.me/...`) tidak diperkenankan mengalihkan kontrol fokus keluar dari sandbox peramban tes atau membentang aplikasi perpesanan meja kerja aslinya.
- **Intervensi**: Penambatan proteksi Javascript internal meluncurkan penyangga pada jendela penelusuran tautan luaran (`window.open = () => null`) serta mencatat kemurnian alamat protokol `href` kedaruratan bebas pulsa ke dalam daftar intersepsi verifikasi validasi.

### D. Simulasi Skenario Sukses, Kegagalan, & Fallback Gemini AI
Pada `tests-e2e/assistance.spec.ts`, rute pengiriman pesan dicoba melintas tiga skenario ekosistem:
1. **Deterministik Tanpa AI (`use_ai: false`)**: Konfirmasi balasan API bertingkat kemanjuran murni dari gudang `EmergencyMessageTemplateService`.
2. **AI Opt-in + Consent Berhasil**: Pengetasan HTTP intercept menuju `/api/v1/compose-message` menghasilkan parameter sumber `source: 'ai'`.
3. **Simulasi Kegagalan dan Degradasi AI**: Menguji kekebalan antarmuka ketika simulasi AI mengembalikan balasan kesalahan atau berkarakteristik fallback `source: 'template'` beserta indikator `fallback_used: true`, memastikan penampil teks frontend beradaptasi mulus tanpa menampilkan jejak error (*zero raw trace display*).

---

## 3. Direktori Spesifikasi & Perintah Eksekusi NPM E2E

### A. Rincian Suite Penyerahan Uji (`tests-e2e/`)
| Berkas Uji Spesifikasi | Cakupan Pembuktian & Keberhasilan Mutlak |
| :--- | :--- |
| **`landing.spec.ts`** | Navigasi kartu ke 3 mode utama, nihil teks asing ('বিজ্ঞান'), aktivasi fungsional tombol toggle ukuran teks besar/normal. |
| **`assistance.spec.ts`** | Penyusunan pesan bantuan, otorisasi eksplisit ganda AI Opt-in & Consent, simulasi penanggulangan degradasi fallback, isolasi WhatsApp. |
| **`speech.spec.ts`** | Operasionalisasi frasa cepat pada TTS, normalisasi kosakata tombol kontrol ("Berhenti"), dan perekaman eksekusi rekayasa tanpa perangkat keras speaker. |
| **`hearing.spec.ts`** | Emulasi mikrofon STT palsu, penerjemahan transkripsi audio ke tulisan, dan proteksi konsistensi label. |
| **`emergency-contacts.spec.ts`** | Pengecekan dialog konfirmasi bebas pulsa telepon 119/112 dan verifikasi pengembalian fokus antarmuka begitu modal ditutup. |
| **`admin.spec.ts`** | Pengujian pelacakan perlindungan *cache no-store*, perlindungan pengambilalihan otentikasi login, serta nihil rekam jejak kunci rahasia (`GEMINI_API_KEY`) di dokumen HTML Dasbor CMS. |
| **`accessibility.spec.ts`** | Penjalaran mesin audit `@axe-core/playwright` pada seluruh halaman komunikasi publik. **Target Mutlak: 0 (Nihil) Pelanggaran Kritis dan Serius standar WCAG 2.1 AA / 2.2 AA.** |

### B. Komando Eksekusi Suite (NPM Scripts Command)
Jalankan komando standar eksekusi Playwright E2E melalui terminal kerja:

```bash
# Eksekusi seluruh pengujian standar cross-browser
npm run test:e2e

# Eksekusi terkhusus pada pemantauan aksesibilitas Axe WCAG
npm run test:e2e:a11y

# Membaca panel UI pemantau interaktif Playwright
npm run test:e2e:ui

# Pemutakhiran mode non-interaktif hemat resource siap Continuous Integration
npm run test:e2e:ci
```

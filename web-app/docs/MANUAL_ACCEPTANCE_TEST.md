# Checklist Pengujian Manual & Penerimaan Aksesibilitas (Manual Acceptance Test)

 Dokumen ini menjadi pedoman resmi untuk verifikasi aksesibilitas ekstensif yang memerlukan interaksi manusiawi dan eksekusi pada perangkat keras nyata (peramban lunak, screen reader khusus, serta simulasi kondisi darurat lapangan) sebelum go-live ke lingkungan produksi/staging.

---

## 1. Pengujian Aksesibilitas Manual (A11y & Inclusive Design)

### A. Navigasi Eksklusif Keyboard (Keyboard-Only Navigation)
Seluruh halaman utama harus dapat dioperasikan tanpa perangkat titik (pointer/mouse), dengan fokus visual yang jelas, kontras tinggi (outline ring minimal 4px), dan urutan tab (tab order) yang intuitif.

| Skenario Pengujian | Langkah Pengujian | Kriteria Keberhasilan (Expected Result) | Status (Pass/Fail/Pending) | Catatan Khusus / Browser Tes |
| :--- | :--- | :--- | :--- | :--- |
| **Skip-to-Content Link** | 1. Buka Halaman Utama `/`.<br>2. Tekan tombol `Tab` pertama kali. | Tautkan "Langsung ke konten utama" (Skip-Link) muncul secara visual dengan kontras tinggi. Tekan `Enter` mengarahkan fokus ke elemen `main`. | **PASS** (Baseline Verified) | Tested on Chromium, Firefox, WebKit |
| **Urutan Fokus Tombol Utama** | 1. Navigasikan dari navigasi utama hingga kartu 3 Mode Darurat menggunakan tombol `Tab`. | Fokus beralih urut secara linier dari kiri ke kanan dan atas ke bawah tanpa terjebak (no keyboard trap). Cincin fokus teal-500 terlihat tajam. | **PASS** | Meminimalisir FOUC & lag |
| **Navigasi Modal Kontak Darurat** | 1. Buka modal "Siapkan 119" dengan menekan `Space`/`Enter`.<br>2. Tekan `Tab` di dalam modal. | Fokus terkunci (focus trap) di dalam dialog konfirmasi. Tidak dapat fokus ke elemen latar belakang di bawah modal. | **PASS** | Kompatibel dengan WCAG 2.1 AA |
| **Penutupan Modal & Return Focus** | 1. Dari dalam modal terbuka, tekan tombol `Escape` (atau tombol Batal). | Modal tertutup secara halus dan fokus kemudi dikembalikan (*restore focus*) persis ke tombol "Siapkan" awal pemanggil modal. | **PASS** | Intersepsi event escape konsisten |
| **Formulir Susun Pesan Bantuan** | 1. Buka Mode Saya Butuh Bantuan.<br>2. Navigasi antar kategori, kondisi, dan jenis bantuan via `Tab`/`Space`/`Enter`. | Pemilihan opsi kedaruratan berstatus `aria-pressed="true"` dengan penanda visual tegas yang dapat dipilih via keyboard tunggal. | **PASS** | Radio/button role diverifikasi |

---

### B. Pengujian Pembaca Layar (Screen Reader Validation - NVDA & VoiceOver)
Verifikasi kompatibilitas sintaksis semantik dengan perangkat lunak pembaca layar standar di ekosistem desktop dan mobile.

| Perangkat & OS | Screen Reader | Area / Alur Uji | Kriteria Keberhasilan | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 11 / 10** | **NVDA (Chrome/Edge)** | Landing Page & Toggle Ukuran Teks | NVDA membacakan struktur H1 tunggal, landmark `main`, `navigation`, dan `footer` secara akurat. Saat toggle teks diklik, label berubah koheren: *"Perbesar ukuran teks, tombol"* menjadi *"Kembalikan ke ukuran teks normal"*. | **PASS** |
| **macOS Sonoma / Sequoia** | **VoiceOver (Safari)** | Mode Saya Butuh Bantuan & AI Opt-In | VoiceOver menuturkan pemberitahuan wajib *"Wajib: Saya setuju informasi kedaruratan umum dikirim..."* saat kotak centang fokus. Preview pesan otomatis teranotasi `aria-live` untuk diperdengarkan kepada penyandang disabilitas ketanjenangan penglihatan. | **PASS** |
| **iOS / iPadOS** | **VoiceOver Mobile** | Kontak Darurat & Panggil Cepat | Tombol panggilan *"Hubungi 119 Sekarang"* disebutkan sebagai tautan aksi langsung bebas pulsa tanpa jeda membingungkan. | **PASS** |
| **Android 13/14** | **TalkBack (Chrome Mobile)** | Mode Tidak Dapat Berbicara (TTS) & STT | Kontrol audio memperjelas status *"Suarakan"* dan *"Berhenti"* (serta nihil penggunaan kata tidak lazim "Setop"). | **PASS** |

---

### C. Pengujian Kontras Tinggi & Zoom Viewport (200% - 400%)
Memastikan desain responsif tidak pecah (no text overlapping, no cropped UI, no broken flow) saat pengguna berkebutuhan khusus membesarkan viewport browser.

| Skenario Uji | Prosedur Uji Manual | Toleransi Keterbacaan (Expected Result) | Status |
| :--- | :--- | :--- | :--- |
| **Zoom 200% (WCAG AA Standard)** | Perbesar antarmuka peramban desktop hingga 200% pada rilis resolusi standar (1280x720 atau 1920x1080). |Seluruh teks membesar proporsional. Layout bertransformasi ke mode tumpuk vertical (*stacking*). Tidak ada kontainer yang memotong teks kedaruratan. | **PASS** |
| **Zoom 400% (Extreme Visibility Test)** | Perbesar tampilan browser hingga batas maksimum 400%. | Elemen antarmuka beradaptasi layaknya viewport perangkat mobile sempit (single-column flex). Tombol *Touch Target* tetap memenuhi batas minimal ergonomis 44x44 px. | **PASS** |
| **Mode Warna Sistem (High Contrast / Dark Mode)** | Aktifkan preferensi High Contrast atau OS Dark Mode (`prefers-color-scheme: dark`). | Palet warna Oklch berbasis gelap (Navy/Teal/Coral) langsung aktif tanpa kilau FOUC menyilaukan. Kombinasi warna teks atas latar memenuhi rasio minimal kontras 4.5:1 untuk teks normal dan 3:1 untuk teks besar/judul. | **PASS** |

---

## 2. Pengujian Penanganan Kondisi Ekstrim & Jaringan (Edge-Case & Degradation Tests)

Aplikasi kedaruratan wajib memiliki daya tahan tinggi dan degradasi mulus di lapangan saat konektivitas terganggu atau perangkat keras tidak mendukung.

| Skenario Kritis Lapangan | Langkah Rekayasa Uji | Respons Aplikasi yang Dipersyaratkan | Status |
| :--- | :--- | :--- | :--- |
| **Degradasi Offline (Offline Graceful Degradation)** | 1. Matikan sambungan internet (atau putuskan koneksi di DevTools Offline Mode).<br>2. Buka aplikasi dan pilih Mode Saya Butuh Bantuan. | Aplikasi beroperasi lancar dengan data referensi tersembur dari memori lokal/fallback-config. Pengguna tetap dapat memilih kategori dan menyusun pesan template deterministik. Tautan WhatsApp merender URI skema `wa.me` offline yang siap diunggah ketika sinyal kembali. | **PASS** |
| **Simulasi Fallback Gemini AI (AI Timeout & Error Handling)** | 1. Centang opsi "Rapikan pesan dengan AI" + Consent di Mode Bantuan.<br>2. Simulasikan kegagalan koneksi ke API Gemini (atau timpa HTTP Status ke 503/400/Timeout). | Backend Laravel langsung secara otomatis dan atomik memutus eksekusi AI dan **mengembalikan hasil pesan dari Template Deterministik**. Parameter `fallback_used` berstatus `true`. **Frontend tidak boleh mengalami crash, tidak blank, dan tidak mencetak stack trace**. | **PASS** |
| **Sinyal GPS Lemah atau Izin Lokasi Ditolak** | 1. Pada dialog konfirmasi lokasi browser, tekan **Block** (atau simulasikan timeout GPS geolocation di lapangan). | Aplikasi menampilkan label peringatan santun dan seketika memberikan fokus pada kolom input **Lokasi Manual ("Ketik alamat atau patokan lokasi Anda")**. Penyusunan pesan dilangsungkan dengan koordinat dibiarkan kosong, tanpa merusak format kalimat telepon/WhatsApp. | **PASS** |
| **Kegagalan Output Suara TTS (Hardware Speaker Failure)** | 1. Simulasikan eksekusi pada peramban lunak yang tidak memiliki mesin sintetiser suara `window.speechSynthesis` (contoh: lingkungan kiosk atau terminal minimalis). | Antarmuka menonaktifkan kontrol animasi pemutaran audio dengan umpan balik visual yang jelas, namun teks frasa cepat darurat tetap dapat disalin (Copy to Clipboard) atau diarahkan via tombol alternatif tanpa error JavaScript. | **PASS** |
| **Simulasi Kegagalan Web Share API** | 1. Tekan tombol bagikan pesan pada peramban desktop yang tidak melayani spesifikasi `navigator.share` native. | Aplikasi langsung melakukan fallback otomatis ke fitur salin papan klip (Copy to Clipboard) atau merender tautan konvensional WhatsApp tanpa melempar pengecualian konsol. | **PASS** |

---

## 3. Catatan Pengesahan Kesiapan Staging (Sign-Off Record)

- **Audit Aksesibilitas Baseline**: Dipastikan **0 (Nihil) Pelanggaran Kritis atau Serius** pada pemindai otomatis WCAG (`@axe-core/playwright`).
- **Pembersihan Konten Liar**: Ditegaskan **tidak terdapat string asing liar** (seperti string Bengali `'বিজ্ঞান'`) di seluruh lapisan presentasi.
- **Konsistensi Bahasa Kedaruratan**: Seluruh kontrol penuturan suara (TTS) terstandarisasi memakai leksikon resmi Bahasa Indonesia: **"Berhenti"** (menghapuskan padanan kata asing/informal "Setop").
- **Audit Kode & Perlindungan Tampilan**: Seluruh pengujian manual terimplementasi bergandengan dengan perlindungan dari injeksi skrip tak sah (CSP strict mode: `script-src 'self'`).

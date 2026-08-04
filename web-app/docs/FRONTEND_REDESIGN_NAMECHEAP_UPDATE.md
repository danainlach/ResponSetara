# Panduan Deployment Namecheap & Laporan Redesign Frontend

Dokumen ini berisi daftar perubahan sistem visual dan petunjuk khusus untuk mengunggah pembaruan asset frontend hasil kompilasi lokal ke Namecheap cPanel Shared Hosting (`https://afnicode.me`).

---

## 1. Ringkasan Perubahan Desain & Aksesibilitas (WCAG 2.2 AA)

1. **Midnight & Teal Theme Integration**
   - Menyelaraskan seluruh palet warna dengan warna utama Teal (`#13B8A6`), pendukung Cyan (`#38BDF8`), dan Coral merah (`#D9383A`) untuk keadaan darurat.
   - Latar belakang utama menggunakan warna gelap midnight layered (`#071A26`, `#0B2433`, `#0E3042`).

2. **Identitas Merek Baru (Brand Identity)**
   - Logo kustom `ResponSetara` berbasis SVG (`ResponSetaraLogo.tsx`, `ResponSetaraMark.tsx`) yang merepresentasikan perisai keamanan, balon suara inkusif, dan garis kesetaraan hak komunikasi.
   - Favicon kustom `public/favicon.svg` menggantikan logo Laravel default.

3. **Restrukturisasi Halaman Autentikasi**
   - Menggunakan split layout panel (kiri panel branding & kanan form input) pada layar desktop dan layout card tunggal responsif pada mobile.
   - Lokalisasi penuh ke Bahasa Indonesia untuk seluruh alur login, lupa sandi, atur ulang sandi, verifikasi email, konfirmasi sandi, dan otentikasi dua faktor (`two-factor-challenge.tsx`).
   - Penambahan fitur tampilkan/sembunyikan password dan tombol Passkey modern.

4. **Aksesibilitas WCAG 2.2 AA & Kontras Tinggi**
   - Tombol `TextSizeToggle.tsx` kini terhubung dengan state global dan nilainya disimpan secara persisten di `localStorage` (`responsetara_text_size`).
   - Seluruh rasio kontras elemen teks utama dan CTA darurat telah diperbaiki agar memenuhi standar minimal **4.5:1** (misalnya, teks hitam di atas tombol teal, dan warna coral dirubah menjadi `#D9383A` agar white text lulus audit contrast).
   - Penambahan media query `@media (prefers-reduced-motion: reduce)` secara global untuk menonaktifkan transkripsi animasi instan demi kenyamanan pengguna dengan gangguan vestibular.
   - Fokus keyboard memiliki ring outline kustom berkontras tinggi (`outline: 3px solid var(--focus-ring)`).

5. **Optimalisasi Tabel Portal Admin**
   - Memodifikasi container pembungkus seluruh tabel CMS di halaman admin dari `overflow-hidden` menjadi `overflow-x-auto` agar tabel tidak terpotong pada monitor berukuran kecil.

---

## 2. Hasil Pengujian Lokal (Verification Logs)

- **Backend (PHPUnit Tests)**: **179 Tests / 177 Passed, 2 Skipped** (100% Success).
- **TypeScript & ESLint Check**: **Selesai tanpa peringatan** (`tsc --noEmit` & `eslint .` clean).
- **Playwright E2E Tests (Chromium)**: **26 Tests Passed** (Termasuk seluruh E2E Accessibility A11y Axe audit).

---

## 3. Prosedur Deployment Namecheap Shared Hosting

Karena build aset frontend dilakukan secara lokal, Anda perlu memperbarui berkas HTML dan aset JS/CSS terkompilasi ke dalam akun cPanel Namecheap.

### Langkah A: Build Aset Secara Lokal
Jalankan perintah berikut di komputer lokal Anda:
```bash
npm run build
```
Proses ini akan menghasilkan berkas bundel teroptimasi di dalam folder `public/build/`.

### Langkah B: File-File yang Harus Di-upload
Unggah berkas-berkas berikut dari folder lokal Anda ke server Namecheap menggunakan **cPanel File Manager** atau **FTP client**:

1. **Folder Aset Terkompilasi**
   - **Lokal**: `web-app/public/build/*` (Seluruh folder `build` beserta isinya)
   - **Tujuan cPanel**: `/home/afnivqow/public_html/build/`
   
   > [!IMPORTANT]
   > Bersihkan terlebih dahulu folder `/home/afnivqow/public_html/build/` di cPanel untuk menghindari file sampah dari kompilasi lama sebelum mengunggah aset baru.

2. **File Favicon Baru**
   - **Lokal**: `web-app/public/favicon.svg`
   - **Tujuan cPanel**: `/home/afnivqow/public_html/favicon.svg`

3. **Folder Modifikasi React & Controller (Source Laravel)**
   Jika ada modifikasi routing atau controller di sisi backend, unggah file tersebut ke root source Laravel di cPanel:
   - **Tujuan cPanel**: `/home/afnivqow/responsetara-app/` (sesuaikan dengan letak path controllers/views yang diubah).

---

## 4. Verifikasi Pasca Deployment

Setelah semua file diunggah ke Namecheap:
1. Akses web `https://afnicode.me`.
2. Lakukan Hard Reload (`Ctrl + F5` atau `Cmd + Shift + R`) pada peramban Anda untuk membersihkan cache.
3. Buka halaman Login Admin untuk memverifikasi tampilan split layout yang baru.
4. Uji tombol pembesar teks (Text Size Toggle) untuk memastikan teks membesar dan preferensi tetap tersimpan saat berpindah halaman.

# PRODUCT REQUIREMENTS DOCUMENT — RESPONSETARA

## 1. Ringkasan Produk

ResponSetara adalah aplikasi web komunikasi keadaan darurat yang membantu pengguna tuli, pengguna nonverbal, pengguna dengan hambatan bicara sementara, dan masyarakat umum berkomunikasi melalui:

- Form bantuan terpandu
- Frasa cepat
- Text-to-Speech
- Speech-to-Text
- AI Emergency Message Composer
- Mode tampilan pesan berukuran besar
- Panduan penolong
- Daftar kontak darurat
- CMS admin

Aplikasi tidak menggantikan layanan darurat resmi.

## 2. Role

### User Publik

Tidak memiliki akun dan tidak perlu login.

### Admin

Wajib login dan dapat mengelola konten CMS.

## 3. Fitur User

### 3.1 Landing Page

1. Navbar
2. Hero
3. Tombol Mulai Komunikasi Darurat
4. Tiga mode komunikasi
5. Cara kerja
6. Panduan penolong
7. Kontak darurat
8. Disclaimer
9. Footer

### 3.2 Mode Saya Butuh Bantuan

Input:

- Kategori kejadian
- Lokasi manual
- Lokasi perangkat secara opsional setelah izin
- Kondisi dari CMS
- Bantuan yang dibutuhkan
- Informasi tambahan opsional

Output:

- Pesan darurat
- Mode tampilan teks besar
- Tombol bacakan
- Tombol salin
- Tombol ubah data
- Tombol mulai ulang

### 3.3 Mode Saya Tidak Dapat Berbicara

- Textarea pesan
- Frasa cepat dari database
- Filter kategori
- Tombol bacakan
- Pengaturan kecepatan suara
- Jeda, lanjutkan, dan berhenti
- Tombol salin
- Mode layar penuh

### 3.4 Mode Saya Tidak Dapat Mendengar

- Tombol mulai mendengarkan
- Indikator mikrofon aktif
- Transkripsi interim dan final
- Tombol berhenti
- Tombol hapus
- Tombol salin
- Pengaturan ukuran teks
- Informasi kompatibilitas browser
- Fallback input teks manual

### 3.5 AI Emergency Message Composer

AI hanya boleh:

- Merapikan urutan informasi
- Membuat kalimat singkat dan jelas
- Menggunakan nilai yang diberikan
- Mempertahankan placeholder

AI tidak boleh:

- Membuat diagnosis
- Menambah nama, nomor, alamat, lokasi, kondisi, atau bantuan
- Memberikan instruksi medis
- Menjamin bantuan akan datang
- Menyimpulkan hal di luar data

### 3.6 Panduan Penolong

Konten CMS berisi panduan komunikasi singkat bagi masyarakat umum.

### 3.7 Kontak Darurat

Kontak resmi yang dikelola admin. Setiap kontak memiliki sumber, tanggal verifikasi, dan catatan cakupan.

## 4. Fitur Admin

- Login dan logout
- Dashboard agregat
- CRUD kategori darurat
- CRUD kondisi darurat
- CRUD jenis bantuan
- CRUD frasa cepat
- CRUD panduan penolong
- CRUD kontak darurat
- CRUD konten landing page
- Pengelolaan versi prompt AI
- Activity log admin

## 5. Fitur yang Tidak Dibuat

- Kartu Darurat
- Piktogram
- CMS piktogram
- Login user publik
- Riwayat pesan user
- Penyimpanan audio atau transkripsi
- Chatbot bebas
- Diagnosis medis
- Panggilan otomatis
- Integrasi WhatsApp
- Reverse geocoding sebagai fitur wajib

## 6. Kebutuhan Fungsional User

| ID | Kebutuhan |
|---|---|
| FR-U01 | Landing page dapat dibuka tanpa login. |
| FR-U02 | User dapat memilih satu dari tiga mode komunikasi. |
| FR-U03 | User dapat memilih kategori kejadian dari database. |
| FR-U04 | User dapat memasukkan lokasi secara manual. |
| FR-U05 | User dapat meminta lokasi perangkat setelah memberi izin. |
| FR-U06 | User dapat memilih kondisi dari database. |
| FR-U07 | User dapat memilih bantuan dari database. |
| FR-U08 | Sistem dapat membuat pesan template tanpa AI. |
| FR-U09 | Sistem dapat meminta AI merapikan pesan yang sudah dianonimkan. |
| FR-U10 | Sistem dapat menampilkan pesan dalam ukuran besar. |
| FR-U11 | Sistem dapat membacakan teks. |
| FR-U12 | Sistem dapat melakukan speech-to-text pada browser yang mendukung. |
| FR-U13 | Sistem menyediakan input manual jika speech-to-text tidak tersedia. |
| FR-U14 | User dapat memilih frasa cepat dari database. |
| FR-U15 | User dapat menyalin hasil. |
| FR-U16 | User dapat mengubah ukuran teks. |
| FR-U17 | Sistem menampilkan panduan penolong aktif. |
| FR-U18 | Sistem menampilkan kontak darurat aktif. |
| FR-U19 | Sistem tidak menyimpan isi pesan atau transkripsi. |
| FR-U20 | Sistem menampilkan fallback ketika AI gagal. |

## 7. Kebutuhan Fungsional Admin

| ID | Kebutuhan |
|---|---|
| FR-A01 | Admin dapat login dan logout. |
| FR-A02 | Seluruh halaman admin dilindungi autentikasi. |
| FR-A03 | Registrasi publik dinonaktifkan. |
| FR-A04 | Admin dapat melihat dashboard. |
| FR-A05 | Admin dapat mengelola kategori. |
| FR-A06 | Admin dapat mengelola kondisi. |
| FR-A07 | Admin dapat mengelola jenis bantuan. |
| FR-A08 | Admin dapat mengelola frasa cepat. |
| FR-A09 | Admin dapat mengelola panduan. |
| FR-A10 | Admin dapat mengelola kontak darurat. |
| FR-A11 | Admin dapat mengelola konten landing page. |
| FR-A12 | Admin dapat mengaktifkan versi prompt AI. |
| FR-A13 | Perubahan CMS tampil tanpa deployment ulang. |
| FR-A14 | Aktivitas admin dicatat. |
| FR-A15 | Admin hanya melihat data agregat. |

## 8. UI/UX

- Mobile-first
- Navy, teal, putih, dan coral
- Tombol minimum 44×44 px
- Teks mudah dibaca dan dapat diperbesar
- Fokus keyboard terlihat
- Tidak mengandalkan warna saja
- Ikon UI disertai label teks
- Status mikrofon terlihat dan dibacakan screen reader
- Mendukung reduced motion
- Tidak ada Kartu Darurat dan tidak ada galeri Piktogram

## 9. Privasi

- Pesan hanya berada pada state sementara.
- Backend tidak menyimpan pesan atau transkripsi.
- Log tidak boleh berisi nama, nomor, alamat, lokasi lengkap, audio, atau isi pesan.
- AI menerima placeholder untuk data sensitif.
- Lokasi perangkat hanya diambil setelah izin eksplisit.

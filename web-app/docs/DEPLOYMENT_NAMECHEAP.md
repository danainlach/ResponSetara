# Panduan Deployment Namecheap Shared Hosting (cPanel)

Dokumen ini berisi panduan arsitektur direktori dan langkah deployment ResponSetara pada layanan **Namecheap Shared Hosting** menggunakan **cPanel** dan **SSH**.

Untuk menjamin keamanan sistem gawat darurat ini, seluruh source code inti Laravel diletakkan di **luar** root web publik (`public_html`). Hal ini mencegah tereksposnya file sensitif seperti berkas `.env`, kode sumber PHP, konfigurasi, log, dan folder vendor ke publik.

---

## 1. Arsitektur Direktori Server

Struktur direktori yang direkomendasikan pada server Namecheap Shared Hosting:

```text
/home/CPANEL_USER/
├── responsetara-app/                      # Folder aplikasi inti (di luar public_html)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/                           # Writable (Permission 775/755)
│   │   ├── app/
│   │   ├── framework/
│   │   └── logs/
│   ├── vendor/
│   ├── artisan
│   ├── composer.json
│   └── .env                               # Berkas konfigurasi rahasia (Permission 600)
└── public_html/                           # Root Web Publik (Document Root Utama)
    ├── build/                             # Aset React terkompilasi (CSS, JS, manifest.json)
    ├── index.php                          # Pintu masuk bootstrap Laravel (termodifikasi)
    ├── .htaccess                          # Konfigurasi keamanan & routing Apache/LiteSpeed
    ├── favicon.ico
    ├── favicon.svg
    └── public assets (images, dll.)
```

> [!IMPORTANT]
> Jangan pernah meletakkan file `.env`, folder `vendor`, `app`, `config`, or `storage` langsung di bawah `public_html` karena file-file tersebut dapat diunduh secara bebas oleh publik jika terjadi kesalahan konfigurasi server.

---

## 2. Strategi Penanganan Document Root

Pada Namecheap Shared Hosting, domain utama biasanya terkunci di folder `/home/CPANEL_USER/public_html` dan tidak dapat diubah di tingkat cPanel tanpa bantuan Customer Support.

Untuk mengatasinya dengan aman tanpa membiarkan kode inti berada di public_html:
1. Pindahkan semua file dari folder `public` Laravel lokal ke dalam folder `public_html` di server.
2. Pindahkan seluruh file sisa proyek Laravel ke folder `/home/CPANEL_USER/responsetara-app/`.
3. Modifikasi berkas `public_html/index.php` untuk menunjuk ke path absolut bootstrap Laravel di `/home/CPANEL_USER/responsetara-app/`.
   *(Contoh file index.php khusus cPanel disediakan dalam folder `docs/cpanel-files/index.php`)*

---

## 3. Strategi Build Frontend & Pemindahan Aset

Untuk menghemat resource CPU dan RAM pada server shared hosting Namecheap (yang sangat dibatasi CloudLinux LVE):
1. **Lakukan Build Lokal**: Jalankan kompilasi aset React/Vite di komputer lokal Anda menggunakan perintah:
   ```bash
   npm run build
   ```
2. **Kirim Folder Build**: Unggah folder `public/build` yang berisi file kompilasi JS/CSS dan berkas `manifest.json` langsung ke server di bawah path `/home/CPANEL_USER/public_html/build/`.
3. **Jangan Jalankan Node di Server**: Dengan cara ini, Node.js tidak perlu terpasang atau berjalan untuk aktivitas build berat di shared hosting.

---

## 4. Keamanan File dan Direktori (Permissions)

Terapkan hak akses berikut via SSH atau File Manager cPanel:
- **Semua Direktori / Folder**: `755`
- **Semua File Umum**: `644`
- **Berkas `/home/CPANEL_USER/responsetara-app/.env`**: `600` (Hanya dibaca oleh pemilik akun cPanel)
- **Folder Writable (`storage/` & `bootstrap/cache/`)**: `755` atau `775` (pastikan group/user web server memiliki izin menulis).

> [!CAUTION]
> Jangan pernah memberikan izin `777` pada berkas atau folder apa pun di shared hosting karena dapat menyebabkan server memblokir akses file demi alasan keamanan (error 500).

---

## 5. Domain, DNS, dan Konfigurasi SSL

Domain yang digunakan: **afnicode.me**

### Pengaturan DNS
Domain **afnicode.me** dikelola langsung di registrar **Namecheap** dan diatur sebagai **Primary Domain** pada layanan Namecheap Shared Hosting. Oleh karena itu, domain ini sudah terhubung secara default ke hosting Anda dan tidak memerlukan konfigurasi DNS eksternal tambahan.

### Pemasangan SSL
1. Masuk ke cPanel Namecheap Anda.
2. Navigasi ke menu **Exclusive for Namecheap Customers** > **Namecheap SSL**.
3. Pilih domain `afnicode.me` dan `www.afnicode.me` untuk dipasang sertifikat SSL.
4. Tunggu beberapa menit hingga proses penerbitan selesai dan status berubah menjadi **Active**.
5. **Penting**: Pastikan status SSL sudah **Active** terlebih dahulu sebelum mengaktifkan fitur HTTPS Redirect di server (via cPanel atau `.htaccess`) guna menghindari kesalahan koneksi SSL Handshake.
6. Perbarui nilai `APP_URL` dan `ASSET_URL` pada berkas `.env` menjadi `https://afnicode.me`.

---
Kembali ke [Daftar Dokumen](RENDER_DEMO_CHECKLIST.md) | Lanjut ke [Panduan First Deploy](NAMECHEAP_FIRST_DEPLOY.md)

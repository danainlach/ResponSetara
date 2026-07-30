# ASSET MANIFEST

## 1. Admin Dashboard

### Pilihan Utama: TailAdmin Free React

- React + TypeScript + Tailwind
- Open-source
- Lisensi MIT
- Gunakan hanya layout dan komponen yang diperlukan
- Jangan gunakan React Router bawaan; adaptasikan ke Inertia

Repository:
https://github.com/TailAdmin/free-react-tailwind-admin-dashboard

Komponen yang diambil:

- Sidebar
- Header
- Breadcrumb
- Stat card
- Data table
- Form
- Modal
- Alert
- Pagination
- Loading state

Komponen yang dihapus:

- E-commerce
- Calendar
- Invoice
- Social profile
- Map
- Demo chart yang tidak digunakan
- Login template

### Alternatif: CoreUI Free React

Repository:
https://github.com/coreui/coreui-free-react-admin-template

Gunakan alternatif ini hanya jika tim memilih Bootstrap. Jangan mencampur TailAdmin dan CoreUI.

## 2. Design Tokens

Warna utama:

| Token | Nilai | Penggunaan |
|---|---|---|
| Navy 900 | #0F2747 | Navbar dan heading |
| Navy 700 | #183B63 | Teks utama |
| Teal 700 | #087F83 | Fitur aksesibilitas |
| Teal 500 | #12A6A6 | CTA umum |
| Coral 600 | #E5484D | Aksi darurat |
| Gray 100 | #F1F5F9 | Background |
| White | #FFFFFF | Surface |

Tipografi:

- Inter atau system sans-serif
- Body minimum 16 px
- Line-height 1.6
- Mode pesan besar minimum 28 px
- Touch target minimum 44×44 px

## 3. UI Copy

### Hero

**Headline:**
Komunikasi darurat yang dapat dipahami semua orang.

**Deskripsi:**
Ubah teks menjadi suara, suara menjadi teks, dan susun pesan darurat secara cepat melalui satu halaman yang aksesibel.

**CTA:**
Mulai Komunikasi Darurat

### Mode

1. Saya butuh bantuan
   - Isi informasi singkat dan susun pesan bantuan yang jelas.
2. Saya tidak dapat berbicara
   - Ketik atau pilih frasa, lalu bacakan kepada penolong.
3. Saya tidak dapat mendengar
   - Ubah ucapan penolong menjadi teks yang mudah dibaca.

### Privasi

- Pesan dan transkripsi tidak disimpan oleh ResponSetara.
- Lokasi hanya diambil setelah Anda memberikan izin.
- AI hanya membantu merapikan pesan dan dapat dinonaktifkan.

### Disclaimer

ResponSetara membantu komunikasi dan tidak menggantikan layanan darurat resmi.

## 4. Browser API

- Web Speech API: TTS dan STT
- Geolocation API: koordinat opsional
- Clipboard API: salin pesan

## 5. Dataset

Dataset runtime utama tersedia di folder `seed_data`.

Mozilla Common Voice Bahasa Indonesia hanya digunakan sebagai dataset pendukung untuk evaluasi atau pengembangan STT lanjutan, bukan kebutuhan MVP.

Portal Satu Data Bencana BNPB dapat digunakan untuk statistik proposal atau konten edukasi, bukan untuk diagnosis atau keputusan medis.

## 6. Ikon UI

Ikon sederhana boleh digunakan untuk tombol dan navigasi apabila selalu disertai label teks. Jangan membuat katalog, pemilih, atau CMS Piktogram.

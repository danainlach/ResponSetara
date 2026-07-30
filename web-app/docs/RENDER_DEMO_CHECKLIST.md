# Checklist & Tips Persiapan Demo Lomba (Render Free)

Guna memastikan jalannya presentasi dan demonstrasi fitur ResponSetara di hadapan juri berjalan mulus tanpa terhambat jeda *cold start* dari server gratisan Render, silakan terapkan tips berikut sebelum presentasi dimulai.

## 1. Pemanasan Server (PENTING — Lakukan Sebelum Giliran Anda)
Karena Render plan Free menonaktifkan container setelah 15 menit tanpa aktivitas:
* [ ] **Buka browser** dan akses URL staging Render Anda sebelum giliran presentasi dimulai.
* [ ] Akses halaman deteksi status kesehatan `/up` secara langsung (misal: `https://nama-app.onrender.com/up`) untuk memicu booting container dari mode tidur (proses bangun biasanya membutuhkan waktu sekitar satu menit, namun dapat bervariasi).
* [ ] Konfirmasi bahwa halaman `/up` mengembalikan respon teks kosong dengan kode HTTP **200 OK** sebelum beralih ke halaman utama.

## 2. Pengecekan Fungsi Sebelum Presentasi
* [ ] Buka halaman utama (Landing Page) dan pastikan seluruh CSS (*styling*) Tailwind ter-render dengan kontras warna yang tajam.
* [ ] Coba masuk ke Halaman CMS Admin (`/login`) menggunakan akun administrator yang sudah dideploy.
* [ ] Uji satu buah simulasi penyusunan pesan darurat menggunakan AI composer di dashboard untuk mematangkan cache pemanggilan.
* [ ] Bersihkan log aktivitas lama apabila diperlukan agar CMS terlihat bersih dan siap dinilai.

## 3. Dokumen Terkait Deployment Staging
* [Panduan Deployment Render](DEPLOYMENT_RENDER.md)
* [Daftar Environment Variables](RENDER_ENVIRONMENT_VARIABLES.md)
* [Panduan Deployment Pertama Kali](RENDER_FIRST_DEPLOY.md)
* [Panduan Rollback](RENDER_ROLLBACK.md)

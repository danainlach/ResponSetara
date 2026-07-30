# Panduan Deployment Render Staging

Dokumen ini berisi panduan untuk mendaftarkan dan melakukan deployment ResponSetara di Render Staging menggunakan Docker dan Supabase.

## Prasyarat
- Akun GitHub pribadi yang menampung kode proyek.
- Akun Render (dapat dibuat gratis tanpa kartu kredit/debit).
- Database Supabase PostgreSQL eksternal yang sudah siap.

## Langkah-Langkah Deployment

### 1. Hubungkan Repositori GitHub ke Render
- Buka Dashboard Render di [dashboard.render.com](https://dashboard.render.com).
- Masuk menggunakan akun GitHub Anda.
- Buat layanan baru dengan memilih tombol **New+** -> **Blueprints**.
- Hubungkan repositori GitHub proyek ResponSetara Anda.

### 2. Konfigurasi Blueprint
- Render akan membaca file `render.yaml` di root repositori secara otomatis.
- Berikan nama untuk service instance Anda (misalnya `responsetara-staging`).
- Pilih region **Singapore** (apabila ditanyakan atau di-override).
- Tinjau daftar environment variables yang harus diisi di dashboard.

### 3. Batasan Akun Render Free
- **Cold Start**: Layanan akan "tidur" setelah 15 menit tanpa aktivitas/trafik. Proses bangun (booting) biasanya membutuhkan waktu sekitar satu menit, namun waktunya dapat bervariasi.
- **Tanpa Pre-Deploy Command**: Plan Free tidak mendukung pre-deploy command (seperti pemicu migrasi terpisah). Sebagai solusinya, migrasi database dijalankan secara otomatis saat startup kontainer melalui entrypoint.
- **Filesystem Sementara (Ephemeral)**: Berkas yang ditulis di luar folder `/tmp` akan hilang ketika kontainer di-rebuild/restart. Session dan cache telah dialihkan ke database Supabase agar data tidak hilang.
- **Tanpa SSH/Shell Gratis**: Render plan Free tidak menyediakan akses SSH terminal langsung di dashboard.

---
Kembali ke [Daftar Panduan](RENDER_DEMO_CHECKLIST.md)

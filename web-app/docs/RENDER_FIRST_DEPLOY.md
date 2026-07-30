# Panduan Deployment Pertama kali (First Deploy)

Berikut adalah urutan langkah khusus untuk melakukan deployment perdana di Render Staging dan membuat akun administrator CMS pertama kali.

## Langkah 1: Siapkan Environment Awal
Sebelum menekan Deploy di Render, pastikan Anda mengisi variabel berikut secara lengkap:
- `APP_KEY` (Hasilkan string enkripsi Laravel melalui `php artisan key:generate --show` secara lokal)
- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (Koneksi Supabase)
- `RUN_MIGRATIONS_ON_START` = `true` (Menjalankan migrasi saat startup container)
- `SEED_ADMIN_ON_START` = `true` (Memerintahkan entrypoint menjalankan seeder admin)
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (Sandi admin pertama Anda)
- `GEMINI_ENABLED` = `false` (Nonaktifkan sementara pada rilis perdana)

## Langkah 2: Jalankan Deployment Perdana
1. Klik **Apply Parameter** atau klik deploy di Render Dashboard.
2. Ketika kontainer mulai booting, berkas `entrypoint.sh` akan:
   * Menjalankan migrasi database (`php artisan migrate --force`). Jika gagal, kontainer otomatis mati dengan status error agar Supabase aman dari kerusakan skema.
   * Karena variabel `SEED_ADMIN_ON_START` bernilai `true` dan data parameter lengkap, kontainer akan memanggil `UserSeeder` untuk mendaftarkan akun admin pertama Anda di database Supabase.

## Langkah 3: Amankan Kredensial Admin Staging
1. Buka URL web service Render Anda setelah deployment bertanda **Live**.
2. Masuk ke halaman login CMS admin (`/login`) menggunakan email dan password admin yang Anda daftarkan.
3. Setelah berhasil login dan memverifikasi dashboard admin bekerja:
   * **Wajib:** Masuk ke Render Dashboard -> **Environment**.
   * **Ubah variabel `SEED_ADMIN_ON_START` menjadi `false`**.
   * **Hapus variabel `ADMIN_PASSWORD`** (kosongkan nilainya) lalu simpan perubahan.
   * Langkah ini menonaktifkan pemanggilan seeder admin pada saat boot ulang kontainer demi keamanan akun.

## Langkah 4: Sesuaikan APP_URL dan ASSET_URL
1. Salin alamat host yang diberikan oleh Render (misalnya `https://responsetara-staging.onrender.com`).
2. Masuk ke tab **Environment** di Render.
3. Ubah nilai `APP_URL` dan `ASSET_URL` menjadi URL Render yang Anda salin.
4. Klik **Save Changes**. Render akan melakukan redeploy otomatis agar tautan aset dan rute Inertia tersaji dengan HTTPS yang presisi. Setelah halaman berjalan normal, Anda dapat menyalakan kembali `GEMINI_ENABLED` ke `true`.

# Daftar Environment Variables Render

Berikut adalah daftar variabel lingkungan yang wajib dikonfigurasi melalui Dashboard Render untuk lingkungan staging Anda.

> [!WARNING]
> Jangan pernah memasukkan nilai rahasia (secrets) ke dalam berkas repositori Git atau berkas Blueprint `render.yaml`. Nilai di bawah ini harus diinput secara aman via dashboard Render.

### Aplikasi Core
- `APP_NAME`: `ResponSetara-Staging`
- `APP_ENV`: `production`
- `APP_DEBUG`: `false`
- `APP_KEY`: *[Hasilkan string acak 32 karakter dengan `base64:xxx` menggunakan `php artisan key:generate --show`]*
- `APP_URL`: *[URL Web Service Anda di Render, misal `https://responsetara-staging.onrender.com`]*
- `ASSET_URL`: *[Sama dengan APP_URL untuk memuat aset]*

### Logging & Error
- `LOG_CHANNEL`: `stderr` (mengarahkan log container ke log viewer Render)
- `LOG_LEVEL`: `info`

### Supabase Database (Eksternal)
- `DB_CONNECTION`: `pgsql`
- `DB_HOST`: *[Host Supabase PostgreSQL Connection Pooler (port 5432)]*
- `DB_PORT`: `5432`
- `DB_DATABASE`: *[Nama database Supabase Anda]*
- `DB_USERNAME`: *[Nama pengguna database Supabase]*
- `DB_PASSWORD`: *[Kata sandi database Supabase]*
- `DB_SCHEMA`: `responsetara`
- `DB_SSLMODE`: `require` (koneksi wajib aman dengan SSL)

### Drivers & Performance
- `SESSION_DRIVER`: `database` (menggunakan tabel sessions Supabase untuk persistent login)
- `SESSION_SECURE_COOKIE`: `true` (cookie hanya dikirim melalui https)
- `SESSION_HTTP_ONLY`: `true`
- `SESSION_SAME_SITE`: `lax`
- `CACHE_STORE`: `database` (menggunakan tabel cache Supabase)
- `QUEUE_CONNECTION`: `sync`

### Gemini AI
- `GEMINI_ENABLED`: `false` (Wajib di-set `false` pada saat inisialisasi awal. Aktifkan menjadi `true` setelah verifikasi halaman utama, database, dan login CMS berhasil).
- `GEMINI_API_KEY`: *[API Key Gemini Anda yang valid]*
- `GEMINI_MODEL`: `gemini-2.5-flash`
- `GEMINI_API_VERSION`: `v1beta`
- `GEMINI_CONNECT_TIMEOUT`: `10`
- `GEMINI_TIMEOUT`: `30`
- `GEMINI_MAX_RETRIES`: `3`
- `GEMINI_TEMPERATURE`: `1.0`
- `GEMINI_MAX_OUTPUT_TOKENS`: `1024`

### Kontrol Startup Migration & Seeding (Render Free Compatibility)
- `RUN_MIGRATIONS_ON_START`: `true` (Secara otomatis menjalankan `php artisan migrate --force` pada saat kontainer booting).
- `SEED_ADMIN_ON_START`: `false` (Set menjadi `true` hanya pada saat deployment pertama kali untuk mendaftarkan admin pertama).

> [!NOTE]
> Strategi menjalankan migrasi pada saat kontainer startup ini diterapkan secara khusus untuk menyiasati keterbatasan staging Render Free yang tidak mendukung perintah pre-deploy. Ini **bukan** rekomendasi atau praktik terbaik untuk lingkungan produksi darurat sesungguhnya.

### Inisialisasi Admin Awal (Hanya jika SEED_ADMIN_ON_START=true)
- `ADMIN_NAME`: *[Nama lengkap Admin]*
- `ADMIN_EMAIL`: *[Email Admin untuk login CMS]*
- `ADMIN_PASSWORD`: *[Kata sandi Admin (Minimal 8 karakter)]*

> [!IMPORTANT]
> Setelah kontainer pertama kali berhasil dideploy dan admin berhasil login, segera **ubah variabel `SEED_ADMIN_ON_START` menjadi `false`** dan **hapus variabel `ADMIN_PASSWORD`** dari dashboard Render untuk mengamankan akun admin.

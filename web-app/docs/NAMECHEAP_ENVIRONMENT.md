# Konfigurasi Environment Production Namecheap

Dokumen ini mendokumentasikan variabel lingkungan (Environment Variables) yang harus didefinisikan dalam berkas `.env` di server Namecheap Shared Hosting (`/home/CPANEL_USER/responsetara-app/.env`).

> [!WARNING]
> Jangan pernah memasukkan file `.env` ke dalam kontrol versi (Git) atau paket ZIP publik. Buat file `.env` secara manual di server menggunakan editor cPanel File Manager atau via terminal SSH, lalu salin struktur di bawah ini dan isi nilainya.

---

## Template Berkas `.env` Production

```ini
# --- APLIKASI UTAMA ---
APP_NAME=ResponSetara
APP_ENV=production
APP_KEY=                             # Jalankan `php artisan key:generate` HANYA apabila APP_KEY kosong. Jangan pernah menimpa APP_KEY production yang sudah valid.
APP_DEBUG=false
APP_URL=https://afnicode.me
ASSET_URL=https://afnicode.me

# --- LOGGING ---
LOG_CHANNEL=daily
LOG_LEVEL=error                      # Hanya mencatat error/warning penting untuk menghemat disk space shared hosting.

# --- KONEKSI DATABASE (SUPABASE POSTGRESQL POOLER) ---
DB_CONNECTION=pgsql
DB_HOST=                             # Masukkan endpoint Supabase transaction pooler (port 5432)
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=                         # Username database postgres Supabase
DB_PASSWORD=                         # Password database Supabase
DB_SCHEMA=public
DB_SSLMODE=require                   # Wajib menggunakan SSL untuk koneksi eksternal aman ke Supabase

# --- OPTIMASI DRIVER PRODUCTION ---
# Menggunakan database Supabase untuk session & cache agar performa optimal
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

CACHE_STORE=database

# Menggunakan koneksi sync karena shared hosting tidak mendukung daemon queue worker permanen
QUEUE_CONNECTION=sync

# --- PARAMETER INTEGRASI GEMINI AI ---
GEMINI_ENABLED=true
GEMINI_API_KEY=                     # API Key Gemini produksi rahasia
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_VERSION=v1beta
GEMINI_CONNECT_TIMEOUT=5
GEMINI_TIMEOUT=15
GEMINI_MAX_RETRIES=3
GEMINI_MAX_OUTPUT_TOKENS=800
```

---
Kembali ke [Panduan Utama](DEPLOYMENT_NAMECHEAP.md) | Lanjut ke [Panduan First Deploy](NAMECHEAP_FIRST_DEPLOY.md)

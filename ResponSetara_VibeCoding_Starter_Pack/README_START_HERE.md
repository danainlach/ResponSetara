# RESPONSETARA — VIBE CODING STARTER PACK

## Judul

**ResponSetara: Platform Komunikasi Keadaan Darurat Berbasis AI bagi Pengguna Tuli, Nonverbal, dan Masyarakat Umum**

## Scope Terbaru

Fitur yang dihapus:

- Kartu Darurat
- Piktogram sebagai fitur atau data CMS
- Tabel dan menu CMS piktogram

Ikon antarmuka tetap boleh digunakan untuk membantu navigasi, tetapi ikon tersebut hanya elemen UI dan bukan fitur piktogram.

## Stack Final

- Laravel 13
- Official Laravel React Starter Kit
- React 19 + TypeScript
- Inertia + Vite + Tailwind CSS
- shadcn/ui untuk landing page
- Supabase PostgreSQL sebagai database cloud
- Laravel session authentication khusus admin
- Gemini Developer API melalui backend Laravel
- Web Speech API untuk Text-to-Speech dan Speech-to-Text
- TailAdmin Free React Dashboard sebagai referensi dashboard admin

## Prinsip Arsitektur

- Satu repository Laravel.
- User publik tidak memiliki akun dan tidak perlu login.
- Hanya admin yang memiliki akun.
- React tidak mengakses Supabase secara langsung.
- Laravel menjadi satu-satunya pintu database.
- Supabase Auth tidak digunakan.
- Pesan, transkripsi, audio, dan lokasi lengkap tidak disimpan permanen.

## Prinsip Pengurangan Halusinasi AI

1. Database-first.
2. Template-first.
3. Data sensitif diganti placeholder.
4. AI hanya merapikan kalimat.
5. Output AI wajib JSON.
6. Backend memvalidasi output.
7. Jika AI gagal, gunakan template Laravel.

## Urutan Penggunaan

1. Baca `docs/PRD_UPDATED.md`.
2. Baca `docs/ARCHITECTURE_AND_API.md`.
3. Baca `database/schema_reference.sql`.
4. Buka `prompts/MASTER_AND_PHASED_PROMPTS.md`.
5. Jalankan prompt fase secara berurutan.
6. Gunakan seed data dalam folder `seed_data`.
7. Gunakan panduan aset di `assets/ASSET_MANIFEST.md`.

## Larangan Utama

- Jangan membuat Kartu Darurat.
- Jangan membuat fitur atau CMS Piktogram.
- Jangan menambahkan role selain admin dan user publik.
- Jangan menyimpan isi pesan atau transkripsi.
- Jangan menaruh API key pada frontend.
- Jangan hard-code konten CMS di React.

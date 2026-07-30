# ResponSetara Workspace Rule

## Sumber Kebenaran

Gunakan dokumentasi pada:

- ResponSetara_VibeCoding_Starter_Pack/docs
- ResponSetara_VibeCoding_Starter_Pack/database
- ResponSetara_VibeCoding_Starter_Pack/prompts
- ResponSetara_VibeCoding_Starter_Pack/seed_data

PRD memiliki prioritas tertinggi.

Jangan menganggap semua prompt fase aktif secara bersamaan.

## Stack

- Laravel 13
- Official Laravel React Starter Kit
- React
- TypeScript
- Inertia
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL
- Laravel Session Authentication
- Gemini API melalui backend
- Web Speech API
- TailAdmin hanya sebagai referensi dashboard admin

## Struktur

- Source code aplikasi berada di web-app.
- Dokumentasi berada di ResponSetara_VibeCoding_Starter_Pack.
- Laravel menjadi satu-satunya akses ke database.
- React tidak mengakses Supabase secara langsung.
- Jangan gunakan Supabase Auth.
- Jangan membuat frontend dan backend repository terpisah.

## Role

Aplikasi hanya memiliki:

1. User publik tanpa login.
2. Admin dengan login.

Jangan membuat registrasi user publik.

## Fitur yang Dilarang

- Kartu Darurat
- Piktogram sebagai fitur
- CMS Piktogram
- Akun user publik
- Penyimpanan pesan
- Penyimpanan transkripsi
- Penyimpanan audio
- Chatbot bebas
- Diagnosis medis
- Panggilan otomatis
- Pengiriman WhatsApp otomatis
- Fitur di luar PRD

Ikon UI boleh digunakan selama memiliki label teks.

## Data CMS

Data berikut harus berasal dari database:

- kategori keadaan darurat,
- kondisi,
- jenis bantuan,
- frasa cepat,
- panduan penolong,
- kontak darurat,
- konten landing page.

Jangan hard-code data CMS pada React.

## Privasi

- Jangan menyimpan pesan atau transkripsi.
- Jangan mencetak data sensitif ke log.
- Jangan menggunakan localStorage untuk pesan.
- Jangan mengirim data sensitif mentah ke AI.
- API key hanya berada di backend.

## Cara Kerja Agent

- Kerjakan satu fase dalam satu waktu.
- Tampilkan rencana sebelum coding.
- Tampilkan file yang akan diubah.
- Tampilkan command sebelum dijalankan.
- Jangan melanjutkan fase tanpa persetujuan.
- Jika kebutuhan ambigu, berhenti dan bertanya.

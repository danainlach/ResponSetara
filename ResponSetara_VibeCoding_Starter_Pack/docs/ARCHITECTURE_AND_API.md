# ARCHITECTURE AND API

## 1. Keputusan Arsitektur

Gunakan satu repository Laravel dengan official React starter kit.

### Backend

- Laravel 13
- Form Request untuk validasi
- Service Class untuk logika bisnis
- Policy atau middleware untuk authorization
- API Resource untuk respons JSON
- Laravel HTTP Client untuk Gemini
- Laravel migration dan seeder

### Frontend

- React 19 + TypeScript
- Inertia
- Vite
- Tailwind CSS
- shadcn/ui
- Web Speech API melalui custom hooks
- State sementara untuk pesan dan transkripsi

### Database

- Supabase PostgreSQL
- Laravel terhubung langsung ke PostgreSQL
- Gunakan schema `responsetara` bila memungkinkan
- Jangan gunakan Supabase Auth
- Jangan akses Supabase dari browser

### Authentication

- Hanya admin memiliki akun
- Laravel session authentication
- Registrasi publik dinonaktifkan
- Route admin memakai middleware `auth`, `admin`, dan `active-account`

## 2. Struktur Folder

```text
app/
├── Http/Controllers
├── Http/Requests
├── Http/Resources
├── Models
├── Policies
├── Services/AI
├── Services/EmergencyMessage
└── Services/Privacy

resources/js/
├── components
├── features/assistance
├── features/nonverbal
├── features/speech-to-text
├── features/accessibility
├── layouts/public
├── layouts/admin
├── pages/public
├── pages/admin
├── services
├── hooks
├── types
└── utils
```

## 3. Alur AI

```text
Input terstruktur
→ validasi
→ buat pesan template
→ ganti data sensitif dengan placeholder
→ kirim konteks minimum ke Gemini
→ terima JSON
→ validasi schema dan fakta
→ pulihkan placeholder
→ tampilkan hasil
```

Jika AI gagal, pesan template tetap digunakan.

## 4. Public API Internal

Prefix: `/api/v1`

### GET /config

Konten landing dan konfigurasi fitur.

### GET /categories

Kategori aktif.

### GET /conditions?category_id=

Kondisi aktif.

### GET /assistance-types?category_id=

Jenis bantuan aktif.

### GET /quick-phrases?mode=&category_id=&search=

Frasa cepat aktif.

### GET /helper-guides?audience=

Panduan aktif.

### GET /emergency-contacts

Hanya kontak aktif dan terverifikasi.

### POST /compose-message

Request:

```json
{
  "category_id": 1,
  "condition_ids": [1, 4],
  "assistance_type_ids": [1],
  "location": {
    "manual_text": "Jalan Gatot Subroto",
    "latitude": null,
    "longitude": null,
    "include_coordinates": false
  },
  "communication_mode": "nonverbal",
  "additional_information": "Saya bersama satu orang teman",
  "use_ai": true
}
```

Response:

```json
{
  "status": "success",
  "source": "ai",
  "message": "Saya mengalami kecelakaan di Jalan Gatot Subroto...",
  "warnings": [],
  "request_id": "uuid"
}
```

Fallback:

```json
{
  "status": "success",
  "source": "template",
  "message": "Saya mengalami kecelakaan di Jalan Gatot Subroto...",
  "warnings": ["Penyusunan AI tidak tersedia. Pesan dibuat menggunakan template."],
  "request_id": "uuid"
}
```

## 5. Validasi Endpoint Compose

- Kategori harus aktif
- Kondisi dan bantuan harus aktif
- Maksimal 3 kondisi
- Maksimal 3 jenis bantuan
- Lokasi manual maksimal 180 karakter
- Informasi tambahan maksimal 300 karakter
- HTML dan script dibersihkan
- Payload tidak disimpan
- Rate limit diterapkan

## 6. Admin Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/categories`
- `/admin/conditions`
- `/admin/assistance-types`
- `/admin/quick-phrases`
- `/admin/helper-guides`
- `/admin/emergency-contacts`
- `/admin/site-contents`
- `/admin/ai-prompts`
- `/admin/activity-logs`

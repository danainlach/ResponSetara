# DOKUMENTASI KONTRAK PUBLIC API RESPONSETARA (v1)

## 1. Base URL
- **Local Development**: `http://localhost:8000/api/v1`
- **Production**: `https://[domain-responsetara]/api/v1`

## 2. Catatan Privasi & Keamanan
1. **Zero Exposure**: Semua endpoint di bawah ini bersifat **read-only (GET)**. Tidak ada akses langsung dari frontend (React) ke database Supabase.
2. **Kerahasiaan Data**: Tabel `users`, `ai_prompts`, `admin_activity_logs`, `aggregate_statistics`, dan hash sandi tidak pernah dikembalikan atau diekspos melalui API publik.
3. **Tanpa Pelacakan**: Backend tidak memetakan IP address atau menyimpan payload penambangan data pribadi. Data yang ditampilkan murni dari konfigurasi CMS aktif.

---

## 3. Daftar Endpoint & Parameter

| Endpoint | Method | Query Parameter | Deskripsi |
| :--- | :---: | :--- | :--- |
| `/config` | GET | Tanpa parameter | Memuat teks konfigurasi, disclaimer, mode komunikasi, dan privasi dari CMS |
| `/categories` | GET | Tanpa parameter | Daftar kategori darurat yang aktif dan diurutkan berdasarkan `sort_order` |
| `/categories/{slug}`| GET | URL path: `slug` | Detail kategori tertentu berdasarkan parameter slug yang aktif |
| `/conditions` | GET | `category_id` *(int, opsional)* | Daftar kondisi pengguna aktif (global/umum jika kosong, atau spesifik kategori) |
| `/assistance-types` | GET | `category_id` *(int, opsional)* | Daftar jenis bantuan aktif yang tersedia di lapangan |
| `/quick-phrases` | GET | `mode`, `category_id`, `search` | Kamus frasa cepat darurat aktif (pencarian distandarisasi & divalidasi) |
| `/helper-guides` | GET | `audience` *(string, opsional)* | Panduan pertolongan cepat berdasarkan audiens target |
| `/emergency-contacts`| GET | Tanpa parameter | Daftar kontak darurat resmi Indonesia (112, 110, 113, 119) yang terverifikasi |
| `/compose-message` | POST | Payload JSON | Menyusun pesan darurat deterministik berdasarkan template resmi dengan opsi penyempurnaan Gemini AI (Zero Storage) |

---

## 4. Contoh Request & Response Sukses (200 OK)

### 4.1. GET `/api/v1/categories`
**Request:**
```http
GET /api/v1/categories HTTP/1.1
Host: localhost:8000
Accept: application/json
```
**Response (Collection):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Darurat Medis atau Kesehatan",
      "slug": "darurat-medis-atau-kesehatan",
      "description": "Kondisi mengancam jiwa yang membutuhkan bantuan medis...",
      "color": "red",
      "sort_order": 10
    }
  ],
  "meta": {
    "version": "v1",
    "count": 1
  }
}
```

### 4.2. GET `/api/v1/quick-phrases?mode=nonverbal`
**Request:**
```http
GET /api/v1/quick-phrases?mode=nonverbal HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### 4.3. POST `/api/v1/compose-message` (Dengan Opsi Gemini AI Refinement)
Endpoint ini digunakan untuk menyusun kalimat bantuan darurat berbahasa Indonesia baku. Mendukung penyusunan murni berbasis template atau penyempurnaan menggunakan Gemini AI apabila pengguna memberikan persetujuan eksplisit. **Zero Data Retention:** Pesan, lokasi, koordinat GPS, mau pun catatan pengguna sama sekali tidak disimpan di database mau pun log server.

**Request Body JSON:**
```json
{
  "communication_mode": "assistance",
  "category_id": 1,
  "condition_ids": [1, 2],
  "assistance_type_ids": [1],
  "location": {
    "manual_text": "Jalan Mawar Merah No 45, Jakarta",
    "latitude": -6.20000,
    "longitude": 106.81666,
    "include_coordinates": true
  },
  "additional_information": "Pelapor memakai jaket merah, gerbang warna hitam.",
  "use_ai": true,
  "ai_consent": true
}
```

**Ketentuan Privasi & Data Minimization Gemini AI:**
- Pada saat `use_ai: true` dan `ai_consent: true` diaktifkan, backend melampirkan *system prompt* dari CMS dan menerapkan **Data Minimization**: Teks lokasi manual (`manual_text`), koordinat GPS (`latitude`, `longitude`), serta catatan informasi tambahan (`additional_information`) **sama sekali tidak dikirimkan** ke provider AI.
- AI hanya memproses struktur tata bahasa dari kategori, kondisi, dan jenis bantuan.
- Setelah balikan JSON berstruktur divalidasi oleh semantic guardrail (anti-halusinasi, tanpa janji kedatangan medis), backend secara deterministik menyatukan kembali lokasi dan koordinat pada hasil akhir `message`.

**Response (Sukses Penyempurnaan AI):**
```json
{
  "success": true,
  "data": {
    "source": "ai",
    "message": "DARURAT MEDIS: Sulit berkomunikasi. Segera dibutuhkan Bantuan Medis Segera.\n\nLokasi: Jalan Mawar Merah No 45, Jakarta\nKoordinat: -6.20000, 106.81666 (https://maps.google.com/?q=-6.20000,106.81666)\nCatatan tambahan: Pelapor memakai jaket merah, gerbang warna hitam.",
    "template_message": "Saya mengalami situasi darurat Darurat Medis atau Kesehatan di Jalan Mawar Merah No 45, Jakarta (Koordinat GPS: -6.20000, 106.81666). Kondisi saat ini: Sulit berkomunikasi. Bantuan yang dibutuhkan: Bantuan Medis Segera. Catatan tambahan: Pelapor memakai jaket merah, gerbang warna hitam.",
    "fallback_used": false,
    "fallback_reason": null,
    "selected": {
      "category_id": 1,
      "condition_ids": [1, 2],
      "assistance_type_ids": [1]
    }
  },
  "meta": {
    "version": "v1",
    "timestamp": "2026-07-28T08:00:00Z"
  }
}
```

**Response (Seamless Template Fallback / Tanpa AI):**
Jika `use_ai: false`, atau terjadi kendala jaringan/timeout AI, atau batas *rate limit* AI (10 req/menit/IP) tercapai, atau output terblokir *guardrail*, API secara mulus (*seamless fallback*) mengembalikan versi template murni tanpa pesan error kepada publik:
```json
{
  "success": true,
  "data": {
    "source": "template",
    "message": "Saya mengalami situasi darurat Darurat Medis atau Kesehatan...",
    "template_message": "Saya mengalami situasi darurat Darurat Medis atau Kesehatan...",
    "fallback_used": true,
    "fallback_reason": "timeout",
    "selected": {
      "category_id": 1,
      "condition_ids": [1, 2],
      "assistance_type_ids": [1]
    }
  },
  "meta": {
    "version": "v1",
    "timestamp": "2026-07-28T08:00:00Z"
  }
}
```

---

## 5. Standar Format Error Response

### 5.1. Validation Error (HTTP 422 Unprocessable Entity)
Muncul jika query parameter berlabel salah atau diluar ketentuan validasi:
```json
{
  "success": false,
  "message": "Parameter tidak valid.",
  "errors": {
    "mode": [
      "The selected mode is invalid."
    ]
  }
}
```

### 5.2. Not Found Error (HTTP 404 Not Found)
Muncul bila memanggil rute atau resource slug yang tidak aktif / tidak tersedia di sistem:
```json
{
  "success": false,
  "message": "Data tidak ditemukan."
}
```

### 5.3. Server Error Produksi (HTTP 500 Internal Server Error)
Di lingkungan production (`APP_ENV=production`), semua rincian stack trace dan kredensial disensor total:
```json
{
  "success": false,
  "message": "Terjadi kendala saat memproses permintaan."
}
```

---

## 6. Field Description (Deskripsi Kolom)
*   `id` *(int)*: Identifier numerik entitas.
*   `name` / `title` / `service_name` *(string)*: Nama resmi atau label utama item kedaruratan.
*   `slug` *(string)*: Teks representasi URL-friendly untuk routing komponen frontend.
*   `color` *(string)*: Kode atau token warna tailwind untuk indikasi urgensi visual (red, blue, amber).
*   `code` *(string)*: Kode internal referensi cepat.
*   `template_fragment` *(string)*: Potongan kalimat yang disispkan pada penyusunan template cepat.
*   `phrase_text` / `speech_text` *(string)*: Teks resmi kalimat komunikasi cepat untuk dibaca atau diproses TTS.
*   `number` *(string)*: Nomor panggilan kedaruratan bebas pulsa terverifikasi (contoh: "119", "112").
*   `sort_order` *(int)*: Parameter prioritas pengurutan tampakan di UI.

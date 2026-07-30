# API, DATASET, DAN SAFETY

## Web Speech API

Digunakan untuk:

- SpeechSynthesis atau Text-to-Speech
- SpeechRecognition atau Speech-to-Text

Kelebihan:

- Tidak memerlukan API key
- Cocok untuk MVP

Batasan:

- Dukungan SpeechRecognition tidak merata
- Pada sebagian browser, audio diproses melalui layanan browser
- Tidak selalu bekerja offline

Fallback input teks manual wajib tersedia.

Dokumentasi:
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

## Gemini Developer API

Digunakan hanya untuk merapikan pesan terstruktur.

Aturan:

- API key hanya pada Laravel `.env`
- Panggilan dari backend
- Model melalui `GEMINI_MODEL`
- Timeout dan retry terbatas
- Output JSON
- Data sensitif diganti placeholder
- Template fallback selalu tersedia

Dokumentasi:
https://ai.google.dev/gemini-api/docs

Pricing:
https://ai.google.dev/gemini-api/docs/pricing

## Browser Geolocation API

- Dipanggil hanya setelah user menekan tombol
- User dapat menolak izin
- Lokasi manual selalu tersedia
- Koordinat tidak disimpan
- Tidak ada reverse geocoding wajib

Dokumentasi:
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

## Supabase PostgreSQL

- Database cloud utama
- Laravel memakai koneksi PostgreSQL langsung
- Supabase Auth tidak digunakan
- React tidak mengakses Supabase langsung

Dokumentasi Laravel:
https://supabase.com/docs/guides/getting-started/quickstarts/laravel

## Dataset Pendukung

### Dataset Runtime

Gunakan seed JSON pada folder `seed_data`.

### Mozilla Common Voice Indonesia

Untuk evaluasi atau pengembangan ASR lanjutan. Tidak diperlukan pada MVP.

https://commonvoice.mozilla.org/en/datasets

### BNPB Satu Data Bencana

Untuk statistik proposal atau edukasi.

https://data.bnpb.go.id/dataset/

## Kontak Darurat

Kontak awal:

- 112: layanan darurat terintegrasi, mengikuti implementasi daerah
- 110: polisi
- 113: pemadam, verifikasi cakupan daerah
- 119: layanan medis, verifikasi cakupan daerah

Admin wajib menyimpan sumber dan tanggal verifikasi.

## Nominatim

Public Nominatim tidak direkomendasikan sebagai ketergantungan MVP karena kebijakan penggunaan ketat, batas permintaan, larangan autocomplete, kewajiban attribution dan caching, serta risiko perubahan kebijakan.

MVP menggunakan lokasi manual dan koordinat perangkat.

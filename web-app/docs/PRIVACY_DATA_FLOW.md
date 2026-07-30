# Arus Data & Perlindungan Privasi Tanpa Jejak (PRIVACY_DATA_FLOW.md)

Dokumen ini menjelaskan rancang bangun aliran data dari lini antarmuka pengguna hingga sistem pemrosesan belakang panggung pada platform **ResponSetara**. Sesuai standar hak asasi warga bernegara dalam masa tangguh kedaruratan (medis, kecelakaan, kekerasan, maupun bencana alam), aplikasi diproksikan melalui doktrin **Zero Retention & Explicit User Consent**.

---

## 1. Prinsip Mutlak Zero Retention (Tanpa Jejak Digital Darurat)

ResponSetara dirancang tanpa menyediakan akun pendaftaran pengguna publik (No User Account Concept) dan **tanpa memiliki gudang penyimpanan riwayat pesan maupu rekam jejak koordinat lokasi darurat**.

1. **Nihilnya Penyimpanan Pesan Darurat di Database**: Tabel database PostgreSQL pada instance Supabase **tidak pernah memiliki entri rekam jejak kejadian darurat publik**. Seluruh isian form pada Mode Saya Butuh Bantuan, Mode Tidak Dapat Berbicara, atau Mode Tidak Dapat Mendengar dikonsep sebatas variabel transien di dalam ruang memori cepat eksekusi saat permohonan disubmit.
2. **Nihilnya Penyimpanan Koordinat Lokasi GPS**: Fitur perolehan koordinat `latitude` dan `longitude` diolah secara efemeral di memori penjelajah internet peramban (*browser sandbox context*). Ketika dikirim ke endpoint Laravel `/api/v1/compose-message`, koordinat tersebut hanya dirajut menjadi kalimat teks (atau pranala peta/koordinat mentah) di dalam keluaran JSON dan langsung dihapus tatkala respon HTTP 200 dilepaskan ke klien.
3. **Kemandirian Operasional di Browser**: Tautan aksi akhir selalu mengandalkan kapabilitasi lokal ekosistem telepon/seluler pengguna, seperti `https://wa.me/...` untuk WhatsApp mandiri, atau tautan skema langsung `tel:119`, tanpa melalui *routing loop* pelacak analitik dari pihak ketiga.

---

## 2. Arus Data Penyempurnaan Pesan oleh Gemini AI (AI Composer Data Flow)

Sistem memanfaatkan mesin kecerdasan buatan Gemini murni sebatas **opsional opt-in** dan dikendalikan berlandaskan arsitektur **Template-First Deterministic Engine**.

```
[ Warga / Pelapor ] 
       │ 
       ├─► (Tanpa Opsi AI / Unchecked) ─► [ Laravel Template Engine ] ─► Teks Pesan Matang (Tanpa Sesi External)
       │
       └─► (Centang Opsi AI + Consent) ─► [ Laravel Controller ] ─► [ Filter Guardrail Internal ]
                                                                                │
                                                                   [ Google Gemini AI Endpoint ]
                                                                   (Data Dianonimkan & Tidak Dilatih)
                                                                                │
                                                                      [ Verifikator Semantik ]
                                                                                │
                                                                   [ Keluaran JSON Tuntas (No Store) ]
```

### A. Protokol Opt-In & Eksperimen Konsensual (Explicit Consent Control)
- Secara baku (*default*), kotak centang **"✨ Rapikan pesan dengan AI"** dalam posisi TIDAK dicentang (*unchecked*).
- Apabila pengguna memutuskan menggunakan penyempurnaan AI, pengguna **wajib** mencentang kotak persetujuan eksplisit kedua (*explicit consent*): *"Saya setuju informasi kedaruratan umum dikirim ke penyedia AI tanpa menyertakan lokasi GPS maupun catatan sensitif..."*.
- Tanpa persetujuan eksplisit ini, permintaan ditolak di tingkat validasi API Laravel (`AiConsentRequiredIf` rule) atau fallback segera dikonduksikan ke mesin template deterministik internal.

### B. Filter Anonimisasi & Keamanan AI (Permanent Guardrail System)
Sebelum payload dikirim melalui jaringan terenkripsi menuju Google DeepMind / Gemini Cloud API:
1. **Stripping Data Sensitif Langsung (Anonymized Transfer)**: Parameter lokasi sensitif yang bersifat *personally identifiable information* (PII), nomor KTP/Identitas, maupu koordinat GPS presisi mikro disederhanakan oleh `GeminiMessageRefinementService` agar tidak masuk ke dalam konteks perintah analitik sistemik AI.
2. **Ketiadaan Retensi Model (No-Training Assurance)**: Rute permintaan diikat pada kesepahaman perlindungan API korporasi berarsitektur ephemaral; masukan pengguna tidak digunakan oleh Google Gemini untuk melatih ulang model pondasi (No Model Training by Provider).
3. **Pemasangan Guardrail Permanent in Code**: Batasan sistem (*System Prompt Command*) ditautkan langsung via CMS terdesinfeksi dengan larangan eksplisit untuk menyembuhkan penyakit medis secara mandiri, memberikan diagnosis obat sembarangan, atau membuat kesimpulan fiksi meleset dari fakta yang dimasukkan pelapor.

---

## 3. Perlindungan Jalur Otomasi TTS, STT, & Peramban Pemuat

- **Text-to-Speech (TTS) di Mode Tidak Dapat Berbicara**: Penguaraan audio dilaksanakan secara terisolasi menggunakan kapabiiltas asli antarmuka peramban lokal (`window.speechSynthesis`). Teks kedaruratan tidak ditransfer menuju layanan cloud eksternal maupu pelacak pengolahan audio suara berbayar.
- **Speech-to-Text (STT) di Mode Tidak Dapat Mendengar**: Pengupayaan pembukaan mikrofon secara waktu nyata diamati dan diolah di atas isolasi pemroses lokal browser (`SpeechRecognition`). Tiada rakam suara (*audio byte stream*) yang diunggah maupu dikantongi dalam direktori `storage` aplikasi.
- **Proteksi Jejak Cache Peramban**: Kombinasi kebijakan pengawal header `Cache-Control: no-store` menjaminkan riwayat pelayaran di peramban langsung menghapuskan jejak teks begitu halaman darurat ditutup atau dipindah arah balik oleh warga yang tengah terancam keselamatannya.

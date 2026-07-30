# Keamanan, Privasi, & Kebijakan Pertahanan Aplikasi (SECURITY.md)

Dokumen ini merupakan pilar resmi kebijakan keamanan siber dan perlindungan privasi pada sistem **ResponSetara**, menggariskan tindakan perbaikan kerentanan kristal (remedially verified), proteksi otentikasi admin, mitigasi kebocoran kredensial AI, serta arsitektur isolasi lalu lintas web berstandar tinggi.

---

## 1. Remediasi Celah Keamanan P0/P1: Mass Assignment & Otorisasi Kritis

### A. Evaluasi Risiko Celah Mass Assignment
Pada baseline audit sebelumnya, terdeteksi potensi kerentanan otorisasi pada model Eloquent (`App\Models\User.php`) di mana atribut sensitif otentikasi lapis atas dan keamanan siber—seperti `two_factor_secret`, `two_factor_recovery_codes`, dan `two_factor_confirmed_at`—terdaftar secara teledor di dalam array `$fillable`.
Hal ini menimbulkan ancaman celah keamanan serius berupa pengambilalihan akun admin (Account Takeover / ATO) apabila penyerang menyisipkan payload HTTP kustom yang mengeksekusi *mass update* pada profil pengguna.

### B. Implementasi Perbaikan (Hardening Intervention)
1. **Pembersihan `$fillable` di Model User**: Seluruh atribut otentikasi ganda (*Two-Factor Authentication / 2FA*) telah dihapus secara mutlak dari array `$fillable` dan dipindahkan ke kebijakan modifikasi *Explicit Property Assignment*. Parameter tersebut juga wajib dikekalkan secara aman dalam daftar exclusion `$hidden` dan `$casts` tersertifikasi (`encrypted`).
2. **Refaktorisasi Seeder (`UserSeeder.php`)**: Pemberian data profil seeding pada lingkungan produksi maupun E2E dikondisikan tanpa melewati gerbang pencatatan massal, dengan penunjukan variabel secara explisit dan verifikasi ganda tipe peran (role authorization check: *admin vs public*).
3. **Penyaringan Pemetaan Props Inertia (`HandleInertiaRequests.php`)**: Properti global berbasis Inertia.js tidak pernah melepaskan informasi sesi atau token kredensial rahasia (baik hash sandi, recovery code, maupun skrip token internal) menuju jaringan pembaca frontend.
4. **Verifikasi Test Suite Keamanan (`UserMassAssignmentRemediationTest.php`)**: Sistem menyertakan suite eksekusi otomatis yang menjalin skenario percobaan modifikasi rekayasa atas kolom rahasia dan menegaskan blokir mutlak oleh perlindungan lapis eloquent Laravel.

---

## 2. Arsitektur Kebijakan Keamanan Lapisan Web (Web Security Policy)

ResponSetara menerapkan middleware pengawal header global secara mutlak pada `bootstrap/app.php` melalui kelas `App\Http\Middleware\SecurityHeaders.php`.

### A. Kebijakan No-Store & Pencegahan Cache Data Sensitif
Seluruh rute otentikasi (`/login`), dasbor CMS manajemen admin (`/admin/*`), dan gerbang susun pesan kedaruratan AI (`/api/v1/compose-message`) dilapisi instruksi proteksi pembatasan cache tingkat tertinggi:
```http
Cache-Control: no-store, no-cache, must-revalidate, max-age=0, private
Pragma: no-cache
Expires: Fri, 01 Jan 1990 00:00:00 GMT
```
**Manfaat Keamanan Lapangan**:
- Mengurangi eksposur informasi kedaruratan pribadi pada cache disk browser lokal di terminal umum atau perangkat yang dipakai bersama (*shared devices*).
- Menjamin tombol **Back/Back-Forward Cache (BFCache)** pada peramban seketika menghentikan pembukaan ulang sesi admin yang telah *logout* atau sesi publikasi darurat masa lampau.

### B. Pengerasan Content Security Policy (CSP) & Mitigasi XSS
Aplikasi dikonfigurasi dengan standar perlindungan injeksi skrip (Cross-Site Scripting / XSS) ketat dengan membatasi eksekusi kode acak:
1. **Pemusnahan Inline Scripts di Root View (`app.blade.php`)**: Skrip inline untuk pendeteksian palet *dark mode* telah dicabut seutuhnya dari dokumen HTML statis dan ditransportasikan dengan aman ke dalam bundel logika React murni (`app.tsx` / hooks React terverifikasi).
2. **CSP Strict Enforcement**: Header respon sistem tidak melepaskan wildcard tak terkawal (`*` atau `unsafe-eval` liar di produksi):
   - `default-src 'self' http://127.0.0.1:* http://localhost:*`
   - `script-src 'self' 'unsafe-inline'`
   - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
   - `connect-src 'self' ws://127.0.0.1:* ws://localhost:* wss://*` (mempertahankan kompatiibilitas Vite HMR dev).
3. **Header Tambahan yang Diaktifkan**:
   - `X-Frame-Options: SAMEORIGIN` (Pencegahan serangan *Clickjacking*).
   - `X-Content-Type-Options: nosniff` (Mitigasi eksploitasi *MIME Sniffing*).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Strict-Transport-Security` (HSTS pada domain berkurungan HTTPS murni).

---

## 3. Rahasia Sistem & Mitigasi Kebocoran Kredensial AI (Zero Key-Leakage Policy)

Kredensial intelijen buatan—terutama parameter konfigurasi `GEMINI_API_KEY` dari Google DeepMind/Gemini Cloud—merupakan aset strategis bertaraf sangat kritis:

1. **Lingkungan Server Ekstrakomunikasi (Strict Server-Side AI Bound)**: Kunci otorisasi AI dilarang keras disertakan pada variabel bertipe `VITE_*` di file konfigurasi `.env`. Kode React frontend yang dirakit melalui Vite tidak pernah dan **dilarang mutlak** membaca maupu melepaskan nilai kunci AI ke lingkungan DOM browser atau file JavaScript client-side.
2. **Redaksi Protokol & Log Catatan (Log Zero Exposure)**: Apabila terjadi kegagalan jaringan atau HTTP error saat berkomunikasi dengan endpoint Gemini Cloud, modul `GeminiClient` dan middleware pelapor pengecualian Laravel melucuti (redact) seluruh otorisasi, koordinat GPS bujur-lintang, sandi, serta token kunci dari catatan sistem (syslog).
3. **Pemeriksaan E2E Seumur Hidup**: Spesifik diuji di dalam spesifikasi pengujian tes otomat `tests-e2e/admin.spec.ts`, penelusuran konsentrisitas teks tidak diperbolehkan menemukan serpihan kunci (contoh prefiks string rahasia `AIza...`) di seluruh elemen visual admin CMS.

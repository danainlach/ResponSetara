# TESTING CHECKLIST

## Public User

- [ ] Landing page dapat dibuka tanpa login.
- [ ] Tidak ada fitur Kartu Darurat.
- [ ] Tidak ada fitur atau CMS Piktogram.
- [ ] Tiga mode komunikasi dapat dibuka.
- [ ] Form bantuan memuat data dari database.
- [ ] Frasa cepat memuat data dari database.
- [ ] Text-to-Speech dapat mulai, jeda, lanjut, dan berhenti.
- [ ] Speech-to-Text menampilkan status izin mikrofon.
- [ ] Fallback input manual muncul jika STT tidak didukung.
- [ ] Lokasi tidak diminta otomatis.
- [ ] Pesan dapat disalin.
- [ ] Pesan dapat ditampilkan layar penuh.
- [ ] Ukuran teks dapat diubah.
- [ ] Pesan dan transkripsi hilang setelah refresh.

## AI

- [ ] Template berfungsi tanpa API key.
- [ ] AI hanya dipanggil dari backend.
- [ ] Placeholder sensitif tidak berubah.
- [ ] Output non-JSON ditolak.
- [ ] Fakta baru menyebabkan fallback.
- [ ] Timeout menyebabkan fallback.
- [ ] Rate limit menyebabkan fallback.
- [ ] Log tidak menyimpan isi pesan.
- [ ] User dapat menonaktifkan AI.

## Admin

- [ ] Registrasi publik tidak tersedia.
- [ ] Route admin menolak user belum login.
- [ ] CRUD kategori berfungsi.
- [ ] CRUD kondisi berfungsi.
- [ ] CRUD jenis bantuan berfungsi.
- [ ] CRUD frasa cepat berfungsi.
- [ ] CRUD panduan berfungsi.
- [ ] CRUD kontak berfungsi.
- [ ] Soft delete berfungsi.
- [ ] Perubahan aktif/nonaktif langsung tampil.
- [ ] Activity log tidak menyimpan data sensitif.

## Accessibility

- [ ] Semua field memiliki label.
- [ ] Semua tombol dapat diakses keyboard.
- [ ] Focus indicator terlihat.
- [ ] Kontras memenuhi target WCAG AA.
- [ ] Informasi tidak hanya bergantung pada warna.
- [ ] Status mikrofon memiliki teks dan indikator visual.
- [ ] Error menggunakan aria-live.
- [ ] Reduced motion didukung.
- [ ] Touch target minimum 44×44 px.
- [ ] Tampilan diuji pada lebar 360 px.

## Security

- [ ] API key tidak ada di bundle frontend.
- [ ] Password database tidak ada di frontend.
- [ ] Input disanitasi.
- [ ] Rate limiting diterapkan.
- [ ] CSRF aktif.
- [ ] Admin authorization diuji.
- [ ] Error produksi tidak menampilkan stack trace.

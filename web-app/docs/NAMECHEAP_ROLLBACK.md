# Panduan Rollback Deployment Namecheap Shared Hosting

Dokumen ini berisi instruksi dan langkah-langkah untuk melakukan pembatalan (rollback) pembaruan rilis aplikasi ResponSetara ke versi sebelumnya apabila ditemukan bug kritis atau kegagalan sistem pada saat rilis baru berjalan di Namecheap.

---

## Strategi Backup Sebelum Update (Pre-Update Backup)

Sebelum melakukan ekstraksi kode baru, Anda **wajib** membuat cadangan versi stabil yang sedang aktif.

1. **Backup Source Code**:
   Salin folder aplikasi aktif saat ini ke folder cadangan:
   ```bash
   cp -R /home/CPANEL_USER/responsetara-app /home/CPANEL_USER/responsetara-app_backup_stabil
   cp -R /home/CPANEL_USER/public_html /home/CPANEL_USER/public_html_backup_stabil
   ```

2. **Backup Skema Database**:
   Lakukan ekspor skema dan data database Supabase sebelum rilis dimulai demi keamanan data jika ada migrasi yang merusak skema.

---

## Langkah-Langkah Rollback (Pemulihan Versi Stabil)

Jika terjadi masalah fatal saat rilis baru diunggah:

### Langkah 1: Hentikan Trafik / Aktifkan Maintenance Mode
Segera aktifkan mode pemeliharaan agar pengguna mendapatkan pesan gawat darurat yang aman dan tidak melihat error Laravel raw:
```bash
cd /home/CPANEL_USER/responsetara-app
php artisan down --refresh=15 --secret="bypass-maintenance-key"
```

### Langkah 2: Kembalikan Berkas Versi Stabil
Untuk menghindari risiko kehilangan data secara tidak sengaja, **jangan** gunakan perintah penghapusan destruktif seperti `rm -rf`. Gunakan strategi pertukaran nama direktori berikut:

1. Ganti nama folder rilis baru yang bermasalah agar dapat dianalisis nanti:
   ```bash
   mv /home/CPANEL_USER/responsetara-app /home/CPANEL_USER/responsetara-app_bermasalah
   mv /home/CPANEL_USER/public_html /home/CPANEL_USER/public_html_bermasalah
   ```
2. Kembalikan folder cadangan stabil Anda menjadi folder aktif:
   ```bash
   mv /home/CPANEL_USER/responsetara-app_backup_stabil /home/CPANEL_USER/responsetara-app
   mv /home/CPANEL_USER/public_html_backup_stabil /home/CPANEL_USER/public_html
   ```

### Langkah 3: Kebijakan Rollback Database (Manual)
Rollback database **tidak dijalankan secara otomatis** dalam alur rollback default demi menjaga integritas data publik di database produksi Supabase.

Jika ada perubahan skema yang merusak aplikasi, lakukan investigasi status migrasi terlebih dahulu:
```bash
cd /home/CPANEL_USER/responsetara-app
php artisan migrate:status
```
Jika dipastikan aman untuk membatalkan migrasi terakhir, lakukan rollback manual secara hati-hati:
```bash
php artisan migrate:rollback --step=1
```

### Langkah 4: Bersihkan dan Cache Ulang Konfigurasi
Hapus seluruh cache rilis bermasalah dan bangun ulang cache untuk versi stabil:
```bash
php artisan optimize:clear
php artisan optimize
```

### Langkah 5: Nonaktifkan Maintenance Mode
Matikan mode pemeliharaan dan biarkan sistem kembali online:
```bash
php artisan up
```

---
Kembali ke [Panduan Utama](DEPLOYMENT_NAMECHEAP.md) | Lihat [Panduan Lingkungan](NAMECHEAP_ENVIRONMENT.md)

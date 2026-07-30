# Panduan Rollback Deployment Render

Dokumen ini menjelaskan cara memulihkan (rollback) web service ke versi stabil sebelumnya apabila terdeteksi kendala kritis pada rilis terbaru.

## 1. Rollback Kode Melalui Dashboard Render
1. Buka Dashboard Render Anda.
2. Pilih Web Service `responsetara-staging`.
3. Buka menu **Events** atau **Deployments** di bilah kiri.
4. Cari rilis atau commit stabil terakhir yang berhasil dideploy sebelumnya.
5. Klik ikon tiga titik (`...`) di samping deploy tersebut, lalu pilih **Rollback to this deploy**.
6. Render akan mengunci rilis aktif ke commit tersebut dan mematikan rilis yang bermasalah.

## 2. Penanganan Skema Migrasi Database (Supabase)
Karena Supabase PostgreSQL dihubungkan secara eksternal, melakukan rollback kode di Render **tidak akan membatalkan (rollback) skema tabel database secara otomatis**.
* Jika rilis terbaru menyertakan perubahan skema migrasi database yang merusak kompatibilitas kode lama:
  * Anda harus memulihkan skema database secara manual menggunakan tool Supabase Database Restoring / Backups.
  * Atau jalankan perintah rollback migrasi lokal secara manual ke arah database target sebelum melakukan rollback commit:
    ```bash
    php artisan migrate:rollback --step=1
    ```

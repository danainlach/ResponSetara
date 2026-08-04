# Panduan First Deployment Namecheap Shared Hosting

Dokumen ini menjelaskan langkah demi langkah untuk melakukan deployment pertama kali setelah berkas ZIP aplikasi diunggah dan diekstrak di server Namecheap.

---

## Prasyarat
- Akses SSH ke Namecheap Shared Hosting (aktifkan melalui cPanel -> Manage Shell).
- Koneksi SSH berjalan pada **Port 21098** (Port khusus SSH Namecheap).
- Kredensial akun cPanel (`CPANEL_USER`).

---

## Langkah 1: Persiapan Folder di Server

Masuk ke server via SSH:
```bash
ssh CPANEL_USER@afnicode.me -p 21098
```

Buat folder proyek di luar `public_html`:
```bash
mkdir -p /home/CPANEL_USER/responsetara-app
```

---

## Langkah 2: Unggah dan Ekstrak Berkas Aplikasi

1. Buat paket deployment di komputer lokal menggunakan skrip pembantu:
   ```powershell
   .\scripts\prepare-namecheap-deploy.ps1
   ```
2. Unggah file `responsetara-deploy.zip` hasil kompilasi ke folder `/home/CPANEL_USER/` di server menggunakan File Manager cPanel atau SFTP (Port 21098).
3. Ekstrak file tersebut di server:
   ```bash
   cd /home/CPANEL_USER
   unzip responsetara-deploy.zip
   ```
4. Pindahkan isi folder `public` dari zip ke dalam folder `public_html` server, sementara folder lainnya diletakkan di bawah `/home/CPANEL_USER/responsetara-app/`.

---

## Langkah 3: Konfigurasi Berkas `.env`

Buat berkas `.env` baru di `/home/CPANEL_USER/responsetara-app/.env`:
```bash
nano /home/CPANEL_USER/responsetara-app/.env
```
Salin template dari [NAMECHEAP_ENVIRONMENT.md](NAMECHEAP_ENVIRONMENT.md), isi seluruh nilainya, lalu simpan (`Ctrl+O`, `Enter`, `Ctrl+X`).

> [!WARNING]
> Perintah `php artisan key:generate` HANYA boleh dijalankan apabila `APP_KEY` pada file `.env` dalam kondisi kosong. Jangan pernah menimpa `APP_KEY` production yang sudah valid karena dapat merusak dekripsi data penting atau session pengguna yang sedang berjalan.

Amankan permission berkas `.env`:
```bash
chmod 600 /home/CPANEL_USER/responsetara-app/.env
```

---

## Langkah 4: Instalasi Dependensi Composer

Periksa apakah perintah `composer` global tersedia di Namecheap:
```bash
composer --version
```

- **Pilihan A (Jika `composer` global tersedia)**:
  ```bash
  cd /home/CPANEL_USER/responsetara-app
  composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
  ```

- **Pilihan B (Jika `composer` tidak tersedia)**:
  Download composer lokal terlebih dahulu:
  ```bash
  cd /home/CPANEL_USER/responsetara-app
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php composer-setup.php --filename=composer.phar
  php -r "unlink('composer-setup.php');"
  
  # Jalankan instalasi menggunakan composer.phar
  php composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader
  ```

---

## Langkah 5: Uji Koneksi Database Supabase

Sebelum menjalankan migrasi database ke Supabase produksi, Anda **wajib** menguji apakah server Namecheap diizinkan melakukan koneksi outbound (PostgreSQL Port 5432) menuju database Supabase eksternal Anda.

Jalankan perintah pengujian koneksi menggunakan salah satu perintah artisan berikut:
```bash
cd /home/CPANEL_USER/responsetara-app
php artisan db:show
# atau
php artisan migrate:status
```

> [!IMPORTANT]
> Jika status pengujian koneksi melaporkan kegagalan (seperti timeout koneksi), ini berarti server Namecheap memblokir akses keluar ke Port 5432. **Hentikan proses deployment** dan hubungi Customer Support Namecheap untuk meminta pembukaan akses keluar Port 5432 demi PostgreSQL eksternal.

---

## Langkah 6: Jalankan Migrasi Database

Setelah koneksi database dipastikan **PASSED**:

1. Periksa status migrasi yang belum terpasang:
   ```bash
   php artisan migrate:status
   ```
2. Jalankan migrasi database ke Supabase:
   ```bash
   php artisan migrate --force
   ```
   > [!WARNING]
   > Jangan pernah menggunakan perintah `migrate:fresh`, `db:wipe`, atau `migrate:reset` pada database produksi karena tindakan tersebut akan menghapus seluruh data publik yang tersimpan.

3. Jika data admin default (CMS admin) belum tersedia di database produksi baru Anda, buat user admin pertama kali dengan menjalankan seeder:
   ```bash
   php artisan db:seed --class=UserSeeder
   ```
   *(Catatan: UserSeeder hanya boleh dijalankan sekali. Setelah admin terbentuk, nonaktifkan atau amankan akun tersebut).*

---

## Langkah 7: Jalankan Optimasi Laravel

Aktifkan caching konfigurasi, rute, dan view untuk performa maksimal di shared hosting:
```bash
php artisan optimize
```

Pastikan tautan storage link sudah terbentuk:
```bash
# Hapus jika ada link lama yang salah arah
rm -f /home/CPANEL_USER/public_html/storage

# Buat link baru secara manual menuju path absolut yang benar
ln -s /home/CPANEL_USER/responsetara-app/storage/app/public /home/CPANEL_USER/public_html/storage
```

---
Kembali ke [Panduan Utama](DEPLOYMENT_NAMECHEAP.md) | Lanjut ke [Panduan Rollback](NAMECHEAP_ROLLBACK.md)

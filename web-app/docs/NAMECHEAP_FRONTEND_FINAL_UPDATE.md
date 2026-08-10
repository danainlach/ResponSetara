# Namecheap Production Update & Rollback Documentation (Frontend Only)

This guide documents the steps required to upload and update the compiled frontend assets of the ResponSetara application on the Namecheap production server.

## Production Server Paths
- **Home directory**: `/home/afnivqow/`
- **Laravel application root**: `/home/afnivqow/responsetara-app/`
- **Public web root**: `/home/afnivqow/public_html/`
- **Production URL**: `https://afnicode.me`

---

## 1. Backup Existing Build
Before uploading any new frontend assets, make a backup of the current production build:
1. Log in to the Namecheap server via SSH or the cPanel Terminal.
2. Navigate to the public web root:
   ```bash
   cd /home/afnivqow/public_html
   ```
3. Rename the current `build` directory to create a timestamped backup:
   ```bash
   mv build build-backup-$(date +%Y%m%d-%H%M)
   ```

---

## 2. Deploy Runtime ZIP (Required)
The compiled assets are stored in the ZIP file:
`responsetara-frontend-final-runtime.zip`

Follow these steps to deploy:
1. Upload the `responsetara-frontend-final-runtime.zip` package to the home directory: `/home/afnivqow/` via cPanel File Manager or SFTP.
2. Go to the terminal and navigate to `/home/afnivqow/`:
   ```bash
   cd /home/afnivqow
   ```
3. Extract the ZIP package:
   ```bash
   unzip -o responsetara-frontend-final-runtime.zip
   ```
   *Note: This extracts and overwrites the contents into `/home/afnivqow/public_html/` (including `/public_html/build/` and static icons).*
4. Verify the extraction by checking that the manifest file exists:
   ```bash
   ls -la /home/afnivqow/public_html/build/manifest.json
   ```

---

## 3. Deploy Source ZIP (Optional)
To synchronize the React components and source code files with the server repository (for backup/consistency):
1. Upload the `responsetara-frontend-final-source.zip` package to `/home/afnivqow/` via cPanel File Manager or SFTP.
2. Extract the package:
   ```bash
   cd /home/afnivqow
   unzip -o responsetara-frontend-final-source.zip
   ```
   *Note: This extracts and synchronizes the frontend sources into `/home/afnivqow/responsetara-app/`.*

---

## 4. Clear & Rebuild Application Caches
After the files are extracted, clear and rebuild Laravel's caches to ensure the view compiler picks up the new paths of the hashed assets:
```bash
cd /home/afnivqow/responsetara-app
php artisan optimize:clear
php artisan config:cache
php artisan view:cache
```

> [!WARNING]
> **DO NOT** run migrations, seeders, or `composer install` for this frontend-only update.

---

## 5. Verify & Test Production Site
Open the website (`https://afnicode.me`) in a private/incognito window (or perform a hard refresh `Ctrl + Shift + R`) and test the following pages:
- **Landing Page**: `/`
- **Emergency Button / Form**: `/bantuan-darurat`
- **Deaf Mode / STT**: `/tidak-dapat-mendengar`
- **Non-verbal / Text-to-Speech**: `/tidak-dapat-berbicara`
- **Login Portal**: `/login`
- **Admin Dashboard**: `/dashboard` or `/admin/*`
- **Settings / Profile**: `/settings/profile`

---

## 6. Rollback Procedure
If any rendering errors, blank screens, or layout issues occur, perform a rollback immediately:
1. Log in to the server terminal.
2. Navigate to the public web root:
   ```bash
   cd /home/afnivqow/public_html
   ```
3. Rename the failed build directory:
   ```bash
   mv build build-failed
   ```
4. Restore the backup build directory (replace `[TIMESTAMP]` with the backup folder name created in step 1):
   ```bash
   mv build-backup-[TIMESTAMP] build
   ```
5. Clear cache again:
   ```bash
   cd /home/afnivqow/responsetara-app
   php artisan view:clear
   ```
*Note: No database rollback is required as this update only changes frontend assets.*

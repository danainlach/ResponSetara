<?php

/**
 * ResponSetara - Media Komunikasi Darurat Inklusif
 * cPanel/Shared Hosting Entry Point
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Tentukan path ke folder aplikasi luar public_html (responsetara-app)
// Dapat menggunakan path relatif atau path absolut server:
$appPath = __DIR__ . '/../responsetara-app'; 
// Alternatif jika path di atas terkendala: '/home/CPANEL_USER/responsetara-app'

// Periksa apakah aplikasi berada dalam mode pemeliharaan...
if (file_exists($maintenance = $appPath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Daftarkan Composer autoloader...
require $appPath . '/vendor/autoload.php';

// Muat bootstrap Laravel...
/** @var Application $app */
$app = require_once $appPath . '/bootstrap/app.php';

// Handle incoming HTTP request...
$app->handleRequest(Request::capture());

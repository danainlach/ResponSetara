<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\AssistanceType;
use App\Models\QuickPhrase;
use App\Models\HelperGuide;
use App\Models\EmergencyContact;
use App\Models\SiteContent;
use App\Models\AiPrompt;
use App\Models\AggregateStatistic;
use App\Models\AdminActivityLog;

echo "\n=== VERIFIKASI DATA CLOUD (SUPABASE) ===" . PHP_EOL;
$tables = [
    'users' => User::count(),
    'emergency_categories' => EmergencyCategory::count(),
    'emergency_conditions' => EmergencyCondition::count(),
    'assistance_types' => AssistanceType::count(),
    'quick_phrases' => QuickPhrase::count(),
    'helper_guides' => HelperGuide::count(),
    'emergency_contacts' => EmergencyContact::count(),
    'site_contents' => SiteContent::count(),
    'ai_prompts' => AiPrompt::count(),
    'aggregate_statistics' => AggregateStatistic::count(),
    'admin_activity_logs' => AdminActivityLog::count(),
];

foreach ($tables as $tbl => $count) {
    echo str_pad($tbl, 22) . " : " . $count . " baris" . PHP_EOL;
}

echo "\n=== VERIFIKASI NOMOR KONTAK DARURAT ===" . PHP_EOL;
$contacts = EmergencyContact::all();
foreach ($contacts as $c) {
    echo " - " . str_pad($c->service_name, 35) . " : " . $c->number . PHP_EOL;
}
$medis = EmergencyContact::where('number', '119')->exists();
$polisi = EmergencyContact::where('number', '110')->exists();
$pemadam = EmergencyContact::where('number', '113')->exists();
$terintegrasi = EmergencyContact::where('number', '112')->exists();
echo "Status Medis (119)             : " . ($medis ? "VALID [119]" : "INVALID") . PHP_EOL;
echo "Status Polisi (110)            : " . ($polisi ? "VALID [110]" : "INVALID") . PHP_EOL;
echo "Status Pemadam (113)           : " . ($pemadam ? "VALID [113]" : "INVALID") . PHP_EOL;
echo "Status Layanan Terintegrasi(112) : " . ($terintegrasi ? "VALID [112]" : "INVALID") . PHP_EOL;

echo "\n=== VERIFIKASI USER ROLE & ADMIN AWAL ===" . PHP_EOL;
$usersCount = User::count();
if ($usersCount === 0) {
    echo "Status Admin Awal : BELUM DIBUAT (Kredensial ADMIN_NAME/EMAIL/PASSWORD belum disetel lengkap di .env, default hardcode diabaikan)" . PHP_EOL;
    echo "UserRole Aktif    : N/A (0 users in database)" . PHP_EOL;
} else {
    $roles = User::distinct()->get(['role'])->map(fn($u) => $u->role->value ?? $u->role)->toArray();
    echo "Status Admin Awal : TERSEDIA (" . $usersCount . " user terkonfirmasi tanpa mencetak rahasia)" . PHP_EOL;
    echo "UserRole Aktif    : " . implode(', ', $roles) . " [ONLY 'admin' PERMITTED]" . PHP_EOL;
}

echo "\n=== VERIFIKASI TABEL TERLARANG ===" . PHP_EOL;
$forbidden = [
    'emergency_cards',
    'cards',
    'pictograms',
    'emergency_pictograms',
    'user_messages',
    'message_histories',
    'transcripts',
    'audio_recordings',
    'public_users',
    'conversations',
];
$currSchema = DB::connection('pgsql')->selectOne("SELECT current_schema() as sch")->sch;
$existingTables = DB::connection('pgsql')->select("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", [$currSchema]);
$existingNames = array_map(fn($t) => $t->table_name, $existingTables);

$foundForbidden = [];
foreach ($forbidden as $f) {
    if (in_array($f, $existingNames)) {
        $foundForbidden[] = $f;
    }
}
if (empty($foundForbidden)) {
    echo "Status Tabel Terlarang : TIDAK ADA (Sepenuhnya mematuhi PRD, 0 tabel terlarang ditemukan pada skema " . $currSchema . ")" . PHP_EOL;
} else {
    echo "Status Tabel Terlarang : DITEMUKAN (" . implode(', ', $foundForbidden) . ")" . PHP_EOL;
}

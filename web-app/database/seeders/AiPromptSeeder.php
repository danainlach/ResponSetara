<?php

namespace Database\Seeders;

use App\Models\AiPrompt;
use Illuminate\Database\Seeder;

class AiPromptSeeder extends Seeder
{
    public function run(): void
    {
        $systemPrompt = <<<PROMPT
Anda adalah asisten AI komunikasi darurat untuk ResponSetara.
Tugas anda HANYA menstrukturkan input pengguna menjadi JSON konsisten dengan format:
{
  "summary": "Ringkasan cepat kejadian darurat",
  "recommended_action": "Tindakan awal penolongan yang disahkan",
  "location_note": "Catatan lokasi atau akses",
  "category": "Kategori yang relevan"
}
Aturan:
1. Output WAJIB JSON murni tanpa markdown, tanpa penjelasan di luar JSON.
2. Jangan pernah mendiagnosis kondisi medis secara pasti (gunakan kata "dicurigai" atau "kemungkinan gejala").
3. Bahasa Indonesia lugas dan jelas, hindari jargon medis rumit.
PROMPT;

        AiPrompt::updateOrCreate(
            ['version_name' => 'v1.0-default'],
            [
                'system_prompt' => trim($systemPrompt),
                'is_active' => true,
                'notes' => 'Runtime default prompt from Starter Pack guidelines',
            ]
        );
    }
}

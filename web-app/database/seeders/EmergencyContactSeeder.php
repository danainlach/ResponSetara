<?php

namespace Database\Seeders;

use App\Models\EmergencyContact;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class EmergencyContactSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/emergency_contacts.json');
        if (!File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        foreach ($data as $item) {
            EmergencyContact::updateOrCreate(
                [
                    'service_name' => $item['service_name'],
                    'number' => $item['number'],
                ],
                [
                    'scope' => $item['scope'] ?? 'Nasional',
                    'coverage_note' => $item['coverage_note'] ?? null,
                    'source_name' => $item['source_name'] ?? null,
                    'source_url' => $item['source_url'] ?? null,
                    'last_verified_at' => $item['last_verified_at'] ?? now()->toDateString(),
                    'is_verified' => $item['is_verified'] ?? true,
                    'sort_order' => $item['sort_order'] ?? 0,
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

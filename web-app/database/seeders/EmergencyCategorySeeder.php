<?php

namespace Database\Seeders;

use App\Models\EmergencyCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class EmergencyCategorySeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/categories.json');
        if (!File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        foreach ($data as $item) {
            EmergencyCategory::updateOrCreate(
                ['code' => $item['code']],
                [
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => $item['description'] ?? null,
                    'color' => $item['color'] ?? null,
                    'sort_order' => $item['sort_order'] ?? 0,
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

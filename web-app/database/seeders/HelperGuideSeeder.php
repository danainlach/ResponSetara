<?php

namespace Database\Seeders;

use App\Models\HelperGuide;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class HelperGuideSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/helper_guides.json');
        if (!File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        foreach ($data as $item) {
            HelperGuide::updateOrCreate(
                [
                    'title' => $item['title'],
                    'audience' => $item['audience'],
                ],
                [
                    'body' => $item['body'],
                    'sort_order' => $item['sort_order'] ?? 0,
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

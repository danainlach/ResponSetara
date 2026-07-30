<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/site_contents.json');
        if (!File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        foreach ($data as $item) {
            SiteContent::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'],
                    'content_type' => $item['content_type'] ?? 'text',
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

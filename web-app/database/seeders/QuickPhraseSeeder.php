<?php

namespace Database\Seeders;

use App\Models\EmergencyCategory;
use App\Models\QuickPhrase;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class QuickPhraseSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/quick_phrases.json');
        if (!File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        foreach ($data as $item) {
            $categoryId = null;
            if (!empty($item['category_code'])) {
                $category = EmergencyCategory::where('code', $item['category_code'])->first();
                $categoryId = $category?->id;
            }

            QuickPhrase::updateOrCreate(
                [
                    'mode' => $item['mode'],
                    'phrase_text' => $item['phrase_text'],
                ],
                [
                    'category_id' => $categoryId,
                    'speech_text' => $item['speech_text'] ?? $item['phrase_text'],
                    'simplified_text' => $item['simplified_text'] ?? $item['phrase_text'],
                    'priority' => $item['priority'] ?? 'medium',
                    'sort_order' => $item['sort_order'] ?? 0,
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

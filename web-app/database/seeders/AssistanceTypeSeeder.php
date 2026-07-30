<?php

namespace Database\Seeders;

use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class AssistanceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../ResponSetara_VibeCoding_Starter_Pack/seed_data/assistance_types.json');
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

            AssistanceType::updateOrCreate(
                ['code' => $item['code']],
                [
                    'category_id' => $categoryId,
                    'label' => $item['label'],
                    'description' => $item['description'] ?? null,
                    'template_fragment' => $item['template_fragment'],
                    'sort_order' => $item['sort_order'] ?? 0,
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }
    }
}

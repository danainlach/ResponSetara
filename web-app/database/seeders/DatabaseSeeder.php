<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EmergencyCategorySeeder::class,
            EmergencyConditionSeeder::class,
            AssistanceTypeSeeder::class,
            QuickPhraseSeeder::class,
            HelperGuideSeeder::class,
            EmergencyContactSeeder::class,
            SiteContentSeeder::class,
            AiPromptSeeder::class,
        ]);
    }
}


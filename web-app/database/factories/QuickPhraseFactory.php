<?php

namespace Database\Factories;

use App\Enums\CommunicationMode;
use App\Enums\PhrasePriority;
use App\Models\EmergencyCategory;
use App\Models\QuickPhrase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuickPhrase>
 */
class QuickPhraseFactory extends Factory
{
    protected $model = QuickPhrase::class;

    public function definition(): array
    {
        $text = $this->faker->sentence();
        return [
            'category_id' => EmergencyCategory::factory(),
            'mode' => CommunicationMode::GENERAL,
            'phrase_text' => $text,
            'speech_text' => $text,
            'simplified_text' => $text,
            'priority' => PhrasePriority::MEDIUM,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}

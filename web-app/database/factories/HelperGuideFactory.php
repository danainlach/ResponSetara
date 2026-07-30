<?php

namespace Database\Factories;

use App\Enums\GuideAudience;
use App\Models\HelperGuide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HelperGuide>
 */
class HelperGuideFactory extends Factory
{
    protected $model = HelperGuide::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'body' => $this->faker->paragraphs(2, true),
            'audience' => GuideAudience::GENERAL,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}

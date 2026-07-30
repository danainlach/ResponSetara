<?php

namespace Database\Factories;

use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmergencyCondition>
 */
class EmergencyConditionFactory extends Factory
{
    protected $model = EmergencyCondition::class;

    public function definition(): array
    {
        return [
            'category_id' => EmergencyCategory::factory(),
            'code' => 'COND_' . $this->faker->unique()->numberBetween(1000, 9999),
            'label' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'template_fragment' => 'Saya mengalami kondisi ' . $this->faker->word(),
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}

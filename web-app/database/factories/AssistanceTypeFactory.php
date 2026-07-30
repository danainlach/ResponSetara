<?php

namespace Database\Factories;

use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssistanceType>
 */
class AssistanceTypeFactory extends Factory
{
    protected $model = AssistanceType::class;

    public function definition(): array
    {
        return [
            'category_id' => EmergencyCategory::factory(),
            'code' => 'HELP_' . $this->faker->unique()->numberBetween(1000, 9999),
            'label' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'template_fragment' => 'Saya membutuhkan bantuan ' . $this->faker->word(),
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}

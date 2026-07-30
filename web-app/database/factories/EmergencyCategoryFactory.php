<?php

namespace Database\Factories;

use App\Models\EmergencyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmergencyCategory>
 */
class EmergencyCategoryFactory extends Factory
{
    protected $model = EmergencyCategory::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);
        return [
            'code' => 'CAT_' . $this->faker->unique()->numberBetween(100, 999),
            'name' => ucwords((string) $name),
            'slug' => str_replace(' ', '-', strtolower((string) $name)) . '-' . $this->faker->unique()->numberBetween(100, 999),
            'description' => $this->faker->sentence(),
            'color' => '#3B82F6',
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

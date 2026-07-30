<?php

namespace Database\Factories;

use App\Models\AggregateStatistic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AggregateStatistic>
 */
class AggregateStatisticFactory extends Factory
{
    protected $model = AggregateStatistic::class;

    public function definition(): array
    {
        return [
            'event_date' => now()->toDateString(),
            'event_type' => $this->faker->randomElement(['compose_ai', 'compose_template', 'tts_used']),
            'category_slug' => 'medis-' . $this->faker->numberBetween(100, 999),
            'count' => $this->faker->numberBetween(1, 50),
        ];
    }
}

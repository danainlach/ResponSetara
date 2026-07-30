<?php

namespace Database\Factories;

use App\Models\SiteContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SiteContent>
 */
class SiteContentFactory extends Factory
{
    protected $model = SiteContent::class;

    public function definition(): array
    {
        return [
            'key' => 'content_key_' . $this->faker->unique()->numberBetween(1000, 9999),
            'value' => $this->faker->paragraph(),
            'content_type' => 'text',
            'is_active' => true,
        ];
    }
}

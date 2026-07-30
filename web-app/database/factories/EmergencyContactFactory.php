<?php

namespace Database\Factories;

use App\Models\EmergencyContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmergencyContact>
 */
class EmergencyContactFactory extends Factory
{
    protected $model = EmergencyContact::class;

    public function definition(): array
    {
        return [
            'service_name' => $this->faker->company(),
            'number' => $this->faker->phoneNumber(),
            'scope' => 'Nasional',
            'coverage_note' => 'Seluruh Indonesia',
            'source_name' => 'Kementerian RI',
            'source_url' => 'https://example.id',
            'last_verified_at' => now()->toDateString(),
            'is_verified' => true,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}

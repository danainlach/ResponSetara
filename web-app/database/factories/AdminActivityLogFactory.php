<?php

namespace Database\Factories;

use App\Models\AdminActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdminActivityLog>
 */
class AdminActivityLogFactory extends Factory
{
    protected $model = AdminActivityLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => 'update_category',
            'target_type' => 'EmergencyCategory',
            'target_id' => 1,
            'description' => 'Updated category status without logging sensitive info.',
            'ip_address' => '127.0.0.1',
            'created_at' => now(),
        ];
    }
}

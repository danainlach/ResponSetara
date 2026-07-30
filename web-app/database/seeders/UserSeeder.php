<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', $_ENV['ADMIN_EMAIL'] ?? $_SERVER['ADMIN_EMAIL'] ?? null);
        $name = env('ADMIN_NAME', $_ENV['ADMIN_NAME'] ?? $_SERVER['ADMIN_NAME'] ?? null);
        $password = env('ADMIN_PASSWORD', $_ENV['ADMIN_PASSWORD'] ?? $_SERVER['ADMIN_PASSWORD'] ?? null);

        if (empty($email) || empty($name) || empty($password)) {
            $this->command?->warn('Admin credentials (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD) not configured in environment. Skipping initial admin creation.');
            return;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $name;
        $user->password = Hash::make((string) $password);
        $user->role = UserRole::ADMIN;
        $user->is_active = true;
        $user->email_verified_at = now();
        $user->save();
    }
}

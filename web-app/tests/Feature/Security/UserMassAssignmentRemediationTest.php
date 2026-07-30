<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserMassAssignmentRemediationTest extends TestCase
{
    use RefreshDatabase;

    // 1. Payload role melalui create/update tidak mengubah role.
    public function test_payload_role_cannot_be_mass_assigned_in_create_or_update(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'operator', // Should be ignored; db default is admin
        ]);

        $user = $user->fresh();
        $this->assertEquals(UserRole::ADMIN, $user->role);
        $this->assertNotEquals(UserRole::OPERATOR, $user->role);

        $user->update(['role' => UserRole::OPERATOR]);
        $this->assertEquals(UserRole::ADMIN, $user->fresh()->role);
    }

    // 2. Payload is_active tidak dapat dimass-assign.
    public function test_payload_is_active_cannot_be_mass_assigned(): void
    {
        $user = User::create([
            'name' => 'Test Inactive',
            'email' => 'inactive@example.com',
            'password' => Hash::make('password'),
        ]);

        $user->is_active = false;
        $user->save();

        $user->update(['is_active' => true]);
        $this->assertFalse($user->fresh()->is_active);
    }

    // 3. Admin seeder tetap dapat membuat admin melalui assignment eksplisit.
    public function test_admin_seeder_creates_admin_via_explicit_assignment(): void
    {
        $_ENV['ADMIN_EMAIL'] = 'admin-seed@test.com';
        $_ENV['ADMIN_NAME'] = 'Admin Seed';
        $_ENV['ADMIN_PASSWORD'] = 'secret-admin-pass';
        $_SERVER['ADMIN_EMAIL'] = 'admin-seed@test.com';
        $_SERVER['ADMIN_NAME'] = 'Admin Seed';
        $_SERVER['ADMIN_PASSWORD'] = 'secret-admin-pass';
        putenv('ADMIN_EMAIL=admin-seed@test.com');
        putenv('ADMIN_NAME=Admin Seed');
        putenv('ADMIN_PASSWORD=secret-admin-pass');

        $this->seed(UserSeeder::class);

        $admin = User::where('email', 'admin-seed@test.com')->first();
        $this->assertNotNull($admin);
        $this->assertEquals(UserRole::ADMIN, $admin->role);
        $this->assertTrue($admin->is_active);
    }

    // 4. User profile update tidak dapat mengubah role.
    public function test_user_profile_update_cannot_change_role(): void
    {
        $user = User::factory()->create(['role' => 'operator']);
        $this->actingAs($user);

        $response = $this->patchJson('/settings/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ]);

        $response->assertRedirect();
        $this->assertEquals(UserRole::OPERATOR, $user->fresh()->role);
    }

    // 5. Password, role, dan is_active tidak masuk Inertia props.
    public function test_password_role_and_is_active_are_not_in_inertia_props(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->actingAs($user);

        $response = $this->get('/');
        $response->assertStatus(200);

        $page = $response->viewData('page');
        $authProps = $page['props']['auth']['user'] ?? [];

        $this->assertArrayHasKey('id', $authProps);
        $this->assertArrayHasKey('name', $authProps);
        $this->assertArrayHasKey('email', $authProps);
        $this->assertArrayNotHasKey('password', $authProps);
        $this->assertArrayNotHasKey('role', $authProps);
        $this->assertArrayNotHasKey('is_active', $authProps);
    }

    // 6. Admin middleware tetap berfungsi.
    public function test_admin_middleware_still_functions_for_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->actingAs($admin);

        $response = $this->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    // 7. Non-admin tetap menerima 403.
    public function test_non_admin_receives_403_on_admin_routes(): void
    {
        $user = User::factory()->create(['role' => 'operator', 'is_active' => true]);
        $this->actingAs($user);

        $response = $this->get('/admin/dashboard');
        $response->assertStatus(403);
    }
}

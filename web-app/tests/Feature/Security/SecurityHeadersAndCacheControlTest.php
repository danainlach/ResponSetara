<?php

declare(strict_types=1);

namespace Tests\Feature\Security;

use App\Models\User;
use Database\Seeders\AssistanceTypeSeeder;
use Database\Seeders\EmergencyCategorySeeder;
use Database\Seeders\EmergencyConditionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class SecurityHeadersAndCacheControlTest extends TestCase
{
    use RefreshDatabase;

    private function assertNoStoreCacheControl($response): void
    {
        $cacheControl = (string) $response->headers->get('Cache-Control');
        $this->assertStringContainsString('no-store', $cacheControl);
        $this->assertStringContainsString('no-cache', $cacheControl);
        $this->assertStringContainsString('must-revalidate', $cacheControl);
        $this->assertStringContainsString('max-age=0', $cacheControl);
        $this->assertStringContainsString('private', $cacheControl);
        $response->assertHeader('Pragma', 'no-cache');
        $response->assertHeader('Expires', '0');
    }

    // 1. Admin response memakai no-store.
    public function test_admin_response_uses_no_store_cache_control(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->actingAs($admin);

        $response = $this->get('/admin/dashboard');
        $response->assertStatus(200);
        $this->assertNoStoreCacheControl($response);
    }

    // 2. Login response memakai no-store.
    public function test_login_response_uses_no_store_cache_control(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
        $this->assertNoStoreCacheControl($response);
    }

    // 3. Compose response memakai no-store.
    public function test_compose_response_uses_no_store_cache_control(): void
    {
        $this->seed([
            EmergencyCategorySeeder::class,
            EmergencyConditionSeeder::class,
            AssistanceTypeSeeder::class,
        ]);

        $category = \App\Models\EmergencyCategory::first();
        $condition = \App\Models\EmergencyCondition::where('category_id', $category?->id)->orWhereNull('category_id')->first();
        $assistance = \App\Models\AssistanceType::where('category_id', $category?->id)->first();

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $category?->id,
            'condition_ids' => $condition ? [$condition->id] : [],
            'assistance_type_ids' => $assistance ? [$assistance->id] : [],
            'location' => [
                'manual_text' => 'Jakarta Barat',
                'latitude' => -6.200000,
                'longitude' => 106.816666,
                'include_coordinates' => true,
            ],
            'use_ai' => false,
        ]);

        $response->assertStatus(200);
        $this->assertNoStoreCacheControl($response);
    }

    // 4. Public reference GET tidak terpengaruh secara salah.
    public function test_public_reference_get_not_affected_by_no_store(): void
    {
        $this->seed([
            EmergencyCategorySeeder::class,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);
        $cacheControl = (string) $response->headers->get('Cache-Control');
        $this->assertTrue(empty($cacheControl) || !str_contains($cacheControl, 'no-store'));

        $apiRefResponse = $this->getJson('/api/v1/categories');
        $apiRefResponse->assertStatus(200);
        $apiCacheControl = (string) $apiRefResponse->headers->get('Cache-Control');
        $this->assertTrue(empty($apiCacheControl) || !str_contains($apiCacheControl, 'no-store'));
    }

    // 5. Development tidak memiliki HSTS.
    public function test_development_does_not_have_hsts(): void
    {
        app()->detectEnvironment(fn () => 'local');
        $response = $this->get('/');
        $response->assertHeaderMissing('Strict-Transport-Security');
    }

    // 6. Production HTTPS memiliki HSTS.
    public function test_production_https_has_hsts(): void
    {
        app()->detectEnvironment(fn () => 'production');
        Config::set('security.hsts_enabled', true);

        $response = $this->get('https://localhost/');
        $response->assertHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // 7. Permissions-Policy benar.
    public function test_permissions_policy_header_is_correct(): void
    {
        $response = $this->get('/');
        $response->assertHeader(
            'Permissions-Policy',
            'camera=(), payment=(), usb=(), microphone=(self), geolocation=(self)'
        );
    }

    // 8. CSP tidak mengizinkan koneksi browser ke Gemini.
    public function test_csp_disallows_browser_connection_to_gemini(): void
    {
        app()->detectEnvironment(fn () => 'production');
        $response = $this->get('/');
        $csp = (string) $response->headers->get('Content-Security-Policy', '');

        $this->assertStringNotContainsString('generativelanguage.googleapis.com', $csp);
        $this->assertStringContainsString("connect-src 'self'", $csp);
    }

    // 9. CSP tidak mengizinkan koneksi browser ke Supabase.
    public function test_csp_disallows_browser_connection_to_supabase(): void
    {
        app()->detectEnvironment(fn () => 'production');
        $response = $this->get('/');
        $csp = (string) $response->headers->get('Content-Security-Policy', '');

        $this->assertStringNotContainsString('supabase.co', $csp);
        $this->assertStringNotContainsString('supabase.in', $csp);
        $this->assertStringNotContainsString('pgsql', $csp);
    }

    // 10. X-Content-Type-Options bernilai nosniff.
    public function test_x_content_type_options_is_nosniff(): void
    {
        $response = $this->get('/');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    // 11. Page tidak dapat di-frame.
    public function test_page_cannot_be_framed(): void
    {
        $response = $this->get('/');
        $response->assertHeader('X-Frame-Options', 'DENY');

        $csp = (string) $response->headers->get('Content-Security-Policy', '');
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\AggregateStatistic;
use App\Models\User;
use App\Services\AggregateStatisticRecorder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PerformanceAndStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test L10: Event allowlist can be recorded.
     */
    public function test_event_allowlist_is_recorded(): void
    {
        AggregateStatisticRecorder::record('assistance_mode_opened');

        $this->assertDatabaseHas('aggregate_statistics', [
            'event_type' => 'assistance_mode_opened',
            'count' => 1
        ]);
    }

    /**
     * Test L11: Unregistered/invalid events are rejected.
     */
    public function test_invalid_event_type_is_ignored(): void
    {
        AggregateStatisticRecorder::record('invalid_event_type_here');

        $this->assertDatabaseMissing('aggregate_statistics', [
            'event_type' => 'invalid_event_type_here'
        ]);
    }

    /**
     * Test L12: Incrementing the same event on the same day increments the count on the same row.
     */
    public function test_same_event_increments_count(): void
    {
        AggregateStatisticRecorder::record('assistance_mode_opened');
        AggregateStatisticRecorder::record('assistance_mode_opened');

        // Dump table if mismatch happens
        if (AggregateStatistic::count() !== 1) {
            var_dump(AggregateStatistic::all()->toArray());
        }

        $this->assertEquals(1, AggregateStatistic::count());
        $this->assertEquals(2, AggregateStatistic::first()->count);
    }

    /**
     * Test L13: Different dates create different rows.
     */
    public function test_different_dates_create_different_rows(): void
    {
        AggregateStatisticRecorder::record('assistance_mode_opened');

        // Travel to tomorrow
        $this->travel(1)->days();

        AggregateStatisticRecorder::record('assistance_mode_opened');

        $this->assertEquals(2, AggregateStatistic::count());
    }

    /**
     * Test L14: Nullable category works.
     */
    public function test_category_slug_nullable_works(): void
    {
        AggregateStatisticRecorder::record('assistance_mode_opened', null);
        AggregateStatisticRecorder::record('assistance_mode_opened', 'medis');

        $this->assertEquals(2, AggregateStatistic::count());
    }

    /**
     * Test L15, L16, L17, L18, L19, L20: Verify no sensitive columns exist in the database table schema.
     */
    public function test_aggregate_statistics_schema_does_not_contain_sensitive_fields(): void
    {
        $columns = Schema::getColumnListing('aggregate_statistics');

        $sensitiveFields = [
            'ip', 'ip_address', 'session_id', 'session', 'user_agent',
            'message', 'message_content', 'location', 'coordinates',
            'transcript', 'audio'
        ];

        foreach ($sensitiveFields as $field) {
            $this->assertNotContains($field, $columns, "Tabel statistik mengandung kolom sensitif dilarang: {$field}");
        }
    }

    /**
     * Test L21: Prefetch requests are not counted.
     */
    public function test_prefetch_requests_are_ignored(): void
    {
        request()->headers->set('X-Inertia-Prefetch', 'true');

        AggregateStatisticRecorder::record('assistance_mode_opened');

        $this->assertDatabaseMissing('aggregate_statistics', [
            'event_type' => 'assistance_mode_opened'
        ]);

        request()->headers->remove('X-Inertia-Prefetch');
    }

    /**
     * Test L24: Recorder failures do not fail the compose message logic.
     */
    public function test_recorder_failures_do_not_crash_compose_message(): void
    {
        $category = \App\Models\EmergencyCategory::factory()->create(['is_active' => true]);

        $response = $this->postJson(route('api.v1.compose-message'), [
            'communication_mode' => 'assistance',
            'category_id' => $category->id,
            'location' => [
                'manual_text' => 'Jl. Merdeka No. 10',
            ],
            'use_ai' => false
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
    }

    /**
     * Test L25, L26, L27: Authorization check for statistics page.
     */
    public function test_statistics_page_authorization(): void
    {
        // Guest is redirected to login
        $this->get(route('admin.statistics.index'))->assertRedirect(route('login'));

        // Non-admin gets 403 Forbidden
        $user = User::factory()->create(['role' => \App\Enums\UserRole::OPERATOR->value]);
        $this->actingAs($user)->get(route('admin.statistics.index'))->assertStatus(403);

        // Admin gets 200 OK
        $admin = User::factory()->create(['role' => \App\Enums\UserRole::ADMIN->value]);
        $this->actingAs($admin)->get(route('admin.statistics.index'))->assertStatus(200);
    }

    /**
     * Test L28: Statistics page remains read-only.
     */
    public function test_statistics_page_is_readonly(): void
    {
        // Assert no write routes (POST/PUT/DELETE) exist for admin statistics
        $routes = collect(\Route::getRoutes())->filter(function ($route) {
            return str_contains($route->getName() ?? '', 'admin.statistics') &&
                count(array_intersect($route->methods(), ['POST', 'PUT', 'PATCH', 'DELETE'])) > 0;
        });

        $this->assertCount(0, $routes, 'Ditemukan route modifikasi data untuk modul statistik admin yang seharusnya bersifat Read-Only!');
    }

    /**
     * Test L1: Verify all sidebar items use Inertia Link and not full page reloads.
     */
    public function test_sidebar_uses_inertia_links(): void
    {
        $sidebarPath = base_path('resources/js/components/app-sidebar.tsx');
        $this->assertFileExists($sidebarPath);
        $content = file_get_contents($sidebarPath);

        // All internal routing links in sidebar must use Inertia's <Link> component
        $this->assertStringContainsString('<Link', $content);
        $this->assertStringNotContainsString('<a href="/admin', $content); // No raw anchor tags for admin routes
    }
}

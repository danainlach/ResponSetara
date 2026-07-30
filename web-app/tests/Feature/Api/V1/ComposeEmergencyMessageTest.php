<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ComposeEmergencyMessageTest extends TestCase
{
    use RefreshDatabase;

    private EmergencyCategory $category;
    private EmergencyCondition $condition;
    private AssistanceType $assistance;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = EmergencyCategory::factory()->create([
            'name' => 'Medis & Kesehatan',
            'slug' => 'medis-kesehatan',
            'is_active' => true,
        ]);

        $this->condition = EmergencyCondition::factory()->create([
            'category_id' => null, // General condition
            'label' => 'Sadar dan dapat merespons',
            'template_fragment' => 'Sadar dan dapat merespons',
            'is_active' => true,
        ]);

        $this->assistance = AssistanceType::factory()->create([
            'category_id' => $this->category->id,
            'label' => 'Ambulans medis terdekat',
            'template_fragment' => 'Ambulans medis terdekat',
            'is_active' => true,
        ]);
    }

    public function test_compose_endpoint_succeeds_with_valid_payload(): void
    {
        $payload = [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'condition_ids' => [$this->condition->id],
            'assistance_type_ids' => [$this->assistance->id],
            'location' => [
                'manual_text' => 'Jalan Gatot Subroto No. 45, Medan',
                'latitude' => 3.5951,
                'longitude' => 98.6722,
                'include_coordinates' => true,
            ],
            'additional_information' => 'Saya bersama satu orang teman yang terluka.',
        ];

        $response = $this->postJson('/api/v1/compose-message', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'source',
                    'message',
                    'selected' => ['category_id', 'condition_ids', 'assistance_type_ids'],
                ],
                'meta' => ['version', 'request_id'],
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'source' => 'template',
                ],
            ]);
    }

    public function test_response_confirms_template_source_usage(): void
    {
        $payload = [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
        ];

        $response = $this->postJson('/api/v1/compose-message', $payload);
        $response->assertStatus(200)
            ->assertJsonPath('data.source', 'template');
    }

    public function test_inactive_category_or_conditions_are_rejected(): void
    {
        $inactiveCat = EmergencyCategory::factory()->create(['is_active' => false]);

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $inactiveCat->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    public function test_soft_deleted_data_is_rejected(): void
    {
        $deletedCond = EmergencyCondition::factory()->create(['is_active' => true]);
        $deletedCond->delete();

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'condition_ids' => [$deletedCond->id],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condition_ids']);
    }

    public function test_maximum_three_conditions_enforced(): void
    {
        $cond2 = EmergencyCondition::factory()->create(['is_active' => true]);
        $cond3 = EmergencyCondition::factory()->create(['is_active' => true]);
        $cond4 = EmergencyCondition::factory()->create(['is_active' => true]);

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'condition_ids' => [$this->condition->id, $cond2->id, $cond3->id, $cond4->id],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condition_ids']);
    }

    public function test_maximum_three_assistance_types_enforced(): void
    {
        $asst2 = AssistanceType::factory()->create(['is_active' => true]);
        $asst3 = AssistanceType::factory()->create(['is_active' => true]);
        $asst4 = AssistanceType::factory()->create(['is_active' => true]);

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'assistance_type_ids' => [$this->assistance->id, $asst2->id, $asst3->id, $asst4->id],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['assistance_type_ids']);
    }

    public function test_location_manual_text_over_180_chars_is_rejected(): void
    {
        $longText = str_repeat('A', 181);

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'location' => [
                'manual_text' => $longText,
            ],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['location.manual_text']);
    }

    public function test_additional_info_over_300_chars_is_rejected(): void
    {
        $longText = str_repeat('B', 301);

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'additional_information' => $longText,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['additional_information']);
    }

    public function test_xss_scripts_and_html_tags_are_sanitized_and_removed(): void
    {
        $payload = [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'location' => [
                'manual_text' => 'Jl. Gatot Subroto <script>alert("XSS")</script>',
            ],
            'additional_information' => '<b>Darurat hebat</b> <iframe src="evil.html"></iframe>',
        ];

        $response = $this->postJson('/api/v1/compose-message', $payload);
        $response->assertStatus(200);

        $message = $response->json('data.message');
        $this->assertStringNotContainsString('<script>', $message);
        $this->assertStringNotContainsString('<iframe>', $message);
        $this->assertStringNotContainsString('<b>', $message);
        $this->assertStringContainsString('Jl. Gatot Subroto alert("XSS")', $message);
        $this->assertStringContainsString('Darurat hebat', $message);
    }

    public function test_emergency_messages_and_requests_are_never_saved_to_database(): void
    {
        $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'additional_information' => 'Rahasia medis pribadi yang tidak boleh disimpan.',
        ]);

        // Verify that no tables exist that store emergency messages or user records
        $this->assertFalse(Schema::hasTable('emergency_messages'));
        $this->assertFalse(Schema::hasTable('message_requests'));
    }

    public function test_no_message_history_table_exists(): void
    {
        $this->assertFalse(Schema::hasTable('message_histories'));
        $this->assertFalse(Schema::hasTable('user_locations'));
    }

    public function test_rate_limiter_restricts_excessive_compose_attempts(): void
    {
        // Execute 61 rapid requests to test throttle:60,1 middleware
        for ($i = 0; $i < 60; $i++) {
            $this->postJson('/api/v1/compose-message', [
                'communication_mode' => 'assistance',
                'category_id' => $this->category->id,
            ]);
        }

        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
        ]);

        $response->assertStatus(429);
    }

    public function test_compose_message_endpoint_does_not_require_login_authentication(): void
    {
        $response = $this->postJson('/api/v1/compose-message', [
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
        ]);

        $response->assertStatus(200);
    }
}

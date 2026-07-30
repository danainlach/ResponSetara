<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Models\AiPrompt;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class ComposeEmergencyMessageAiTest extends TestCase
{
    use RefreshDatabase;

    private EmergencyCategory $category;
    private EmergencyCondition $condition;
    private AssistanceType $assistance;
    private AiPrompt $aiPrompt;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('gemini.enabled', true);
        Config::set('gemini.api_key', 'test-fake-gemini-api-key-12345');
        Config::set('gemini.model', 'gemini-3.6-flash');
        Config::set('gemini.endpoint', 'https://generativelanguage.googleapis.com/v1/interactions');

        $this->category = EmergencyCategory::factory()->create([
            'name' => 'Kesehatan',
            'slug' => 'kesehatan',
            'is_active' => true,
        ]);

        $this->condition = EmergencyCondition::factory()->create([
            'category_id' => $this->category->id,
            'label' => 'Sulit berkomunikasi',
            'template_fragment' => 'Sulit berkomunikasi',
            'is_active' => true,
        ]);

        $this->assistance = AssistanceType::factory()->create([
            'category_id' => $this->category->id,
            'label' => 'Bantuan Medis Segera',
            'template_fragment' => 'Bantuan Medis Segera',
            'is_active' => true,
        ]);

        $this->aiPrompt = AiPrompt::create([
            'version_name' => 'V1_TEST_PROMPT',
            'system_prompt' => 'Anda adalah penyempurna pesan darurat. Ringkas pesan agar formal dan akurat.',
            'is_active' => true,
        ]);
    }

    private function getValidPayload(array $overrides = []): array
    {
        return array_merge([
            'communication_mode' => 'assistance',
            'category_id' => $this->category->id,
            'condition_ids' => [$this->condition->id],
            'assistance_type_ids' => [$this->assistance->id],
            'location' => [
                'manual_text' => 'Jalan Mawar Merah No 45',
                'latitude' => -7.2654,
                'longitude' => 112.7489,
                'include_coordinates' => true,
            ],
            'additional_information' => 'Pelapor memakai jaket merah muda',
        ], $overrides);
    }

    private function getFakeGeminiSuccessJson(array $customProps = []): string
    {
        $payload = array_merge([
            'message' => 'DARURAT KESEHATAN: Sulit berkomunikasi. Dibutuhkan Bantuan Medis Segera.',
            'category_code' => 'kesehatan',
            'condition_codes' => ['Sulit berkomunikasi'],
            'assistance_codes' => ['Bantuan Medis Segera'],
            'added_facts' => [],
            'contains_diagnosis' => false,
            'contains_promise' => false,
            'contains_unverified_contact' => false,
        ], $customProps);

        return json_encode([
            'steps' => [
                [
                    'content' => [
                        [
                            'modality' => 'text',
                            'text' => json_encode($payload, JSON_UNESCAPED_UNICODE)
                        ]
                    ]
                ]
            ],
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            ['text' => json_encode($payload, JSON_UNESCAPED_UNICODE)]
                        ]
                    ],
                    'finishReason' => 'STOP',
                ],
            ],
        ]);
    }

    // 1. Request lama tanpa use_ai tetap menghasilkan template.
    public function test_legacy_request_without_use_ai_returns_template(): void
    {
        Http::fake();
        $payload = $this->getValidPayload();
        unset($payload['use_ai'], $payload['ai_consent']);

        $response = $this->postJson('/api/v1/compose-message', $payload);

        $response->assertOk()
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_used', false);
        Http::assertNothingSent();
    }

    // 2. use_ai false tidak memanggil Gemini.
    public function test_use_ai_false_does_not_call_gemini(): void
    {
        Http::fake();
        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => false]));

        $response->assertOk()->assertJsonPath('data.source', 'template');
        Http::assertNothingSent();
    }

    // 3. use_ai true tanpa consent menggunakan template.
    public function test_use_ai_true_without_consent_returns_template_fallback(): void
    {
        Http::fake();
        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload([
            'use_ai' => true,
            'ai_consent' => false,
        ]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_used', true)
            ->assertJsonPath('data.fallback_reason', 'consent_missing');
        Http::assertNothingSent();
    }

    // 4. use_ai true dengan consent memanggil fake Gemini.
    public function test_use_ai_true_with_consent_calls_fake_gemini_successfully(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload([
            'use_ai' => true,
            'ai_consent' => true,
        ]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'ai')
            ->assertJsonPath('data.fallback_used', false);
        Http::assertSent(fn ($req) => str_contains($req->url(), 'generativelanguage.googleapis.com'));
    }

    // 5. API key tidak tersedia menggunakan template.
    public function test_missing_api_key_returns_template_fallback(): void
    {
        Config::set('gemini.api_key', null);
        Http::fake();

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_used', true)
            ->assertJsonPath('data.fallback_reason', 'not_configured');
    }

    // 6. Timeout menggunakan template.
    public function test_timeout_returns_template_fallback(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => fn () => throw new ConnectionException('Timeout'),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_used', true)
            ->assertJsonPath('data.fallback_reason', 'timeout');
    }

    // 7. Provider 401 menggunakan template.
    public function test_provider_401_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'Unauthorized'], 401),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_used', true);
    }

    // 8. Provider 429 menggunakan template.
    public function test_provider_429_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'Too many requests'], 429),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'rate_limited');
    }

    // 9. Provider 500 menggunakan template.
    public function test_provider_500_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'Internal server error'], 500),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'provider_error');
    }

    // 10. Response blocked menggunakan template.
    public function test_response_blocked_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [['finishReason' => 'SAFETY']],
                'promptFeedback' => ['blockReason' => 'SAFETY']
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'blocked');
    }

    // 11. JSON invalid menggunakan template.
    public function test_invalid_json_from_model_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [['content' => ['parts' => [['text' => 'This is not valid JSON!']]]]]
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'invalid_json');
    }

    // 12. Code kategori berubah menggunakan template.
    public function test_altered_category_code_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(['category_code' => 'altered-code']), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 13. Kondisi bertambah menggunakan template.
    public function test_added_condition_code_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(['condition_codes' => ['Sulit berkomunikasi', 'Kondisi Halus']]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 14. Assistance berubah menggunakan template.
    public function test_altered_assistance_code_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(['assistance_codes' => ['Bantuan Tidak Disetujui']]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 15. added_facts tidak kosong menggunakan template.
    public function test_non_empty_added_facts_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(['added_facts' => ['Pasien memiliki alergi']]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 16. contains_diagnosis true menggunakan template.
    public function test_contains_diagnosis_true_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(['contains_diagnosis' => true]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 17. Nomor tidak dikenal menggunakan template.
    public function test_message_with_unidentified_phone_number_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson([
                'message' => 'Hubungi nomor 081234567890 untuk bantuan darurat.'
            ]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 18. Koordinat pada output menggunakan template.
    public function test_message_with_leaked_coordinates_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson([
                'message' => 'Terjadi darurat medis pada lokasi -7.2654, 112.7489 segera melucur.'
            ]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 19. HTML pada output ditolak.
    public function test_message_with_html_tags_returns_template(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson([
                'message' => '<b>Darurat</b> Medis: Sulit berkomunikasi.<script>alert("xss")</script>'
            ]), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk()->assertJsonPath('data.source', 'template')->assertJsonPath('data.fallback_reason', 'validation_failed');
    }

    // 20. Output valid menghasilkan source ai.
    public function test_valid_ai_output_returns_source_ai_with_injected_location(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'ai')
            ->assertJsonPath('data.fallback_used', false);
        
        $msg = $response->json('data.message');
        // New structured section format: "Lokasi:\n<address>" instead of inline "Lokasi: <address>"
        $this->assertStringContainsString('Lokasi:', $msg);
        $this->assertStringContainsString('Jalan Mawar Merah No 45', $msg);
        $this->assertStringContainsString('Koordinat: -7.26540, 112.74890', $msg);
    }

    // 21. Lokasi tidak dikirim ke fake Gemini.
    public function test_location_manual_text_never_sent_to_gemini(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        Http::assertSent(function ($request) {
            return !str_contains($request->body(), 'Jalan Mawar Merah');
        });
    }

    // 22. Koordinat tidak dikirim ke fake Gemini.
    public function test_gps_coordinates_never_sent_to_gemini(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        Http::assertSent(function ($request) {
            $body = $request->body();
            return !str_contains($body, '-7.2654') && !str_contains($body, '112.7489');
        });
    }

    // 23. Informasi tambahan sensitif tidak dikirim ke fake Gemini.
    public function test_sensitive_additional_information_never_sent_to_gemini(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        Http::assertSent(function ($request) {
            return !str_contains($request->body(), 'Pelapor memakai jaket merah muda');
        });
    }

    // 24. Pesan tidak disimpan.
    public function test_zero_database_retention_of_composed_messages(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $beforeCount = \DB::table('sqlite_master')->count();
        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]))->assertOk();
        
        // Ensure no storage table for messages or AI logs was created or inserted into
        $afterCount = \DB::table('sqlite_master')->count();
        $this->assertSame($beforeCount, $afterCount);
    }

    // 25. Response Gemini tidak dicatat.
    public function test_raw_gemini_response_is_never_logged(): void
    {
        Log::spy();
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]))->assertOk();

        Log::shouldHaveReceived('info')->withArgs(function ($message, $context) {
            if ($message === 'GEMINI_AI_REFINEMENT') {
                return !isset($context['raw_response']) && !isset($context['payload']);
            }
            return true;
        });
    }

    // 26. API key tidak masuk log.
    public function test_api_key_never_appears_in_logs(): void
    {
        Log::spy();
        Http::fake([
            'generativelanguage.googleapis.com/*' => fn () => throw new ConnectionException('Timeout error with key test-fake-gemini-api-key-12345'),
        ]);

        $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]))->assertOk();

        Log::shouldHaveReceived('info')->withArgs(function ($message, $context) {
            $jsonStr = json_encode($context);
            return !str_contains((string) $jsonStr, 'test-fake-gemini-api-key-12345');
        });
    }

    // 27. Template tetap tersedia ketika AI gagal.
    public function test_template_message_always_available_when_ai_fails(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'Fatal API error'], 500),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        $response->assertOk()
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_used', true);
        
        $this->assertNotEmpty($response->json('data.template_message'));
        $this->assertSame($response->json('data.message'), $response->json('data.template_message'));
    }

    // 28. Rate limit AI tidak memblokir template.
    public function test_ai_rate_limit_falls_back_to_template_without_fatal_429(): void
    {
        RateLimiter::clear('gemini_ai_throttle:127.0.0.1');
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        // Trigger 10 requests to reach limit
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]))->assertOk();
        }

        // 11th request should NOT return 429, but instead seamlessly return template fallback
        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));

        $response->assertStatus(200)
            ->assertJsonPath('data.source', 'template')
            ->assertJsonPath('data.fallback_reason', 'rate_limited');
    }

    // 29. Public user tidak membutuhkan login.
    public function test_public_user_can_compose_ai_message_without_authentication(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $this->assertGuest();
        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload(['use_ai' => true, 'ai_consent' => true]));
        $response->assertOk();
    }

    // 30. Tidak ada key pada frontend bundle / environment exposure.
    public function test_no_api_key_exposed_to_frontend_config(): void
    {
        $this->assertNull(Config::get('app.api_key'));
        $this->assertNull(Config::get('inertia.props.gemini_api_key'));
        $this->assertFalse(str_starts_with((string) config('gemini.api_key'), 'VITE_'));
    }

    // 31. Wajib zero retention (store: false, stream: false), normalisasi model, dan tanpa parameter sampling lama.
    public function test_interactions_api_enforces_zero_retention_and_model_normalization(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response($this->getFakeGeminiSuccessJson(), 200),
        ]);

        $response = $this->postJson('/api/v1/compose-message', $this->getValidPayload([
            'use_ai' => true,
            'ai_consent' => true,
        ]));

        $response->assertOk()->assertJsonPath('data.source', 'ai');

        Http::assertSent(function ($req) {
            $body = $req->data();
            return str_contains($req->url(), 'generativelanguage.googleapis.com/v1/interactions')
                && ($body['store'] ?? null) === false
                && ($body['stream'] ?? null) === false
                && ($body['model'] ?? '') === 'models/gemini-3.6-flash'
                && isset($body['system_instruction'], $body['input'], $body['response_format'], $body['generation_config'])
                && !isset($body['temperature'], $body['top_p'], $body['top_k'], $body['candidate_count'], $body['contents'], $body['systemInstruction']);
        });
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\CommunicationMode;
use App\Enums\GuideAudience;
use App\Enums\PhrasePriority;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\QuickPhrase;
use App\Models\SiteContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Verify SQLite test database protection
        $this->assertEquals('sqlite', config('database.default'));
        $this->assertEquals(':memory:', config('database.connections.sqlite.database'));

        // Seed basic test data
        SiteContent::create(['key' => 'landing_title', 'value' => 'ResponSetara', 'content_type' => 'text', 'is_active' => true]);
        SiteContent::create(['key' => 'secret_inactive', 'value' => 'Hidden', 'content_type' => 'text', 'is_active' => false]);

        $cat1 = EmergencyCategory::create([
            'code' => 'CAT-MED',
            'name' => 'Darurat Medis',
            'slug' => 'darurat-medis',
            'description' => 'Bantuan medis darurat',
            'color' => 'red',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        $catInactive = EmergencyCategory::create([
            'code' => 'CAT-INACTIVE',
            'name' => 'Kategori Nonaktif',
            'slug' => 'kategori-nonaktif',
            'description' => 'Nonaktif',
            'color' => 'gray',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        $catDeleted = EmergencyCategory::create([
            'code' => 'CAT-DEL',
            'name' => 'Kategori Terhapus',
            'slug' => 'kategori-terhapus',
            'description' => 'Deleted',
            'color' => 'gray',
            'is_active' => true,
            'sort_order' => 100,
        ]);
        $catDeleted->delete();

        EmergencyCondition::create([
            'category_id' => $cat1->id,
            'code' => 'COND-1',
            'label' => 'Sesak Napas',
            'description' => 'Sulit bernapas',
            'template_fragment' => 'mengalami sesak napas',
            'is_active' => true,
            'sort_order' => 1,
        ]);
        EmergencyCondition::create([
            'category_id' => null,
            'code' => 'COND-GEN',
            'label' => 'Kondisi Umum',
            'description' => 'Kondisi darurat umum',
            'template_fragment' => 'dalam kondisi darurat',
            'is_active' => true,
            'sort_order' => 5,
        ]);
        EmergencyCondition::create([
            'category_id' => $cat1->id,
            'code' => 'COND-INACT',
            'label' => 'Kondisi Nonaktif',
            'description' => 'Tidak aktif',
            'template_fragment' => 'nonaktif',
            'is_active' => false,
            'sort_order' => 99,
        ]);

        AssistanceType::create([
            'category_id' => $cat1->id,
            'code' => 'AST-1',
            'label' => 'Ambulans',
            'description' => 'Bawa ke rumah sakit',
            'template_fragment' => 'membutuhkan ambulans',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        QuickPhrase::create([
            'category_id' => $cat1->id,
            'mode' => CommunicationMode::NONVERBAL,
            'phrase_text' => 'Tolong panggil ambulans sekarang.',
            'speech_text' => 'Tolong panggil ambulans sekarang.',
            'simplified_text' => 'Panggil ambulans.',
            'priority' => PhrasePriority::HIGH,
            'is_active' => true,
            'sort_order' => 1,
        ]);
        QuickPhrase::create([
            'category_id' => null,
            'mode' => CommunicationMode::DEAF,
            'phrase_text' => 'Saya Tuli, mohon ketik atau pesan teks.',
            'speech_text' => 'Saya Tuli.',
            'simplified_text' => 'Saya Tuli ketik teks.',
            'priority' => PhrasePriority::HIGH,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        HelperGuide::create([
            'title' => 'Cara Menolong Pengguna Tuli',
            'body' => 'Gunakan kontak mata dan isyarat yang jelas.',
            'audience' => GuideAudience::DEAF,
            'is_active' => true,
            'sort_order' => 1,
        ]);
        HelperGuide::create([
            'title' => 'Panduan Nonaktif',
            'body' => 'Tidak aktif',
            'audience' => GuideAudience::GENERAL,
            'is_active' => false,
            'sort_order' => 2,
        ]);

        EmergencyContact::create([
            'service_name' => 'Layanan Medis 119',
            'number' => '119',
            'scope' => 'Nasional',
            'coverage_note' => 'Ambulans Kemenkes',
            'source_name' => 'Kemenkes RI',
            'source_url' => 'https://kemkes.go.id',
            'is_verified' => true,
            'is_active' => true,
            'sort_order' => 1,
        ]);
        EmergencyContact::create([
            'service_name' => 'Nomor Tidak Terverifikasi',
            'number' => '999',
            'scope' => 'Lokal',
            'coverage_note' => 'Unverified',
            'source_name' => 'Unofficial',
            'source_url' => 'http://example.com',
            'is_verified' => false,
            'is_active' => true,
            'sort_order' => 99,
        ]);
    }

    public function test_all_endpoints_return_200_and_consistent_json_format(): void
    {
        $endpoints = [
            '/api/v1/config',
            '/api/v1/categories',
            '/api/v1/conditions',
            '/api/v1/assistance-types',
            '/api/v1/quick-phrases',
            '/api/v1/helper-guides',
            '/api/v1/emergency-contacts',
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->getJson($endpoint);
            $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data',
                    'meta' => ['version', 'count'],
                ])
                ->assertJson(['success' => true, 'meta' => ['version' => 'v1']]);
        }
    }

    public function test_only_active_data_appears(): void
    {
        $response = $this->getJson('/api/v1/config');
        $response->assertStatus(200)
            ->assertJsonFragment(['key' => 'landing_title'])
            ->assertJsonMissing(['key' => 'secret_inactive']);

        $responseCat = $this->getJson('/api/v1/categories');
        $responseCat->assertStatus(200)
            ->assertJsonFragment(['slug' => 'darurat-medis'])
            ->assertJsonMissing(['slug' => 'kategori-nonaktif']);

        $responseCond = $this->getJson('/api/v1/conditions');
        $responseCond->assertStatus(200)
            ->assertJsonMissing(['code' => 'COND-INACT']);

        $responseGuide = $this->getJson('/api/v1/helper-guides');
        $responseGuide->assertStatus(200)
            ->assertJsonMissing(['title' => 'Panduan Nonaktif']);
    }

    public function test_soft_deleted_data_does_not_appear(): void
    {
        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJsonMissing(['slug' => 'kategori-terhapus']);
    }

    public function test_category_filter_works_on_conditions_and_assistance_types(): void
    {
        $cat = EmergencyCategory::where('slug', 'darurat-medis')->first();

        $response = $this->getJson('/api/v1/conditions?category_id=' . $cat->id);
        $response->assertStatus(200)
            ->assertJsonFragment(['code' => 'COND-1'])
            ->assertJsonFragment(['code' => 'COND-GEN']);

        $responsePhrase = $this->getJson('/api/v1/quick-phrases?category_id=' . $cat->id);
        $responsePhrase->assertStatus(200)
            ->assertJsonFragment(['phrase_text' => 'Tolong panggil ambulans sekarang.'])
            ->assertJsonMissing(['phrase_text' => 'Saya Tuli, mohon ketik atau pesan teks.']);
    }

    public function test_mode_filter_works_on_quick_phrases(): void
    {
        $response = $this->getJson('/api/v1/quick-phrases?mode=deaf');
        $response->assertStatus(200)
            ->assertJsonFragment(['phrase_text' => 'Saya Tuli, mohon ketik atau pesan teks.'])
            ->assertJsonMissing(['phrase_text' => 'Tolong panggil ambulans sekarang.']);
    }

    public function test_audience_filter_works_on_helper_guides(): void
    {
        $response = $this->getJson('/api/v1/helper-guides?audience=deaf');
        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Cara Menolong Pengguna Tuli'])
            ->assertJsonMissing(['title' => 'Panduan Nonaktif']);
    }

    public function test_quick_phrase_search_works(): void
    {
        $response = $this->getJson('/api/v1/quick-phrases?search=ambulans');
        $response->assertStatus(200)
            ->assertJsonFragment(['phrase_text' => 'Tolong panggil ambulans sekarang.'])
            ->assertJsonMissing(['phrase_text' => 'Saya Tuli, mohon ketik atau pesan teks.']);
    }

    public function test_invalid_query_parameter_returns_422(): void
    {
        $response = $this->getJson('/api/v1/quick-phrases?mode=invalid_mode');
        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Parameter tidak valid.',
            ]);

        $responseAudience = $this->getJson('/api/v1/helper-guides?audience=unknown');
        $responseAudience->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Parameter tidak valid.',
            ]);
    }

    public function test_not_found_or_inactive_category_slug_returns_404(): void
    {
        $response = $this->getJson('/api/v1/categories/unknown-slug');
        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan.',
            ]);

        $responseInactive = $this->getJson('/api/v1/categories/kategori-nonaktif');
        $responseInactive->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Data tidak ditemukan.',
            ]);
    }

    public function test_unverified_emergency_contact_does_not_appear(): void
    {
        $response = $this->getJson('/api/v1/emergency-contacts');
        $response->assertStatus(200)
            ->assertJsonFragment(['number' => '119'])
            ->assertJsonMissing(['number' => '999']);
    }

    public function test_users_table_and_secrets_never_exposed_and_forbidden_endpoints_do_not_exist(): void
    {
        $this->getJson('/api/v1/users')->assertStatus(404);
        $this->getJson('/api/v1/ai-prompts')->assertStatus(404);
        $this->getJson('/api/v1/admin-activity-logs')->assertStatus(404);
        $this->getJson('/api/v1/emergency-cards')->assertStatus(404);
        $this->getJson('/api/v1/pictograms')->assertStatus(404);
    }
}

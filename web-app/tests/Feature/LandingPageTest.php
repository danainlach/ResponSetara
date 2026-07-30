<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\EmergencyCategory;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\SiteContent;
use App\Services\Api\PublicContentService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure test runs strictly on SQLite memory
        $this->assertEquals('sqlite', config('database.default'));
        $this->assertEquals(':memory:', config('database.connections.sqlite.database'));
    }

    public function test_landing_page_can_be_opened_with_hero_and_config_data(): void
    {
        SiteContent::factory()->create([
            'key' => 'landing_hero_headline',
            'value' => 'Komunikasi darurat yang dapat dipahami semua orang.',
            'content_type' => 'text',
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->has('configs', 1)
                ->where('configs.0.key', 'landing_hero_headline')
                ->where('hasError', false)
            );
    }

    public function test_active_helper_guides_and_verified_emergency_contacts_appear(): void
    {
        HelperGuide::factory()->create([
            'title' => 'Panduan Menolong Pengguna Tuli',
            'audience' => 'deaf',
            'is_active' => true,
            'sort_order' => 1,
        ]);
        HelperGuide::factory()->create([
            'title' => 'Panduan Non-aktif',
            'is_active' => false,
        ]);

        EmergencyContact::factory()->create([
            'service_name' => 'Ambulans 119',
            'number' => '119',
            'is_active' => true,
            'is_verified' => true,
        ]);
        EmergencyContact::factory()->create([
            'service_name' => 'Kontak Belum Terverifikasi',
            'number' => '999',
            'is_active' => true,
            'is_verified' => false,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->has('helperGuides', 1)
                ->where('helperGuides.0.title', 'Panduan Menolong Pengguna Tuli')
                ->has('emergencyContacts', 1)
                ->where('emergencyContacts.0.number', '119')
            );
    }

    public function test_empty_state_is_handled_cleanly_when_database_tables_are_empty(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->where('configs', [])
                ->where('categories', [])
                ->where('helperGuides', [])
                ->where('emergencyContacts', [])
                ->where('hasError', false)
            );
    }

    public function test_error_state_appears_gracefully_when_database_or_api_service_fails(): void
    {
        // Mock PublicContentService to simulate database or networking failure
        $mock = $this->mock(PublicContentService::class);
        $mock->shouldReceive('getConfig')->andThrow(new Exception('Simulated DB connection failure'));

        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->where('hasError', true)
                ->where('configs', [])
                ->where('helperGuides', [])
            );
    }

    public function test_three_communication_modes_and_accessibility_landmarks_exist_in_react_code(): void
    {
        $modesPath = resource_path('js/components/public/landing/CommunicationModesSection.tsx');
        $layoutPath = resource_path('js/layouts/PublicLayout.tsx');
        $navbarPath = resource_path('js/components/public/landing/LandingNavbar.tsx');

        $this->assertFileExists($modesPath);
        $this->assertFileExists($layoutPath);
        $this->assertFileExists($navbarPath);

        $modesContent = File::get($modesPath);
        // Verify 3 mode selectors exist with ready-to-use status
        $this->assertStringContainsString('Saya Butuh Bantuan', $modesContent);
        $this->assertStringContainsString('Saya Tidak Dapat Berbicara', $modesContent);
        $this->assertStringContainsString('Saya Tidak Dapat Mendengar', $modesContent);
        $this->assertStringContainsString('Siap Digunakan', $modesContent);

        // Verify Accessibility Landmarks & Keyboard Navigation support
        $layoutContent = File::get($layoutPath);
        $this->assertStringContainsString('<header', $layoutContent);
        $this->assertStringContainsString('<main id="main-content"', $layoutContent);
        $this->assertStringContainsString('<footer', $layoutContent);
        $this->assertStringContainsString('SkipLink', $layoutContent);
        $this->assertStringContainsString('LiveAnnouncer', $layoutContent);

        // Verify screen reader accessible mobile menu returning focus
        $navbarContent = File::get($navbarPath);
        $this->assertStringContainsString('aria-expanded', $navbarContent);
        $this->assertStringContainsString('aria-label="Navigasi Utama ResponSetara"', $navbarContent);
        $this->assertStringContainsString('toggleButtonRef.current?.focus()', $navbarContent);
    }

    public function test_text_size_toggle_and_root_dataset_zoom_implementation(): void
    {
        $togglePath = resource_path('js/components/accessibility/TextSizeToggle.tsx');
        $layoutPath = resource_path('js/layouts/PublicLayout.tsx');
        $cssPath = resource_path('css/app.css');

        $this->assertFileExists($togglePath);
        $this->assertFileExists($layoutPath);
        $this->assertFileExists($cssPath);

        $toggleContent = File::get($togglePath);
        $this->assertStringContainsString('Teks Besar', $toggleContent);
        $this->assertStringContainsString('Teks Normal', $toggleContent);
        $this->assertStringContainsString('aria-pressed={isLargeText}', $toggleContent);

        $layoutContent = File::get($layoutPath);
        $this->assertStringContainsString("document.documentElement.dataset.textSize", $layoutContent);
        $this->assertStringContainsString("'large' : 'normal'", $layoutContent);

        $cssContent = File::get($cssPath);
        $this->assertStringContainsString("html[data-text-size='large']", $cssContent);
    }

    public function test_landing_page_ui_refinement_and_trust_section(): void
    {
        $heroPath = resource_path('js/components/public/landing/HeroSection.tsx');
        $privacyPath = resource_path('js/components/public/landing/PrivacyDisclaimerSection.tsx');

        $heroContent = File::get($heroPath);
        $this->assertStringContainsString('Darurat Cepat Tanpa Batas Audio-Verbal', $heroContent);
        $this->assertStringContainsString('Tanpa Daftar &amp; Tanpa Login', $heroContent);

        $privacyContent = File::get($privacyPath);
        $this->assertStringContainsString('Pesan Tidak Disimpan', $privacyContent);
        $this->assertStringContainsString('Tidak Perlu Akun Pengguna', $privacyContent);
        $this->assertStringContainsString('Cadangan Template Tersedia', $privacyContent);
        $this->assertStringContainsString('ResponSetara membantu komunikasi dan tidak menggantikan layanan darurat resmi', $privacyContent);
    }

    public function test_no_forbidden_features_or_supabase_credentials_in_frontend(): void
    {
        $jsDir = resource_path('js');
        $allFiles = File::allFiles($jsDir);

        foreach ($allFiles as $file) {
            $content = $file->getContents();

            // Guardrail 1: No Kartu Darurat or Piktogram features
            $this->assertStringNotContainsStringIgnoringCase('Kartu Darurat', $content, "Forbidden feature found in {$file->getFilename()}");
            $this->assertStringNotContainsStringIgnoringCase('Piktogram', $content, "Forbidden feature found in {$file->getFilename()}");
            
            // Guardrail 2: No direct Supabase JS client or anon key in React frontend
            $this->assertStringNotContainsString('@supabase/supabase-js', $content, "Direct Supabase SDK exposure found in {$file->getFilename()}");
            $this->assertStringNotContainsString('anon_key', $content, "Supabase anon key reference found in {$file->getFilename()}");
            $this->assertStringNotContainsString('supabaseUrl', $content, "Supabase URL reference found in {$file->getFilename()}");
        }
    }
}


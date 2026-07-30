<?php

declare(strict_types=1);

namespace Tests\Feature\Frontend;

use App\Enums\GuideAudience;
use App\Models\HelperGuide;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeafModePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        HelperGuide::factory()->create([
            'title' => 'Berbicara satu per satu',
            'body' => 'Hindari berbicara bersamaan agar ucapan dapat ditangkap dengan baik.',
            'audience' => GuideAudience::DEAF,
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_deaf_page_can_be_accessed_publicly_without_login(): void
    {
        $response = $this->get('/tidak-dapat-mendengar');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/deaf/index')
                ->has('initialHelperGuides', 1)
                ->where('hasError', false)
            );
    }

    public function test_deaf_alias_redirects_to_main_route(): void
    {
        $response = $this->get('/deaf');
        $response->assertRedirect('/tidak-dapat-mendengar');
    }

    public function test_active_deaf_audience_helper_guides_appear_in_inertia_props(): void
    {
        $response = $this->get('/tidak-dapat-mendengar');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('initialHelperGuides.0.title', 'Berbicara satu per satu')
                ->where('initialHelperGuides.0.body', 'Hindari berbicara bersamaan agar ucapan dapat ditangkap dengan baik.')
            );
    }

    public function test_inactive_and_non_deaf_audience_guides_do_not_appear(): void
    {
        // Inactive deaf guide
        HelperGuide::factory()->create([
            'title' => 'Panduan nonaktif',
            'audience' => GuideAudience::DEAF,
            'is_active' => false,
        ]);

        // Active general audience guide
        HelperGuide::factory()->create([
            'title' => 'Panduan untuk umum',
            'audience' => GuideAudience::GENERAL,
            'is_active' => true,
        ]);

        $response = $this->get('/tidak-dapat-mendengar');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->has('initialHelperGuides', 1)
                ->where('initialHelperGuides.0.title', 'Berbicara satu per satu')
            );
    }

    public function test_zero_local_storage_or_session_storage_usage_in_deaf_features(): void
    {
        $dir = resource_path('js/features/deaf');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            $this->assertStringNotContainsString('localStorage', $content, "File {$file->getFilename()} dilarang memakai localStorage.");
            $this->assertStringNotContainsString('sessionStorage', $content, "File {$file->getFilename()} dilarang memakai sessionStorage.");
        }
    }

    public function test_zero_forbidden_features_and_no_recording_or_upload_in_deaf_features(): void
    {
        $dir = resource_path('js/features/deaf');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            $this->assertStringNotContainsString('MediaRecorder', $content, "File {$file->getFilename()} dilarang melakukan rekaman audio.");
            $this->assertStringNotContainsString('Gemini', $content, "File {$file->getFilename()} dilarang menggunakan Gemini AI.");
            $this->assertStringNotContainsString('KartuDarurat', $content, "File {$file->getFilename()} dilarang membuat Kartu Darurat.");
            $this->assertStringNotContainsString('Piktogram', $content, "File {$file->getFilename()} dilarang membuat Piktogram.");
            $this->assertStringNotContainsString('Google Cloud Speech', $content, "File {$file->getFilename()} dilarang menggunakan API STT cloud.");
            $this->assertStringNotContainsString('AWS Transcribe', $content, "File {$file->getFilename()} dilarang menggunakan API STT cloud.");
            $this->assertStringNotContainsString('uploadAudio', $content, "File {$file->getFilename()} dilarang mengunggah audio.");
        }
    }

    public function test_speech_recognition_and_webkit_fallback_are_detected_in_hook(): void
    {
        $hookContent = File::get(resource_path('js/features/deaf/useSpeechToText.ts'));
        $this->assertStringContainsString('window.SpeechRecognition || window.webkitSpeechRecognition', $hookContent, "Hook wajib mendukung SpeechRecognition dan fallback webkitSpeechRecognition.");
        $this->assertStringContainsString("'id-ID'", $hookContent, "Bahasa default wajib diatur ke id-ID.");
        $this->assertStringContainsString('interimResults = true', $hookContent, "interimResults wajib aktif.");
        $this->assertStringContainsString('recognitionRef.current.abort()', $hookContent, "Wajib membersihkan atau abort pada event unmount.");
    }

    public function test_speech_recognition_mock_classes_exist_and_avoid_real_microphone(): void
    {
        $mockPath = resource_path('js/features/deaf/speechRecognitionMock.ts');
        $this->assertTrue(File::exists($mockPath), "File mock speechRecognitionMock.ts harus ada untuk automated testing tanpa mikrofon nyata.");
        $mockContent = File::get($mockPath);
        $this->assertStringContainsString('class MockSpeechRecognition', $mockContent);
        $this->assertStringNotContainsString('getUserMedia', $mockContent, "Mock tidak boleh mengakses mikrofon atau getUserMedia.");
    }

    public function test_indonesian_error_mapping_and_character_limit_exist_in_hook(): void
    {
        $hookContent = File::get(resource_path('js/features/deaf/useSpeechToText.ts'));
        $this->assertStringContainsString('Izin mikrofon ditolak', $hookContent, "Wajib memetakan error not-allowed dalam bahasa Indonesia.");
        $this->assertStringContainsString('Belum ada ucapan yang terdeteksi', $hookContent, "Wajib memetakan error no-speech dalam bahasa Indonesia.");
        $this->assertStringContainsString('MAX_CHAR_LIMIT = 3000', $hookContent, "Wajib menegakkan batas karakter 3.000 sesuai rancangan yang disetujui.");
    }

    public function test_shared_large_text_dialog_reused_in_deaf_mode(): void
    {
        $modeContent = File::get(resource_path('js/features/deaf/DeafMode.tsx'));
        $this->assertStringContainsString('../../components/shared/LargeTextDialog', $modeContent, "DeafMode wajib mendaul ulang LargeTextDialog shared.");
    }

    public function test_privacy_notices_displayed_in_compatibility_notice_component(): void
    {
        $noticeContent = File::get(resource_path('js/features/deaf/BrowserCompatibilityNotice.tsx'));
        $this->assertStringContainsString('ResponSetara tidak menyimpan audio atau transkripsi.', $noticeContent, "Wajib mencantumkan pengumuman privasi zero retention.");
        $this->assertStringContainsString('Pemrosesan pengenalan suara dapat mengikuti layanan dan kebijakan browser yang digunakan.', $noticeContent, "Wajib mencantumkan pengumuman pemrosesan layanan browser.");
    }

    public function test_no_database_write_or_audio_upload_routes_exist_in_application(): void
    {
        $routes = Route::getRoutes();
        foreach ($routes as $route) {
            $uri = $route->uri();
            $this->assertStringNotContainsString('upload-audio', $uri);
            $this->assertStringNotContainsString('save-transcript', $uri);
        }
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Frontend;

use App\Enums\CommunicationMode;
use App\Enums\PhrasePriority;
use App\Models\EmergencyCategory;
use App\Models\QuickPhrase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NonverbalModePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $category = EmergencyCategory::factory()->create([
            'name' => 'Medis & Kesehatan',
            'slug' => 'medis-kesehatan',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        QuickPhrase::factory()->create([
            'category_id' => $category->id,
            'mode' => CommunicationMode::NONVERBAL,
            'phrase_text' => 'Tolong panggilkan ambulans darurat',
            'speech_text' => 'Tolong panggilkan ambulans darurat',
            'priority' => PhrasePriority::HIGH,
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_nonverbal_page_can_be_accessed_publicly_without_login(): void
    {
        $response = $this->get('/tidak-dapat-berbicara');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/nonverbal/index')
                ->has('initialCategories', 1)
                ->has('initialPhrases', 1)
                ->where('hasError', false)
            );
    }

    public function test_nonverbal_alias_redirects_to_main_route(): void
    {
        $response = $this->get('/nonverbal');
        $response->assertRedirect('/tidak-dapat-berbicara');
    }

    public function test_active_phrases_and_categories_appear_in_inertia_props(): void
    {
        $response = $this->get('/tidak-dapat-berbicara');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('initialCategories.0.name', 'Medis & Kesehatan')
                ->where('initialPhrases.0.phrase_text', 'Tolong panggilkan ambulans darurat')
            );
    }

    public function test_inactive_and_soft_deleted_phrases_do_not_appear(): void
    {
        $category = EmergencyCategory::first();

        // Inactive phrase
        QuickPhrase::factory()->create([
            'category_id' => $category->id,
            'mode' => CommunicationMode::NONVERBAL,
            'phrase_text' => 'Frasa non-aktif',
            'is_active' => false,
        ]);

        // Soft-deleted phrase
        $deletedPhrase = QuickPhrase::factory()->create([
            'category_id' => $category->id,
            'mode' => CommunicationMode::NONVERBAL,
            'phrase_text' => 'Frasa terhapus',
            'is_active' => true,
        ]);
        $deletedPhrase->delete();

        $response = $this->get('/tidak-dapat-berbicara');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->has('initialPhrases', 1)
                ->where('initialPhrases.0.phrase_text', 'Tolong panggilkan ambulans darurat')
            );
    }

    public function test_only_nonverbal_mode_phrases_are_loaded(): void
    {
        $category = EmergencyCategory::first();

        QuickPhrase::factory()->create([
            'category_id' => $category->id,
            'mode' => CommunicationMode::DEAF,
            'phrase_text' => 'Frasa khusus mode tuli',
            'is_active' => true,
        ]);

        $response = $this->get('/tidak-dapat-berbicara');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->has('initialPhrases', 1)
                ->where('initialPhrases.0.phrase_text', 'Tolong panggilkan ambulans darurat')
            );
    }

    public function test_zero_local_storage_or_session_storage_usage_in_nonverbal_features(): void
    {
        $dir = resource_path('js/features/nonverbal');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            $this->assertStringNotContainsString('localStorage', $content, "File {$file->getFilename()} dilarang memakai localStorage.");
            $this->assertStringNotContainsString('sessionStorage', $content, "File {$file->getFilename()} dilarang memakai sessionStorage.");
        }
    }

    public function test_zero_forbidden_features_and_no_recording_in_nonverbal_features(): void
    {
        $dir = resource_path('js/features/nonverbal');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            $this->assertStringNotContainsString('MediaRecorder', $content, "File {$file->getFilename()} dilarang melakukan rekaman audio.");
            $this->assertStringNotContainsString('SpeechRecognition', $content, "File {$file->getFilename()} dilarang membuat Speech-to-Text.");
            $this->assertStringNotContainsString('webkitSpeechRecognition', $content, "File {$file->getFilename()} dilarang membuat Speech-to-Text.");
            $this->assertStringNotContainsString('Gemini', $content, "File {$file->getFilename()} dilarang menggunakan Gemini AI.");
            $this->assertStringNotContainsString('KartuDarurat', $content, "File {$file->getFilename()} dilarang membuat Kartu Darurat.");
            $this->assertStringNotContainsString('Piktogram', $content, "File {$file->getFilename()} dilarang membuat Piktogram.");
            $this->assertStringNotContainsString('ElevenLabs', $content, "File {$file->getFilename()} dilarang menggunakan API TTS eksternal.");
            $this->assertStringNotContainsString('Polly', $content, "File {$file->getFilename()} dilarang menggunakan API TTS eksternal.");
        }
    }

    public function test_shared_large_text_dialog_works_cross_feature_without_breaking(): void
    {
        $sharedPath = resource_path('js/components/shared/LargeTextDialog.tsx');
        $assistancePath = resource_path('js/features/assistance/LargeTextDialog.tsx');

        $this->assertTrue(File::exists($sharedPath), "Komponen reusable LargeTextDialog harus ada di components/shared.");
        $this->assertTrue(File::exists($assistancePath), "Komponen LargeTextDialog pada assistance tetap ada untuk kompatibilitas.");
    }
}

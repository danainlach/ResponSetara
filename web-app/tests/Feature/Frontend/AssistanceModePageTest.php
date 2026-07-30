<?php

declare(strict_types=1);

namespace Tests\Feature\Frontend;

use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AssistanceModePageTest extends TestCase
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

        EmergencyCondition::factory()->create([
            'category_id' => $category->id,
            'label' => 'Sesak napas berat',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        AssistanceType::factory()->create([
            'category_id' => $category->id,
            'label' => 'Ambulans medis terdekat',
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_assistance_form_page_can_be_loaded_correctly(): void
    {
        $response = $this->get('/bantuan-darurat');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/assistance/index')
                ->has('initialCategories', 1)
                ->has('initialConditions', 1)
                ->has('initialAssistanceTypes', 1)
                ->where('hasError', false)
            );
    }

    public function test_categories_are_supplied_from_api_props(): void
    {
        $response = $this->get('/assistance');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('initialCategories.0.name', 'Medis & Kesehatan')
                ->where('initialConditions.0.label', 'Sesak napas berat')
                ->where('initialAssistanceTypes.0.label', 'Ambulans medis terdekat')
            );
    }

    public function test_zero_local_storage_or_session_storage_usage_in_assistance_features(): void
    {
        $dir = resource_path('js/features/assistance');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            $this->assertStringNotContainsString('localStorage', $content, "File {$file->getFilename()} dilarang memakai localStorage.");
            $this->assertStringNotContainsString('sessionStorage', $content, "File {$file->getFilename()} dilarang memakai sessionStorage.");
        }
    }

    public function test_no_forbidden_buttons_in_assistance_mode(): void
    {
        $dir = resource_path('js/features/assistance');
        $files = File::allFiles($dir);

        foreach ($files as $file) {
            $content = $file->getContents();
            // Gemini AI must NOT be integrated directly in the frontend
            $this->assertStringNotContainsString('Gemini', $content, "Integrasi Gemini AI belum boleh dibuat pada fase ini.");
            // Emergency cards and pictograms are out of scope
            $this->assertStringNotContainsString('Kartu Darurat', $content, "Kartu Darurat belum boleh dibuat pada fase ini.");
            $this->assertStringNotContainsString('Piktogram', $content, "Piktogram belum boleh dibuat pada fase ini.");
        }
        // TTS (Bacakan) is now an approved feature of Emergency Action Hub in MessagePreview
        // localStorage and sessionStorage must never be used in assistance features
        $this->assertStringNotContainsString('localStorage', implode('', array_map(fn ($f) => $f->getContents(), $files)));
        $this->assertStringNotContainsString('sessionStorage', implode('', array_map(fn ($f) => $f->getContents(), $files)));
    }
}

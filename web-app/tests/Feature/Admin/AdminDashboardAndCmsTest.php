<?php

namespace Tests\Feature\Admin;

use App\Models\AiPrompt;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\QuickPhrase;
use App\Models\SiteContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminDashboardAndCmsTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $nonAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->nonAdmin = User::factory()->create([
            'role' => 'operator',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_is_redirected_to_login_when_accessing_admin(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_non_admin_user_receives_403_forbidden(): void
    {
        $response = $this->actingAs($this->nonAdmin)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_admin_user_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_can_crud_emergency_categories_with_soft_delete(): void
    {
        // Create
        $response = $this->actingAs($this->admin)->post('/admin/categories', [
            'code' => 'CAT_GEMPA',
            'name' => 'Bencana Gempa',
            'slug' => 'bencana-gempa',
            'description' => 'Keadaan darurat akibat gempa bumi.',
            'color' => '#ef4444',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('emergency_categories', ['code' => 'CAT_GEMPA', 'slug' => 'bencana-gempa', 'name' => 'Bencana Gempa']);

        $category = EmergencyCategory::where('slug', 'bencana-gempa')->firstOrFail();

        // Update
        $response = $this->actingAs($this->admin)->put("/admin/categories/{$category->id}", [
            'code' => 'CAT_GEMPA',
            'name' => 'Bencana Gempa Bumi',
            'slug' => 'bencana-gempa',
            'description' => 'Updated description.',
            'color' => '#ef4444',
            'sort_order' => 5,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('emergency_categories', ['id' => $category->id, 'name' => 'Bencana Gempa Bumi']);

        // Soft Delete
        $response = $this->actingAs($this->admin)->delete("/admin/categories/{$category->id}");
        $response->assertRedirect();
        $this->assertSoftDeleted('emergency_categories', ['id' => $category->id]);

        // Restore
        $response = $this->actingAs($this->admin)->post("/admin/categories/{$category->id}/restore");
        $response->assertRedirect();
        $this->assertDatabaseHas('emergency_categories', ['id' => $category->id, 'deleted_at' => null]);
    }

    public function test_admin_can_crud_conditions_and_assistance_types(): void
    {
        // Create condition
        $response = $this->actingAs($this->admin)->post('/admin/conditions', [
            'code' => 'COND_TEST',
            'label' => 'Sesak Napas Berat',
            'template_fragment' => 'mengalami sesak napas berat',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('emergency_conditions', ['code' => 'COND_TEST']);

        // Create assistance type
        $response = $this->actingAs($this->admin)->post('/admin/assistance-types', [
            'code' => 'ASST_TEST',
            'label' => 'Ambulans Segera',
            'template_fragment' => 'memerlukan pengiriman ambulans segera',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('assistance_types', ['code' => 'ASST_TEST']);
    }

    public function test_admin_can_crud_quick_phrases_and_helper_guides(): void
    {
        // Quick Phrase
        $response = $this->actingAs($this->admin)->post('/admin/quick-phrases', [
            'mode' => 'nonverbal',
            'phrase_text' => 'Tolong bantu saya mengambil air minum.',
            'speech_text' => 'Tolong bantu saya mengambil air minum.',
            'simplified_text' => 'TOLONG AMBIL KAN AIR',
            'priority' => 'medium',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('quick_phrases', ['simplified_text' => 'TOLONG AMBIL KAN AIR']);

        // Helper Guide
        $response = $this->actingAs($this->admin)->post('/admin/helper-guides', [
            'title' => 'Cara Membantu Penyandang Tuli',
            'body' => '1. Tepuk bahu perlahan. 2. Tampilkan teks di layar HP.',
            'audience' => 'general',
            'sort_order' => 10,
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('helper_guides', ['title' => 'Cara Membantu Penyandang Tuli']);
    }

    public function test_admin_can_crud_emergency_contacts_and_site_contents(): void
    {
        // Emergency Contact
        $response = $this->actingAs($this->admin)->post('/admin/emergency-contacts', [
            'service_name' => 'Layanan Siap Siaga',
            'number' => '112',
            'scope' => 'Nasional',
            'is_verified' => true,
            'is_active' => true,
            'sort_order' => 1,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('emergency_contacts', ['number' => '112', 'service_name' => 'Layanan Siap Siaga']);

        // Site Content
        $response = $this->actingAs($this->admin)->post('/admin/site-contents', [
            'key' => 'privacy.policy_note',
            'value' => 'ResponSetara menerapkan Kebijakan Tanpa Penyimpanan Data Pribadi.',
            'content_type' => 'text',
            'is_active' => true,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('site_contents', ['key' => 'privacy.policy_note']);
    }

    public function test_single_active_rule_on_ai_prompts(): void
    {
        $prompt1 = AiPrompt::create([
            'version_name' => 'v1.0',
            'system_prompt' => 'Initial prompt',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->post('/admin/ai-prompts', [
            'version_name' => 'v2.0-new',
            'system_prompt' => 'New updated system prompt',
            'is_active' => true,
        ]);
        $response->assertRedirect();

        $this->assertDatabaseHas('ai_prompts', ['version_name' => 'v2.0-new', 'is_active' => true]);
        $this->assertDatabaseHas('ai_prompts', ['id' => $prompt1->id, 'is_active' => false]);
    }

    public function test_activity_log_records_actions_without_exposing_sensitive_data(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/categories', [
            'code' => 'CAT_SECRET',
            'name' => 'Kategori Rahasia password=supersecret',
            'slug' => 'kategori-rahasia',
            'description' => 'Mengandung kata secret_token_12345 dan password_db',
            'color' => '#ef4444',
            'sort_order' => 20,
            'is_active' => true,
        ]);
        $response->assertRedirect();

        $this->assertDatabaseHas('admin_activity_logs', [
            'user_id' => $this->admin->id,
            'action' => 'CREATE',
            'target_type' => 'EmergencyCategory',
        ]);

        $log = DB::table('admin_activity_logs')->where('target_type', 'EmergencyCategory')->latest('id')->first();
        $this->assertNotNull($log);
        $this->assertStringNotContainsString('supersecret', $log->description);
        $this->assertStringContainsString('[SECRET_REDACTED]', $log->description);
    }

    public function test_zero_retention_policy_compliance_in_db_schema(): void
    {
        // Assert no messages, audio recordings, or GPS coordinates tables exist in database
        $tables = DB::getSchemaBuilder()->getTableListing();
        $prohibitedSubstrings = ['messages_storage', 'saved_audio', 'user_locations', 'transcripts_archive'];

        foreach ($tables as $table) {
            foreach ($prohibitedSubstrings as $prohibited) {
                $this->assertStringNotContainsString($prohibited, $table, "Database must not retain user message or audio archives: {$table}");
            }
        }
    }
}

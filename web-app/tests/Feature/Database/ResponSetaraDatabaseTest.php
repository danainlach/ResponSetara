<?php

namespace Tests\Feature\Database;

use App\Models\AdminActivityLog;
use App\Models\AiPrompt;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\QuickPhrase;
use App\Models\SiteContent;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResponSetaraDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_populates_tables_and_is_idempotent(): void
    {
        // First seed
        $this->seed();

        $userCount = User::count();
        $catCount = EmergencyCategory::count();
        $condCount = EmergencyCondition::count();
        $assistCount = AssistanceType::count();
        $phraseCount = QuickPhrase::count();
        $guideCount = HelperGuide::count();
        $contactCount = EmergencyContact::count();
        $contentCount = SiteContent::count();
        $promptCount = AiPrompt::count();

        $this->assertGreaterThan(0, $catCount);
        $this->assertGreaterThan(0, $condCount);
        $this->assertGreaterThan(0, $assistCount);
        $this->assertGreaterThan(0, $phraseCount);
        $this->assertGreaterThan(0, $guideCount);
        $this->assertGreaterThan(0, $contactCount);
        $this->assertGreaterThan(0, $contentCount);
        $this->assertGreaterThan(0, $promptCount);

        // Second seed (idempotency check)
        $this->seed();

        $this->assertEquals($userCount, User::count());
        $this->assertEquals($catCount, EmergencyCategory::count());
        $this->assertEquals($condCount, EmergencyCondition::count());
        $this->assertEquals($assistCount, AssistanceType::count());
        $this->assertEquals($phraseCount, QuickPhrase::count());
        $this->assertEquals($guideCount, HelperGuide::count());
        $this->assertEquals($contactCount, EmergencyContact::count());
        $this->assertEquals($contentCount, SiteContent::count());
        $this->assertEquals($promptCount, AiPrompt::count());
    }

    public function test_relationships(): void
    {
        $category = EmergencyCategory::factory()->create();

        $condition = EmergencyCondition::factory()->create(['category_id' => $category->id]);
        $assistance = AssistanceType::factory()->create(['category_id' => $category->id]);
        $phrase = QuickPhrase::factory()->create(['category_id' => $category->id]);

        $this->assertTrue($category->conditions->contains($condition));
        $this->assertTrue($category->assistanceTypes->contains($assistance));
        $this->assertTrue($category->quickPhrases->contains($phrase));
        $this->assertEquals($category->id, $condition->category->id);
        $this->assertEquals($category->id, $assistance->category->id);
        $this->assertEquals($category->id, $phrase->category->id);

        $user = User::factory()->create();
        $log = AdminActivityLog::factory()->create(['user_id' => $user->id]);
        $this->assertTrue($user->activityLogs->contains($log));
        $this->assertEquals($user->id, $log->user->id);
    }

    public function test_soft_deletes(): void
    {
        $models = [
            EmergencyCategory::factory()->create(),
            EmergencyCondition::factory()->create(),
            AssistanceType::factory()->create(),
            QuickPhrase::factory()->create(),
            HelperGuide::factory()->create(),
            EmergencyContact::factory()->create(),
            AiPrompt::factory()->create(),
        ];

        foreach ($models as $model) {
            $class = get_class($model);
            $id = $model->id;

            $model->delete();
            $this->assertNull($class::find($id));
            $this->assertNotNull($class::withTrashed()->find($id));
        }
    }

    public function test_active_scope(): void
    {
        EmergencyCategory::factory()->create(['is_active' => true]);
        EmergencyCategory::factory()->create(['is_active' => false]);
        $this->assertEquals(1, EmergencyCategory::active()->count());

        EmergencyCondition::factory()->create(['is_active' => true]);
        EmergencyCondition::factory()->create(['is_active' => false]);
        $this->assertEquals(1, EmergencyCondition::active()->count());

        AssistanceType::factory()->create(['is_active' => true]);
        AssistanceType::factory()->create(['is_active' => false]);
        $this->assertEquals(1, AssistanceType::active()->count());

        QuickPhrase::factory()->create(['is_active' => true]);
        QuickPhrase::factory()->create(['is_active' => false]);
        $this->assertEquals(1, QuickPhrase::active()->count());

        HelperGuide::factory()->create(['is_active' => true]);
        HelperGuide::factory()->create(['is_active' => false]);
        $this->assertEquals(1, HelperGuide::active()->count());

        EmergencyContact::factory()->create(['is_active' => true]);
        EmergencyContact::factory()->create(['is_active' => false]);
        $this->assertEquals(1, EmergencyContact::active()->count());
    }

    public function test_duplicate_category_slug_throws_exception(): void
    {
        EmergencyCategory::factory()->create(['slug' => 'duplicate-slug', 'code' => 'CODE1']);

        $this->expectException(QueryException::class);
        EmergencyCategory::factory()->create(['slug' => 'duplicate-slug', 'code' => 'CODE2']);
    }

    public function test_duplicate_condition_code_throws_exception(): void
    {
        EmergencyCondition::factory()->create(['code' => 'DUPL_COND']);

        $this->expectException(QueryException::class);
        EmergencyCondition::factory()->create(['code' => 'DUPL_COND']);
    }

    public function test_duplicate_assistance_code_throws_exception(): void
    {
        AssistanceType::factory()->create(['code' => 'DUPL_ASSIST']);

        $this->expectException(QueryException::class);
        AssistanceType::factory()->create(['code' => 'DUPL_ASSIST']);
    }
}

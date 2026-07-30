<?php

declare(strict_types=1);

namespace App\Services\Api;

use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\QuickPhrase;
use App\Models\SiteContent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PublicContentService
{
    public function getConfig(): Collection
    {
        return SiteContent::active()
            ->select(['key', 'value', 'content_type'])
            ->get();
    }

    public function getCategories(): Collection
    {
        return EmergencyCategory::active()->get();
    }

    public function getCategoryBySlug(string $slug): ?EmergencyCategory
    {
        return EmergencyCategory::active()->where('slug', $slug)->first();
    }

    public function getConditions(?int $categoryId = null): Collection
    {
        $query = EmergencyCondition::active();
        if ($categoryId !== null) {
            $query->where(function ($q) use ($categoryId) {
                $q->whereNull('category_id')->orWhere('category_id', $categoryId);
            });
        } else {
            $query->whereNull('category_id');
        }

        return $query->get();
    }

    public function getAssistanceTypes(?int $categoryId = null): Collection
    {
        $query = AssistanceType::active();
        if ($categoryId !== null) {
            $query->where(function ($q) use ($categoryId) {
                $q->whereNull('category_id')->orWhere('category_id', $categoryId);
            });
        } else {
            $query->whereNull('category_id');
        }

        return $query->get();
    }

    public function getAllConditions(): Collection
    {
        return EmergencyCondition::active()->get();
    }

    public function getAllAssistanceTypes(): Collection
    {
        return AssistanceType::active()->get();
    }

    public function getQuickPhrases(?string $mode = null, ?int $categoryId = null, ?string $search = null): Collection
    {
        $query = QuickPhrase::active();

        if ($mode !== null) {
            $query->where('mode', $mode);
        }

        if ($categoryId !== null) {
            $query->where('category_id', $categoryId);
        }

        if (!empty($search)) {
            $driver = DB::connection()->getDriverName();
            $operator = $driver === 'pgsql' ? 'ilike' : 'like';
            $term = '%' . trim($search) . '%';
            $query->where(function ($q) use ($operator, $term) {
                $q->where('phrase_text', $operator, $term)
                  ->orWhere('speech_text', $operator, $term)
                  ->orWhere('simplified_text', $operator, $term);
            });
        }

        return $query->reorder()->orderBy('priority', 'asc')->orderBy('sort_order', 'asc')->get();
    }

    public function getHelperGuides(?string $audience = null): Collection
    {
        $query = HelperGuide::active();
        if ($audience !== null) {
            $query->where('audience', $audience);
        }

        return $query->get();
    }

    public function getEmergencyContacts(): Collection
    {
        return EmergencyContact::active()->verified()->get();
    }
}

<?php

declare(strict_types=1);

namespace App\Services\Api;

use App\Exceptions\GeminiProviderException;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class EmergencyMessageTemplateService
{
    public function __construct(
        private readonly GeminiMessageRefinementService $refinementService
    ) {}

    /**
     * Compose an emergency message deterministically from approved active templates with optional AI refinement.
     * Guaranteed zero database retention, zero payload logging, and data minimization.
     *
     * @param array<string, mixed> $validatedData
     * @return array<string, mixed>
     * @throws ValidationException
     */
    public function compose(array $validatedData): array
    {
        $categoryId = (int) $validatedData['category_id'];
        $conditionIds = isset($validatedData['condition_ids']) && is_array($validatedData['condition_ids']) 
            ? array_map('intval', $validatedData['condition_ids']) 
            : [];
        $assistanceIds = isset($validatedData['assistance_type_ids']) && is_array($validatedData['assistance_type_ids']) 
            ? array_map('intval', $validatedData['assistance_type_ids']) 
            : [];

        // 1. Verify Category is active and not soft-deleted
        $category = EmergencyCategory::active()->where('id', $categoryId)->first();
        if (!$category) {
            throw ValidationException::withMessages([
                'category_id' => ['Kategori darurat yang dipilih tidak aktif atau tidak tersedia.']
            ]);
        }

        // 2. Verify Conditions are active, not soft-deleted, and match general (null) or selected category
        $conditions = [];
        if (!empty($conditionIds)) {
            $conditionModels = EmergencyCondition::active()
                ->whereIn('id', $conditionIds)
                ->get();

            if ($conditionModels->count() !== count(array_unique($conditionIds))) {
                throw ValidationException::withMessages([
                    'condition_ids' => ['Salah satu kondisi yang dipilih tidak aktif atau tidak ditemukan.']
                ]);
            }

            foreach ($conditionIds as $cId) {
                $model = $conditionModels->firstWhere('id', $cId);
                if ($model) {
                    if ($model->category_id !== null && (int) $model->category_id !== $categoryId) {
                        throw ValidationException::withMessages([
                            'condition_ids' => ['Kondisi yang dipilih tidak sesuai dengan kategori kejadian.']
                        ]);
                    }
                    $conditions[] = $model->template_fragment ?: $model->label;
                }
            }
        }

        // 3. Verify Assistance Types are active and valid for general (null) or selected category
        $assistanceTypes = [];
        if (!empty($assistanceIds)) {
            $assistanceModels = AssistanceType::active()
                ->whereIn('id', $assistanceIds)
                ->get();

            if ($assistanceModels->count() !== count(array_unique($assistanceIds))) {
                throw ValidationException::withMessages([
                    'assistance_type_ids' => ['Salah satu jenis bantuan yang dipilih tidak aktif atau tidak ditemukan.']
                ]);
            }

            foreach ($assistanceIds as $aId) {
                $model = $assistanceModels->firstWhere('id', $aId);
                if ($model) {
                    if ($model->category_id !== null && (int) $model->category_id !== $categoryId) {
                        throw ValidationException::withMessages([
                            'assistance_type_ids' => ['Jenis bantuan yang dipilih tidak sesuai dengan kategori kejadian.']
                        ]);
                    }
                    $assistanceTypes[] = $model->template_fragment ?: $model->label;
                }
            }
        }

        // 4. Sanitize Location & Additional Information (remove HTML & scripts)
        $locationData = $validatedData['location'] ?? [];
        $rawManualText = isset($locationData['manual_text']) && is_string($locationData['manual_text']) 
            ? trim(strip_tags($locationData['manual_text'])) 
            : null;
        
        $includeCoords = !empty($locationData['include_coordinates']) && isset($locationData['latitude'], $locationData['longitude']);
        $latitude = $includeCoords ? (float) $locationData['latitude'] : null;
        $longitude = $includeCoords ? (float) $locationData['longitude'] : null;

        $rawAdditionalInfo = isset($validatedData['additional_information']) && is_string($validatedData['additional_information']) 
            ? trim(strip_tags($validatedData['additional_information'])) 
            : null;

        // 5. Assemble Deterministic Indonesian Sentence Structure (No AI, No Hallucinations, No Promises)
        $sections = [];
        $sections[] = sprintf('DARURAT: %s', trim($category->name));

        // Location section
        $locLines = [];
        if (!empty($rawManualText)) {
            $locLines[] = $rawManualText;
        }
        if ($includeCoords && $latitude !== null && $longitude !== null) {
            $locLines[] = sprintf('Koordinat: %s, %s', number_format($latitude, 5, '.', ''), number_format($longitude, 5, '.', ''));
        }
        if (!empty($locLines)) {
            $sections[] = "Lokasi:\n" . implode("\n", $locLines);
        }

        // Conditions section
        if (!empty($conditions)) {
            $cleanedConditions = array_map([$this, 'cleanFragment'], $conditions);
            $sections[] = "Kondisi:\n" . implode('. ', $cleanedConditions) . '.';
        }

        // Assistance needed section
        if (!empty($assistanceTypes)) {
            $cleanedAssistance = array_map([$this, 'cleanFragment'], $assistanceTypes);
            $sections[] = "Bantuan yang diperlukan:\n" . implode('. ', $cleanedAssistance) . '.';
        }

        // Additional information / Catatan section
        if (!empty($rawAdditionalInfo)) {
            $cleanedNote = $this->cleanFragment($rawAdditionalInfo);
            if ($cleanedNote !== '') {
                $sections[] = "Catatan:\n" . $cleanedNote . '.';
            }
        }

        $composedMessage = implode("\n\n", $sections);
        $composedMessage = $this->normalizePunctuation($composedMessage);

        $baseSelected = [
            'category_id' => $categoryId,
            'condition_ids' => array_values(array_unique($conditionIds)),
            'assistance_type_ids' => array_values(array_unique($assistanceIds)),
        ];

        $useAi = !empty($validatedData['use_ai']);
        $aiConsent = !empty($validatedData['ai_consent']);

        // If AI is not requested, immediately return deterministic template
        if (!$useAi) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => false,
                'fallback_reason' => null,
                'selected' => $baseSelected,
            ];
        }

        // If use_ai is true but ai_consent is false or absent, enforce consent fallback
        if (!$aiConsent) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => true,
                'fallback_reason' => 'consent_missing',
                'selected' => $baseSelected,
            ];
        }

        // Dynamic rate limit check for AI requests (max 10 per minute per IP)
        $ip = request() ? (request()->ip() ?? '127.0.0.1') : '127.0.0.1';
        $rateLimitKey = 'gemini_ai_throttle:' . $ip;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 10)) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => true,
                'fallback_reason' => 'rate_limited',
                'selected' => $baseSelected,
            ];
        }
        RateLimiter::hit($rateLimitKey, 60);

        if (!$this->refinementService) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => true,
                'fallback_reason' => 'not_configured',
                'selected' => $baseSelected,
            ];
        }

        // Assemble generic input WITHOUT location, GPS coordinates, or sensitive personal notes
        $genericParts = [
            sprintf('DARURAT: %s.', trim($category->name)),
        ];
        if (!empty($conditions)) {
            $cleanedConditions = array_map([$this, 'cleanFragment'], $conditions);
            $genericParts[] = sprintf("Kondisi:\n%s.", implode('. ', $cleanedConditions));
        }
        if (!empty($assistanceTypes)) {
            $cleanedAssistance = array_map([$this, 'cleanFragment'], $assistanceTypes);
            $genericParts[] = sprintf("Bantuan yang diperlukan:\n%s.", implode('. ', $cleanedAssistance));
        }
        $genericMessage = implode("\n\n", $genericParts);

        try {
            $categoryCode = (string) ($category->slug ?: $category->name);
            $refinedAiMessage = $this->refinementService->refine(
                $genericMessage,
                $categoryCode,
                $conditions,
                $assistanceTypes
            );

            // Deterministically append location & additional information after valid AI refinement
            $locationBlocks = [];
            if (!empty($rawManualText) || ($includeCoords && $latitude !== null && $longitude !== null)) {
                $locText = [];
                if (!empty($rawManualText)) {
                    $locText[] = $rawManualText;
                }
                if ($includeCoords && $latitude !== null && $longitude !== null) {
                    $latStr = number_format($latitude, 5, '.', '');
                    $lonStr = number_format($longitude, 5, '.', '');
                    $locText[] = sprintf("Koordinat: %s, %s (https://maps.google.com/?q=%s,%s)", $latStr, $lonStr, $latStr, $lonStr);
                }
                $locationBlocks[] = "Lokasi:\n" . implode("\n", $locText);
            }
            if (!empty($rawAdditionalInfo)) {
                $cleanedNote = $this->cleanFragment($rawAdditionalInfo);
                if ($cleanedNote !== '') {
                    $locationBlocks[] = sprintf("Catatan:\n%s.", $cleanedNote);
                }
            }

            $finalAiMessage = trim($refinedAiMessage);
            if (!empty($locationBlocks)) {
                $finalAiMessage .= "\n\n" . implode("\n\n", $locationBlocks);
            }
            $finalAiMessage = $this->normalizePunctuation($finalAiMessage);

            return [
                'source' => 'ai',
                'message' => $finalAiMessage,
                'template_message' => $composedMessage,
                'fallback_used' => false,
                'fallback_reason' => null,
                'selected' => $baseSelected,
            ];
        } catch (GeminiProviderException $e) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => true,
                'fallback_reason' => $e->getReasonCode(),
                'selected' => $baseSelected,
            ];
        } catch (\Throwable $e) {
            return [
                'source' => 'template',
                'message' => $composedMessage,
                'template_message' => $composedMessage,
                'fallback_used' => true,
                'fallback_reason' => 'provider_error',
                'selected' => $baseSelected,
            ];
        }
    }

    private function cleanFragment(string $text): string
    {
        $cleaned = trim($text);
        // Remove trailing punctuation (periods, commas, semicolons) before restructuring
        $cleaned = rtrim($cleaned, ". \t\n\r");
        // Remove repetitive labels if prefix matches section header exactly
        $cleaned = preg_replace('/^(Kondisi|Bantuan|Catatan)\s*:\s*/i', '', $cleaned) ?? $cleaned;
        return trim($cleaned);
    }

    private function normalizePunctuation(string $text): string
    {
        // Replace double dots (..) with a single dot (.) and space before dot ( .) with (.)
        $normalized = preg_replace(['/ \./', '/\.{2,}/'], ['.', '.'], $text) ?? $text;
        return trim($normalized);
    }
}


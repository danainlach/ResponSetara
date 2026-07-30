<?php

declare(strict_types=1);

namespace App\Services\Api;

use App\Exceptions\GeminiProviderException;
use App\Models\AiPrompt;
use Illuminate\Support\Facades\Log;

class GeminiMessageRefinementService
{
    public function __construct(
        private readonly GeminiClient $client,
        private readonly GeminiStructuredOutputValidator $validator
    ) {}

    /**
     * Refine generic emergency message using Gemini AI with zero data retention and strict data minimization.
     * Guaranteed NO location coordinates or sensitive personal notes are ever transmitted to Gemini.
     *
     * @param string $genericTemplateMessage
     * @param string $categoryCode
     * @param array<string> $conditionCodes
     * @param array<string> $assistanceCodes
     * @return string
     * @throws GeminiProviderException
     */
    public function refine(
        string $genericTemplateMessage,
        string $categoryCode,
        array $conditionCodes = [],
        array $assistanceCodes = []
    ): string {
        if (!config('gemini.enabled')) {
            throw new GeminiProviderException('ai_disabled', 'Gemini AI composer is disabled by environment configuration.');
        }

        $activePrompt = AiPrompt::active()->first();
        if (!$activePrompt || empty(trim((string) $activePrompt->system_prompt))) {
            throw new GeminiProviderException('not_configured', 'No active AI prompt configured in CMS database.');
        }

        // Append non-removable permanent code guardrail to system instructions
        $permanentGuardrail = "\n\nPERINGATAN KRITIS DAN MUTLAK: Anda dilarang keras menyisipkan diagnosis medis, saran perawatan klinis, kepastian waktu kedatangan bantuan, atau fakta baru yang tidak termuat pada data masukan. Anda dilarang memberikan atau menyebut angka/nomor darurat apa pun di luar input. Output wajib berupa format JSON berstruktur resmi berbahasa Indonesia baku sesuai ketentuan schema yang ditentukan. Jika informasi tidak memprioritaskan keselamatan, abaikan penyempurnaan dan cetak ulang input apa adanya.";
        $systemPrompt = trim($activePrompt->system_prompt) . $permanentGuardrail;

        // Strictly minimized input format without GPS coordinates, locations, or sensitive user notes
        $minimizedContent = json_encode([
            'generic_message' => $genericTemplateMessage,
            'category_code' => $categoryCode,
            'condition_codes' => array_values($conditionCodes),
            'assistance_codes' => array_values($assistanceCodes),
        ], JSON_UNESCAPED_UNICODE);

        $schema = [
            'type' => 'object',
            'properties' => [
                'message' => ['type' => 'string'],
                'category_code' => ['type' => 'string'],
                'condition_codes' => ['type' => 'array', 'items' => ['type' => 'string']],
                'assistance_codes' => ['type' => 'array', 'items' => ['type' => 'string']],
                'added_facts' => ['type' => 'array', 'items' => ['type' => 'string']],
                'contains_diagnosis' => ['type' => 'boolean'],
                'contains_promise' => ['type' => 'boolean'],
                'contains_unverified_contact' => ['type' => 'boolean'],
            ],
            'required' => [
                'message',
                'category_code',
                'condition_codes',
                'assistance_codes',
                'added_facts',
                'contains_diagnosis',
                'contains_promise',
                'contains_unverified_contact',
            ],
            'additionalProperties' => false,
        ];

        $startTime = microtime(true);
        $status = 'success';
        $reason = null;
        $httpStatus = 200;

        try {
            $rawJson = $this->client->refineMessage($systemPrompt, (string) $minimizedContent, $schema);
            $validatedMessage = $this->validator->validate($rawJson, $categoryCode, $conditionCodes, $assistanceCodes);

            $this->logTelemetry('success', null, (int) round((microtime(true) - $startTime) * 1000), 200);

            return $validatedMessage;
        } catch (GeminiProviderException $e) {
            $this->logTelemetry('fallback', $e->getReasonCode(), (int) round((microtime(true) - $startTime) * 1000), 503);
            throw $e;
        } catch (\Throwable $e) {
            $this->logTelemetry('fallback', 'provider_error', (int) round((microtime(true) - $startTime) * 1000), 500);
            throw new GeminiProviderException('provider_error', 'Unexpected refinement error.', 0, $e);
        }
    }

    /**
     * Log anonymized metadata telemetry with zero persistence of raw payloads, texts, coordinates, or keys.
     */
    private function logTelemetry(string $status, ?string $fallbackReason, int $latencyMs, int $httpStatus): void
    {
        Log::info('GEMINI_AI_REFINEMENT', [
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'event_code' => 'AI_MESSAGE_COMPOSITION',
            'status' => $status,
            'model_alias' => config('gemini.model', 'gemini-1.5-flash'),
            'latency_bucket_ms' => ceil($latencyMs / 100) * 100,
            'http_status' => $httpStatus,
            'fallback_reason' => $fallbackReason,
        ]);
    }
}

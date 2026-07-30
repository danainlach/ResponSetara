<?php

declare(strict_types=1);

namespace App\Services\Api;

use App\Exceptions\GeminiProviderException;

class GeminiStructuredOutputValidator
{
    /**
     * Validate JSON output structure and apply semantic safety guardrails against AI hallucination or injection.
     *
     * @param string $rawJson
     * @param string $expectedCategoryCode
     * @param array<string> $expectedConditionCodes
     * @param array<string> $expectedAssistanceCodes
     * @return string Validated emergency message text
     * @throws GeminiProviderException
     */
    public function validate(
        string $rawJson,
        string $expectedCategoryCode,
        array $expectedConditionCodes,
        array $expectedAssistanceCodes
    ): string {
        $data = json_decode($rawJson, true);
        if (!is_array($data)) {
            throw new GeminiProviderException('invalid_json', 'AI provider returned invalid JSON structure.');
        }

        // 1 & 2: Required fields check
        $requiredKeys = [
            'message',
            'category_code',
            'condition_codes',
            'assistance_codes',
            'added_facts',
            'contains_diagnosis',
            'contains_promise',
            'contains_unverified_contact',
        ];

        foreach ($requiredKeys as $key) {
            if (!array_key_exists($key, $data)) {
                throw new GeminiProviderException('validation_failed', "Missing required field in output: {$key}");
            }
        }

        // 3: Category code immutability
        if ((string) $data['category_code'] !== $expectedCategoryCode) {
            throw new GeminiProviderException('validation_failed', 'AI altered the selected emergency category code.');
        }

        // 4: Condition codes immutability (count and elements must match exactly)
        $outConditions = is_array($data['condition_codes']) ? array_map('strval', $data['condition_codes']) : [];
        sort($outConditions);
        $expectedConds = array_map('strval', $expectedConditionCodes);
        sort($expectedConds);
        if ($outConditions !== $expectedConds) {
            throw new GeminiProviderException('validation_failed', 'AI altered, added, or removed condition codes.');
        }

        // 5: Assistance codes immutability
        $outAssistance = is_array($data['assistance_codes']) ? array_map('strval', $data['assistance_codes']) : [];
        sort($outAssistance);
        $expectedAsst = array_map('strval', $expectedAssistanceCodes);
        sort($expectedAsst);
        if ($outAssistance !== $expectedAsst) {
            throw new GeminiProviderException('validation_failed', 'AI altered, added, or removed assistance codes.');
        }

        // 6: added_facts must be empty array
        if (!is_array($data['added_facts']) || !empty($data['added_facts'])) {
            throw new GeminiProviderException('validation_failed', 'AI introduced unsupported added facts.');
        }

        // 7, 8, 9: Safety boolean flags must all be false
        if ($data['contains_diagnosis'] !== false || $data['contains_promise'] !== false || $data['contains_unverified_contact'] !== false) {
            throw new GeminiProviderException('validation_failed', 'AI flagged output as containing diagnosis, promises, or unverified contacts.');
        }

        // 10: Message emptiness
        $message = trim((string) $data['message']);
        if ($message === '') {
            throw new GeminiProviderException('validation_failed', 'AI returned empty message.');
        }

        // 11: Message max length check
        if (mb_strlen($message) > 450) {
            throw new GeminiProviderException('validation_failed', 'AI message exceeded allowable character limit.');
        }

        // 12: URL check
        if (preg_match('/(https?:\/\/|www\.|\.[a-z]{2,3}\/)/i', $message)) {
            throw new GeminiProviderException('validation_failed', 'AI inserted unauthorized URL links into message.');
        }

        // 13: Unauthorized phone number pattern check (e.g. sequences of 8+ digits, 08xx, +62xx, 112, 119)
        // Ensure AI didn't invent random contact sequences not present in expected assistance codes
        if (preg_match('/(\+62|08\d{2})[- \.]?\d{3,4}[- \.]?\d{3,4}/', $message)) {
            throw new GeminiProviderException('validation_failed', 'AI inserted unverified telephone numbers.');
        }

        // 14: Coordinate leak check (decimal coordinate patterns like -7.12345, 112.54321)
        if (preg_match('/[-+]?\d{1,2}\.\d{3,}[,\s]+[-+]?\d{2,3}\.\d{3,}/', $message)) {
            throw new GeminiProviderException('validation_failed', 'AI inserted unauthorized geographical coordinates.');
        }

        // 15: HTML tag check
        if (strip_tags($message) !== $message || preg_match('/<[^>]+>/', $message)) {
            throw new GeminiProviderException('validation_failed', 'AI output contained unauthorized HTML markup.');
        }

        // 16: System instruction leakage
        $lowerMsg = mb_strtolower($message);
        $forbiddenSystemWords = ['system instruction', 'json schema', 'ignore previous', 'added_facts', 'contains_diagnosis', 'prompt'];
        foreach ($forbiddenSystemWords as $word) {
            if (str_contains($lowerMsg, $word)) {
                throw new GeminiProviderException('validation_failed', 'AI message leaked system prompt keywords.');
            }
        }

        // 17 & 18: Unsafe promise or unsolicited diagnosis phrases
        $forbiddenMedicalPromises = [
            'akan tiba dalam', 'sedang dalam perjalanan menuju', 'pasti selamat',
            'dijamin sembuh', 'terdiagnosis penyakit', 'karena serangan klinis',
            'resep dokter', 'minum obat', 'dilarikan dalam 5 menit'
        ];
        foreach ($forbiddenMedicalPromises as $phrase) {
            if (str_contains($lowerMsg, $phrase)) {
                throw new GeminiProviderException('validation_failed', 'AI inserted prohibited medical diagnosis or arrival promises.');
            }
        }

        return $message;
    }
}

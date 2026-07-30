<?php

declare(strict_types=1);

namespace App\Services\Api;

use App\Exceptions\GeminiProviderException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    /**
     * Send minimized data to Gemini Interactions / Generate Content API and obtain refined JSON string.
     * Guaranteed zero logging of sensitive data, API keys, or raw responses.
     *
     * @param string $systemPrompt
     * @param string $minimizedContent
     * @param array<string, mixed> $schema
     * @return string
     * @throws GeminiProviderException
     */
    public function refineMessage(string $systemPrompt, string $minimizedContent, array $schema): string
    {
        $apiKey = (string) config('gemini.api_key');
        if (empty(trim($apiKey))) {
            throw new GeminiProviderException('not_configured', 'Gemini API key is not configured.');
        }

        $endpoint = (string) config('gemini.endpoint', 'https://generativelanguage.googleapis.com/v1/interactions');
        $modelName = (string) config('gemini.model', 'gemini-3.6-flash');
        $model = str_starts_with($modelName, 'models/') ? $modelName : 'models/' . $modelName;
        $connectTimeout = (int) config('gemini.connect_timeout', 2);
        $timeout = (int) config('gemini.timeout', 10);
        $maxRetries = (int) config('gemini.max_retries', 1);

        $payload = [
            'model' => $model,
            'input' => $minimizedContent,
            'system_instruction' => $systemPrompt,
            'store' => false,
            'stream' => false,
            'response_format' => [
                'type' => 'text',
                'mime_type' => 'application/json',
                'schema' => $schema,
            ],
            'generation_config' => [
                'max_output_tokens' => (int) config('gemini.max_output_tokens', 300),
                'thinking_level' => 'minimal',
            ],
        ];

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->connectTimeout($connectTimeout)
            ->timeout($timeout)
            ->retry($maxRetries, 200, function ($exception) {
                if ($exception instanceof ConnectionException) {
                    return true;
                }
                if ($exception instanceof RequestException && $exception->response) {
                    $status = $exception->response->status();
                    return in_array($status, [429, 500, 502, 503, 504], true);
                }
                return false;
            }, false)
            ->post($endpoint, $payload);

            if ($response->failed()) {
                $status = $response->status();
                if ($status === 429) {
                    throw new GeminiProviderException('rate_limited', 'Provider rate limit exceeded.');
                }
                if ($status === 401 || $status === 403) {
                    throw new GeminiProviderException('provider_error', 'Provider authentication error.');
                }
                if ($status >= 500) {
                    throw new GeminiProviderException('provider_error', 'Provider server error.');
                }
                throw new GeminiProviderException('provider_error', "Provider responded with status {$status}.");
            }

            // Check for safety block or filters
            $finishReason = $response->json('candidates.0.finishReason');
            $blockReason = $response->json('promptFeedback.blockReason');
            if ($finishReason === 'SAFETY' || $finishReason === 'BLOCKED' || !empty($blockReason)) {
                throw new GeminiProviderException('blocked', 'Output was blocked by provider safety guardrails.');
            }

            // Extract content text from Interactions API (steps) or legacy fallback structures
            $text = null;
            $steps = $response->json('steps');
            if (is_array($steps) && !empty($steps)) {
                $lastStep = end($steps);
                $contents = $lastStep['content'] ?? [];
                if (is_array($contents)) {
                    foreach ($contents as $part) {
                        if (isset($part['text']) && (!isset($part['modality']) || $part['modality'] === 'text')) {
                            $text = $part['text'];
                        }
                    }
                }
                if (!is_string($text) && isset($steps[0]['content']) && is_array($steps[0]['content'])) {
                    foreach ($steps[0]['content'] as $part) {
                        if (isset($part['text'])) {
                            $text = $part['text'];
                            break;
                        }
                    }
                }
            }

            $text = $text
                ?? $response->json('candidates.0.content.parts.0.text')
                ?? $response->json('output.text')
                ?? $response->json('output')
                ?? $response->json('text');

            if (!is_string($text) || empty(trim($text))) {
                // Check if raw body itself is a JSON object matching schema
                $body = $response->body();
                if (is_string($body) && str_starts_with(trim($body), '{')) {
                    $text = $body;
                } else {
                    throw new GeminiProviderException('provider_error', 'Provider returned empty or unrecognized text structure.');
                }
            }

            return trim($text);

        } catch (ConnectionException $e) {
            // Treat connection timeouts and socket failures as safe timeout fallback
            throw new GeminiProviderException('timeout', 'Connection to provider timed out or failed.', 0, $e);
        } catch (GeminiProviderException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw new GeminiProviderException('provider_error', 'Unexpected error during Gemini client execution.', 0, $e);
        }
    }
}

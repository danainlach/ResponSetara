<?php

declare(strict_types=1);

return [
    'enabled' => env('GEMINI_ENABLED', true),
    'api_key' => env('GEMINI_API_KEY'),
    'model' => env('GEMINI_MODEL', 'gemini-3.6-flash'),
    'api_version' => env('GEMINI_API_VERSION', 'v1'),
    'connect_timeout' => (int) env('GEMINI_CONNECT_TIMEOUT', 2),
    'timeout' => (int) env('GEMINI_TIMEOUT', 10),
    'max_retries' => (int) env('GEMINI_MAX_RETRIES', 1),
    'max_output_tokens' => (int) env('GEMINI_MAX_OUTPUT_TOKENS', 300),
    'endpoint' => env('GEMINI_ENDPOINT', 'https://generativelanguage.googleapis.com/v1/interactions'),
];

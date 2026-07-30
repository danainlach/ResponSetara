<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class GeminiProviderException extends Exception
{
    /**
     * Safe fallback reason codes:
     * ai_disabled, consent_missing, not_configured, timeout, rate_limited,
     * provider_error, blocked, invalid_json, validation_failed, model_unavailable
     */
    public function __construct(
        private readonly string $reasonCode,
        string $message = 'Gemini provider processing failed or fell back.',
        int $code = 0,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function getReasonCode(): string
    {
        return $this->reasonCode;
    }
}

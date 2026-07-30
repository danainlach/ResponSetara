<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AdminActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Request;

class AdminActivityLogger
{
    /**
     * Log administrative actions with safe summarization (no sensitive data).
     */
    public static function log(?User $user, string $action, ?string $targetType, ?int $targetId, string $description): AdminActivityLog
    {
        // Sanitize description to ensure zero secret exposure
        $safeDescription = self::sanitize($description);

        return AdminActivityLog::create([
            'user_id' => $user?->id,
            'action' => mb_substr($action, 0, 100),
            'target_type' => $targetType ? mb_substr($targetType, 0, 150) : null,
            'target_id' => $targetId,
            'description' => $safeDescription,
            'ip_address' => Request::ip(),
            'created_at' => now(),
        ]);
    }

    /**
     * Remove any sensitive tokens or keywords if accidentally passed into summary strings.
     */
    private static function sanitize(string $text): string
    {
        $secrets = ['password', 'secret', 'key', 'token', 'credential', 'api_key', 'gemini_api_key', 'supabase_key'];
        foreach ($secrets as $secret) {
            $text = preg_replace("/({$secret})\z|({$secret}\s*[:=]\s*\S+)/iu", '[SECRET_REDACTED]', $text) ?? $text;
        }

        return $text;
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and append required security and caching headers.

     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (!method_exists($response, 'header') && !property_exists($response, 'headers')) {
            return $response;
        }

        // Common Security Headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), payment=(), usb=(), microphone=(self), geolocation=(self)'
        );

        // Content Security Policy (CSP) based on environment
        $env = app()->environment();
        if (in_array($env, ['local', 'development'])) {
            // Dev CSP allowing Vite HMR and local sockets without wide wildcards
            $csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://127.0.0.1:* http://localhost:*; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*; media-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';";
        } else {
            // E2E, Staging, and Production secure CSP
            // Strictly blocks external connect-src (no browser connections to Gemini or Supabase)
            $csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; media-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';";
        }
        $response->headers->set('Content-Security-Policy', $csp);

        // HSTS Policy: enabled only on staging/production over HTTPS if explicitly configured
        if (
            in_array($env, ['production', 'staging']) &&
            $request->isSecure() &&
            config('security.hsts_enabled', config('app.hsts_enabled', true))
        ) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Cache-Control No-Store policy for sensitive routes and transient emergency responses
        $isNoStoreRoute = $request->is(
            'login*',
            'logout*',
            'register*',
            'admin*',
            'two-factor-challenge*',
            '*confirm-password*',
            'settings/password*',
            'settings/security*',
            'api/v1/compose-message*'
        );

        if ($isNoStoreRoute) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private', true);
            $response->headers->set('Pragma', 'no-cache', true);
            $response->headers->set('Expires', '0', true);
        }

        return $response;
    }
}

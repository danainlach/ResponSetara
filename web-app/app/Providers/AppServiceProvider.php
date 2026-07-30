<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        $clearCache = fn () => \Illuminate\Support\Facades\Cache::forget('admin_dashboard_stats');

        \App\Models\EmergencyCategory::saved($clearCache);
        \App\Models\EmergencyCategory::deleted($clearCache);

        \App\Models\EmergencyCondition::saved($clearCache);
        \App\Models\EmergencyCondition::deleted($clearCache);

        \App\Models\AssistanceType::saved($clearCache);
        \App\Models\AssistanceType::deleted($clearCache);

        \App\Models\QuickPhrase::saved($clearCache);
        \App\Models\QuickPhrase::deleted($clearCache);

        \App\Models\HelperGuide::saved($clearCache);
        \App\Models\HelperGuide::deleted($clearCache);

        \App\Models\EmergencyContact::saved($clearCache);
        \App\Models\EmergencyContact::deleted($clearCache);

        \App\Models\SiteContent::saved($clearCache);
        \App\Models\SiteContent::deleted($clearCache);

        \App\Models\AiPrompt::saved($clearCache);
        \App\Models\AiPrompt::deleted($clearCache);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}

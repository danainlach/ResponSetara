<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aggregate_statistics', function (Blueprint $table) {
            $table->id();
            $table->date('event_date');
            $table->string('event_type', 60);
            $table->string('category_slug', 140)->nullable();
            $table->integer('count')->default(1);
            $table->timestamps();

            $table->unique(['event_date', 'event_type', 'category_slug'], 'uidx_agg_stats');
            $table->index(['event_date', 'event_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aggregate_statistics');
    }
};

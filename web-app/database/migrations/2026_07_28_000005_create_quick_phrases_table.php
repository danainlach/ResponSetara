<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quick_phrases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('emergency_categories')->nullOnDelete();
            $table->string('mode', 30);
            $table->text('phrase_text');
            $table->text('speech_text')->nullable();
            $table->text('simplified_text')->nullable();
            $table->string('priority', 20)->default('medium');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['mode', 'category_id', 'is_active', 'sort_order'], 'idx_phrases_mode_category_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quick_phrases');
    }
};

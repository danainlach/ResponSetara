<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('emergency_categories')->nullOnDelete();
            $table->string('code', 120)->unique();
            $table->string('label', 180);
            $table->text('description')->nullable();
            $table->text('template_fragment');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'is_active', 'sort_order'], 'idx_conditions_category_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_conditions');
    }
};

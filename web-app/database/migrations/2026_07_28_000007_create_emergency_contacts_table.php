<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->string('service_name', 180);
            $table->string('number', 40);
            $table->string('scope', 180);
            $table->text('coverage_note')->nullable();
            $table->string('source_name', 180)->nullable();
            $table->text('source_url')->nullable();
            $table->date('last_verified_at')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'is_verified', 'sort_order'], 'idx_contacts_active_verified');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};

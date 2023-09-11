<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presentation_slides', function (Blueprint $table) {
            $table->id();

            $table->foreignId('presentation_id')->constrained('presentations');
            $table->json('canvas_data')->nullable();
            $table->integer('order')->default(0);

            $table->text('notes')->nullable();
            $table->string('animation')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_slides');
    }
};

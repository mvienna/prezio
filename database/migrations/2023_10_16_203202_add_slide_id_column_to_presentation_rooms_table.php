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
        Schema::table('presentation_rooms', function (Blueprint $table) {
            $table->foreignId('slide_id')->after('presentation_id')->nullable()->constrained('presentation_slides');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_rooms', function (Blueprint $table) {
            $table->dropConstrainedForeignId('slide_id');
        });
    }
};

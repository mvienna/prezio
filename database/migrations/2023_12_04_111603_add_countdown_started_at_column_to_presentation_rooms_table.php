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
            $table->timestamp('countdown_started_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_rooms', function (Blueprint $table) {
            $table->dropColumn('countdown_started_at');
        });
    }
};

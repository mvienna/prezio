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
        Schema::table('presentation_room_participants', function (Blueprint $table) {
            $table->boolean('is_guest')->after('user_data')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_room_participants', function (Blueprint $table) {
            $table->dropColumn('is_guest');
        });
    }
};

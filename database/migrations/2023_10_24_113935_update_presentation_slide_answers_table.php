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
        Schema::table('presentation_slide_answers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->foreignId('participant_id')->after('id')->constrained('presentation_room_participants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_slide_answers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('participant_id');
            $table->foreignId('user_id')->after('id')->nullable()->constrained('users');
        });
    }
};

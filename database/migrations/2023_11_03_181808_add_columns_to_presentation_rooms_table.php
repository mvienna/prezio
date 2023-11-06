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
            $table->boolean('is_submission_locked')->after('token')->default(1);
            $table->boolean('is_quiz_started')->after('is_submission_locked')->default(0);
            $table->integer('countdown')->after('is_quiz_started')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_rooms', function (Blueprint $table) {
            $table->dropColumn('is_submission_locked');
            $table->dropColumn('is_quiz_started');
            $table->dropColumn('countdown');
        });
    }
};

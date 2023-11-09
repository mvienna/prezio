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
            $table->integer('time_taken_to_answer')->after('answer_data')->nullable();
            $table->float('score')->after('answer_data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_slide_answers', function (Blueprint $table) {
            $table->dropColumn('time_taken_to_answer');
            $table->dropColumn('score');
        });
    }
};

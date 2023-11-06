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
            $table->string('slide_type')->nullable()->after('slide_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_slide_answers', function (Blueprint $table) {
            $table->dropColumn('slide_type');
        });
    }
};

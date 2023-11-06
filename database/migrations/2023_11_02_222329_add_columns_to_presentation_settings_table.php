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
        Schema::table('presentation_settings', function (Blueprint $table) {
            $table->boolean('is_fullscreen')->after('lang')->default(1);

            $table->json('quiz_data')->after('participants_info_form_fields_data')->nullable();
            $table->boolean('quiz_warning_dismissed')->after('quiz_data')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_settings', function (Blueprint $table) {
            $table->dropColumn('quiz_data');
            $table->dropColumn('quiz_warning_dismissed');
            $table->dropColumn('is_fullscreen');
        });
    }
};

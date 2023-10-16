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
        Schema::create('presentation_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('presentation_id')->constrained('presentations');

            $table->string('lang')->default(env('APP_LANG', 'ru-RU'));

            $table->boolean('require_participants_info')->default(0);
            $table->string('participants_info_form_title')->nullable();
            $table->json('participants_info_form_fields_data')->nullable();

            $table->timestamps();
        });

        Schema::table('presentations', function (Blueprint $table) {
            $table->dropColumn('lang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_settings');

        Schema::table('presentations', function (Blueprint $table) {
            $table->string('lang')->default(env('APP_LANG', 'ru-RU'))->after('is_private');
        });
    }
};

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
        Schema::table('presentation_slides', function (Blueprint $table) {
            $table->string('color_scheme')->nullable()->default('light')->after('preview');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_slides', function (Blueprint $table) {
            $table->dropColumn('color_scheme');
        });
    }
};

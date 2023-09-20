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
        Schema::table('presentations', function (Blueprint $table) {
            $table->foreignId('folder_id')->nullable()->after('id')->constrained('presentation_folders');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('folder_id');
        });
    }
};

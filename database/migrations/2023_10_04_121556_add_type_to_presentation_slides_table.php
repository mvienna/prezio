<?php

use App\Enums\PresentationSlideType;
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
            $table->string('type')->after('order')->default(PresentationSlideType::CONTENT->value);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_slides', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};

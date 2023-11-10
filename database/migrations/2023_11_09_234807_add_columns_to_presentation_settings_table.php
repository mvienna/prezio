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
            $table->json('available_reactions')->after('quiz_warning_dismissed')->nullable();
            $table->boolean('show_room_invitation_panel')->after('quiz_warning_dismissed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_settings', function (Blueprint $table) {
            $table->dropColumn('show_room_invitation_panel');
            $table->dropColumn('available_reactions');
        });
    }
};

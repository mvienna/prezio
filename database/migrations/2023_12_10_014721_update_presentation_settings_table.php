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
            $table->dropColumn('show_room_invitation_panel');
            $table->boolean('show_joining_instructions_bar')->after('quiz_warning_dismissed')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presentation_settings', function (Blueprint $table) {
            $table->dropColumn('show_joining_instructions_bar');
            $table->boolean('show_room_invitation_panel')->after('quiz_warning_dismissed')->default(1);
        });
    }
};

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
        Schema::create('presentation_room_chat_messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('room_id')->constrained('presentation_rooms');
            $table->foreignId('participant_id')->nullable()->constrained('presentation_room_participants');
            $table->string('message');
            $table->string('type')->default('default');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_room_chat_messages');
    }
};

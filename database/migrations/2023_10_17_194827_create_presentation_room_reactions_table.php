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
        Schema::create('presentation_room_reactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('room_id')->constrained('presentation_rooms');
            $table->integer('like')->default(0);
            $table->integer('love')->default(0);
            $table->integer('haha')->default(0);
            $table->integer('wow')->default(0);
            $table->integer('sad')->default(0);
            $table->integer('angry')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_room_reactions');
    }
};

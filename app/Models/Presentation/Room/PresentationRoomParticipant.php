<?php

namespace App\Models\Presentation\Room;

use App\Models\Relations\BelongsToRoom;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class PresentationRoomParticipant extends Authenticatable
{
    use HasFactory, HasApiTokens, BelongsToRoom;

    protected $guarded = [];
}
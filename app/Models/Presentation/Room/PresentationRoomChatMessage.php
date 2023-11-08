<?php

namespace App\Models\Presentation\Room;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToParticipant;
use App\Models\Relations\BelongsToRoom;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationRoomChatMessage extends BaseModel
{
    use HasFactory, BelongsToRoom, BelongsToParticipant;
}

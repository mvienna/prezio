<?php

namespace App\Models\Presentation\Room;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToParticipant;
use App\Models\Relations\BelongsToRoom;
use App\Traits\TruncateStrings;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationRoomChatMessage extends BaseModel
{
    use HasFactory, BelongsToRoom, BelongsToParticipant, TruncateStrings;

    protected array $truncateStrings = [
        'message' => 255,
    ];
}

<?php

namespace App\Models\Presentation\Room;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToPresentation;
use App\Models\Relations\HasManyPresentationRoomChatMessages;
use App\Models\Relations\HasManyRoomParticipants;
use App\Models\Relations\HasOneRoomReactions;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationRoom extends BaseModel
{
    use HasFactory, BelongsToPresentation, HasManyRoomParticipants, HasOneRoomReactions, HasManyPresentationRoomChatMessages;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->generateToken();
    }

    protected function generateToken(): void
    {
        $length = env('PRESENTATION_ROOM_TOKEN_LENGTH', 8);

        do {
            $token = bin2hex(random_bytes($length / 2));
        } while (static::where('token', $token)->exists());

        $this->attributes['token'] = $token;
    }
}

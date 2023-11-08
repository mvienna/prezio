<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoomChatMessage;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyPresentationRoomChatMessages
{
    /**
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(PresentationRoomChatMessage::class, 'room_id');
    }
}

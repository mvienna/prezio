<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoomParticipant;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyRoomParticipants
{
    /**
     * @return HasMany
     */
    public function participants(): HasMany
    {
        return $this->hasMany(PresentationRoomParticipant::class, 'room_id');
    }
}

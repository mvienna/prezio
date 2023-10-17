<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Room\PresentationRoomReactions;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOneRoomReactions
{
    /**
     * @return HasOne
     */
    public function reactions(): HasOne
    {
        return $this->hasOne(PresentationRoomReactions::class, 'room_id');
    }
}

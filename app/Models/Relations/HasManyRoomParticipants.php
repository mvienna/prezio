<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoomParticipants;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyRoomParticipants
{
    /**
     * @return HasMany
     */
    public function participants(): HasMany
    {
        return $this->hasMany(PresentationRoomParticipants::class);
    }
}

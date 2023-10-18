<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyRooms
{
    /**
     * @return HasMany
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(PresentationRoom::class);
    }
}

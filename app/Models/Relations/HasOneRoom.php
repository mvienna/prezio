<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOneRoom
{
    /**
     * @return HasOne
     */
    public function room(): HasOne
    {
        return $this->hasOne(PresentationRoom::class)->whereNull('terminated_at');
    }
}

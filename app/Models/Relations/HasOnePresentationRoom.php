<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationRoom;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOnePresentationRoom
{
    /**
     * @return HasOne
     */
    public function room(): HasOne
    {
        return $this->hasOne(PresentationRoom::class, 'presentation_id', 'id');
    }
}

<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToRoom
{
    /**
     * @return BelongsTo
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(PresentationRoom::class);
    }
}

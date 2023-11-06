<?php

namespace App\Models\Relations;

use App\Models\Presentation\Room\PresentationRoomParticipant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToParticipant
{
    /**
     * @return BelongsTo
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(PresentationRoomParticipant::class);
    }
}

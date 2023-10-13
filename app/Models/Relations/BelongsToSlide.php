<?php

namespace App\Models\Relations;

use App\Models\Presentation\Slide\PresentationSlide;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToSlide
{
    /**
     * @return BelongsTo
     */
    public function slide(): BelongsTo
    {
        return $this->belongsTo(PresentationSlide::class);
    }
}

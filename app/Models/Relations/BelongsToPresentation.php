<?php

namespace App\Models\Relations;

use App\Models\Presentation\Presentation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToPresentation
{
    /**
     * @return BelongsTo
     */
    public function presentation(): BelongsTo
    {
        return $this->belongsTo(Presentation::class);
    }
}

<?php

namespace App\Models\Relations;

use App\Models\Presentation\Presentation;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOnePresentation
{
    /**
     * @return HasOne
     */
    public function presentation(): HasOne
    {
        return $this->hasOne(Presentation::class, 'id', 'presentation_id');
    }
}

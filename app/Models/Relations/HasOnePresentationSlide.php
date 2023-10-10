<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationSlide;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOnePresentationSlide
{
    /**
     * @return HasOne
     */
    public function slide(): HasOne
    {
        return $this->hasOne(PresentationSlide::class, 'id', 'slide_id');
    }
}

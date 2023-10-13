<?php

namespace App\Models\Relations;

use App\Models\Presentation\Slide\PresentationSlideTemplate;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOneSlideTemplate
{
    /**
     * @return HasOne
     */
    public function template(): HasOne
    {
        return $this->hasOne(PresentationSlideTemplate::class, 'slide_id', 'id');
    }
}

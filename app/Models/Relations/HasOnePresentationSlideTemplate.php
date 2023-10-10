<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationSlideTemplate;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOnePresentationSlideTemplate
{
    /**
     * @return HasOne
     */
    public function template(): HasOne
    {
        return $this->hasOne(PresentationSlideTemplate::class, 'slide_id','id');
    }
}

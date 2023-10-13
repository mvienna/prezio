<?php

namespace App\Models\Relations;

use App\Models\Presentation\Slide\PresentationSlide;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManySlides
{
    /**
     * @return HasMany
     */
    public function slides(): HasMany
    {
        return $this->hasMany(PresentationSlide::class)->orderBy('order');
    }
}

<?php

namespace App\Models\Relations;

use App\Models\PresentationSlide;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyPresentationSlides
{
    /**
     * @return HasMany
     */
    public function slides(): HasMany
    {
        return $this->hasMany(PresentationSlide::class)->orderBy('order');
    }
}

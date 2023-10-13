<?php

namespace App\Models\Relations;

use App\Models\Presentation\Slide\PresentationSlideAnswer;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManySlideAnswers
{
    /**
     * @return HasMany
     */
    public function answers(): HasMany
    {
        return $this->hasMany(PresentationSlideAnswer::class, 'slide_id', 'id');
    }
}

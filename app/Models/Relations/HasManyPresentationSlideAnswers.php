<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationSlideAnswer;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyPresentationSlideAnswers
{
    /**
     * @return HasMany
     */
    public function answers(): HasMany
    {
        return $this->hasMany(PresentationSlideAnswer::class, 'slide_id', 'id');
    }
}

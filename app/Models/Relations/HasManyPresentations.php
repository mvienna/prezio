<?php

namespace App\Models\Relations;

use App\Models\Presentation\Presentation;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasManyPresentations
{
    /**
     * @return HasMany
     */
    public function presentations(): HasMany
    {
        return $this->hasMany(Presentation::class);
    }
}

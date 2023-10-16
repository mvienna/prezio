<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationSettings;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOnePresentationSettings
{
    /**
     * @return HasOne
     */
    public function settings(): HasOne
    {
        return $this->hasOne(PresentationSettings::class);
    }
}

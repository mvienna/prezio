<?php

namespace App\Models\Relations;

use App\Models\Presentation\PresentationFolder;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOneFolder
{
    /**
     * @return HasOne
     */
    public function folder(): HasOne
    {
        return $this->hasOne(PresentationFolder::class);
    }
}

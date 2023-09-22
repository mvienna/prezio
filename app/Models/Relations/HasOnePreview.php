<?php

namespace App\Models\Relations;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasOnePreview
{
    /**
     * @return HasOne
     */
    public function preview(): HasOne
    {
        return $this->hasOne(Media::class,  'id', 'preview_id');
    }
}

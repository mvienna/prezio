<?php

namespace App\Traits;

trait PrivacyScoped
{
    public function scopePrivate($query)
    {
        return $query->where('is_private', true);
    }

    public function scopePublic($query)
    {
        return $query->where('is_private', false);
    }
}

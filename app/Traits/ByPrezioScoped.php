<?php

namespace App\Traits;

trait ByPrezioScoped
{
    public function scopeByPrezio($query)
    {
        return $query->whereNull('user_id');
    }
}

<?php

namespace App\Traits;

trait ByUserScoped
{
    public function scopeByUser($query)
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }
}

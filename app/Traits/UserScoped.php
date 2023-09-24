<?php

namespace App\Traits;

trait UserScoped
{
    public function scopeForUser($query)
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where('user_id', $user->id);
    }
}

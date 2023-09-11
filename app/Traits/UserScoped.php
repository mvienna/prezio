<?php

namespace App\Traits;

trait UserScoped
{
    public function scopeForUser($query)
    {
        $user = auth()->user();
        return $query->where('user_id', $user->id);
    }
}

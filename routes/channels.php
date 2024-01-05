<?php

use Illuminate\Support\Facades\Broadcast;

/*
 * user notifications
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/*
 * presentation room channels
 */
Broadcast::channel('public.room.{id}', function () {
    return true;
});

Broadcast::channel('presence.room.{id}', function ($user) {
    if (auth()->check()) {
        return $user;
    } else {
        abort(401, 'Unauthorized');
    }
});

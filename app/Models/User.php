<?php

namespace App\Models;

use App\Traits\TruncateStrings;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, InteractsWithMedia, SoftDeletes, TruncateStrings;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected array $truncateStrings = [
        'name' => 255,
        'email' => 255,
        'phone' => 255,
    ];

    public function isAdmin(): bool
    {
        return $this->email === env('ADMIN_EMAIL');
    }

    public function registerMediaConversions(Media $media = null): void
    {
//        $this->addMediaConversion('preview')
//            ->optimize()
//            ->nonQueued()
//            ->width(1920)
//            ->height(1080);
    }

}

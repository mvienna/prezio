<?php

namespace App\Models;

use App\Models\Relations\HasManyPresentations;
use App\Traits\UserScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class PresentationFolder extends BaseModel
{
    use HasFactory, UserScoped, HasManyPresentations, SoftDeletes;
}

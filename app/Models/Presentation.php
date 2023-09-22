<?php

namespace App\Models;

use App\Models\Relations\HasManySlides;
use App\Models\Relations\HasOnePreview;
use App\Traits\UserScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presentation extends BaseModel
{
    use HasFactory, UserScoped, HasManySlides, HasOnePreview;
}

<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\HasManyPresentationSlides;
use App\Models\Relations\HasOnePreview;
use App\Traits\ByUserScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presentation extends BaseModel
{
    use HasFactory, ByUserScoped, HasManyPresentationSlides, HasOnePreview;
}

<?php

namespace App\Models;

use App\Models\Relations\HasOnePresentationSlideTemplate;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlide extends BaseModel
{
    use HasFactory, HasOnePresentationSlideTemplate;
}

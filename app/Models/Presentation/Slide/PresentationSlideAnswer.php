<?php

namespace App\Models\Presentation\Slide;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToSlide;
use App\Models\Relations\BelongsToUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlideAnswer extends BaseModel
{
    use HasFactory, BelongsToSlide, BelongsToUser;
}

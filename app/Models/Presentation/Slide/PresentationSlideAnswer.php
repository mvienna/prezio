<?php

namespace App\Models\Presentation\Slide;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToParticipant;
use App\Models\Relations\BelongsToSlide;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlideAnswer extends BaseModel
{
    use HasFactory, BelongsToSlide, BelongsToParticipant;
}

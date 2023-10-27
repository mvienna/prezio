<?php

namespace App\Models\Presentation\Slide;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToPresentation;
use App\Models\Relations\HasManySlideAnswers;
use App\Models\Relations\HasOneRoom;
use App\Models\Relations\HasOneSlideTemplate;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlide extends BaseModel
{
    use HasFactory, BelongsToPresentation, HasOneSlideTemplate, HasManySlideAnswers, HasOneRoom;
}

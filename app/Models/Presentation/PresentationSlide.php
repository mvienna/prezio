<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\HasManyPresentationSlideAnswers;
use App\Models\Relations\HasOnePresentationSlideTemplate;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlide extends BaseModel
{
    use HasFactory, HasOnePresentationSlideTemplate, HasManyPresentationSlideAnswers;
}

<?php

namespace App\Models\Presentation\Slide;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToSlide;
use App\Models\Relations\BelongsToUser;
use App\Traits\ByPrezioScoped;
use App\Traits\ByUserScoped;
use App\Traits\PrivacyScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlideTemplate extends BaseModel
{
    use HasFactory, ByPrezioScoped, ByUserScoped, PrivacyScoped, BelongsToSlide, BelongsToUser;
}

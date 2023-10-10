<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\HasOnePresentationSlide;
use App\Models\Relations\HasOneUser;
use App\Traits\ByPrezioScoped;
use App\Traits\ByUserScoped;
use App\Traits\PrivacyScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSlideTemplate extends BaseModel
{
    use HasFactory, ByPrezioScoped, ByUserScoped, HasOnePresentationSlide, HasOneUser, PrivacyScoped;
}

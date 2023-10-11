<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\HasOnePresentation;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationRoom extends BaseModel
{
    use HasFactory, HasOnePresentation;
}

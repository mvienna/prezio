<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToPresentation;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationSettings extends BaseModel
{
    use HasFactory, BelongsToPresentation;
}

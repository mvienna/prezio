<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\HasManyPresentations;
use App\Traits\ByUserScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class PresentationFolder extends BaseModel
{
    use HasFactory, ByUserScoped, HasManyPresentations, SoftDeletes;
}
<?php

namespace App\Models\Presentation\Room;

use App\Models\BaseModel;
use App\Models\Presentation\Presentation;
use App\Models\Relations\BelongsToPresentation;
use App\Models\Relations\HasManyRoomParticipants;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresentationRoom extends BaseModel
{
    use HasFactory, BelongsToPresentation, HasManyRoomParticipants;
}

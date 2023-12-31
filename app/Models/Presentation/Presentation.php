<?php

namespace App\Models\Presentation;

use App\Models\BaseModel;
use App\Models\Relations\BelongsToUser;
use App\Models\Relations\HasManyRooms;
use App\Models\Relations\HasManySlides;
use App\Models\Relations\HasOneFolder;
use App\Models\Relations\HasOnePresentationSettings;
use App\Models\Relations\HasOnePreview;
use App\Models\Relations\HasOneRoom;
use App\Traits\ByUserScoped;
use App\Traits\TruncateStrings;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presentation extends BaseModel
{
    use HasFactory,
        ByUserScoped,
        HasOneRoom,
        HasManyRooms,
        HasOnePreview,
        HasManySlides,
        HasOneFolder,
        BelongsToUser,
        HasOnePresentationSettings,
        TruncateStrings;

    protected array $truncateStrings = [
        'name' => 100,
    ];
}

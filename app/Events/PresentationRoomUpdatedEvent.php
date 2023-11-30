<?php

namespace App\Events;

use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Slide\PresentationSlide;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationRoomUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $room_id;

    public function __construct($room_id)
    {
        $this->room_id = $room_id;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room_id);
    }
}

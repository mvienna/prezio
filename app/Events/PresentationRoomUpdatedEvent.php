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

    public PresentationRoom $room;
    public PresentationSlide|null $slide;

    public function __construct(PresentationRoom $room, PresentationSlide|null $slide)
    {
        $this->room = $room;
        $this->slide = $slide;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'data' => $this->room->toArray(),
            'slide' => $this->slide?->toArray(),
        ];
    }
}

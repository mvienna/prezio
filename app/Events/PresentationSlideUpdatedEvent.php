<?php

namespace App\Events;

use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Slide\PresentationSlide;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationSlideUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PresentationRoom $room;
    public PresentationSlide $slide;

    public function __construct(PresentationRoom $room, PresentationSlide $slide)
    {
        $this->slide = $slide;
        $this->room = $room;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'slide_id' => $this->slide->id,
        ];
    }
}

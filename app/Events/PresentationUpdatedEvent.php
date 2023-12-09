<?php

namespace App\Events;

use App\Models\Presentation\Presentation;
use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PresentationRoom $room;
    public Presentation $presentation;

    public function __construct(PresentationRoom $room, Presentation $presentation)
    {
        $this->room = $room;
        $this->presentation = $presentation;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'data' => $this->presentation->toArray(),
        ];
    }
}

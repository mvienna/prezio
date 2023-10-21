<?php

namespace App\Events;

use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationRoomPrivacyUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PresentationRoom $room;
    public bool $is_private;

    public function __construct(PresentationRoom $room, bool $is_private)
    {
        $this->room = $room;
        $this->is_private = $is_private;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'is_private' => $this->is_private,
        ];
    }
}

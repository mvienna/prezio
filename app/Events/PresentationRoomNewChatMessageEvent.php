<?php

namespace App\Events;

use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Room\PresentationRoomChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationRoomNewChatMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PresentationRoom $room;
    public PresentationRoomChatMessage $message;

    public function __construct(PresentationRoom $room, PresentationRoomChatMessage $message)
    {
        $this->room = $room;
        $this->message = $message;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
        ];
    }
}

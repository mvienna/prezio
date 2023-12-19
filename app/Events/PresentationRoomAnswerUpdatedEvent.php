<?php

namespace App\Events;

use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Slide\PresentationSlideAnswer;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationRoomAnswerUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PresentationRoom $room;
    public PresentationSlideAnswer $answer;

    public function __construct(PresentationRoom $room, PresentationSlideAnswer $answer)
    {
        $this->room = $room;
        $this->answer = $answer;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('public.room.'.$this->room->id);
    }

    public function broadcastWith(): array
    {
        return [
            'data' => $this->answer->toArray(),
        ];
    }
}

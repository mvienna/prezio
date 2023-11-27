<?php

namespace App\Console\Commands;

use App\Events\PresentationRoomUpdatedEvent;
use App\Models\Presentation\Room\PresentationRoom;
use Illuminate\Console\Command;

class UpdatePresentationRoomCountdown extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-presentation-room-countdown';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $seconds = 60;
        for ($i = 0; $i < $seconds; $i++) {
            sleep(1);

            $rooms = PresentationRoom::where('countdown', '=', 0)->get();
            foreach ($rooms as $room) {
                $room->update(['is_submission_locked' => true]);
                event(new PresentationRoomUpdatedEvent($room));
            }

            PresentationRoom::where('countdown', '>', 0)->decrement('countdown');
        }
    }
}

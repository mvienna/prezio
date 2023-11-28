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
            // fetch rooms with countdown 1s to lock submission in a second
            $rooms = PresentationRoom::where('countdown', 1)->get();

            // decrement countdown as one second has passed
            PresentationRoom::where('countdown', '>', 0)->decrement('countdown');

            // sleep for 1s and then lock submission for rooms that have just finished the countdown
            sleep(1);
            foreach ($rooms as $room) {
                $room->update(['is_submission_locked' => true]);
                event(new PresentationRoomUpdatedEvent($room));
            }
        }
    }
}

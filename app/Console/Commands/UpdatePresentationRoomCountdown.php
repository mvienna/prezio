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
    protected $description = "This command decrements all rooms countdown time each second and sends an event once the time's up";

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
//        $seconds = 60;

//        for ($i = 0; $i < $seconds; $i++) {
            $this->decrementCountdown();
            sleep(1);
//        }
    }

    private function decrementCountdown(): void
    {
        $rooms = PresentationRoom::where('countdown', '>', 0)->get();

        foreach ($rooms as $room) {
            $room->decrement('countdown');

            if ($room->countdown === 0) {
                $room->update(['is_submission_locked' => true]);
                event(new PresentationRoomUpdatedEvent($room));
            }
        }
    }
}

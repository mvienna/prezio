<?php

namespace App\Console\Commands;

use App\Models\Presentation\PresentationRoom;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TerminatePresentationRooms extends Command
{
    /**
     * @var string
     */
    protected $signature = 'app:terminate-presentation-rooms';

    /**
     * @var string
     */
    protected $description = 'Terminate all presentation rooms that were created more that 24h ago';


    public function handle()
    {
        PresentationRoom::where('created_at', '<=', Carbon::now()->subDay())->delete();
    }
}

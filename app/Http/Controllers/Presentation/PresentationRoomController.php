<?php

namespace App\Http\Controllers\Presentation;

use App\Events\PresentationRoomTerminatedEvent;
use App\Events\PresentationRoomUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\PresentationRoom;
use App\Models\Presentation\PresentationSlide;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationRoomController extends Controller
{
    /**
     * @throws \Exception
     */
    public function store (Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $room = PresentationRoom::where('presentation_id', $presentation->id)->first();

        if (!$room) {
            $room = PresentationRoom::create([
                'presentation_id' => $presentation->id,
                'token' => bin2hex(random_bytes(32)),
            ]);
        }

        return $this->jsonResponse($room->toArray());
    }

    /**
     * @throws \Exception
     */
    public function destroy (Presentation $presentation, PresentationRoom $room): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $room->update([
            'terminated_at' => Carbon::now(),
        ]);

        event(new PresentationRoomTerminatedEvent($room));

        return $this->successResponse();
    }

    /**
     * @throws \Exception
     */
    public function show(string $token): JsonResponse
    {
        $room = PresentationRoom::where('token', $token)->whereNull('terminated_at')->first();
        if (!$room) {
            throw new \Exception(trans('errors.room.notFound'));
        }

        $room->load('presentation');
        $room->presentation->load('slides', 'slides.answers', 'preview');

        return $this->jsonResponse([
            'room' => $room,
            'presentation' => $room->presentation,
            'slide' => $room->presentation['slides'][0]
        ]);
    }

    public function update(Presentation $presentation, PresentationRoom $room, Request $request): JsonResponse
    {
        $slide = PresentationSlide::find($request->slide_id);
        event(new PresentationRoomUpdatedEvent($room, $slide));

        return $this->successResponse();
    }
}

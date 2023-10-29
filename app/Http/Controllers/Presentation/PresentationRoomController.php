<?php

namespace App\Http\Controllers\Presentation;

use App\Events\PresentationRoomAnswersFormSubmittedEvent;
use App\Events\PresentationRoomNewReactionEvent;
use App\Events\PresentationRoomTerminatedEvent;
use App\Events\PresentationRoomUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Room\PresentationRoomParticipant;
use App\Models\Presentation\Room\PresentationRoomReactions;
use App\Models\Presentation\Slide\PresentationSlide;
use App\Models\Presentation\Slide\PresentationSlideAnswer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationRoomController extends Controller
{
    /*
     * room
     */
    public function store(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user?->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $room = PresentationRoom::where('presentation_id', $presentation->id)->whereNull('terminated_at')->first();

        if (!$room) {
            $room = PresentationRoom::create([
                'presentation_id' => $presentation->id,
            ]);

            PresentationRoomReactions::create([
                'room_id' => $room->id
            ]);
        }

        return $this->jsonResponse($room->toArray());
    }

    public function destroy(Presentation $presentation, PresentationRoom $room): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user?->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $room->update([
            'terminated_at' => Carbon::now(),
        ]);

        event(new PresentationRoomTerminatedEvent($room));

        return $this->successResponse();
    }

    public function show(string $token): JsonResponse
    {
        $room = PresentationRoom::where('token', $token)->whereNull('terminated_at')->first();
        if (!$room) {
            return $this->errorResponse(trans('errors.room.notFound'), 404);
        }

        $room->load('presentation', 'reactions');
        $room->presentation->load('slides', 'slides.answers', 'preview', 'settings');

        if (!$room->reactions) {
            PresentationRoomReactions::create([
                'room_id' => $room->id,
            ]);

            $room->load('reactions');
        }

        return $this->jsonResponse([
            'room' => $room,
            'presentation' => $room->presentation,
        ]);
    }

    public function update(Presentation $presentation, PresentationRoom $room, Request $request): JsonResponse
    {
        $props = [];

        // slide
        $slide_id = $request->input('slide_id');
        $slide = PresentationSlide::find($slide_id ?? $room->slide_id);
        if ($slide) {
            $props['slide_id'] = $slide->id;
        }

        // token
        if (!empty($request->token)) {
            if (strlen($request->token) > 10) {
                return $this->errorResponse(
                    trans('errors.room.invalidToken'),
                    422,
                    ['token' => $room->token]
                );
            }

            $roomWithRequestToken = PresentationRoom::where('token', $request->token);
            if ($roomWithRequestToken->exists()) {
                return $this->errorResponse(
                    trans('errors.room.tokenIsTaken'),
                    422,
                    ['token' => $room->token]
                );
            }

            $props['token'] = $request->token;
        }

        // update
        $room->update($props);
        if ($slide) {
            event(new PresentationRoomUpdatedEvent($room, $slide));
        }

        return $this->successResponse();
    }

    /*
     * reactions
     */
    public function react(Presentation $presentation, PresentationRoom $room, Request $request): JsonResponse
    {
        $validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
        $reaction = $request->input('reaction');

        $request->validate([
            'reaction' => 'required|in:' . implode(',', $validReactions),
        ]);

        if (in_array($reaction, $validReactions)) {
            $room->reactions()->increment($reaction);

            $room->load('reactions');
            event(new PresentationRoomNewReactionEvent($room, $room->reactions));
        }

        return $this->successResponse();
    }

    /*
     * answers
     */
    public function submitAnswers(Presentation $presentation, PresentationRoom $room, Request $request): JsonResponse
    {
        $user = auth()->user();

        $answers = [];
        foreach ($request->answers as $answer) {
            $sameAnswer = PresentationSlideAnswer::where('slide_id', $request->slide_id)->where('answer_data', json_encode(['text' => $answer]));

            if (!$sameAnswer->exists()) {
                $answer = PresentationSlideAnswer::create([
                    'participant_id' => $user->id,
                    'slide_id' => $request->slide_id,
                    'answer_data' => json_encode(['text' => $answer]),
                ]);

                $answers[] = $answer;
            }
        }

        event(new PresentationRoomAnswersFormSubmittedEvent($room, $answers));

        return $this->successResponse();
    }

    /*
     *  auth
     */
    public function login(Request $request): JsonResponse
    {
        $participant = PresentationRoomParticipant::find($request->participant_id);
        if (!$participant) {
            $participant = PresentationRoomParticipant::create([
                'room_id' => $request->room_id,
                'user_data' => $request->data
            ]);
        }

        $token = $participant->createToken('authToken')->plainTextToken;

        return $this->jsonResponse([
            'token' => $token,
            'participant' => $participant
        ]);
    }

    public function user(): JsonResponse
    {
        $participant = auth()->user();
        return $this->jsonResponse($participant->toArray());
    }
}

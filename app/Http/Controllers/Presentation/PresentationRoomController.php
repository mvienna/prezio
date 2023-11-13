<?php

namespace App\Http\Controllers\Presentation;

use App\Events\PresentationRoomAnswersFormSubmittedEvent;
use App\Events\PresentationRoomNewChatMessageEvent;
use App\Events\PresentationRoomNewReactionEvent;
use App\Events\PresentationRoomTerminatedEvent;
use App\Events\PresentationRoomUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Room\PresentationRoomChatMessage;
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

        $this->store($presentation);

        return $this->successResponse();
    }

    public function show(string $token): JsonResponse
    {
        $room = PresentationRoom::where('token', $token)->whereNull('terminated_at')->first();
        if (!$room) {
            return $this->errorResponse(trans('errors.room.notFound'), 404);
        }

        $room->load('presentation', 'reactions', 'messages', 'messages.participant');
        $room->presentation->load('slides', 'slides.answers', 'slides.answers.participant', 'preview', 'settings');

        if (!$room->reactions) {
            PresentationRoomReactions::create([
                'room_id' => $room->id,
            ]);

            $room->load('reactions');
        }

        $room['host'] = User::find($room->presentation->user_id);

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

        // countdown
        if (isset($request->data)) {
            if (isset($request->data['is_quiz_started'])) {
                $props['is_quiz_started'] = $request->data['is_quiz_started'];
            }

            if (isset($request->data['is_submission_locked'])) {
                $props['is_submission_locked'] = $request->data['is_submission_locked'];
            }

            if (isset($request->data['countdown'])) {
                $props['countdown'] = $request->data['countdown'];
            }
        }

        // update
        $room->update($props);

        $room->load('presentation', 'reactions', 'messages', 'messages.participant');
        $room['host'] = User::find($room->presentation->user_id);

        if ($slide) {
            event(new PresentationRoomUpdatedEvent($room));
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
        /** @var User $user */
        $user = auth()->user();

        $answers = [];
        foreach ($request->answers as $answer) {
            $slide = PresentationSlide::find($request->slide_id);

            $answer = PresentationSlideAnswer::create([
                'participant_id' => $user->id,
                'slide_id' => $slide->id,
                'slide_type' => $slide->type,
                'answer_data' => json_encode(['text' => $answer]),
                'score' => $request->score,
                'time_taken_to_answer' => $request->time_taken_to_answer
            ]);

            $answer['participant'] = $user->toArray();
            $answers[] = $answer;
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

    public function getParticipantData(): JsonResponse
    {
        $participant = auth()->user();
        return $this->jsonResponse($participant->toArray());
    }

    public function updateParticipantData(Request $request): JsonResponse
    {
        $participant = auth()->user();

        $participant->update([
           'user_data' => $request->user_data
        ]);

        return $this->jsonResponse($participant->toArray());
    }

    /*
     * chat
     */
    public function submitChatMessage(Presentation $presentation, PresentationRoom $room, Request $request): JsonResponse
    {
        /** @var User $sender */
        $sender = auth()->user();
        $type = 'default';
        if ($presentation->user_id === $sender->id) {
            if ($request->filled('participant_id')) {
                $sender = PresentationRoomParticipant::find($request->participant_id);
            } else {
                $sender = null;
            }

            if ($request->type === 'system') {
                $type = 'system';
            }
        }

        $message = PresentationRoomChatMessage::create([
            'room_id' => $room->id,
            'participant_id' => $sender?->id,
            'message' => $request->message,
            'type' => $type
        ]);

        $message->load('participant');

        event(new PresentationRoomNewChatMessageEvent($room, $message));

        return $this->successResponse();
    }
}

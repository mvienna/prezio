<?php

namespace App\Http\Controllers\Presentation;

use App\Events\PresentationRoomAnswersSubmittedEvent;
use App\Events\PresentationRoomAnswerUpdatedEvent;
use App\Events\PresentationRoomNewChatMessageEvent;
use App\Events\PresentationRoomNewReactionEvent;
use App\Events\PresentationRoomTerminatedEvent;
use App\Events\PresentationRoomUpdatedEvent;
use App\Events\PresentationSlideUpdatedEvent;
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
        $room->presentation->load('slides', 'slides.answers', 'slides.answers.participant', 'preview', 'settings'); // TODO: remove slides payload

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

        /*
         * slide
         */
        $slide = null;
        if ($request->filled('slide_id') && $room->slide_id !== $request->input('slide_id')) {
            $slide = PresentationSlide::select('id', 'type', 'settings_data')->find($request->input('slide_id'));
            if ($slide) {
                $props['slide_id'] = $slide->id;
                $presentation->settings()->update([
                    'last_slide_id' => $slide->id
                ]);

                event(new PresentationSlideUpdatedEvent($presentation->room, $slide));
            }
        }

        /*
         * token
         */
        if ($request->filled('token')) {
            // validate length
            if (strlen($request->token) > 10) {
                return $this->errorResponse(
                    trans('errors.room.invalidToken'),
                    422,
                    ['token' => $room->token]
                );
            }

            // check for uniqueness
            $roomWithRequestToken = PresentationRoom::where('token', $request->input('token'));
            if ($roomWithRequestToken->exists()) {
                return $this->errorResponse(
                    trans('errors.room.tokenIsTaken'),
                    422,
                    ['token' => $room->token]
                );
            }

            $props['token'] = $request->token;
        }

        /*
         * quiz data
         */
        if ($request->filled('is_quiz_started')) {
            $props['is_quiz_started'] = $request->input('is_quiz_started');
        }

        if ($request->filled('is_submission_locked')) {
            $props['is_submission_locked'] = $request->input('is_submission_locked');
        }

        if ($request->filled('is_answers_revealed')) {
            $props['is_answers_revealed'] = $request->input('is_answers_revealed');
        }

        if ($request->filled('countdown')) {
            if ($request->filled('sentAt')) {
                $currentTime = Carbon::now();
                $sentAt = Carbon::parse($request->input('sentAt'));
                $timeDifferenceInSeconds = $currentTime->diffInSeconds($sentAt);
                // $currentTime = Carbon::now();
                // $timeDifferenceInSeconds = ($currentTime->valueOf() - $request->data['sentAt']) / 1000;
                $props['countdown'] = $request->input('countdown') - $timeDifferenceInSeconds;
            } else {
                $props['countdown'] = $request->input('countdown');
            }

            $props['countdown_started_at'] = Carbon::now();
        }

        /*
         * update
         */
        $room->update($props);
        if (!$request->filled('disableNotification')) {
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
//        if ($room->is_submission_locked) {
//            return $this->errorResponse(trans('errors.room.submissionIsLocked'));
//        }

        $slide = PresentationSlide::find($request->slide_id);
        $participant = PresentationRoomParticipant::find($request->input('participant_id'));

        $answers = [];
        foreach ($request->answers as $answer) {
            $answer = PresentationSlideAnswer::create([
                'participant_id' => $participant->id,
                'slide_id' => $slide->id,
                'slide_type' => $slide->type,
                'answer_data' => json_encode(['text' => $answer]),
                'score' => $request->input('score'),
                'time_taken_to_answer' => $request->input('time_taken_to_answer')
            ]);

            $answer['participant'] = $participant->toArray();
            $answers[] = $answer;
        }

        event(new PresentationRoomAnswersSubmittedEvent($room, $answers));

        return $this->jsonResponse($answers);
    }

    public function updateAnswer(Presentation $presentation, PresentationRoom $room, PresentationSlideAnswer $answer, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user?->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $answer->update([
            'answer_data' => $request->answer_data,
            'score' => $request->score,
        ]);

        $answer->load('participant');
        event(new PresentationRoomAnswerUpdatedEvent($room, $answer));

        return $this->successResponse();
    }

    /*
     * auth
     */
    public function login(Request $request): JsonResponse
    {
        $participant = PresentationRoomParticipant::create([
            'room_id' => $request->room_id,
            'user_data' => $request->data,
            'is_guest' => $request->is_guest
        ]);
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
            'user_data' => $request->data,
            'is_guest' => false
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

<?php

namespace App\Http\Controllers\Presentation\Slide;

use App\Events\PresentationRoomParticipantsErasedEvent;
use App\Events\PresentationRoomUpdatedEvent;
use App\Events\PresentationSlideUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\Slide\PresentationSlide;
use App\Models\Presentation\Slide\PresentationSlideAnswer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideAnswerController extends Controller
{
    public function store(PresentationSlide $slide, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $answer = PresentationSlideAnswer::create([
            'user_id' => $user->id,
            'slide_id' => $slide->id,
            'answer_data' => $request->answer_data
        ]);

        return $this->jsonResponse($answer->toArray());
    }

    public function destroy(PresentationSlide $slide, PresentationSlideAnswer $answer): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $slide->load('presentation');
        if ($slide->presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $answer->delete();
        return $this->successResponse();
    }

    public function resetSlideAnswers(PresentationSlide $slide): JsonResponse
    {
        $slide->load('presentation', 'presentation.room');

        /** @var User $user */
        $user = auth()->user();
        if ($slide->presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $slide->answers()->delete();

        $slide->presentation->room()?->update([
            'is_quiz_started' => false,
            'is_submission_locked' => true
        ]);

        if ($slide->presentation?->room?->slide_id === $slide->id) {
            event(new PresentationSlideUpdatedEvent($slide->presentation->room, $slide));
        }

        return $this->successResponse();
    }

    public function resetPresentationAnswers(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $presentation->load('slides', 'room');
        foreach ($presentation->slides as $slide) {
            $slide->answers()->delete();

            if ($presentation->room?->slide_id === $slide->id) {
                event(new PresentationSlideUpdatedEvent($presentation->room, $slide));
            }
        }

        if ($presentation->room) {
            $presentation->room?->messages()?->delete();
            $presentation->room?->reactions()?->delete();
            $presentation->room?->participants()?->delete();

            $presentation->room?->update([
                'is_quiz_started' => false,
                'is_submission_locked' => true,
                'countdown' => 0
            ]);

            $presentation->room->load('messages', 'reactions');
            event(new PresentationRoomUpdatedEvent($presentation->room));
            event(new PresentationRoomParticipantsErasedEvent($presentation->room));
        }

        return $this->successResponse();
    }
}

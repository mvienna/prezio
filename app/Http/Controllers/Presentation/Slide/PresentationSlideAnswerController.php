<?php

namespace App\Http\Controllers\Presentation\Slide;

use App\Events\PresentationRoomUpdatedEvent;
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

        if ($slide->presentation?->room) {
            event(new PresentationRoomUpdatedEvent($slide->presentation->room));
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
        }

        $presentation->room?->messages()?->delete();
//        $presentation->room?->reactions()?->delete();
        $presentation->room?->participants()?->delete();

        $presentation->room()?->update([
            'is_quiz_started' => false,
            'is_submission_locked' => true
        ]);

        if ($presentation?->room) {
            event(new PresentationRoomUpdatedEvent($presentation->room));
        }

        return $this->successResponse();
    }
}

<?php

namespace App\Http\Controllers\Presentation\Slide;

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
        $slide->load('presentation');

        /** @var User $user */
        $user = auth()->user();
        if ($slide->presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $slide->answers()->delete();
        return $this->successResponse();
    }

    public function resetPresentationAnswers(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $presentation->load('slides');
        foreach ($presentation->slides as $slide) {
            $slide->answers()->delete();
        }

        return $this->successResponse();
    }
}

<?php

namespace App\Http\Controllers\Presentation;

use App\Http\Controllers\Controller;
use App\Models\Presentation\PresentationSlide;
use App\Models\Presentation\PresentationSlideAnswer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideAnswerController extends Controller
{
    public function store (PresentationSlide $slide, Request $request): JsonResponse
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

    /**
     * @throws \Exception
     */
    public function destroy (PresentationSlide $slide, PresentationSlideAnswer $answer): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        $slide->load('presentation');
        if ($slide->presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $answer->delete();
        return $this->successResponse();
    }
}

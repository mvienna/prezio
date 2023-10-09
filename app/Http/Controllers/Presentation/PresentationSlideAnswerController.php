<?php

namespace App\Http\Controllers\Presentation;

use App\Http\Controllers\Controller;
use App\Models\PresentationSlide;
use App\Models\PresentationSlideAnswer;
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

    public function destroy (PresentationSlide $slide, PresentationSlideAnswer $answer): JsonResponse
    {
        $answer->delete();
        return $this->successResponse();
    }
}

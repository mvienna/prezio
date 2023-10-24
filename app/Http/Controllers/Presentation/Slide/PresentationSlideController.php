<?php

namespace App\Http\Controllers\Presentation\Slide;

use App\Events\PresentationRoomUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\Room\PresentationRoom;
use App\Models\Presentation\Slide\PresentationSlide;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideController extends Controller
{
    public function store(Presentation $presentation, Request $request): JsonResponse
    {
        $slide = PresentationSlide::create([
            'presentation_id' => $presentation->id,
            'canvas_data' => $request->canvas_data,
            'order' => $request->order,
            'type' => $request->type,
        ]);

        $presentation->settings()->update([
            'last_slide_id' => $slide->id
        ]);

        return $this->jsonResponse($slide->toArray());
    }

    public function update(Presentation $presentation, PresentationSlide $slide, Request $request): JsonResponse
    {
        $slide->update([
            'canvas_data' => $request->canvas_data,
            'preview' => $request->preview,
            'order' => $request->order,
            'type' => $request->type,
            'settings_data' => $request->settings_data,
            'notes' => $request->notes,
            'animation' => $request->animation,
        ]);

        $presentation->settings()->update([
            'last_slide_id' => $request->last_slide_id
        ]);

        return $this->successResponse();
    }

    public function updateSlides(Presentation $presentation, Request $request): JsonResponse
    {
        foreach ($request->slides as $slide) {
            PresentationSlide::find($slide['id'])->update([
                'order' => $slide['order']
            ]);
        }

        $presentation->load('slides');
        return $this->jsonResponse($presentation->toArray());
    }

    public function destroy(Presentation $presentation, PresentationSlide $slide): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $slide->load('template');
        if ($slide->template) {
            $slide->template->delete();
        }

        $presentation->load('settings');
        if ($presentation->settings?->last_slide_id === $slide->id) {
            $presentation->settings()->update([
                'last_slide_id' => null
            ]);
        }

        $room = PresentationRoom::where('slide_id', $slide->id)->whereNull('terminated_at')->first();
        if ($room) {
            $room->update([
                'slide_id' => null,
            ]);
        }

        $slide->delete();
        return $this->successResponse();
    }
}

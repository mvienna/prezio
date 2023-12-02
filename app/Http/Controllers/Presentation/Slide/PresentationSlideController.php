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
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $slide = PresentationSlide::create([
            'presentation_id' => $presentation->id,
            'canvas_data' => $request->canvas_data,
            'order' => $request->order,
            'type' => $request->type,
        ]);

        $presentation->settings()->update([
            'last_slide_id' => $slide->id
        ]);

        return $this->show($presentation, $slide);
    }

    public function update(Presentation $presentation, PresentationSlide $slide, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

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

        $presentation->load('room');
        if ($presentation->room && $slide->id === $presentation->room->slide_id) {
            event(new PresentationRoomUpdatedEvent($presentation->room)); // TODO: pass updated slide data
        }

        return $this->successResponse();
    }

    public function updateSlides(Presentation $presentation, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        foreach ($request->slides as $slide) {
            $data = [];

            if (isset($slide['order'])) {
                $data['order'] = $slide['order'];
            }

            if (isset($slide['settings_data'])) {
                $data['settings_data'] = $slide['settings_data'];
            }

            PresentationSlide::find($slide['id'])->update($data);
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

        $slide->template()->delete();
        $slide->answers()->delete();

        $presentation->load('settings', 'room');
        if ($presentation->settings?->last_slide_id === $slide->id) {
            $presentation->settings()->update([
                'last_slide_id' => null
            ]);
        }

        PresentationRoom::where('slide_id', $slide->id)->update([
            'slide_id' => null,
        ]);

        $slide->delete();
        return $this->successResponse();
    }

    public function show(Presentation $presentation, PresentationSlide $slide): JsonResponse
    {
        $slide->load('template', 'answers', 'answers.participant');
        return $this->jsonResponse($slide->toArray());
    }
}

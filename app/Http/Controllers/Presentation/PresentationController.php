<?php

namespace App\Http\Controllers\Presentation;

use App\Events\PresentationRoomPrivacyUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Presentation\Slide\PresentationSlideController;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\PresentationSettings;
use App\Models\Presentation\Slide\PresentationSlide;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $presentation = Presentation::create([
            'folder_id' => $request->folder_id,
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $user->id,
            'is_private' => $request->is_private,
        ]);

        PresentationSlide::create([
            'presentation_id' => $presentation->id
        ]);

        PresentationSettings::create([
            'presentation_id' => $presentation->id,
        ]);

        $presentation->load('slides', 'settings');

        return $this->jsonResponse($presentation->toArray());
    }

    public function update(Presentation $presentation, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        // send event to room channel to inform about privacy setting change
        $presentation->load('room');
        if ($presentation->room && $presentation->is_private !== $request->is_private) {
            event(new PresentationRoomPrivacyUpdatedEvent($presentation->room, $request->is_private));
        }

        $presentation->update([
            'folder_id' => $request->folder_id,
            'name' => $request->name,
            'description' => $request->description,
            'preview_id' => $request->preview_id,
            'is_private' => $request->is_private,
        ]);

        $presentation->settings()->update([
            'lang' => $request->settings['lang'],
            'require_participants_info' => $request->settings['require_participants_info'],
            'participants_info_form_title' => $request->settings['participants_info_form_title'],
            'participants_info_form_fields_data' => $request->settings['participants_info_form_fields_data'],
        ]);

        return $this->jsonResponse($presentation->toArray());
    }

    public function destroy(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $presentation->load('settings', 'slides', 'rooms');

        // delete presentation slides
        foreach ($presentation->slides as $slide) {
            app(PresentationSlideController::class)->destroy($presentation, $slide);
        }

        // delete presentation rooms, participants data, reactions
        foreach ($presentation->rooms as $room) {
            $room->participants()->delete();
            $room->reactions()->delete();
            $room->delete();
        }

        // delete presentation settings
        $presentation->settings()->delete();

        // delete presentation
        $presentation->delete();

        return $this->successResponse();
    }

    public function show(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $presentation->load('slides', 'slides.template', 'slides.answers', 'preview', 'room', 'settings');

        if (!$presentation->settings) {
            PresentationSettings::create([
                'presentation_id' => $presentation->id,
            ]);

            $presentation->load('settings');
        }

        return $this->jsonResponse($presentation->toArray());
    }

    public function get(Request $request): JsonResponse
    {
        /*
         * pagination & other params
         */
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'updated_at');
        $descending = filter_var($request->query('descending', false), FILTER_VALIDATE_BOOLEAN);

        $folder_id = $request->query('folder_id', null);
        $offset = ($page - 1) * $limit;

        $userHasPresentations = Presentation::byUser()->count() > 0;

        /*
         * query
         */
        $query = Presentation::byUser()
            ->with(['slides' => function ($query) {
                $query->select('id', 'presentation_id', 'updated_at');
            }])
            ->with('preview', 'settings');

        $query = $query->where('folder_id', $folder_id);
        $totalFiltered = $query->count();

        $query = $descending ? $query->orderByDesc($sortBy) : $query->orderBy($sortBy);
        $presentations = $query
            ->skip($offset)
            ->take($limit)
            ->get()
            ->toArray();

        /*
         * preview
         */
        foreach ($presentations as &$presentation) {
            if (!isset($presentation['preview']) && isset($presentation['slides'][0])) {
                $slide_id = $presentation['slides'][0]['id'];
                $slide = PresentationSlide::select('preview')->find($slide_id);

                if ($slide) {
                    $presentation['preview'] = $slide->preview;
                }
            }
        }

        return $this->jsonResponse([
            'rows' => $presentations,
            'total' => $totalFiltered,
            'userHasPresentations' => $userHasPresentations
        ]);
    }
}

<?php

namespace App\Http\Controllers\Presentation;

use App\Http\Controllers\Controller;
use App\Models\Presentation;
use App\Models\PresentationSlide;
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
        $presentation->load('slides');

        return $this->jsonResponse($presentation->toArray());
    }

    public function update(Presentation $presentation, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $presentation->update([
            'folder_id' => $request->folder_id,
            'name' => $request->name,
            'description' => $request->description,
            'preview_id' => $request->preview_id,
            'is_private' => $request->is_private,
            'lang' => $request->lang,
        ]);

        return $this->jsonResponse($presentation->toArray());
    }

    public function destroy(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $presentation->load('slides');
        foreach ($presentation->slides as $slide) {
            app(PresentationSlideController::class)->destroy($presentation, $slide);
        }

        $presentation->delete();

        return $this->successResponse();
    }

    /**
     * @throws \Exception
     */
    public function show(Presentation $presentation): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($presentation->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $presentation->load('slides', 'slides.template', 'slides.answers', 'preview');
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
            ->with('preview');

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

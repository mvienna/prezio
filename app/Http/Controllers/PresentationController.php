<?php

namespace App\Http\Controllers;

use App\Models\Presentation;
use App\Models\PresentationSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
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
        $user = auth()->user();
        if ($presentation->user_id !== $user->id) {
            throw new \Exception(trans('errors.presentation.accessDenied'));
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
        $user = auth()->user();
        if ($presentation->user_id !== $user->id) {
            throw new \Exception(trans('errors.presentation.accessDenied'));
        }

        PresentationSlide::where('presentation_id', $presentation->id)->delete();
        $presentation->delete();

        return $this->successResponse();
    }

    /**
     * @throws \Exception
     */
    public function show(Presentation $presentation): JsonResponse
    {
        $user = auth()->user();
        if ($presentation->user_id !== $user->id) {
            throw new \Exception(trans('errors.presentation.accessDenied'));
        }

        $presentation->load('slides', 'preview');
        return $this->jsonResponse($presentation->toArray());
    }

    public function get(): JsonResponse
    {
        $presentations = Presentation::forUser()
            ->with(['slides' => function ($query) {
                $query->select('id', 'presentation_id', 'updated_at');
            }])
            ->with('preview')
            ->get()
            ->toArray();

        foreach ($presentations as &$presentation) {
            if (!isset($presentation['preview'])) {
                $slide_id = $presentation['slides'][0]['id'];
                $slide = PresentationSlide::select('preview')->find($slide_id);

                if ($slide) {
                    $presentation['preview'] = $slide->preview;
                }
            }
        }

        return $this->jsonResponse($presentations);
    }
}

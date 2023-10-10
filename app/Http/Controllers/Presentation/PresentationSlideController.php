<?php

namespace App\Http\Controllers\Presentation;

use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\PresentationSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideController extends Controller
{
    public function store (Presentation $presentation, Request $request): JsonResponse
    {
        $slide = PresentationSlide::create([
            'presentation_id' => $presentation->id,
            'canvas_data' => $request->canvas_data,
            'order' => $request->order,
            'type' => $request->type,
        ]);

        return $this->jsonResponse($slide->toArray());
    }

    public function update (Presentation $presentation, PresentationSlide $slide, Request $request): JsonResponse
    {
        $slide->update([
            'canvas_data' => $request->canvas_data,
            'preview' => $request->preview,
            'order' => $request->order,
            'type' => $request->type,
            'notes' => $request->notes,
            'animation' => $request->animation,
        ]);
        $presentation->load('slides');

        return $this->successResponse();
    }

    public function updateSlides (Presentation $presentation, Request $request): JsonResponse
    {
        foreach ($request->slides as $slide) {
            PresentationSlide::find($slide['id'])->update([
                'order' => $slide['order']
            ]);
        }

        $presentation->load('slides');

        return $this->jsonResponse($presentation->toArray());
    }

    public function destroy (Presentation $presentation, PresentationSlide $slide): JsonResponse
    {
        $slide->load('template');
        if ($slide->template) {
            $slide->template->delete();
        }

        $slide->delete();
        $presentation->load('slides');

        return $this->successResponse();
    }
}

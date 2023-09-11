<?php

namespace App\Http\Controllers;

use App\Models\Presentation;
use App\Models\PresentationSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideController extends Controller
{
    public function store (Presentation $presentation): JsonResponse
    {
        $presentation->load('slides');
        $slide = PresentationSlide::create([
            'presentation_id' => $presentation->id,
            'order' => count($presentation->slides),
        ]);

        return $this->jsonResponse($slide->toArray());
    }

    public function update (Presentation $presentation, PresentationSlide $slide, Request $request): JsonResponse
    {
        $slide->update([
            'canvas_data' => $request->canvas_data,
            'order' => $request->order,
            'notes' => $request->notes,
            'animation' => $request->animation,
        ]);
        $presentation->load('slides');

        return $this->jsonResponse($presentation->toArray());
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
        $slide->delete();
        $presentation->load('slides');

        return $this->jsonResponse($presentation->toArray());
    }
}

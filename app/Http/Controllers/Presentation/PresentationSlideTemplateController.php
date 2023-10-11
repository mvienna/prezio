<?php

namespace App\Http\Controllers\Presentation;

use App\Enums\PresentationSlideTemplateCategoryType;
use App\Http\Controllers\Controller;
use App\Models\Presentation\PresentationSlideTemplate;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationSlideTemplateController extends Controller
{
    public function store (Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $template = PresentationSlideTemplate::create([
            'user_id' => $request->category ? null : $user->id,
            'slide_id' => $request->slide_id,
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category ?? PresentationSlideTemplateCategoryType::CUSTOM->value,
            'is_private' => $request->is_private,
        ]);

        $template->load(['slide', 'user']);

        return $this->jsonResponse($template->toArray());
    }

    /**
     * @throws \Exception
     */
    public function update (PresentationSlideTemplate $slideTemplate, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($slideTemplate->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $slideTemplate->update([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category ?? PresentationSlideTemplateCategoryType::CUSTOM->value,
            'is_private' => $request->is_private,
        ]);

        return $this->jsonResponse($slideTemplate->toArray());
    }

    /**
     * @throws \Exception
     */
    public function destroy (PresentationSlideTemplate $slideTemplate): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($slideTemplate->user_id !== $user->id && !$user->isAdmin()) {
            throw new \Exception(trans('errors.accessDenied'));
        }

        $slideTemplate->delete();
        return $this->successResponse();
    }

    public function get(Request $request): JsonResponse
    {
        $query = '%' . $request->query('query') . '%';

        $templates = PresentationSlideTemplate::where(function ($queryBuilder) use ($query) {
            $queryBuilder
                ->where(function ($subQueryBuilder) use ($query) {
                    $subQueryBuilder->byPrezio()
                        ->where('name', 'LIKE', $query);
                })
                ->orWhere(function ($subQueryBuilder) use ($query) {
                    $subQueryBuilder->byUser()
                        ->where('category', PresentationSlideTemplateCategoryType::CUSTOM->value)
                        ->where('name', 'LIKE', $query);
                })
                ->orWhere(function ($subQueryBuilder) use ($query) {
                    $subQueryBuilder->public()
                        ->where('category', PresentationSlideTemplateCategoryType::CUSTOM->value)
                        ->where('name', 'LIKE', $query);
                });
        })
            ->with('slide')
            ->with(['user' => function ($query) {
                $query->select('id', 'name');
            }])
            ->get();

        return $this->jsonResponse($templates->toArray());
    }
}

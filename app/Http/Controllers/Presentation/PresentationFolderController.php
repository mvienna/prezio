<?php

namespace App\Http\Controllers\Presentation;

use App\Http\Controllers\Controller;
use App\Models\Presentation\Presentation;
use App\Models\Presentation\PresentationFolder;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresentationFolderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();

        $folder = PresentationFolder::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        Presentation::whereIn('id', $request->presentations_ids)->update(['folder_id' => $folder->id]);

        return $this->jsonResponse($folder->toArray());
    }

    public function update(PresentationFolder $folder, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($folder->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        $folder->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return $this->jsonResponse($folder->toArray());
    }

    public function destroy(PresentationFolder $folder): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($folder->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        Presentation::where('folder_id', $folder->id)->update(['folder_id' => null]);
        $folder->delete();

        return $this->successResponse();
    }

    public function get(): JsonResponse
    {
        $folders = PresentationFolder::byUser()->orderBy('created_at', 'desc')->get();
        return $this->jsonResponse($folders->toArray());
    }

    public function show(PresentationFolder $folder): JsonResponse
    {
        /** @var User $user */
        $user = auth()->user();
        if ($folder->user_id !== $user->id && !$user->isAdmin()) {
            return $this->errorResponse(trans('errors.accessDenied'), 403);
        }

        return $this->jsonResponse($folder->toArray());
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Presentation;
use App\Models\PresentationFolder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PresentationFolderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        $folder = PresentationFolder::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'is_private' => $request->is_private,
        ]);

        Presentation::whereIn('id', $request->presentations_ids)->update(['folder_id' => $folder->id]);

        return $this->jsonResponse($folder->toArray());
    }

    public function update(PresentationFolder $folder, Request $request)
    {
        $user = auth()->user();
        if ($folder->user_id !== $user->id) {
            throw new \Exception(trans('errors.folder.accessDenied'));
        }

        $folder->update([
            'name' => $request->name,
            'description' => $request->description,
            'is_private' => $request->is_private,
        ]);

        return $this->jsonResponse($folder->toArray());
    }

    public function destroy(PresentationFolder $folder): JsonResponse
    {
        $user = auth()->user();
        if ($folder->user_id !== $user->id) {
            throw new \Exception(trans('errors.folder.accessDenied'));
        }

        Presentation::where('folder_id', $folder->id)->update(['folder_id' => null]);
        $folder->delete();

        return $this->successResponse();
    }

    public function get(): JsonResponse
    {
        $folders = PresentationFolder::forUser()->orderBy('created_at', 'desc')->get();
        return $this->jsonResponse($folders->toArray());
    }

    public function show(PresentationFolder $folder): JsonResponse
    {
        $user = auth()->user();
        if ($folder->user_id !== $user->id) {
            throw new \Exception(trans('errors.folder.accessDenied'));
        }

        return $this->jsonResponse($folder->toArray());
    }
}
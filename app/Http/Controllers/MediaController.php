<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Image\Image;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    /*
     * store
     */
    public function store (Request $request): jsonResponse
    {
        $modelType = $request->input('model_type');
        $modelId = $request->input('model_id');
        $collection = $request->input('collection');

        $unsplash_image_data = $request->input('unsplash_image_data');

        $model = $modelType::findOrFail($modelId);
        $media = $model;

        // add from unsplash
        if ($unsplash_image_data) {
            $media = $media
                ->addMediaFromUrl($unsplash_image_data['urls']['regular'])
                ->usingName($unsplash_image_data['slug']);

        // upload from the computer
        } else {
            $media = $media
                ->addMediaFromRequest('file')
                ->usingName($request->file('file')->getClientOriginalName())
                ->usingFileName(uniqid() . '.' . $request->file('file')->getClientOriginalExtension());
        }

        $media = $media->toMediaCollection($collection);

        // compress & optimize
        $imagePath = $media->getPath();

        Image::load($imagePath)
            ->width(1920)
            ->optimize()
            ->save($imagePath);

        return $this->jsonResponse($media->toArray());
    }

    /*
     * get
     */
    public function get(): jsonResponse
    {
        $user = auth()->user();
        $media = $user->getMedia()->toArray();

        return $this->jsonResponse($media);
    }

    public function getImageByUrlQuery(Request $request): JsonResponse
    {
        $url = $request->query('url');

        $image = file_get_contents($url);
        $base64 = base64_encode($image);

        return $this->jsonResponse(['base64' => $base64]);
    }

    /*
     * delete
     */
    public function deletePermanently($file_id): jsonResponse
    {
        $media = Media::find($file_id);

        if ($media) {
            $media->forceDelete();
            return $this->successResponse();
        }

        return $this->errorResponse(trans('errors.media.fileNotFound'));
    }

    public function moveToTrash (Request $request): JsonResponse
    {
        $media = Media::find($request->file_id);

        if ($media) {
            $media->delete();
            return $this->successResponse();
        }

        return $this->errorResponse(trans('errors.media.fileNotFound'));

    }

    public function restoreFromTrash(Request $request): JsonResponse
    {
        $media = Media::find($request->file_id);

        if ($media) {
            $media->restore();
            return $this->successResponse();
        }

        return $this->errorResponse(trans('errors.media.fileNotFound'));
    }

    /*
     * download
     */
    public function download(Media $media): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        return response()->download($media->getPath(), $media->file_name);
    }
}

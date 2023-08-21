<?php

namespace App\Services\MediaLibrary;

use App\Models\User;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        switch ($media->model_type) {
            case User::class:
                $user = User::findOrFail($media->model_id);

                return sprintf('%s/%s/%s',
                    'users',
                    $user->id,
                    $media->file_name
                ).'/';
        }
    }

    public function getPathForConversions(Media $media): string
    {
        $path = $this->getPath($media);
        return "{$path}/{$media->file_name}";
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        $path = $this->getPath($media);
        return "{$path}/{$media->file_name}";
    }
}

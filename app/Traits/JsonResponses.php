<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait JsonResponses
{
    protected function jsonResponse(array $data, $statusCode = 200): JsonResponse
    {
        return response()->json($data)->setStatusCode($statusCode);
    }

    protected function successResponse(): JsonResponse
    {
        return $this->jsonResponse([
            'success' => true,
        ]);
    }

    protected function errorResponse(string $error, $statusCode = 500): JsonResponse
    {
        return $this->jsonResponse([
            'success' => false,
            'message'  => $error,
        ], $statusCode);
    }
}

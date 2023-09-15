<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PresentationController;
use App\Http\Controllers\PresentationSlideController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;

/*
 * user
 */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
 * restore password
 */
Route::post('/email/verification-code/send', [VerificationController::class, 'sendVerificationCode']);
Route::post('/email/verification-code/check', [VerificationController::class, 'checkVerificationCode']);

/*
 * authenticated
 */
Route::middleware('auth:sanctum')->group(function () {
    /*
     * user
     */
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/user', [AuthController::class, 'update']);

    /*
     * media
     */
    Route::post('/media', [MediaController::class, 'store']);
    Route::get('/media', [MediaController::class, 'get']);
    Route::delete('/media/{file_id}', [MediaController::class, 'deletePermanently']);
    Route::get('/image', [MediaController::class, 'getImageByUrlQuery']); // ?url=

    /*
     * presentation(s)
     * slide(s)
     */
    Route::resource('/presentation', PresentationController::class)->only(['store', 'update', 'destroy', 'show']);
    Route::get('/presentations', [PresentationController::class, 'get']);

    Route::resource('/presentation/{presentation}/slide', PresentationSlideController::class)->only(['store', 'update', 'destroy']);
    Route::patch('/presentation/{presentation}/slides', [PresentationSlideController::class, 'updateSlides']);
});

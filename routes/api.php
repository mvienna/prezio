<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\Presentation\PresentationController;
use App\Http\Controllers\Presentation\PresentationFolderController;
use App\Http\Controllers\Presentation\PresentationRoomController;
use App\Http\Controllers\Presentation\Slide\PresentationSlideAnswerController;
use App\Http\Controllers\Presentation\Slide\PresentationSlideController;
use App\Http\Controllers\Presentation\Slide\PresentationSlideTemplateController;
use App\Http\Controllers\User\AuthController;
use App\Http\Controllers\User\VerificationController;
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
 * room
 */
Route::get('/room/{token}', [PresentationRoomController::class, 'show']);
Route::post('/room/login', [PresentationRoomController::class, 'login']);

/*
 * authenticated
 */
Route::middleware('auth:sanctum')->group(function () {
    /*
     * user
     */
    Route::get('/user', [AuthController::class, 'user']);
    Route::patch('/user', [AuthController::class, 'update']);

    Route::get('/user/room', [PresentationRoomController::class, 'getParticipantData']);
    Route::patch('/user/room', [PresentationRoomController::class, 'updateParticipantData']);

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
     * media
     */
    Route::post('/media', [MediaController::class, 'store']);
    Route::get('/media', [MediaController::class, 'get']);
    Route::delete('/media/{file_id}', [MediaController::class, 'deletePermanently']);
    Route::get('/image', [MediaController::class, 'getImageByUrlQuery']); // ?url=

    /*
     * folder(s)
     * presentation(s)
     * slide(s)
     * slide template(s)
     * slide answer
     * room
     */
    Route::resource('/folder', PresentationFolderController::class)->only(['store', 'update', 'destroy', 'show']);
    Route::get('/folders', [PresentationFolderController::class, 'get']);

    Route::resource('/presentation', PresentationController::class)->only(['store', 'update', 'destroy', 'show']);
    Route::get('/presentations', [PresentationController::class, 'get']);

    Route::resource('/presentation/{presentation}/slide', PresentationSlideController::class)->only(['store', 'update', 'destroy', 'show']);
    Route::patch('/presentation/{presentation}/slides', [PresentationSlideController::class, 'updateSlides']);

    Route::resource('/slide-template', PresentationSlideTemplateController::class)->only(['store', 'update', 'destroy']);
    Route::get('/slide-templates', [PresentationSlideTemplateController::class, 'get']);

    Route::resource('/presentation/slide/{slide}/answer', PresentationSlideAnswerController::class)->only(['store', 'destroy']);
    Route::delete('/presentation/slide/{slide}/answers', [PresentationSlideAnswerController::class, 'resetSlideAnswers']);
    Route::delete('/presentation/{presentation}/answers', [PresentationSlideAnswerController::class, 'resetPresentationAnswers']);

    Route::resource('/presentation/{presentation}/room', PresentationRoomController::class)->only(['store', 'update', 'destroy']);
    Route::post('/presentation/{presentation}/room/{room}/react', [PresentationRoomController::class, 'react']);
    Route::post('/presentation/{presentation}/room/{room}/submit-answers', [PresentationRoomController::class, 'submitAnswers']);
    Route::post('/presentation/{presentation}/room/{room}/message', [PresentationRoomController::class, 'submitChatMessage']);
});

Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});

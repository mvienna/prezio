<?php

use App\Http\Controllers\AuthController;
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
});

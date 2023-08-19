<?php

namespace App\Http\Controllers;

use App\Mail\VerificationCodeMail;
use App\Models\User;
use App\Repositories\VerificationCodeRepository;
use App\Services\EmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request, VerificationCodeRepository $codeRepository): JsonResponse {
        $user = User::where('email', $request->email);
        if (!$user->exists()) {
            return $this->errorResponse(trans('errors.verification.userNotFound'), 422);
        }

        $codeRepository->setAllCodesAsExpired($request->email);
        $code = $codeRepository->generateCode($request->email);
        $recipient = EmailService::getRecipient($request->email);
        Mail::to($recipient)->send(new VerificationCodeMail($code));

        return $this->successResponse();
    }

    public function checkVerificationCode(Request $request, VerificationCodeRepository $codeRepository): JsonResponse
    {
        $codeModel = $codeRepository->findByCodeAndEmailNotExpired($request->code, $request->email);

        if ($codeModel) {
            $codeModel->update([
                'expires_at' => now(),
            ]);

            $user = User::where('email', $request->email)->first();
            $token = $user->createToken('password-reset')->plainTextToken;

            return $this->jsonResponse(['token' => $token]);
        }

        return $this->errorResponse(trans('errors.verification.invalidCode'), 422);
    }
}

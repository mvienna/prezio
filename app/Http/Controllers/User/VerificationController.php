<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
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
        /*
         * check email for existence if it's not a new one
         */
        if (!$request->isNewEmail) {
            $user = User::where('email', $request->email);
            if (!$user->exists()) {
                return $this->errorResponse(trans('errors.verification.userNotFound'), 422);
            }
        }

        /*
         * generate & send verification code
         */
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
            /*
             * set code as expired
             */
            $codeModel->update([
                'expires_at' => now(),
            ]);

            /*
             * generate temp token for changing the password
             */
            if ($request->generateTempToken) {
                $user = User::where('email', $request->email)->first();
                $token = $user->createToken('passwordReset')->plainTextToken;

                return $this->jsonResponse(['token' => $token]);
            }

            return $this->successResponse();
        }

        return $this->errorResponse(trans('errors.verification.invalidCode'), 422);
    }
}

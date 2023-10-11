<?php

namespace App\Services;

class EmailService
{
    /**
     * @throws \Exception
     */
    public static function getRecipient($originalRecipient)
    {
        if (config('app.env') !== 'production') {
            if (!env('MAIL_DEV_RECIPIENT')) {
                throw new \Exception(trans('errors.email.missingDevRecipientEmail'));
            }

            return env('MAIL_DEV_RECIPIENT');
        }

        return $originalRecipient;
    }
}

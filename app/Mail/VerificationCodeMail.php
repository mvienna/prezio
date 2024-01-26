<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public int $verificationCode;

    /**
     * Create a new message instance.
     */
    public function __construct(int $verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->subject(trans('emails.verificationCode.title'))
            ->view('emails.verificationCode')
            ->with([
                'verificationCode' => $this->verificationCode,
                'brand' => env('APP_NAME', 'Prezio'),
                'url' => env('FRONTEND_APP_URL', 'https://app.prezio.ru').'/login',
                'telegram_url' => env('TELEGRAM_URL', 'https://t.me/preziorus'),
                'instagram_url' => env('INSTAGRAM_URL', 'https://www.instagram.com/prezio.ru/'),
            ]);
    }
}

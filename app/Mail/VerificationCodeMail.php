<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationCode;

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
            ]);
    }
}

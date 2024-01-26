<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;

    /**
     * Create a new message instance.
     */
    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * Build the message.
     * @return $this
     */
    public function build()
    {
        return $this->subject(trans('emails.welcome.title', ['name' => $this->name]))
            ->view('emails.welcome')
            ->with([
                'name' => $this->name,
                'url' => env('FRONTEND_APP_URL', 'https://app.prezio.ru').'/login',
                'telegram_url' => env('TELEGRAM_URL', 'https://t.me/preziorus'),
                'instagram_url' => env('INSTAGRAM_URL', 'https://www.instagram.com/prezio.ru/'),
            ]);
    }
}

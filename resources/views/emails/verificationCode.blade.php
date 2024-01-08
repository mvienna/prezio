<!DOCTYPE html>
<html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

            body {
                font-family: 'Inter', sans-serif;
                background: #F8F8F8;
                margin: 48px 8px;
                font-size: 14px;
            }

            .logo {
                margin: 0 auto;
                width: 100px;
            }

            .container {
                background-color: #FFFFFF;
                max-width: 410px;
                width: 100%;
                padding: 24px;
                border-radius: 16px;
                border: 1px solid #F1F1F1;
                margin: 0 auto;
            }
            @media screen and (max-width: 442px) {
                body {
                    background: #FFFFFF;
                }
                .container {
                    max-width: 100%;
                    border: none;
                }
            }

            .header {
                font-size: 1.5em;
                margin-top: 0.5em;
                color: #0A090B;
                font-weight: 600;
            }

            .verification-code {
                font-size: 2em;
                font-weight: 600;
                text-align: center;
                letter-spacing: 8px;
                background: #F1F1F1;
                color: #1751D0;
                border-radius: 8px;
                padding: 0.5em;
                margin: 1em 0;
            }

            .instructions {
                font-size: 1em;
                color: #0A090B;
            }
            .footer {
                color: #A3A2A6;
                margin-top: 1em;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <a href="{{ env('FRONTEND_APP_URL') }}">
                <img class="logo" src="{{ asset('images/logo.png') }}" alt="Prezio Logo" style="width: 100px; height: auto;">
            </a>

            <div class="header">{{ trans('emails.verificationCode.title') }}</div>
            <div class="verification-code">{{ $verificationCode }}</div>
            <div class="instructions">{{ trans('emails.verificationCode.instruction') }}</div>
            <div class="footer">{{ trans('emails.verificationCode.footer') }}</div>
    </div>
    </body>
</html>

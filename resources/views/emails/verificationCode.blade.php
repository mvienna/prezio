<!DOCTYPE html>
<html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
            body {
                font-family: 'Inter', sans-serif;
                background: #F4F6F8;
                margin: 48px 8px;
            }
            .logo {
                margin-bottom: 48px;
                display: flex;
                justify-content: center;
            }
            .logo img {
                width: 140px;
            }
            .container {
                max-width: 360px;
                width: 100%;
                margin: 0 auto;
                padding: 48px;
                background-color: #FFFFFF;
                border-radius: 8px;
                border: 1.5px solid rgba(19, 18, 58, 0.3);
            }
            @media screen and (max-width: 500px) {
                body {
                    background: #FFFFFF;
                }
                .container {
                    max-width: 100%;
                    padding: 24px;
                    border-radius: 8px;
                    border: none;
                }
            }
            .header {
                text-align: center;
                font-size: 2em;
                font-weight: bold;
                margin: 0;
            }
            .verification-code {
                font-size: 2em;
                font-weight: bold;
                text-align: center;
                letter-spacing: 8px;
                padding-bottom: 8px;
                color: #007bff;
            }
            .instructions {
                font-size: 16px;
                opacity: 0.8;
            }
            .footer {
                opacity: 0.6;
            }
        </style>
    </head>
    <body>
        <div class="logo">
            <img src="{{ asset('images/logo.png') }}" alt="Logo">
        </div>

        <div class="container">
            <p class="header">{{ trans('emails.verificationCode.title') }}</p>
            <p class="verification-code">{{ $verificationCode }}</p>
            <p class="instructions">{{ trans('emails.verificationCode.instruction') }}</p>
            <p class="footer">{{ trans('emails.verificationCode.footer') }}</p>
    </div>
    </body>
</html>

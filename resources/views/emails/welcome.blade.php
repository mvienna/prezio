<!DOCTYPE html>
<html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

            body {
                font-family: 'Inter', sans-serif;
                background: #F8F8F8;
                margin: 3rem 0.5rem;
                font-size: 1rem;
            }

            .container {
                background-color: #FFFFFF;
                max-width: 640px;
                width: 100%;
                padding: 1.25rem;
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

            .logo {
                margin: 0 auto;
                width: 112px;
            }

            section {
                padding: 1.5rem;
            }

            h1 {
                font-size: 1.25rem;
                font-weight: 600;
                line-height: 1.5rem;
                letter-spacing: -0.02em;
                margin: 0 0 1.5rem;
            }

            p {
                font-size: 1rem;
                font-weight: 400;
                line-height: 1.375rem;
                text-align: left;
                margin: 0;
                color: #0A090B;
            }

            .verification-code {
                background: #F1F1F1;
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;

                font-size: 2rem;
                font-weight: 600;
                line-height: 2.75rem;
                letter-spacing: 0.3em;
                text-align: center;
            }

            a {
                text-decoration: none;
                color: #1751D0;
            }
            a:hover {
                text-decoration: underline;
            }

            .links {
                display: flex;
                justify-content: space-between;
                margin-top: 1.25rem;

                div {
                    display: flex;
                }

                a, img {
                    width: 1rem;
                    height: 1rem;
                }
            }

            button {
                cursor: pointer;
                background: #1751D0;
                color: #FFFFFF;
                border-radius: 0.375rem;
                margin: 1.5rem 0;
                font-size: 0.875rem;
                padding: 0 0.875rem 0 0.875rem;
                height: 2.5rem;
                border: none;
                transition: .2s;
            }
            button:hover {
                opacity: 0.9;
            }

            .list {
                margin: 1.5rem 0;
            }
            .list__item {
                display: flex;
                align-items: center;
                margin: 1.5rem 0;
            }
            .list__item__index {
                width: 2.5rem;
                min-width: 2.5rem;
                max-width: 2.5rem;
                height: 2.5rem;
                min-height: 2.5rem;
                max-height: 2.5rem;
                line-height: 2.5rem;
                text-align: center;
                font-weight: 600;
                padding: 0.625rem;
                border-radius: 50%;
                background: #ECECED;
                margin-right: 1rem;
            }

            .footer {
                p {
                    color: #4F4D55;
                    font-size: 0.75rem;
                }
            }
        </style>
    </head>
    <body>

        <div class="container">
            <section>
                <a href="{{ env('FRONTEND_APP_URL') }}">
                    <img class="logo" src="{{ asset('images/logo.png') }}" alt="Prezio" style="width: 100px; height: auto;">
                </a>
            </section>

            <section>
                <h1>{!! trans('emails.welcome.title', ['name' => $name]) !!}</h1>
                <p>{{ trans('emails.welcome.description') }}</p>
                <a href="{{ $url }}">
                    <button>
                        {{ trans('emails.welcome.getStarted') }}
                    </button>
                </a>

                <p>{{ trans('emails.welcome.tips.title') }}</p>

                <div class="list">
                    <div class="list__item">
                        <div class="list__item__index">1</div>
                        <p>{!! trans('emails.welcome.tips.list.one') !!}</p>
                    </div>

                    <div class="list__item">
                        <div class="list__item__index">2</div>
                        <p>{!! trans('emails.welcome.tips.list.two') !!}</p>
                    </div>

                    <div class="list__item">
                        <div class="list__item__index">3</div>
                        <p>{!! trans('emails.welcome.tips.list.three') !!}</p>
                    </div>
                </div>

                <p>{{ trans('emails.welcome.tips.description') }}</p>
            </section>

            <section class="footer">
                <p>{!! trans('emails.footer', ['url' => $url]) !!}</p>

                <p style="margin-top: 1.5rem;">© Prezio {{ date("Y") }}</p>

                <div class="links">
                    <a href="{{ $url }}" target="_blank">
                        <img src="{{ asset('images/logo--footer.png') }}" alt="Prezio">
                    </a>

                    <div>
                        <a href="{{ $telegram_url }}" target="_blank" style="margin-right: 0.75rem;">
                            <img class="logo" src="{{ asset('images/telegram.png') }}" alt="Prezio in Telegram" >
                        </a>

                        <a href="{{ $instagram_url }}" target="_blank">
                            <img class="logo" src="{{ asset('images/instagram.png') }}" alt="Prezio in Instagram" >
                        </a>
                    </div>
                </div>
            </section>
    </div>
    </body>
</html>

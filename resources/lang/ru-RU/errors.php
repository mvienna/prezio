<?php

return [
    'auth' => [
        'missingCredentials' => 'Email или пароль отсутствуют',
        'invalidCredentials' => 'Неверные данные',
        'invalidFields' => 'Неверные поле/поля формы',
        'invalidPassword' => 'Неверный пароль',
    ],
    'verification' => [
        'userNotFound' => "Пользователь не найден",
        'invalidCode' => 'Неверный код',
    ],
    'email' => [
        'missingDevRecipientEmail' => 'Создайте переменную электронной почты MAIL_DEV_RECIPIENT в файле .env',
        'alreadyExists' => 'Данный e-mail уже занят'
    ],
    'media' => [
        'fileNotFound' => 'Файл не найден',
    ],
    'room' => [
        'notFound' => 'Комната не найдена',
        'tokenIsTaken' => 'Код уже занят',
        'invalidToken' => 'Максимальная длинна кода - 10 символов',
        'submissionIsLocked' => 'Отправка ответов закрыта'
    ],
    'accessDenied' => 'Доступ запрещен'
];

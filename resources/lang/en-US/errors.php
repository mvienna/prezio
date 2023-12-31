<?php

return [
    'auth' => [
        'missingCredentials' => 'Email or Password is missing',
        'invalidCredentials' => 'Invalid credentials',
        'invalidFields' => 'Invalid form field(s)',
        'invalidPassword' => 'Invalid password',
    ],
    'verification' => [
        'userNotFound' => "User not found",
        'invalidCode' => 'Invalid code',
    ],
    'email' => [
        'missingDevRecipientEmail' => 'Set MAIL_DEV_RECIPIENT email variable in the .env file',
        'alreadyExists' => 'This e-mail has already been taken'
    ],
    'media' => [
        'fileNotFound' => 'File not found',
    ],
    'room' => [
        'notFound' => 'Room not found',
        'tokenIsTaken' => 'Code is already taken',
        'invalidToken' => 'Max code length - 10 characters',
        'submissionIsLocked' => 'Submission is locked'
    ],
    'accessDenied' => 'Access denied',
];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'GeniusPay' => [
        'url'          => env('GENIUSPAY_URL', 'https://pay.genius.ci/api/v1/merchant'),
        'public'       => env('GENIUSPAY_PUBLIC'),
        'secret'       => env('GENIUSPAY_SECRET'),
        'currency'     => env('GENIUSPAY_CURRENCY', 'XOF'),
        'success_url'  => env('GENIUSPAY_SUCCESS_URL', 'http://localhost:5173/paiement-succes') . '?reservation_id={reservation_id}',
        'error_url'    => env('GENIUSPAY_ERROR_URL', 'http://localhost:5173/paiement-erreur') . '?reservation_id={reservation_id}',
        'callback_url' => env('GENIUSPAY_CALLBACK_URL', 'https://axelteky.shoptongba.ci/api/webhooks/geniuspay'),
    ],

];

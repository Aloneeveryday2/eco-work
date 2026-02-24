<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspacesController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API EcoWork fonctionne !',
        'status'  => 200,
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('espaces', EspacesController::class);

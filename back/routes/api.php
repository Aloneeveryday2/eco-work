<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspacesController;
use App\Http\Controllers\Api\AdminController;

Route::get('/test', function () {
    return response()->json(['message' => 'API EcoWork fonctionne !', 'status' => 200]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('espaces', EspacesController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users',           [AdminController::class, 'index']);
    Route::put('/admin/users/{user}',    [AdminController::class, 'update']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroy']);
    Route::post('/admin/users',          [AdminController::class, 'store']);
});

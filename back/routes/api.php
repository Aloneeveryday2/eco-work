<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspacesController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\EquipementController;

Route::get('/test', function () {
    return response()->json(['message' => 'API EcoWork fonctionne !', 'status' => 200]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/espaces',          [EspacesController::class, 'index']);
Route::get('/espaces/{espace}', [EspacesController::class, 'show']);
Route::get('/equipements', [EquipementController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('reservations', ReservationController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users',           [AdminController::class, 'index']);
    Route::put('/admin/users/{user}',    [AdminController::class, 'update']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroy']);
    Route::post('/admin/users',          [AdminController::class, 'createAdmin']);

    Route::post('/espaces',           [EspacesController::class, 'store']);
    Route::put('/espaces/{espace}',   [EspacesController::class, 'update']);
    Route::delete('/espaces/{espace}',[EspacesController::class, 'destroy']);

    Route::post('/equipements',           [EquipementController::class, 'store']);
    Route::put('/equipements/{equipement}',   [EquipementController::class, 'update']);
    Route::delete('/equipements/{equipement}',[EquipementController::class, 'destroy']);

    Route::get('/liste-reservation', [ReservationController::class, 'index']);
});

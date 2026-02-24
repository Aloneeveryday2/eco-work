<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;



class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function register(RegisterRequest $request)
    {
        //

    $user = User::create([
        ...$request->validated(),
        'password' => bcrypt($request->pin),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Utilisateur créé avec succès !',
        'token'   => $token,
        'user'    => $user,
    ], 201);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt([
            'email'    => $request->email,
            'password' => $request->pin,
        ])) {
            return response()->json(['message' => 'Identifiants invalides !'], 401);
        }

        $token = Auth::user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie !',
            'token'   => $token,
            'user'    => Auth::user(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie !']);
    }
}

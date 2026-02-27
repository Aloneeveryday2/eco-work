<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\CreateAdminRequest;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json(User::where('type', 'user')->get());
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès'], 204);
    }

     public function createAdmin(CreateAdminRequest $request)
     {
            $admin = User::create([
                ...$request->validated(),
                'password' => bcrypt($request->pin),
                'type'     => 'admin',
            ]);

            return response()->json($admin, 201);
        }

    public function updateAdmin(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        return response()->json($user);
    }
}

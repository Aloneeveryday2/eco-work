<?php

namespace App\Http\Controllers\Api;

use App\Models\Espace;
use App\Http\Requests\Espace\StoreEspaceRequest;
use App\Http\Requests\Espace\UpdateEspaceRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class EspacesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $espaces = Espace::with('equipements')->paginate(10);
        return response()->json($espaces);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEspaceRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('espaces', 'public');
        }

        $espace = Espace::create($data);

        return response()->json([
            'message' => 'Espace créé avec succès',
            'data' => $espace
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Espace $espace): JsonResponse
    {
        return response()->json($espace->load('equipements'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEspaceRequest $request, $id): JsonResponse
    {
        $espace = Espace::find($id);

        if (!$espace) {
            return response()->json([
                'message' => "L'espace avec l'ID $id n'existe pas."
            ], 404);
        }

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            // Delete old photo if it exists
            if ($espace->photo) {
                Storage::disk('public')->delete($espace->photo);
            }
            $data['photo'] = $request->file('photo')->store('espaces', 'public');
        }

        $espace->update($data);

        return response()->json([
            'message' => 'Espace mis à jour avec succès !',
            'data' => $espace
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Espace $espace): JsonResponse
    {
        if ($espace->photo) {
            Storage::disk('public')->delete($espace->photo);
        }

        $espace->delete();

        return response()->json([
            'message' => 'Espace supprimé avec succès'
        ]);
    }
}

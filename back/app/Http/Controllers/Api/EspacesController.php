<?php

namespace App\Http\Controllers\Api;

use App\Models\Espace;
use App\Http\Requests\Espace\StoreEspaceRequest;
use App\Http\Requests\Espace\UpdateEspaceRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class EspacesController extends Controller
{
    private function convertToWebp($file, string $filename): void
    {
        $manager = new ImageManager(new Driver());
        $image   = $manager->read($file->getRealPath());
        $image->toWebp(80)->save(storage_path('app/public/' . $filename));
    }

    public function index(): JsonResponse
    {
        $query = Espace::with('equipements');
        $dateDebut = request('date_debut');
        $dateFin = request('date_fin');

        $espaces = $query->paginate(10);

        if ($dateDebut && $dateFin) {
            $espaces->getCollection()->transform(function ($espace) use ($dateDebut, $dateFin) {
                $isOccupied = $espace->reservations()
                    ->whereIn('statut', ['confirmee', 'en_attente'])
                    ->where('date_debut', '<=', $dateFin)
                    ->where('date_fin', '>=', $dateDebut)
                    ->exists();
                $espace->is_available = !$isOccupied;
                return $espace;
            });
        }

        return response()->json([
            'data' => $espaces->items(),
            'pagination' => [
                'current_page' => $espaces->currentPage(),
                'last_page'    => $espaces->lastPage(),
                'per_page'     => $espaces->perPage(),
                'total'        => $espaces->total(),
            ]
        ]);
    }

    public function store(StoreEspaceRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $filename = 'espaces/' . uniqid() . '.webp';
            $this->convertToWebp($request->file('photo'), $filename);
            $data['photo'] = $filename;
        }

        $espace = Espace::create($data);

        if ($request->has('equipements')) {
            $espace->equipements()->attach($request->equipements);
        }

        return response()->json([
            'message' => 'Espace créé avec succès',
            'data'    => $espace->load('equipements')
        ], 201);
    }

    public function show(Espace $espace): JsonResponse
    {
        return response()->json($espace->load(['equipements', 'reservations' => function($q) {
            $q->where('date_fin', '>=', now()->toDateString())
              ->whereIn('statut', ['confirmee', 'en_attente']);
        }]));
    }

    public function update(UpdateEspaceRequest $request, $id): JsonResponse
    {
        $espace = Espace::find($id);

        if (!$espace) {
            return response()->json(['message' => "L'espace avec l'ID $id n'existe pas."], 404);
        }

        $data = $request->validated();

        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo
            if ($espace->photo) {
                Storage::disk('public')->delete($espace->photo);
            }

            $filename = 'espaces/' . uniqid() . '.webp';
            $this->convertToWebp($request->file('photo'), $filename);
            $data['photo'] = $filename;
        }

        $espace->update($data);

        if ($request->has('equipements')) {
            $espace->equipements()->sync($request->equipements);
        }

        return response()->json([
            'message' => 'Espace mis à jour avec succès !',
            'data'    => $espace->load('equipements')
        ]);
    }

    public function destroy(Espace $espace): JsonResponse
    {
        if ($espace->photo) {
            Storage::disk('public')->delete($espace->photo);
        }

        $espace->delete();

        return response()->json(['message' => 'Espace supprimé avec succès']);
    }
}

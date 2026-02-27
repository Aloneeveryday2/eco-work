<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Equipement\StoreEquipementRequest;
use App\Http\Requests\Equipement\UpdateEquipementRequest;
use App\Models\Equipement;

class EquipementController extends Controller
{
    public function index()
    {
        return response()->json(Equipement::all());
    }

    public function store(StoreEquipementRequest $request)
    {
        $equipement = Equipement::create($request->validated());
        return response()->json($equipement, 201);
    }

    public function show(Equipement $equipement)
    {
        return response()->json($equipement);
    }

    public function update(UpdateEquipementRequest $request, Equipement $equipement)
    {
        $equipement->update($request->validated());
        return response()->json($equipement);
    }

    public function destroy(Equipement $equipement)
    {
        $equipement->delete();
        return response()->json(null, 204);
    }
}

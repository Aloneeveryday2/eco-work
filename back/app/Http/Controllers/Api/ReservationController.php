<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Espace;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reservations = Reservation::with(['user', 'espace'])->paginate(10);
        return response()->json($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $espace = Espace::findOrFail($request->espace_id);

        // Calcul de la durée et du prix
        $debut = new \DateTime($request->date_debut);
        $fin = new \DateTime($request->date_fin);
        $jours = $debut->diff($fin)->days ?: 1;

        $reservation = Reservation::create([
            'user_id' => auth()->id(),
            'espace_id' => $request->espace_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'prix_total' => $jours * $espace->tarif_jour,
            'statut' => 'en_attente'
        ]);

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'data' => $reservation->load('espace')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load(['user', 'espace']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation): JsonResponse
    {
        $reservation->update($request->validated());

        return response()->json([
            'message' => 'Réservation mise à jour avec succès !',
            'data' => $reservation
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->json([
            'message' => 'Réservation supprimée avec succès'
        ]);
    }


    public function myReservations()
{
    return response()->json(auth()->user()->reservations()->with('espace')->get());
}
}

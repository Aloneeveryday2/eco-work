<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Espace;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use Illuminate\Http\JsonResponse;
use App\Mail\ReservationConfirmeeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
        return DB::transaction(function () use ($request) {
            $espace = Espace::findOrFail($request->espace_id);

            $debut = new \DateTime($request->date_debut);
            $fin = new \DateTime($request->date_fin);
            $jours = $debut->diff($fin)->days ?: 1;

            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'espace_id' => $request->espace_id,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'prix_total' => $jours * $espace->tarif_jour,
                'statut' => 'en_attente'
            ]);

            // Initialisation immédiate du paiement
            $baseUrl = rtrim(config('services.GeniusPay.url', 'https://pay.genius.ci/api/v1/merchant'), '/');

            $amount = (int) $reservation->prix_total;
            
            // GeniusPay a souvent un minimum de 100 XOF
            if ($amount < 100) {
                throw new \Exception("Le montant de la réservation ($amount XOF) est trop bas pour un paiement en ligne.");
            }

            $response = Http::withHeaders([
                'X-API-Key'    => config('services.GeniusPay.public'),
                'X-API-Secret' => config('services.GeniusPay.secret'),
                'Accept'       => 'application/json',
                'Content-Type' => 'application/json',
            ])->post("{$baseUrl}/payments", [
                'amount'       => $amount,
                'currency'     => config('services.GeniusPay.currency', 'XOF'),
                'description'  => 'Réservation #' . $reservation->id,
                'reference'    => 'reservation-' . $reservation->id,
                'success_url'  => str_replace('{reservation_id}', $reservation->id, config('services.GeniusPay.success_url')),
                'error_url'    => str_replace('{reservation_id}', $reservation->id, config('services.GeniusPay.error_url')),
                'callback_url' => config('services.GeniusPay.callback_url'),
                'customer'     => [
                    'email' => Auth::user()->email,
                    'name'  => Auth::user()->prenom . ' ' . Auth::user()->nom,
                ],
            ]);

            if (!$response->successful()) {
                Log::error('Erreur GeniusPay détaillée', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                    'json'   => $response->json(),
                    'headers' => $response->headers(),
                    'payload_sent' => [
                        'amount'       => $reservation->prix_total,
                        'currency'     => config('services.GeniusPay.currency', 'XOF'),
                        'description'  => 'Réservation #' . $reservation->id,
                        'reference'    => 'reservation-' . $reservation->id,
                        'success_url'  => config('services.GeniusPay.success_url'),
                        'error_url'    => config('services.GeniusPay.error_url'),
                        'callback_url' => config('services.GeniusPay.callback_url'),
                    ]
                ]);
                
                $errorMessage = $response->json('message') ?? $response->json('error') ?? 'Erreur GeniusPay inconnue';
                throw new \Exception("Erreur paiement : $errorMessage");
            }

            $data = $response->json('data');
            $checkoutUrl = $data['checkout_url'] ?? $data['payment_url'] ?? $data['authorization_url'] ?? null;

            return response()->json([
                'message' => 'Réservation créée et paiement initié',
                'data' => $reservation->load('espace'),
                'checkout_url' => $checkoutUrl
            ], 201);
        });
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
        if ($reservation->user_id !== Auth::id() && Auth::user()->type_de_compte !== 'admin') {
            return response()->json(['message' => 'Interdit'], 403);
        }

        $reservation->delete();


        return response()->json([
            'message' => 'Réservation supprimée avec succès'
        ]);
    }


    public function myReservations()
    {
        return response()->json(Auth::user()->reservations()->with('espace')->get());
    }

    public function initierPaiement(Reservation $reservation): JsonResponse
{
    if ($reservation->user_id !== Auth::id()) {
        return response()->json(['message' => 'Interdit'], 403);
    }

    $baseUrl = rtrim(config('services.GeniusPay.url', 'https://pay.genius.ci/api/v1/merchant'), '/');

    $response = Http::withHeaders([
        'X-API-Key'    => config('services.GeniusPay.public'),
        'X-API-Secret' => config('services.GeniusPay.secret'),
        'Accept'       => 'application/json',
        'Content-Type' => 'application/json',
    ])->post("{$baseUrl}/payments", [
        'amount'       => $reservation->prix_total,
        'currency'     => config('services.GeniusPay.currency', 'XOF'),
        'description'  => 'Réservation #' . $reservation->id,
        'reference'    => 'reservation-' . $reservation->id,
        'success_url'  => config('services.GeniusPay.success_url'),
        'error_url'    => config('services.GeniusPay.error_url'),
        'callback_url' => config('services.GeniusPay.callback_url'),
        'customer'     => [
            'email' => $reservation->user->email,
            'name'  => $reservation->user->prenom . ' ' . $reservation->user->nom,
        ],
    ]);

    if (!$response->successful()) {
        return response()->json(['message' => 'Erreur paiement', 'detail' => $response->json()], 500);
    }

    $data = $response->json('data');
    $checkoutUrl = $data['checkout_url'] ?? $data['payment_url'] ?? $data['authorization_url'] ?? null;

    return response()->json(['checkout_url' => $checkoutUrl]);
}

    public function confirmer(Reservation $reservation): JsonResponse
    {

    if ($reservation->user_id !== Auth::id()) {
        return response()->json(['message' => 'Interdit'], 403);
    }

    $reservation->update(['statut' => 'confirmee']);

    Mail::to($reservation->user->email)
        ->send(new ReservationConfirmeeMail($reservation->load(['espace', 'user'])));

    return response()->json(['message' => 'Réservation confirmée']);

    }

}

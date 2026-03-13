<?php

namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmeeMail;



class WebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();

        $signature = $request->header('X-Geniuspay-Signature');
        $expected  = hash_hmac('sha256', $request->getContent(), config('services.GeniusPay.secret'));

        if ($signature !== $expected) {
            return response()->json(['message' => 'Signature invalide'], 401);
        }

        if ($payload['status'] === 'success') {
            $reference = $payload['reference'];
            $id = str_replace('reservation-', '', $reference);

            $reservation = Reservation::find($id);

            if ($reservation) {
                $reservation->update([
                    'statut' => 'confirmee',
                ]);
                
                Mail::to($reservation->user->email)
                    ->send(new ReservationConfirmeeMail($reservation->load(['espace', 'user'])));
            }
        }

        return response()->json(['message' => 'Webhook reçu']);
    }
}

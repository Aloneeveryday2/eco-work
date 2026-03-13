<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Espace;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::factory()->create([
            'password' => bcrypt('123456'),
            'type_de_compte'     => 'user',
        ]);
    }

    private function createAdmin(): User
    {
        return User::factory()->create([
            'password' => bcrypt('123456'),
            'type_de_compte'     => 'admin',
        ]);
    }

    private function createEspace(): Espace
    {
        return Espace::factory()->create([
            'tarif_jour' => 10000,
        ]);
    }

    // ✅ T12 - Réserver un espace valide
    public function test_user_can_create_reservation(): void
    {
        $user   = $this->createUser();
        $espace = $this->createEspace();
        $token  = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/reservations', [
                             'espace_id'  => $espace->id,
                             'date_debut' => now()->addDays(5)->format('Y-m-d'),
'date_fin'   => now()->addDays(7)->format('Y-m-d'),
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.user_id', $user->id)
                 ->assertJsonPath('data.espace_id', $espace->id);

        $this->assertDatabaseHas('reservations', [
            'user_id'   => $user->id,
            'espace_id' => $espace->id,
        ]);
    }

    // ✅ Calcul du prix total
    public function test_reservation_calculates_correct_total_price(): void
    {
        $user   = $this->createUser();
        $espace = $this->createEspace(); // tarif_jour = 10000
        $token  = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/reservations', [
                             'espace_id'  => $espace->id,
                                'date_debut' => now()->addDays(5)->format('Y-m-d'),
                                'date_fin'   => now()->addDays(7)->format('Y-m-d'),
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.prix_total', 20000);
    }

    // ✅ T14 - Annuler une réservation (user propriétaire)
    public function test_user_can_cancel_own_reservation(): void
    {
        $user        = $this->createUser();
        $espace      = $this->createEspace();
        $token       = $user->createToken('test')->plainTextToken;
        $reservation = Reservation::factory()->create([
            'user_id'   => $user->id,
            'espace_id' => $espace->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->deleteJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('reservations', ['id' => $reservation->id]);
    }

    // ✅ Sécurité - Un user ne peut pas supprimer la réservation d'un autre
    public function test_user_cannot_cancel_other_users_reservation(): void
    {
        $user1       = $this->createUser();
        $user2       = $this->createUser();
        $espace      = $this->createEspace();
        $token       = $user1->createToken('test')->plainTextToken;
        $reservation = Reservation::factory()->create([
            'user_id'   => $user2->id,
            'espace_id' => $espace->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->deleteJson("/api/reservations/{$reservation->id}");

        $response->assertStatus(403);
    }

    // ✅ Mes réservations - user voit uniquement les siennes
    public function test_user_sees_only_own_reservations(): void
    {
        $user1  = $this->createUser();
        $user2  = $this->createUser();
        $espace = $this->createEspace();
        $token  = $user1->createToken('test')->plainTextToken;

        Reservation::factory()->create(['user_id' => $user1->id, 'espace_id' => $espace->id]);
        Reservation::factory()->create(['user_id' => $user2->id, 'espace_id' => $espace->id]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->getJson('/api/my-reservations');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json());
    }

    // ✅ Admin voit toutes les réservations
    public function test_admin_can_list_all_reservations(): void
    {
        $admin  = $this->createAdmin();
        $user   = $this->createUser();
        $espace = $this->createEspace();
        $token  = $admin->createToken('test')->plainTextToken;

        Reservation::factory()->count(3)->create([
            'user_id'   => $user->id,
            'espace_id' => $espace->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->getJson('/api/reservations');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    // ✅ Sans token - accès refusé
    public function test_unauthenticated_user_cannot_create_reservation(): void
    {
        $espace = $this->createEspace();

        $response = $this->postJson('/api/reservations', [
            'espace_id'  => $espace->id,
            'date_debut' => '2025-06-10',
            'date_fin'   => '2025-06-12',
        ]);

        $response->assertStatus(401);
    }
}

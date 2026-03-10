<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Espace;
use App\Models\Equipement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EspaceTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::factory()->create([
            'password' => bcrypt('123456'),
            'type'     => 'admin',
        ]);
    }

    private function normalUser(): User
    {
        return User::factory()->create([
            'password' => bcrypt('123456'),
            'type'     => 'user',
        ]);
    }

    public function test_anyone_can_list_espaces(): void
    {
        Espace::factory()->count(3)->create();

        $response = $this->getJson('/api/espaces');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_anyone_can_view_espace_detail(): void
    {
        $espace = Espace::factory()->create();

        $response = $this->getJson("/api/espaces/{$espace->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('id', $espace->id);
    }

    public function test_admin_can_create_espace(): void
    {
        $admin = $this->adminUser();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/espaces', [
                             'nom'        => 'Bureau Calme A',
                             'type'       => 'bureau',
                             'surface'    => 20,
                             'tarif_jour' => 15000,
                         ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('espaces', ['nom' => 'Bureau Calme A']);
    }

    public function test_admin_can_create_espace_with_photo(): void
    {
        Storage::fake('public');
        $admin = $this->adminUser();
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->post('/api/espaces', [
                             'nom'        => 'Salle Confluence',
                             'type'       => 'salle_reunion',
                             'surface'    => 40,
                             'tarif_jour' => 25000,
                             'photo'      => UploadedFile::fake()->image('espace.jpg'),
                         ]);

        $response->assertStatus(201);
        Storage::disk('public')->assertExists('espaces/' . basename($response->json('data.photo')));
    }

    public function test_admin_can_update_espace(): void
    {
        $admin  = $this->adminUser();
        $token  = $admin->createToken('test')->plainTextToken;
        $espace = Espace::factory()->create(['nom' => 'Ancien nom']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->putJson("/api/espaces/{$espace->id}", [
                             'nom'        => 'Nouveau nom',
                             'type'       => $espace->type,
                             'surface'    => $espace->surface,
                             'tarif_jour' => $espace->tarif_jour,
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('espaces', ['nom' => 'Nouveau nom']);
    }

    public function test_admin_can_delete_espace(): void
    {
        $admin  = $this->adminUser();
        $token  = $admin->createToken('test')->plainTextToken;
        $espace = Espace::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->deleteJson("/api/espaces/{$espace->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('espaces', ['id' => $espace->id]);
    }

    public function test_normal_user_cannot_create_espace(): void
    {
        $user  = $this->normalUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/espaces', [
                             'nom'        => 'Bureau Test',
                             'type'       => 'bureau',
                             'surface'    => 20,
                             'tarif_jour' => 15000,
                         ]);

        $response->assertStatus(403);
    }

    public function test_espaces_filtered_by_dates_excludes_reserved(): void
    {
        $espace = Espace::factory()->create();

        $user = $this->normalUser();
        $espace->reservations()->create([
            'user_id'    => $user->id,
            'date_debut' => '2025-06-01',
            'date_fin'   => '2025-06-05',
            'prix_total' => 50000,
            'statut'     => 'en_attente',
        ]);

        $response = $this->getJson('/api/espaces?date_debut=2025-06-02&date_fin=2025-06-04');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($espace->id, $ids);
    }
}

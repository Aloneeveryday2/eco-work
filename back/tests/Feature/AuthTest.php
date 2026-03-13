<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ✅ T01 - Inscription valide
    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'nom'             => 'Dupont',
            'prenom'          => 'Jean',
            'email'           => 'jean@example.com',
            'pin'             => '123456',
            'telephone'       => '+2250700000000',
            'adresse_postale' => 'Paris 11e',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['token', 'user']);

        $this->assertDatabaseHas('users', ['email' => 'jean@example.com']);
    }

    // ✅ T02 - Inscription email existant
    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'jean@example.com']);

        $response = $this->postJson('/api/register', [
            'nom'             => 'Dupont',
            'prenom'          => 'Jean',
            'email'           => 'jean@example.com',
            'pin'             => '123456',
            'telephone'       => '+2250700000000',
            'adresse_postale' => 'Paris 11e',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    // ✅ T03 - Login valide user
    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email'    => 'jean@example.com',
            'password' => bcrypt('123456'),
            'type'     => 'user',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jean@example.com',
            'pin'   => '123456',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }

    // ✅ T04 - Login valide admin
    public function test_admin_can_login(): void
    {
        User::factory()->create([
            'email'    => 'admin@example.com',
            'password' => bcrypt('123456'),
            'type_de_compte'     => 'admin',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'pin'   => '123456',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('user.type_de_compte', 'admin');
    }

    // ✅ T05 - Login mauvais PIN
    public function test_login_fails_with_wrong_pin(): void
    {
        User::factory()->create([
            'email'    => 'jean@example.com',
            'password' => bcrypt('123456'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jean@example.com',
            'pin'   => '999999',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Identifiants invalides !']);
    }

    // ✅ T06 - Accès route protégée sans token
    public function test_protected_route_requires_authentication(): void
    {
        $response = $this->getJson('/api/reservations');
        $response->assertStatus(401);
    }

    // ✅ T08 - Déconnexion
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('123456'),
        ]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
                         ->postJson('/api/logout');

        $response->assertStatus(200);
    }
}

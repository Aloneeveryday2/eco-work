<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Espace;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $debut = fake()->dateTimeBetween('+1 days', '+30 days');
        $fin   = fake()->dateTimeBetween($debut, '+60 days');

        return [
            'user_id'    => User::factory(),
            'espace_id'  => Espace::factory(),
            'date_debut' => $debut->format('Y-m-d'),
            'date_fin'   => $fin->format('Y-m-d'),
            'prix_total' => fake()->randomElement([10000, 25000, 50000]),
            'statut'     => 'en_attente',
        ];
    }
}

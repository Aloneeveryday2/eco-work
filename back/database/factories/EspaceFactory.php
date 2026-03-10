<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EspaceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom'        => fake()->words(3, true),
            'type'       => fake()->randomElement(['bureau', 'salle_reunion', 'conference']),
            'surface'    => fake()->numberBetween(10, 100),
            'tarif_jour' => fake()->randomElement([10000, 15000, 25000, 50000]),
            'photo'      => null,
        ];
    }
}

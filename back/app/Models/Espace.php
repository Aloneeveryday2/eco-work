<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Espace extends Model
{
    protected $fillable = [
        'nom',
        'surface',
        'type',
        'tarif_jour',
        'photo',
    ];


    public function equipements()
    {
        return $this->belongsToMany(Equipement::class, 'espace_equipement');
    }


    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}

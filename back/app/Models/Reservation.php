<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'espace_id',
        'date_debut',
        'date_fin',
        'prix_total',
        'statut',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function espace(): BelongsTo
    {
        return $this->belongsTo(Espace::class);
    }
}

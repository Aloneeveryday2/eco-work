<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Reservation;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'espace_id' => 'required|exists:espaces,id',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin' => 'required|date|after:date_debut',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $conflict = Reservation::where('espace_id', $this->espace_id)
                ->where(function ($query) {
                    $query->whereBetween('date_debut', [$this->date_debut, $this->date_fin])
                          ->orWhereBetween('date_fin', [$this->date_debut, $this->date_fin]);
                })->exists();

            if ($conflict) {
                $validator->errors()->add('date_debut', 'Cet espace est déjà réservé pour ces dates.');
            }
        });
    }
}

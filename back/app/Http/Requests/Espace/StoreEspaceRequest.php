<?php

namespace App\Http\Requests\Espace;

use Illuminate\Foundation\Http\FormRequest;

class StoreEspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->type_de_compte === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom'        => 'required|string|max:255',
            'surface'    => 'required|integer|min:1',
            'type' => 'required|string',
            'tarif_jour' => 'required|numeric|min:0',
            'photo'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'equipements.*'    => 'exists:equipements,id',
            'equipements'   => 'nullable|array',
        ];
    }
}

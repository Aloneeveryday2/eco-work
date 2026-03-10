@component('mail::message')

<div style="text-align:center; margin-bottom: 2rem;">
  <h1 style="color:#1a3a45; font-size:1.8rem; font-weight:300;">
    Bienvenue, <strong>{{ $user->prenom }}</strong> 🌿
  </h1>
</div>

Votre compte **EcoWork** a bien été créé. Vous pouvez dès maintenant réserver vos espaces de coworking éco-responsables à Paris 11e.

@component('mail::panel')
**Vos informations**

- **Nom :** {{ $user->prenom }} {{ $user->nom }}
- **Email :** {{ $user->email }}
- **Téléphone :** {{ $user->telephone }}
@endcomponent

@component('mail::button', ['url' => 'http://localhost:5173/espaces', 'color' => 'success'])
Découvrir les espaces
@endcomponent

À très bientôt,
**L'équipe EcoWork**

@endcomponent

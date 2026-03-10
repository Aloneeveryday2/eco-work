@component('mail::message')

<div style="text-align:center; margin-bottom: 2rem;">
  <h1 style="color:#1a3a45; font-size:1.8rem; font-weight:300;">
    Réservation confirmée ✅
  </h1>
</div>

Bonjour **{{ $reservation->user->prenom }}**,

Votre réservation a bien été enregistrée. Voici le récapitulatif :

@component('mail::panel')
**Détails de la réservation**

- **Espace :** {{ $reservation->espace->nom }}
- **Type :** {{ $reservation->espace->type }}
- **Du :** {{ \Carbon\Carbon::parse($reservation->date_debut)->format('d/m/Y') }}
- **Au :** {{ \Carbon\Carbon::parse($reservation->date_fin)->format('d/m/Y') }}
- **Montant total :** {{ number_format($reservation->prix_total, 0, ',', ' ') }} FCFA
@endcomponent

@component('mail::button', ['url' => 'http://localhost:5173/dashboard', 'color' => 'success'])
Voir mon dashboard
@endcomponent

À bientôt dans nos espaces,
**L'équipe EcoWork**

@endcomponent

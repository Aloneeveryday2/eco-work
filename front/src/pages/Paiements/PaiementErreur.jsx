import { useNavigate } from 'react-router-dom'

export default function PaiementErreur() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ color: '#f7d6e0' }}>❌ Paiement échoué</h1>
      <p>Une erreur est survenue lors du paiement.</p>
      <button onClick={() => navigate('/dashboard')}>
        Retour au dashboard
      </button>
    </div>
  )
}
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiConfirmerReservation } from '../../services/api'

export default function PaiementSucces() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const reservationId = searchParams.get('reservation_id')
    if (reservationId) {
      apiConfirmerReservation(reservationId)
    }
    const timer = setTimeout(() => navigate('/dashboard'), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ color: '#7bdff2' }}>✅ Paiement réussi !</h1>
      <p>Votre réservation est confirmée. Redirection en cours...</p>
    </div>
  )
}
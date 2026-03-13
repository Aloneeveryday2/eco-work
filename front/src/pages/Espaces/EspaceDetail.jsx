import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetEspace, apiCreateReservation, apiPayerReservation, API_URL } from '../../services/api'

const TYPE_LABELS = { bureau: 'Bureau', salle_reunion: 'Réunion', conference: 'Conférence' }
const TYPE_COLORS = {
  bureau: { bg: '#e8faf8', text: '#0a6b5c' },
  salle_reunion: { bg: '#e0f6fb', text: '#0a5a6b' },
  conference: { bg: '#fdf0f4', text: '#6b0a2a' },
}

export default function EspaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [espace, setEspace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [reserving, setReserving] = useState(false)
  const [reserveSuccess, setReserveSuccess] = useState(false)
  const [reserveError, setReserveError] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    
    apiGetEspace(id).then(res => {
      if (res.ok) setEspace(res.data)
      else setError('Espace introuvable.')
      setLoading(false)
    })

    return () => window.removeEventListener('resize', handleResize)
  }, [id])

  const jours = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86400000) + 1)
    : 0
  const total = jours * (espace?.tarif_jour || 0)

  const handleReserver = async () => {
    if (!token) { navigate('/login'); return }
    if (!dateDebut || !dateFin) return
    setReserving(true)
    setReserveError(null)
    
    // 1. Créer la réservation ET initier le paiement en une seule fois
    const res = await apiCreateReservation({ espace_id: id, date_debut: dateDebut, date_fin: dateFin })
    
    if (res.ok) {
      // Si l'API renvoie une checkout_url, on redirige
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        setReserveSuccess(true)
        setDateDebut('')
        setDateFin('')
      }
    } else {
      setReserveError(res.data?.message || 'Erreur lors de la réservation ou du paiement.')
    }
    setReserving(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff7f6' }}>
      <div style={{ fontSize: '0.9rem', color: '#4a7a85' }}>Chargement...</div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff7f6' }}>
      <div style={{ fontSize: '0.9rem', color: '#ef4444' }}>{error}</div>
    </div>
  )

  const typeColor = TYPE_COLORS[espace.type] || { bg: '#f0f4f5', text: '#4a7a85' }

  return (
    <div style={{ minHeight: '100vh', background: '#eff7f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: isMobile ? '1rem 1.5rem' : '1.2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239,247,246,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,58,69,0.06)' }}>
        <a href="/" style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600, color: '#1a3a45', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          Eco<span style={{ color: '#7bdff2' }}>Work</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.8rem' : '1.5rem' }}>
          <a href="/espaces" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#4a7a85', textDecoration: 'none', fontWeight: 500 }}>
            {isMobile ? '← Retour' : '← Tous les espaces'}
          </a>
          {token
            ? <a href="/dashboard" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#1a3a45', textDecoration: 'none', fontWeight: 600, background: '#7bdff2', padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem', borderRadius: '8px' }}>
                {isMobile ? 'Dashboard' : 'Mon espace'}
              </a>
            : <a href="/login" style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', color: '#1a3a45', textDecoration: 'none', fontWeight: 600, background: '#7bdff2', padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem', borderRadius: '8px' }}>
                {isMobile ? 'Login' : 'Se connecter'}
              </a>
          }
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 72, position: 'relative', height: isMobile ? 320 : 460, overflow: 'hidden' }}>
        {espace.photo ? (
          <img src={`${API_URL}/storage/${espace.photo}`} alt={espace.nom} loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #1a3a45 0%, #0d2530 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: isMobile ? '3rem' : '5rem', opacity: 0.15 }}>
              {espace.type === 'bureau' ? '🖥️' : espace.type === 'salle_reunion' ? '📽️' : '🎤'}
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,22,0.7) 0%, transparent 60%)' }} />

        {/* Infos sur l'image */}
        <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '2.5rem', left: isMobile ? '1.5rem' : '2.5rem', right: isMobile ? '1.5rem' : '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <span style={{ background: typeColor.bg, color: typeColor.text, fontSize: isMobile ? '0.65rem' : '0.72rem', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {TYPE_LABELS[espace.type] || espace.type}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#eff7f6', fontSize: isMobile ? '0.65rem' : '0.72rem', fontWeight: 600, padding: '0.3rem 0.9rem', borderRadius: '100px' }}>
              {espace.surface} m²
            </span>
          </div>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#eff7f6', margin: 0, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {espace.nom}
          </h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '3rem 2rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '1.5rem' : '3rem', alignItems: 'start' }}>

        {/* Colonne gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Équipements */}
          {espace.equipements?.length > 0 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 1px 12px rgba(26,58,69,0.06)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3a45', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
                Équipements inclus
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.8rem' }}>
                {espace.equipements.map(eq => (
                  <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', background: '#f8fbfc', borderRadius: '10px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7bdff2', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a3a45' }}>{eq.libelle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Infos */}
          <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 1px 12px rgba(26,58,69,0.06)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3a45', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
              Informations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Type', value: TYPE_LABELS[espace.type] || espace.type },
                { label: 'Surface', value: `${espace.surface} m²` },
                { label: 'Tarif', value: `${Number(espace.tarif_jour).toLocaleString('fr-FR')} FCFA/jour` },
                { label: 'Équipements', value: `${espace.equipements?.length || 0} inclus` },
              ].map(info => (
                <div key={info.label} style={{ padding: '1rem', background: '#f8fbfc', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4a7a85', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{info.label}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a3a45' }}>{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite — formulaire réservation */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: '5.5rem', width: '100%' }}>
          <div style={{ background: '#1a3a45', borderRadius: '20px', padding: isMobile ? '1.5rem' : '2rem', boxShadow: '0 8px 40px rgba(26,58,69,0.2)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7bdff2', marginBottom: '0.4rem' }}>
                Tarif
              </p>
              <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#eff7f6', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {Number(espace.tarif_jour).toLocaleString('fr-FR')} FCFA
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'rgba(239,247,246,0.4)' }}>/jour</span>
              </div>
            </div>

            {reserveSuccess ? (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>✅</div>
                <p style={{ fontSize: '0.88rem', color: '#4ade80', fontWeight: 600, marginBottom: '0.4rem' }}>Réservation confirmée !</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(239,247,246,0.4)' }}>Retrouvez-la dans votre dashboard.</p>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', background: '#7bdff2', color: '#1a3a45', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Voir mon dashboard →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reserveError && (
                  <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.82rem', color: '#f87171' }}>
                    {reserveError}
                  </div>
                )}

                {/* Date début */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(239,247,246,0.4)' }}>
                    Date de début
                  </label>
                  <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ background: 'rgba(239,247,246,0.07)', border: '1px solid rgba(239,247,246,0.1)', borderRadius: '8px', padding: '0.8rem 1rem', color: '#eff7f6', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
                </div>

                {/* Date fin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(239,247,246,0.4)' }}>
                    Date de fin
                  </label>
                  <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                    min={dateDebut || new Date().toISOString().split('T')[0]}
                    style={{ background: 'rgba(239,247,246,0.07)', border: '1px solid rgba(239,247,246,0.1)', borderRadius: '8px', padding: '0.8rem 1rem', color: '#eff7f6', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', colorScheme: 'dark' }} />
                </div>

                {/* Récap prix */}
                {jours > 0 && (
                  <div style={{ background: 'rgba(239,247,246,0.05)', border: '1px solid rgba(239,247,246,0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(239,247,246,0.4)' }}>
                      {jours} jour{jours > 1 ? 's' : ''} × {Number(espace.tarif_jour).toLocaleString('fr-FR')} FCFA
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7bdff2' }}>
                      {Number(total).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                )}

                <button
                  onClick={handleReserver}
                  disabled={reserving || !dateDebut || !dateFin}
                  style={{ background: !dateDebut || !dateFin ? 'rgba(123,223,242,0.4)' : '#7bdff2', color: '#1a3a45', border: 'none', padding: '1rem', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 700, cursor: !dateDebut || !dateFin ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {reserving ? 'Réservation...' : token ? 'Réserver cet espace' : 'Se connecter pour réserver'}
                </button>

                {!token && (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(239,247,246,0.3)', textAlign: 'center', margin: 0 }}>
                    Vous serez redirigé vers la page de connexion
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
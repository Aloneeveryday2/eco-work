import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLowCarbon } from '../../context/LowCarbonContext'

const API_URL = 'http://127.0.0.1:8000'

export default function EspaceCard({ espace }) {
  const navigate = useNavigate()
  const { lowCarbonMode } = useLowCarbon()

  return (
    <div
      onClick={() => navigate(`/espaces/${espace.id}`)}
      style={{
        background: '#fff', borderRadius: '1rem', overflow: 'hidden',
        cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        fontFamily: 'system-ui, sans-serif',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      <div style={{ position: 'relative', height: 180, background: '#7bdff2' }}>

        {/* ✅ Low Carbon : pas d'image, juste une icône légère */}
        {lowCarbonMode ? (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #e8faf8, #d0f0ec)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', opacity: 0.6,
          }}>
            {espace.type === 'bureau' ? '🖥️' : espace.type === 'salle_reunion' ? '📽️' : '🎤'}
          </div>
        ) : (
          /* Mode standard : image lazy-loaded en WebP */
          espace.photo && (
            <img
              src={`${API_URL}/storage/${espace.photo}`}
              alt={espace.nom}
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        )}

        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, color: '#1a3a45' }}>
            {espace.type}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, color: '#1a3a45' }}>
            {espace.surface} m²
          </span>
        </div>
      </div>

      <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3a45', margin: '0 0 0.5rem' }}>
          {espace.nom}
        </h3>
        {espace.equipements?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {espace.equipements.map(eq => (
              <span key={eq.id} style={{ background: '#f0f4f5', borderRadius: '100px', padding: '2px 10px', fontSize: '0.7rem', color: '#4a7a85' }}>
                {eq.libelle}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a3a45' }}>
            {Number(espace.tarif_jour).toLocaleString('fr-FR')} FCFA
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#4a7a85' }}>/jour</span>
          </p>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a3a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  )
}
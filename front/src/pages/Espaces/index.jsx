import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { apiGetEspaces } from '../../services/api'
import NavBar from './NavBar'
import SearchBar from './SearchBar'
import EspaceCard from './EspaceCard'
import Pagination from './Pagination'

export default function Espaces() {
  const [espaces, setEspaces] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [typeActif, setTypeActif] = useState('Tous')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const { ok, data } = await apiGetEspaces(page)
      if (!ok) { setError('Impossible de charger les espaces.'); setLoading(false); return }
      setEspaces(data.data)
      setPagination(data.pagination)
      setLoading(false)
    }
    load()
  }, [page])

  const filtres = espaces.filter(e => {
    const matchType = typeActif === 'Tous' || e.type === typeActif
    const matchSearch = e.nom?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: '#eff7f6', fontFamily: 'system-ui, sans-serif' }}>
      <NavBar />
      <SearchBar search={search} onSearch={setSearch} typeActif={typeActif} onType={setTypeActif} />

      <div style={{ padding: '2rem 3rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={32} color="#1a3a45" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#e53e3e', padding: '4rem' }}>{error}</p>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: '#4a7a85', marginBottom: '1.5rem' }}>
              {filtres.length} espace{filtres.length > 1 ? 's' : ''} disponible{filtres.length > 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filtres.map(e => <EspaceCard key={e.id} espace={e} />)}
            </div>
            {filtres.length === 0 && (
              <p style={{ textAlign: 'center', color: '#4a7a85', padding: '4rem' }}>
                Aucun espace ne correspond à votre recherche.
              </p>
            )}
            <Pagination pagination={pagination} page={page} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
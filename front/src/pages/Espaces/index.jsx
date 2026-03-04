import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import NavBar from './NavBar'
import SearchBar from './SearchBar'
import EspaceCard from './EspaceCard'
import Pagination from './Pagination'

function useEspaces(page) {
  const [espaces, setEspaces] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/espaces?page=${page}`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setEspaces(data.data)
        setPagination(data.pagination)
      } catch {
        setError('Impossible de charger les espaces.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])

  return { espaces, pagination, loading, error }
}

export default function Espaces() {
  const [search, setSearch] = useState('')
  const [typeActif, setTypeActif] = useState('Tous')
  const [page, setPage] = useState(1)
  const { espaces, pagination, loading, error } = useEspaces(page)

  const espacesFiltres = espaces.filter(e => {
    const matchType = typeActif === 'Tous' || e.type === typeActif
    const matchSearch = e.nom?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div style={{ minHeight: "100vh", background: "#eff7f6", fontFamily: "system-ui, sans-serif" }}>
      <NavBar />
      <SearchBar search={search} onSearch={setSearch} typeActif={typeActif} onType={setTypeActif} />

      <div style={{ padding: "2rem 3rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#1a3a45" }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#e53e3e" }}>{error}</div>
        ) : (
          <>
            <p style={{ fontSize: "0.85rem", color: "#4a7a85", marginBottom: "1.5rem" }}>
              {espacesFiltres.length} espace{espacesFiltres.length > 1 ? 's' : ''} disponible{espacesFiltres.length > 1 ? 's' : ''}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}>
              {espacesFiltres.map(espace => (
                <EspaceCard key={espace.id} espace={espace} />
              ))}
            </div>

            {espacesFiltres.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem", color: "#4a7a85" }}>
                Aucun espace ne correspond à votre recherche.
              </div>
            )}

            <Pagination pagination={pagination} page={page} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
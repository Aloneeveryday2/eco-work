import { Search } from 'lucide-react'

const TYPES = ['Tous', 'Bureau', 'Réunion', 'Conférence']

export default function SearchBar({ search, onSearch, typeActif, onType }) {
  return (
    <div style={{
      background: "linear-gradient(to bottom, #1a3a45, #2a5060)",
      padding: "7rem 3rem 3rem",
    }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 300, marginBottom: "2rem", letterSpacing: "-0.02em" }}>
        Nos <span style={{ fontWeight: 700, color: "#7bdff2" }}>espaces</span>
      </h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)"
          }} />
          <input
            type="text"
            placeholder="Rechercher un espace..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "100px", padding: "0.6rem 1rem 0.6rem 2.2rem",
              color: "#fff", fontSize: "0.85rem", outline: "none", width: 220,
            }}
          />
        </div>

        {TYPES.map(type => (
          <button key={type} onClick={() => onType(type)} style={{
            background: typeActif === type ? "#7bdff2" : "rgba(255,255,255,0.1)",
            color: typeActif === type ? "#1a3a45" : "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px", padding: "0.6rem 1.2rem",
            fontSize: "0.85rem", fontWeight: typeActif === type ? 700 : 500,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
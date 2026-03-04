import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "1.2rem 3rem",
      background: "rgba(239,247,246,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(26,58,69,0.08)",
    }}>
      <Link to="/" style={{ textDecoration: "none", fontSize: "1.1rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.02em" }}>
        EcoWork
      </Link>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#1a3a45", fontSize: "0.85rem", fontWeight: 600, padding: "0.5rem 1rem" }}>
          Accueil
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} style={{
            background: "transparent", border: "1px solid rgba(26,58,69,0.2)",
            color: "#1a3a45", fontSize: "0.82rem", fontWeight: 600,
            padding: "0.5rem 1.2rem", borderRadius: "100px", cursor: "pointer",
          }}>
            Se déconnecter
          </button>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "#4a7a85", fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem" }}>
              Connexion
            </Link>
            <Link to="/inscription" style={{
              textDecoration: "none", background: "#1a3a45", color: "#eff7f6",
              fontSize: "0.82rem", fontWeight: 600, padding: "0.5rem 1.2rem", borderRadius: "100px",
            }}>
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
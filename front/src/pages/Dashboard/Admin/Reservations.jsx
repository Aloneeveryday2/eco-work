import { useState, useEffect } from "react";
import { apiGetReservations, apiDeleteReservation } from "../../../services/api";
import Btn from "../components/Btn";
import Modal from "../components/Modal";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("Toutes");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const filters = ["Toutes", "Payées", "En attente"];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await apiGetReservations(1, { date_debut: dateDebut, date_fin: dateFin });
        if (res.ok) {
          const data = res.data?.data || res.data;
          setReservations(Array.isArray(data) ? data : []);
        } else {
          setError("Erreur lors de la récupération des réservations.");
        }
      } catch (err) {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();

    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, [dateDebut, dateFin, refreshKey]);

  const handleDelete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiDeleteReservation(deleteConfirm);
      if (res.ok) {
        setReservations(prev => prev.filter(r => r.id !== deleteConfirm));
        setDeleteConfirm(null);
      } else {
        setError("Erreur lors de la suppression de la réservation.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const safeReservations = Array.isArray(reservations) ? reservations : [];
  const filtered = safeReservations.filter(r => {
    if (filter === "Payées") return r?.facture_acquittee;
    if (filter === "En attente") return !r?.facture_acquittee;
    return true;
  });

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Réservations</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{reservations.length} réservations au total</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            style={{ background: "white", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "0.5rem" }}
            title="Rafraîchir"
          >
            🔄
          </button>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginRight: "1rem" }}>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(26,58,69,0.1)", fontSize: "0.8rem" }} />
            <span style={{ color: "#4a7a85" }}>à</span>
            <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid rgba(26,58,69,0.1)", fontSize: "0.8rem" }} />
          </div>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: `1px solid ${filter === f ? "#1a3a45" : "rgba(26,58,69,0.15)"}`, background: filter === f ? "#1a3a45" : "white", color: filter === f ? "#eff7f6" : "#4a7a85", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fbfc" }}>
              {["#", "Utilisateur", "Espace", "Début", "Fin", "Montant", "Statut", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.2rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderTop: "1px solid rgba(26,58,69,0.05)" }}>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.75rem", color: "rgba(26,58,69,0.3)", fontWeight: 700 }}>#{r.id}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.88rem", fontWeight: 600, color: "#1a3a45" }}>{r.user?.prenom} {r.user?.nom}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.85rem", color: "#4a7a85" }}>{r.espace?.nom}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.82rem", color: "#4a7a85" }}>{r.date_debut}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.82rem", color: "#4a7a85" }}>{r.date_fin}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.88rem", fontWeight: 700, color: "#1a3a45" }}>{Number(r.prix_total).toLocaleString('fr-FR')}€</td>
                <td style={{ padding: "1rem 1.2rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.7rem", borderRadius: "100px", background: r.facture_acquittee ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)", color: r.facture_acquittee ? "#16a34a" : "#d97706" }}>
                    {r.facture_acquittee ? "✓ Payée" : "En attente"}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.2rem" }}>
                  <Btn size="sm" variant="danger" onClick={() => setDeleteConfirm(r.id)} disabled={isSubmitting}>×</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <Modal title="Supprimer la réservation ?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem", lineHeight: 1.6 }}>Cette action est irréversible.</p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)} disabled={isSubmitting}>Annuler</Btn>
            <Btn variant="danger" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Suppression...' : 'Supprimer'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

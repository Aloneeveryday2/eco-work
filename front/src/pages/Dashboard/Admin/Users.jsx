import { useState, useEffect } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { apiGetUsers, apiUpdateUser, apiDeleteUser, apiCreateAdmin } from "../../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ nom: "", prenom: "", email: "", telephone: "", type: "admin", adresse_postale: "", password: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchUsers = async () => {
      try {
        const res = await apiGetUsers();
        if (res.ok) {
          setUsers(Array.isArray(res.data) ? res.data : []);
        } else {
          setError("Erreur lors de la récupération des utilisateurs.");
        }
      } catch (err) {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const safeUsers = Array.isArray(users) ? users : [];
  const filtered = safeUsers.filter(u =>
    `${u?.nom || ""} ${u?.prenom || ""} ${u?.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiDeleteUser(deleteConfirm);
      if (res.ok) {
        setUsers(u => (Array.isArray(u) ? u : []).filter(x => x?.id !== deleteConfirm));
        setDeleteConfirm(null);
      } else {
        setError("Erreur lors de la suppression de l'utilisateur.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiUpdateUser(editUser?.id, editUser);
      if (res.ok) {
        setUsers(u => (Array.isArray(u) ? u : []).map(x => x?.id === editUser?.id ? res.data : x));
        setEditUser(null);
      } else {
        setError("Erreur lors de la mise à jour de l'utilisateur.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiCreateAdmin(newAdmin);
      console.log(res)
      if (res.ok) {
        setUsers(u => [...u, res.data]);
        setShowCreate(false);
        setNewAdmin({ nom: "", prenom: "", email: "", telephone: "", adresse_postale: "", password: "" });
      } else {
        setError("Erreur lors de la création de l'administrateur.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", flexDirection: isMobile ? "column" : "row" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Utilisateurs</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{safeUsers.length} comptes enregistrés</p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", width: isMobile ? "100%" : "auto", flexDirection: isMobile ? "column" : "row" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            style={{ background: "white", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.65rem 1rem", fontSize: "0.85rem", color: "#1a3a45", width: isMobile ? "100%" : 200, fontFamily: "inherit", outline: "none" }} />
          <Btn variant="cyan" onClick={() => setShowCreate(true)}>+ Créer un admin</Btn>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", overflowX: "auto", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "600px" : "auto" }}>
          <thead>
            <tr style={{ background: "#f8fbfc" }}>
              {["Utilisateur", "Email", "Téléphone", "Type", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem 1.2rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(filtered) ? filtered : []).map(u => (
              <tr key={u?.id} style={{ borderTop: "1px solid rgba(26,58,69,0.05)" }}>
                <td style={{ padding: "1rem 1.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: u?.type === "admin" ? "rgba(123,223,242,0.15)" : "#f0f4f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: u?.type === "admin" ? "#1a3a45" : "#4a7a85" }}>
                      {u?.prenom?.[0]}{u?.nom?.[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a3a45" }}>{u?.prenom} {u?.nom}</div>
                      <div style={{ fontSize: "0.72rem", color: "#4a7a85" }}>{u?.adresse_postale}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.85rem", color: "#4a7a85" }}>{u?.email}</td>
                <td style={{ padding: "1rem 1.2rem", fontSize: "0.85rem", color: "#4a7a85" }}>{u?.telephone}</td>
                <td style={{ padding: "1rem 1.2rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.7rem", borderRadius: "100px", background: u?.type === "admin" ? "rgba(123,223,242,0.15)" : "#f0f4f5", color: u?.type === "admin" ? "#1a3a45" : "#4a7a85", textTransform: "uppercase", letterSpacing: "0.04em" }}>{u?.type}</span>
                </td>
                <td style={{ padding: "1rem 1.2rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Btn size="sm" variant="ghost" onClick={() => setEditUser({ ...u })} disabled={isSubmitting}>Modifier</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteConfirm(u?.id)} disabled={isSubmitting}>Supprimer</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <Modal title="Modifier l'utilisateur" onClose={() => setEditUser(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input label="Nom" value={editUser.nom} onChange={e => setEditUser(u => ({ ...u, nom: e.target.value }))} disabled={isSubmitting} />
              <Input label="Prénom" value={editUser.prenom} onChange={e => setEditUser(u => ({ ...u, prenom: e.target.value }))} disabled={isSubmitting} />
            </div>
            <Input label="Email" type="email" value={editUser.email} onChange={e => setEditUser(u => ({ ...u, email: e.target.value }))} disabled={isSubmitting} />
            <Input label="Téléphone" value={editUser.telephone} onChange={e => setEditUser(u => ({ ...u, telephone: e.target.value }))} disabled={isSubmitting} />
            <Input label="Adresse" value={editUser.adresse_postale} onChange={e => setEditUser(u => ({ ...u, adresse_postale: e.target.value }))} disabled={isSubmitting} />
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setEditUser(null)} disabled={isSubmitting}>Annuler</Btn>
              <Btn variant="cyan" onClick={handleUpdate} disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {showCreate && (
        <Modal title="Créer un administrateur" onClose={() => setShowCreate(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <Input label="Nom" value={newAdmin.nom} onChange={e => setNewAdmin(a => ({ ...a, nom: e.target.value }))} disabled={isSubmitting} />
              <Input label="Prénom" value={newAdmin.prenom} onChange={e => setNewAdmin(a => ({ ...a, prenom: e.target.value }))} disabled={isSubmitting} />
            </div>
            <Input label="Email" type="email" value={newAdmin.email} onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))} disabled={isSubmitting} />
            <Input label="Téléphone" value={newAdmin.telephone} onChange={e => setNewAdmin(a => ({ ...a, telephone: e.target.value }))} disabled={isSubmitting} />
            <Input label="Type" value="admin" onChange={e => setNewAdmin(a => ({ ...a, type: e.target.value }))} disabled={isSubmitting} />
            <Input label="Adresse" value={newAdmin.adresse_postale} onChange={e => setNewAdmin(a => ({ ...a, adresse_postale: e.target.value }))} disabled={isSubmitting} />
            <Input label="PIN (6 chiffres)" type="password" value={newAdmin.password} onChange={e => setNewAdmin(a => ({ ...a, password: e.target.value }))} placeholder="••••••" disabled={isSubmitting} />
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowCreate(false)} disabled={isSubmitting}>Annuler</Btn>
              <Btn variant="cyan" onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Confirmer la suppression" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Cette action est irréversible. L'utilisateur et ses réservations seront supprimés.
          </p>
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

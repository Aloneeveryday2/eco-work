import { useState, useEffect } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { apiGetEspaces, apiGetEquipements, apiCreateEspace, apiUpdateEspace, apiDeleteEspace } from "../../../services/api";

const TYPE_LABELS = { bureau: "Bureau", salle_reunion: "Réunion", conference: "Conférence" };
const TYPE_COLORS = {
  bureau: { bg: "#e8faf8", text: "#0a6b5c" },
  salle_reunion: { bg: "#e0f6fb", text: "#0a5a6b" },
  conference: { bg: "#fdf0f4", text: "#6b0a2a" },
};

function Badge({ type }) {
  const c = TYPE_COLORS[type] || { bg: "#f0f4f5", text: "#4a7a85" };
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.7rem", borderRadius: "100px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

const toggleEquip = (data, setData, eq) => {
  const has = data?.equipements?.some(e => e.id === eq.id);
  setData(d => ({ ...d, equipements: has ? d.equipements.filter(e => e.id !== eq.id) : [...(d?.equipements || []), eq] }));
};

const EspaceForm = ({ data, setData, onSave, onCancel, title, equipements, isSubmitting }) => (
  <Modal title={title} onClose={onCancel}>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Input label="Nom" value={data?.nom || ""} onChange={e => setData(d => ({ ...d, nom: e.target.value }))} placeholder="Ex: Bureau Calme A" disabled={isSubmitting} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</label>
          <select value={data?.type || "bureau"} onChange={e => setData(d => ({ ...d, type: e.target.value }))} disabled={isSubmitting}
            style={{ background: "#f8fbfc", border: "1px solid rgba(26,58,69,0.1)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#1a3a45", fontSize: "0.88rem", fontFamily: "inherit", outline: "none" }}>
            <option value="bureau">Bureau</option>
            <option value="salle_reunion">Salle de réunion</option>
            <option value="conference">Conférence</option>
          </select>
        </div>
        <Input label="Surface (m²)" type="number" value={data?.surface || ""} onChange={e => setData(d => ({ ...d, surface: e.target.value }))} disabled={isSubmitting} />
      </div>
      <Input label="Tarif / jour (FCFA)" type="number" value={data?.tarif_jour || ""} onChange={e => setData(d => ({ ...d, tarif_jour: e.target.value }))} disabled={isSubmitting} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#4a7a85", textTransform: "uppercase", letterSpacing: "0.1em" }}>Équipements</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {(Array.isArray(equipements) ? equipements : []).map(eq => {
            const sel = data?.equipements?.some(e => e.id === eq.id);
            return (
              <button key={eq.id} type="button" onClick={() => toggleEquip(data, setData, eq)} disabled={isSubmitting} style={{ padding: "0.3rem 0.8rem", borderRadius: "100px", border: `1px solid ${sel ? "#7bdff2" : "rgba(26,58,69,0.15)"}`, background: sel ? "rgba(123,223,242,0.12)" : "transparent", color: sel ? "#1a3a45" : "#4a7a85", fontSize: "0.78rem", fontWeight: sel ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                {eq.libelle}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onCancel} disabled={isSubmitting}>Annuler</Btn>
        <Btn variant="cyan" onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Btn>
      </div>
    </div>
  </Modal>
);

export default function Espaces() {
  const [espaces, setEspaces] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editEspace, setEditEspace] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const empty = { nom: "", type: "bureau", surface: "", tarif_jour: "", equipements: [] };
  const [newEspace, setNewEspace] = useState(empty);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [e, eq] = await Promise.all([apiGetEspaces(), apiGetEquipements()]);
        
        // Gestion Laravel API Resources
        const listEspaces = Array.isArray(e.data) ? e.data : (e.data?.data || []);
        const listEquip = Array.isArray(eq.data) ? eq.data : (eq.data?.data || []);
        
        setEspaces(listEspaces);
        setEquipements(listEquip);
      } catch (err) {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiCreateEspace(newEspace);
      console.log(res)
      if (res.ok) {
        setEspaces(e => [...e, res.data]);
        setShowCreate(false);
        setNewEspace(empty);
      } else {
        setError("Erreur lors de la création de l'espace.");
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
      const res = await apiUpdateEspace(editEspace.id, editEspace);
      if (res.ok) {
        setEspaces(e => e.map(x => x.id === editEspace.id ? res.data : x));
        setEditEspace(null);
      } else {
        setError("Erreur lors de la mise à jour de l'espace.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiDeleteEspace(deleteConfirm);
      if (res.ok) {
        setEspaces(e => e.filter(x => x.id !== deleteConfirm));
        setDeleteConfirm(null);
      } else {
        setError("Erreur lors de la suppression de l'espace.");
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={{ color: "#4a7a85" }}>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const safeEspaces = Array.isArray(espaces) ? espaces : [];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a45", letterSpacing: "-0.03em", marginBottom: "0.3rem" }}>Espaces</h2>
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>{safeEspaces.length} espaces configurés</p>
        </div>
        <Btn variant="cyan" onClick={() => setShowCreate(true)}>+ Ajouter</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {safeEspaces.map(e => (
          <div key={e.id} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 12px rgba(26,58,69,0.06)" }}>
            <div style={{ height: 72, background: TYPE_COLORS[e.type]?.bg || "#f0f4f5", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.2rem" }}>
              <Badge type={e.type} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: TYPE_COLORS[e.type]?.text }}>{e.surface} m²</span>
            </div>
            <div style={{ padding: "1.2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a3a45", marginBottom: "0.6rem" }}>{e.nom}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                {e.equipements?.map(eq => (
                  <span key={eq.id} style={{ fontSize: "0.68rem", background: "#f0f4f5", color: "#4a7a85", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{eq.libelle}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a3a45" }}>{e.tarif_jour}FCFA<span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#4a7a85" }}>/jour</span></span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Btn size="sm" variant="ghost" onClick={() => setEditEspace({ ...e })} disabled={isSubmitting}>Modifier</Btn>
                  <Btn size="sm" variant="danger" onClick={() => setDeleteConfirm(e.id)} disabled={isSubmitting}>×</Btn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && <EspaceForm title="Nouvel espace" data={newEspace} setData={setNewEspace} onSave={handleCreate} onCancel={() => setShowCreate(false)} equipements={equipements} isSubmitting={isSubmitting} />}
      {editEspace && <EspaceForm title="Modifier l'espace" data={editEspace} setData={setEditEspace} onSave={handleUpdate} onCancel={() => setEditEspace(null)} equipements={equipements} isSubmitting={isSubmitting} />}

      {deleteConfirm && (
        <Modal title="Supprimer l'espace ?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: "0.9rem", color: "#4a7a85", marginBottom: "1.5rem", lineHeight: 1.6 }}>Cet espace sera supprimé définitivement.</p>
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

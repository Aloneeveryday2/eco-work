import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Users from "./Users";
import Espaces from "./Espaces";
import Equipements from "./Equipements";
import Reservations from "./Reservations";
import { apiGetUsers, apiGetEspaces } from "../../../services/api";

const injectStyles = () => {
  const s = document.createElement("style");
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f0f4f5; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(26,58,69,0.15); border-radius: 4px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    input, select, button { font-family: inherit; }
    input:focus, select:focus { outline: none; }
  `;
  document.head.appendChild(s);
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [usersCount, setUsersCount] = useState(0);
  const [espacesCount, setEspacesCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    injectStyles();
    const fetchData = async () => {
      try {
        const [usersRes, espacesRes] = await Promise.all([apiGetUsers(), apiGetEspaces()]);
        
        // Gestion flexible du format de données (Laravel API Resources utilisent souvent { data: [] })
        const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
        const espaces = Array.isArray(espacesRes.data) ? espacesRes.data : (espacesRes.data?.data || []);
        
        setUsersCount(users.length);
        setEspacesCount(espaces.length);
      } catch (err) {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    };
    fetchData();
  }, []);

  const sections = {
    overview: <Overview usersCount={usersCount} espacesCount={espacesCount} />,
    users: <Users />,
    espaces: <Espaces />,
    equipements: <Equipements />,
    reservations: <Reservations />,
  };

  if (error) return <p style={{ color: "red", padding: "2rem" }}>{error}</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f5" }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ marginLeft: 240, flex: 1, padding: "2.5rem", minHeight: "100vh" }}>
        {sections[active]}
      </main>
    </div>
  );
}

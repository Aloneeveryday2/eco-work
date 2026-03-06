import { useState } from "react";
import Sidebar from "./Sidebar";
import Accueil from "./Accueil";
import Reservations from "./Reservations";
import Profil from "./Profil";

export default function UserDashboard() {
  const [active, setActive] = useState("accueil");

  const sections = {
    accueil: <Accueil setActive={setActive} />,
    reservations: <Reservations />,
    profil: <Profil />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f5" }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ marginLeft: 230, flex: 1, padding: "2.5rem", minHeight: "100vh" }}>
        {sections[active]}
      </main>
    </div>
  );
}

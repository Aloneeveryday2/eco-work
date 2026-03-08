import { useState, useEffect } from "react";
import { apiGetReservations } from "../../../services/api";

const TYPE_COLORS = {
  bureau: { bg: "#e8faf8" },
  salle_reunion: { bg: "#e0f6fb" },
  conference: { bg: "#fdf0f4" },
};

const TYPE_EMOJIS = {
  bureau: "🖥️",
  salle_reunion: "📽️",
  conference: "🎤"
};

export default function Accueil({ setActive }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reservations, setReservations] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    apiGetReservations().then((res) => {
      if (res?.ok) {
        setReservations(res?.data?.reservations ?? []);
      }
    });
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const upcoming = Array.isArray(reservations)
    ? reservations.filter((r) => !r.facture_acquittee)
    : [];

  const totalDepense = Array.isArray(reservations)
    ? reservations
        .filter((r) => r.facture_acquittee)
        .reduce((sum, r) => sum + r.prix_total, 0)
    : 0;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* Hero */}
      <div
        style={{
          background: "#1a3a45",
          borderRadius: "20px",
          padding: isMobile ? "1.5rem" : "2.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1px solid rgba(123,223,242,0.07)",
            pointerEvents: "none"
          }}
        />

        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#7bdff2",
            marginBottom: "0.6rem"
          }}
        >
          {now.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long"
          })}
        </p>

        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: 300,
            color: "#eff7f6",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            marginBottom: "1.8rem"
          }}
        >
          {greeting},<br />
          <span style={{ fontWeight: 700 }}>{user?.prenom}.</span>
        </h2>

        <a
          href="/espaces"
          style={{
            textDecoration: "none",
            background: "#7bdff2",
            color: "#1a3a45",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 700,
            display: "inline-block"
          }}
        >
          Réserver un espace →
        </a>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem"
        }}
      >
        {[
          { label: "Réservations totales", val: reservations.length, icon: "📅" },
          { label: "En attente de paiement", val: upcoming.length, icon: "⏳" },
          { label: "Total dépensé", val: `${totalDepense} FCFA`, icon: "💶" }
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "1.3rem",
              boxShadow: "0 1px 12px rgba(26,58,69,0.06)",
              display: "flex",
              gap: "1rem",
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "#f0f4f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0
              }}
            >
              {s.icon}
            </div>

            <div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1a3a45",
                  letterSpacing: "-0.04em",
                  lineHeight: 1
                }}
              >
                {s.val}
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#4a7a85",
                  marginTop: "0.2rem"
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prochaines réservations */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 1px 12px rgba(26,58,69,0.06)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.2rem"
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#1a3a45"
            }}
          >
            Prochaines réservations
          </h3>

          <button
            onClick={() => setActive("reservations")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.78rem",
              color: "#7bdff2",
              fontWeight: 600,
              fontFamily: "inherit"
            }}
          >
            Voir tout →
          </button>
        </div>

        {upcoming.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#4a7a85" }}>
            Aucune réservation à venir.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {upcoming.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "#f8fbfc",
                  borderRadius: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: TYPE_COLORS[r.espace?.type]?.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem"
                    }}
                  >
                    {TYPE_EMOJIS[r.espace?.type]}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "#1a3a45"
                      }}
                    >
                      {r.espace?.nom}
                    </div>

                    <div style={{ fontSize: "0.72rem", color: "#4a7a85" }}>
                      {r.date_debut} → {r.date_fin}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#1a3a45"
                    }}
                  >
                    {r.prix_total}FCFA
                  </div>

                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#d97706",
                      background: "rgba(251,191,36,0.1)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "100px"
                    }}
                  >
                    En attente
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
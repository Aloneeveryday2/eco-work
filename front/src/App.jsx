import { useState, useEffect, useRef } from "react";

// ── Hooks ────────────────────────────────────────────────────────────
const useWindowWidth = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return width;
};

const useSectionVisible = (threshold = 0.3) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

// ── SECTION 1 : Silence ──────────────────────────────────────────────
function SectionSilence() {
  const words = ["Respirez.", "Travaillez.", "Réservez."];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIndex(i => (i + 1) % words.length); setFade(true); }, 600);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      width: "100%",
      minHeight: "100vh",
      background: "#eff7f6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: isMobile ? "6rem 1.5rem 4rem" : "0",
    }}>
      {/* Blob organique */}
      <svg viewBox="0 0 800 800" style={{
        position: "absolute",
        width: isMobile ? "120vw" : "70vw",
        height: isMobile ? "120vw" : "70vw",
        maxWidth: 700, maxHeight: 700,
        opacity: 0.15,
        animation: "breathe 10s ease-in-out infinite",
        pointerEvents: "none",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7bdff2" />
            <stop offset="100%" stopColor="#f7d6e0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M400,100 C520,80 680,160 720,300 C760,440 700,600 560,660 C420,720 240,680 160,560 C80,440 100,240 200,160 C270,100 340,115 400,100 Z" fill="url(#g1)" />
      </svg>

      {/* Nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: isMobile ? "1.2rem 1.5rem" : "1.8rem 3rem",
      }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a3a45", letterSpacing: "-0.02em" }}>EcoWork</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!isMobile && (
            <a href="#" style={{ textDecoration: "none", color: "#4a7a85", fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem" }}>
              Connexion
            </a>
          )}
          <a href="#" style={{
            textDecoration: "none",
            background: "#1a3a45", color: "#eff7f6",
            fontSize: "0.82rem", fontWeight: 600,
            padding: "0.5rem 1.2rem", borderRadius: "100px",
          }}>S'inscrire</a>
        </div>
      </div>

      {/* Contenu */}
      <div style={{
        textAlign: "center", position: "relative", zIndex: 1,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "none" : "translateY(20px)",
        transition: "all 1s ease",
      }}>
        <p style={{
          fontSize: "0.68rem", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "#7bdff2", marginBottom: "2rem",
        }}>GreenSpace</p>

        <h1 style={{
          fontSize: isMobile ? "clamp(3.5rem, 18vw, 6rem)" : "clamp(5rem, 12vw, 10rem)",
          fontWeight: 300, color: "#1a3a45",
          letterSpacing: "-0.04em", lineHeight: 1,
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          userSelect: "none",
        }}>
          {words[index]}
        </h1>

        <p style={{
          marginTop: "2.5rem", fontSize: isMobile ? "0.88rem" : "1rem",
          color: "rgba(26,58,69,0.4)", letterSpacing: "0.02em",
          padding: isMobile ? "0 1rem" : "0",
        }}>
          La plateforme de coworking de GreenSpace.
        </p>

        <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#" style={{
            textDecoration: "none",
            background: "#1a3a45", color: "#eff7f6",
            fontWeight: 600, fontSize: "0.88rem",
            padding: "0.9rem 2rem", borderRadius: "100px",
          }}>Réserver un espace</a>
          <a href="#flow" style={{
            textDecoration: "none", color: "#4a7a85",
            fontSize: "0.88rem", fontWeight: 500,
            padding: "0.9rem 1rem",
            borderBottom: "1px solid rgba(74,122,133,0.3)",
          }}>Découvrir ↓</a>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: "2rem",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        opacity: 0.3,
      }}>
        <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a45" }}>Défiler</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #1a3a45, transparent)", animation: "scrollDrop 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ── SECTION 2 : Bâtiment ────────────────────────────────────────────
function SectionBuilding() {
  const [ref, visible] = useSectionVisible(0.2);
  const [progress, setProgress] = useState(0);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      setProgress(p);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const floor3 = progress > 0.1;
  const floor2 = progress > 0.4;
  const floor1 = progress > 0.7;

  return (
    <section ref={ref} style={{ width: "100%", minHeight: isMobile ? "150vh" : "250vh", background: "#1a3a45", position: "relative" }}>
      <div style={{
        width: "100%",
        position: "sticky", top: 0, height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "2rem" : "6rem",
        padding: isMobile ? "2rem 1.5rem" : "0 6rem",
        overflow: "hidden",
      }}>
        {/* Texte */}
        <div style={{
          maxWidth: isMobile ? "100%" : 280,
          textAlign: isMobile ? "center" : "left",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateX(-20px)",
          transition: "all 1s ease",
          order: isMobile ? 2 : 1,
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7bdff2", marginBottom: "1rem" }}>L'espace</p>
          <h2 style={{ fontSize: isMobile ? "1.4rem" : "1.8rem", fontWeight: 300, color: "#eff7f6", lineHeight: 1.4, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
            Un bâtiment pensé pour la concentration.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: isMobile ? "center" : "flex-start" }}>
            {[
              { label: "Bureaux individuels", active: floor1, color: "#b2f7ef" },
              { label: "Salles de réunion", active: floor2, color: "#7bdff2" },
              { label: "Espaces conférence", active: floor3, color: "#f7d6e0" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", opacity: f.active ? 1 : 0.25, transition: "opacity 0.8s ease" }}>
                <div style={{ width: 24, height: 1, background: f.active ? f.color : "rgba(239,247,246,0.2)", transition: "background 0.8s ease" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: f.active ? 600 : 400, color: f.active ? f.color : "rgba(239,247,246,0.3)", transition: "all 0.8s ease" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Bâtiment */}
        <svg viewBox="0 0 320 420" style={{
          width: isMobile ? "min(260px, 70vw)" : "min(320px, 35vw)",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(30px)",
          transition: "all 1.2s ease",
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.4))",
          order: isMobile ? 1 : 2,
          flexShrink: 0,
        }}>
          <rect x="40" y="390" width="240" height="6" rx="3" fill="rgba(239,247,246,0.08)" />

          {/* Etage Conférence */}
          <g style={{ opacity: floor3 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="50" y="300" width="220" height="88" rx="4" fill={floor3 ? "rgba(247,214,224,0.1)" : "rgba(239,247,246,0.03)"} stroke={floor3 ? "#f7d6e0" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[80, 120, 160, 200, 240].map(x => (
              <rect key={x} x={x} y="314" width="16" height="55" rx="2" fill={floor3 ? "rgba(247,214,224,0.18)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="348" textAnchor="middle" fill={floor3 ? "#f7d6e0" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1" style={{ transition: "all 0.8s ease" }}>CONFÉRENCE</text>
          </g>

          {/* Etage Réunion */}
          <g style={{ opacity: floor2 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="55" y="200" width="210" height="95" rx="4" fill={floor2 ? "rgba(123,223,242,0.08)" : "rgba(239,247,246,0.03)"} stroke={floor2 ? "#7bdff2" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[75, 115, 155, 195, 235].map(x => (
              <rect key={x} x={x} y="214" width="16" height="62" rx="2" fill={floor2 ? "rgba(123,223,242,0.15)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="252" textAnchor="middle" fill={floor2 ? "#7bdff2" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1" style={{ transition: "all 0.8s ease" }}>RÉUNION</text>
          </g>

          {/* Etage Bureaux */}
          <g style={{ opacity: floor1 ? 1 : 0.15, transition: "opacity 0.8s ease" }}>
            <rect x="70" y="100" width="180" height="95" rx="4" fill={floor1 ? "rgba(178,247,239,0.08)" : "rgba(239,247,246,0.03)"} stroke={floor1 ? "#b2f7ef" : "rgba(239,247,246,0.12)"} strokeWidth="1" style={{ transition: "all 0.8s ease" }} />
            {[90, 128, 166, 204].map(x => (
              <rect key={x} x={x} y="114" width="14" height="63" rx="2" fill={floor1 ? "rgba(178,247,239,0.18)" : "rgba(239,247,246,0.04)"} style={{ transition: "all 0.8s ease" }} />
            ))}
            <text x="160" y="152" textAnchor="middle" fill={floor1 ? "#b2f7ef" : "rgba(239,247,246,0.15)"} fontSize="8" fontWeight="600" letterSpacing="1" style={{ transition: "all 0.8s ease" }}>BUREAUX</text>
          </g>

          {/* Toit */}
          <polygon points="160,30 80,100 240,100" fill="rgba(239,247,246,0.05)" stroke="rgba(239,247,246,0.18)" strokeWidth="1" />
          <line x1="160" y1="30" x2="160" y2="12" stroke="rgba(239,247,246,0.2)" strokeWidth="1" />
          <circle cx="160" cy="10" r="2" fill="#7bdff2" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

// ── SECTION 3 : Flow ────────────────────────────────────────────────
function FlowStep({ step, index, isMobile }) {
  const [ref, visible] = useSectionVisible(0.2);
  return (
    <div ref={ref} style={{
      textAlign: "center",
      padding: isMobile ? "2.5rem 1rem" : "3rem 2rem",
      borderRight: !isMobile && index < 2 ? "1px solid rgba(26,58,69,0.08)" : "none",
      borderBottom: isMobile && index < 2 ? "1px solid rgba(26,58,69,0.08)" : "none",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: `all 0.9s ${index * 0.18}s ease`,
    }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(26,58,69,0.2)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 style={{ fontSize: isMobile ? "2.2rem" : "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "#1a3a45", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.8rem" }}>
        {step.word}
      </h3>
      <p style={{ fontSize: "0.8rem", color: "rgba(26,58,69,0.4)", lineHeight: 1.6 }}>{step.sub}</p>
    </div>
  );
}

function SectionFlow() {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const steps = [
    { word: "Choisir", sub: "L'espace qui vous convient" },
    { word: "Planifier", sub: "Votre date et durée" },
    { word: "Confirmer", sub: "En quelques secondes" },
  ];

  return (
    <section id="flow" style={{ width: "100%", background: "#eff7f6", padding: isMobile ? "6rem 1.5rem" : "10rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7bdff2", marginBottom: "4rem" }}>Le flux</p>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        width: "100%", maxWidth: 900,
      }}>
        {steps.map((s, i) => <FlowStep key={i} step={s} index={i} isMobile={isMobile} />)}
      </div>
    </section>
  );
}

// ── SECTION 4 : Calendrier ───────────────────────────────────────────
function SectionCalendar() {
  const [ref, visible] = useSectionVisible(0.2);
  const w = useWindowWidth();
  const isMobile = w < 768;
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i - today.getDay() + 1);
    return {
      day: d.getDate(),
      available: Math.random() > 0.35,
      isToday: d.toDateString() === today.toDateString(),
      isPast: d < new Date(new Date().setHours(0, 0, 0, 0)),
    };
  });
  const [selected, setSelected] = useState(null);

  return (
    <section ref={ref} style={{
      width: "100%",
      background: "#1a3a45",
      padding: isMobile ? "6rem 1.5rem" : "10rem 6rem",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#7bdff2", marginBottom: "1.2rem", opacity: visible ? 1 : 0, transition: "all 0.8s ease" }}>
        Disponibilités
      </p>
      <h2 style={{
        fontSize: isMobile ? "1.6rem" : "clamp(1.8rem, 3vw, 2.8rem)",
        fontWeight: 300, color: "#eff7f6",
        letterSpacing: "-0.03em", textAlign: "center",
        marginBottom: "4rem", maxWidth: 440,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "all 0.9s 0.1s ease",
      }}>
        Consultez les disponibilités en temps réel.
      </h2>

      {/* Calendrier */}
      <div style={{
        background: "rgba(239,247,246,0.04)",
        border: "1px solid rgba(239,247,246,0.08)",
        borderRadius: "16px",
        padding: isMobile ? "1.5rem" : "2.5rem",
        width: "100%", maxWidth: 440,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: "all 1s 0.2s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#eff7f6", letterSpacing: "-0.01em" }}>
            {today.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {["‹", "›"].map((a, i) => (
              <button key={i} style={{ background: "rgba(239,247,246,0.06)", border: "none", color: "rgba(239,247,246,0.5)", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: "1rem" }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.4rem" }}>
          {["L","M","M","J","V","S","D"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: "0.62rem", fontWeight: 600, color: "rgba(239,247,246,0.2)", padding: "0.4rem 0", letterSpacing: "0.05em" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
          {days.map((d, i) => (
            <button key={i} onClick={() => d.available && !d.isPast && setSelected(i)} style={{
              aspectRatio: "1", border: "none", borderRadius: "8px",
              background: selected === i ? "#7bdff2" : d.isToday ? "rgba(123,223,242,0.12)" : d.isPast ? "transparent" : d.available ? "rgba(178,247,239,0.05)" : "transparent",
              color: selected === i ? "#1a3a45" : d.isPast ? "rgba(239,247,246,0.1)" : d.available ? "#eff7f6" : "rgba(239,247,246,0.2)",
              fontSize: "0.75rem", fontWeight: selected === i ? 700 : 400,
              cursor: d.available && !d.isPast ? "pointer" : "default",
              transition: "all 0.2s",
              outline: d.isToday && selected !== i ? "1px solid rgba(123,223,242,0.3)" : "none",
            }}>{d.day}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {[
            { color: "rgba(178,247,239,0.12)", label: "Disponible" },
            { color: "#7bdff2", label: "Sélectionné" },
            { color: "transparent", label: "Indisponible", border: "rgba(239,247,246,0.1)" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div style={{ width: 9, height: 9, borderRadius: "2px", background: l.color, border: l.border ? `1px solid ${l.border}` : "none" }} />
              <span style={{ fontSize: "0.68rem", color: "rgba(239,247,246,0.3)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#" style={{
        marginTop: "2.5rem", textDecoration: "none",
        border: "1px solid rgba(123,223,242,0.25)", color: "#7bdff2",
        padding: "0.85rem 2rem", borderRadius: "100px",
        fontSize: "0.83rem", fontWeight: 500,
        opacity: visible ? 1 : 0, transition: "all 1s 0.4s ease",
      }}>Voir toutes les disponibilités</a>
    </section>
  );
}

// ── SECTION 5 : CTA Final ────────────────────────────────────────────
function SectionCTA() {
  const [ref, visible] = useSectionVisible(0.3);
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section ref={ref} style={{
      width: "100%",
      background: "#eff7f6",
      minHeight: "80vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: isMobile ? "8rem 1.5rem" : "8rem 3rem",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Cercles déco */}
      {[60, 40, 22].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${size}vw`, height: `${size}vw`,
          borderRadius: "50%",
          border: `1px solid rgba(123,223,242,${0.06 + i * 0.04})`,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          minWidth: 100, minHeight: 100,
        }} />
      ))}

      <p style={{
        fontSize: "0.65rem", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "#7bdff2", marginBottom: "1.8rem",
        opacity: visible ? 1 : 0, transition: "all 0.8s ease",
      }}>GreenSpace · EcoWork</p>

      <h2 style={{
        fontSize: isMobile ? "2.5rem" : "clamp(3rem, 7vw, 7rem)",
        fontWeight: 300, color: "#1a3a45",
        letterSpacing: "-0.04em", lineHeight: 1.05,
        marginBottom: "3rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "all 1s 0.1s ease",
      }}>
        Un espace.<br />
        <span style={{ color: "#7bdff2" }}>Une respiration.</span>
      </h2>

      <a href="/espaces" style={{
        textDecoration: "none",
        background: "#1a3a45", color: "#eff7f6",
        padding: "1.1rem 3rem", borderRadius: "100px",
        fontSize: "0.9rem", fontWeight: 600,
        letterSpacing: "0.04em",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: "all 1s 0.25s ease",
        display: "inline-block",
      }}>Explorer les espaces</a>

      <div style={{
        position: "absolute", bottom: "2rem",
        fontSize: "0.68rem", color: "rgba(26,58,69,0.25)",
        letterSpacing: "0.05em",
      }}>
        © 2025 GreenSpace · Paris 11e · Hébergement vert
      </div>
    </section>
  );
}

// ── APP ──────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: system-ui, -apple-system, sans-serif; overflow-x: hidden; background: #eff7f6; }
      @keyframes breathe {
        0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        33% { transform: translate(-50%, -50%) scale(1.08) rotate(3deg); }
        66% { transform: translate(-50%, -50%) scale(0.96) rotate(-2deg); }
      }
      @keyframes scrollDrop {
        0%, 100% { transform: scaleY(1); opacity: 1; }
        50% { transform: scaleY(0.4); opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <SectionSilence />
      <SectionBuilding />
      <SectionFlow />
      <SectionCalendar />
      <SectionCTA />
    </div>
  );
}

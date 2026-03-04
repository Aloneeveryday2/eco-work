import { useState } from "react";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { useSectionVisible } from "../hooks/useSectionVisible";

export default function SectionCalendar() {
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

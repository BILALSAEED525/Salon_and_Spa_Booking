import { GoldBtn } from "./atoms/Button";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE — AboutPage
══════════════════════════════════════════════════════════════════════════ */
const ABOUT_CARDS = [
  ["ti-award",   "Expert team",      "Certified specialists with years of proven experience."],
  ["ti-heart",   "Premium products", "Only the finest, skin-safe products for every treatment."],
  ["ti-star",    "Client focused",   "Every appointment tailored to your unique beauty goals."],
  ["ti-map-pin", "Find us",          "Located in the heart of the city, open 7 days a week."],
];

export default function AboutPage({ onBook }) {
  return (
    <div className="fade-up page-wrap" style={{ padding: "52px 20px" }}>
      <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 8 }}>
        Our story
      </p>
      <h1 className="serif" style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
        About Luxe Salon &amp; Spa
      </h1>
      <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: 15, maxWidth: 560, marginBottom: 44 }}>
        Founded on the belief that everyone deserves a luxurious self-care experience, Luxe brings Pakistan's finest beauty professionals together under one roof.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginBottom: 44 }}>
        {ABOUT_CARDS.map(([icon, title, desc]) => (
          <div key={title} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 18px" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--gold-l)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <i className={`ti ${icon}`} style={{ fontSize: 22, color: "var(--gold)" }} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{
        background: "var(--ink)", borderRadius: 16, padding: "32px 28px",
        display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p className="serif" style={{ fontSize: 20, color: "#fff", marginBottom: 6 }}>Ready to experience Luxe?</p>
          <p style={{ color: "#A8A29E", fontSize: 13 }}>Book your appointment today — it only takes a minute.</p>
        </div>
        <GoldBtn onClick={onBook} style={{ padding: "12px 26px", flexShrink: 0 }}>Book now</GoldBtn>
      </div>
    </div>
  );
}

import { GoldBtn, GhostBtn } from "./atoms/Button";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE — HomePage (HeroSection + HomeCategoryGrid + StatsStrip)
══════════════════════════════════════════════════════════════════════════ */
const HOME_CATS = [
  ["Hair care",  "ti-cut",      "#C6A87C", "#F3ECE0", "Expert cuts, coloring & treatments"],
  ["Makeup",     "ti-sparkles", "#9E6A8A", "#F8F0F5", "Bridal, events & editorial looks"],
  ["Body & spa", "ti-droplet",  "#5A8A80", "#EEF6F4", "Relaxing massage & spa therapies"],
];

const STATS = [
  ["500+", "Happy clients"],
  ["3", "Expert professionals"],
  ["4.9★", "Average rating"],
  ["5+", "Years of luxury"],
];

function HeroSection({ onBook }) {
  return (
    <div style={{
      background: "var(--cream)", borderBottom: "1px solid #F0EDE8",
      padding: "72px 20px 60px", textAlign: "center",
    }}>
      {/* pill tag */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "var(--gold-l)", borderRadius: 999, padding: "5px 14px", marginBottom: 20,
      }}>
        <i className="ti ti-star" style={{ fontSize: 12, color: "var(--gold)" }} />
        <span style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-d)", fontWeight: 600 }}>
          Premium beauty destination
        </span>
      </div>

      <h1
        className="serif"
        style={{ fontSize: "clamp(28px,5vw,50px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}
      >
        Luxe Salon &amp; Spa —
        <br />
        <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Book your luxe experience</em>
      </h1>

      <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 36px" }}>
        Welcome to the salon where your beauty journey begins. Premium services tailored just for you.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <GoldBtn onClick={onBook} style={{ padding: "13px 30px", fontSize: 14 }}>Book now</GoldBtn>
        <GhostBtn onClick={onBook} style={{ padding: "13px 30px", fontSize: 14 }}>Our services</GhostBtn>
      </div>
    </div>
  );
}

function HomeCategoryGrid({ onBook }) {
  return (
    <div style={{ padding: "52px 0" }}>
      <p style={{ textAlign: "center", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#A8A29E", fontWeight: 600, marginBottom: 10 }}>
        What we offer
      </p>
      <h2 className="serif" style={{ textAlign: "center", fontSize: 26, fontWeight: 600, marginBottom: 36 }}>
        Our signature services
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        {HOME_CATS.map(([name, icon, color, bg, desc]) => (
          <button
            key={name}
            onClick={onBook}
            className="hoverable"
            style={{
              background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
              padding: "28px 22px", textAlign: "left", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 14,
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`ti ${icon}`} style={{ fontSize: 30, color }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>{name}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{desc}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color, fontWeight: 600, fontSize: 12, marginTop: "auto" }}>
              <span>Explore</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 14 }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatsStrip() {
  return (
    <div style={{ background: "var(--ink)", borderRadius: 16, padding: "36px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 28, textAlign: "center" }}>
        {STATS.map(([value, label]) => (
          <div key={label}>
            <div className="serif" style={{ fontSize: 32, color: "var(--gold)", fontWeight: 700, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#A8A29E", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 8 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage({ onBook }) {
  return (
    <div className="fade-up">
      <HeroSection onBook={onBook} />
      <div className="page-wrap">
        <HomeCategoryGrid onBook={onBook} />
        <StatsStrip />
      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}

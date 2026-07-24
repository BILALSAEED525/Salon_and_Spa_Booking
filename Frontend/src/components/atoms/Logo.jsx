/* ── Logo ── */
export default function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
      <div className="serif" style={{ fontSize: 20, letterSpacing: "0.18em" }}>LUXE</div>
      <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#78716C", marginTop: 3 }}>
        Salon &amp; Spa
      </div>
    </button>
  );
}

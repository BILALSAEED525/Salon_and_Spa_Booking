import { SVG_AVATARS } from "../../data/constants";

/* ══════════════════════════════════════════════════════════════════════════
   ATOMS — Avatar
   • SVG illustrated face for hardcoded demo staff (st1/st2/st3)
   • Initials circle for dynamically registered barbers (id starts with b_)
══════════════════════════════════════════════════════════════════════════ */
export default function Avatar({ staffId, name = "", size = 80 }) {
  const svg = SVG_AVATARS[staffId];

  /* registered barber — show initials circle */
  if (!svg) {
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg,#C6A87C,#B0946A)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color: "#fff", fontWeight: 700,
        fontSize: size * 0.32, letterSpacing: "0.04em",
      }}>
        {initials || "?"}
      </div>
    );
  }

  /* hardcoded staff — SVG illustration */
  return (
    <div
      style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

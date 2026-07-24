import Avatar from "./atoms/Avatar";
import { formatPrice, fmtShort, minsToLabel } from "../utils/helpers";

/* ══════════════════════════════════════════════════════════════════════════
   MOLECULES — BookingSidebar
══════════════════════════════════════════════════════════════════════════ */
export default function BookingSidebar({ svc, staff, selDate, selTime }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 18, padding: 22,
    }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: ".12em", color: "var(--ink)",
        borderBottom: "1px solid #F5F5F4", paddingBottom: 12, marginBottom: 18,
      }}>
        Booking summary
      </h3>

      {!svc ? (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{
            width: 48, height: 48, background: "#F5F5F4", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px",
          }}>
            <i className="ti ti-sparkles" style={{ fontSize: 20, color: "#D6D3D1" }} />
          </div>
          <p style={{ fontSize: 12, color: "#A8A29E" }}>Select a service to begin</p>
        </div>
      ) : (
        <div>
          {/* service info */}
          <div style={{ marginBottom: 14 }}>
            <h4 className="serif" style={{ fontSize: 14, marginBottom: 8 }}>{svc.name}</h4>
            {[["Duration", `${svc.dur} min`], ["Price", formatPrice(svc.price)]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 3 }}>
                <span>{k}</span>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* staff info */}
          {staff && (
            <div style={{ borderTop: "1px solid #F5F5F4", paddingTop: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ border: "2px solid #F5F5F4", borderRadius: "50%" }}>
                <Avatar staffId={staff.id} size={38} />
              </div>
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#A8A29E" }}>Specialist</p>
                <p style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{staff.name}</p>
              </div>
            </div>
          )}

          {/* date & time info */}
          {selDate && selTime != null && (
            <div style={{ borderTop: "1px solid #F5F5F4", paddingTop: 14, display: "flex", gap: 10, marginBottom: 14 }}>
              <i className="ti ti-calendar" style={{ fontSize: 14, color: "#A8A29E", marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#A8A29E" }}>Date &amp; time</p>
                <p style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{fmtShort(selDate)}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{minsToLabel(selTime)}</p>
              </div>
            </div>
          )}

          {/* total */}
          <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Total</span>
            <span className="serif" style={{ fontSize: 17 }}>{formatPrice(svc.price)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

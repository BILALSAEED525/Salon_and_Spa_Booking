import Avatar from "../atoms/Avatar";
import { formatPrice, fmtLong, minsToLabel } from "../../utils/helpers";
import { GoldBtn, GhostBtn } from "../atoms/Button";

/* ══════════════════════════════════════════════════════════════════════════
   STEP 4 — Confirm
   └─ BookingDetailCard   →  service + specialist + datetime summary card
   └─ CancellationPolicy  →  policy text block
   └─ Step4Confirm        →  assembled step
══════════════════════════════════════════════════════════════════════════ */
function BookingDetailCard({ svc, staff, selDate, selTime }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, padding: 28, marginBottom: 16, position: "relative", overflow: "hidden" }}>
      {/* decorative glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "var(--gold-l)", filter: "blur(28px)" }} />

      {/* service row */}
      <div style={{ borderBottom: "1px solid #F5F5F4", paddingBottom: 20, marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, position: "relative" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: 6 }}>Service</p>
          <h2 className="serif" style={{ fontSize: 20 }}>{svc.name}</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 28, fontWeight: 300 }}>{formatPrice(svc.price)}</p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{svc.dur} minutes</p>
        </div>
      </div>

      {/* details row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, position: "relative" }}>
        {/* date & time */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#F5F5F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="ti ti-calendar" style={{ fontSize: 18, color: "var(--muted)" }} />
          </div>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "#A8A29E", fontWeight: 600, marginBottom: 4 }}>Date &amp; time</p>
            <p style={{ fontWeight: 500, fontSize: 13 }}>{fmtLong(selDate)}</p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{minsToLabel(selTime)}</p>
          </div>
        </div>

        {/* specialist */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ border: "2px solid #F5F5F4", borderRadius: "50%", flexShrink: 0 }}>
            <Avatar staffId={staff.id} size={42} />
          </div>
          <div>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "#A8A29E", fontWeight: 600, marginBottom: 4 }}>Specialist</p>
            <p style={{ fontWeight: 500, fontSize: 13 }}>{staff.name}</p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{staff.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CancellationPolicy() {
  return (
    <div style={{ background: "#F9F8F6", border: "1px solid var(--border)", borderRadius: 12, padding: 18, marginBottom: 24 }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Cancellation policy</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
        24-hour notice required for cancellations. Appointments cancelled within 24 hours may incur a 50% charge.
      </p>
    </div>
  );
}

export default function Step4Confirm({ svc, staff, selDate, selTime, onBack, onConfirm }) {
  return (
    <div className="fade-up">
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Confirm your booking</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>Review the details below before confirming.</p>

      <BookingDetailCard svc={svc} staff={staff} selDate={selDate} selTime={selTime} />
      <CancellationPolicy />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <GoldBtn
          fullWidth
          onClick={onConfirm}
          style={{ padding: 15, fontSize: 15, borderRadius: 12, boxShadow: "0 8px 20px rgba(198,168,124,.35)" }}
        >
          Confirm &amp; pay
        </GoldBtn>
        <GhostBtn onClick={onBack} style={{ padding: 13, borderRadius: 12 }}>Edit booking</GhostBtn>
      </div>
    </div>
  );
}

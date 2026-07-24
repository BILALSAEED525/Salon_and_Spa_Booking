import { GoldBtn, GhostBtn } from "./atoms/Button";
import { fmtLong, minsToLabel } from "../utils/helpers";

/* ══════════════════════════════════════════════════════════════════════════
   BOOKING SUCCESS
══════════════════════════════════════════════════════════════════════════ */
export default function BookingSuccess({ booking, onViewBookings, onBookAnother }) {
  return (
    <div className="fade-up" style={{ maxWidth: 540, margin: "0 auto", textAlign: "center", padding: "48px 0" }}>
      <div className="scale-in" style={{ width: 88, height: 88, background: "var(--gold-l)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
          <path d="M10 21L17 28L30 13" stroke="var(--gold-d)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
        </svg>
      </div>

      <h2 className="serif" style={{ fontSize: 28, marginBottom: 12 }}>Booking request sent!</h2>
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.75, marginBottom: 32 }}>
        <strong>{booking.svc.name}</strong> with {booking.staff.name} on {fmtLong(booking.date)}{" "}
        at {minsToLabel(booking.time)} — marked <strong>Pending</strong> until confirmed.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <GoldBtn onClick={onViewBookings} style={{ borderRadius: 999, padding: "12px 26px" }}>View my bookings</GoldBtn>
        <GhostBtn onClick={onBookAnother} style={{ borderRadius: 999, padding: "12px 26px" }}>Book another</GhostBtn>
      </div>
    </div>
  );
}

import { useState } from "react";
import Avatar from "./atoms/Avatar";
import StatusBadge from "./atoms/StatusBadge";
import { GoldBtn } from "./atoms/Button";
import { formatPrice, fmtLong, minsToLabel } from "../utils/helpers";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE — MyBookingsPage
   └─ BookingCard      →  single booking row
   └─ MyBookingsPage   →  full bookings page with tabs
══════════════════════════════════════════════════════════════════════════ */
function BookingCard({ booking, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const canCancel = booking.status === "Pending" || booking.status === "Confirmed";

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ border: "2px solid #F5F5F4", borderRadius: "50%" }}>
          <Avatar staffId={booking.staff.id} size={50} />
        </div>
        <div>
          <p className="serif" style={{ fontSize: 14, marginBottom: 2 }}>{booking.svc.name}</p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>{booking.staff.name} · {fmtLong(booking.date)} · {minsToLabel(booking.time)}</p>
          <p style={{ fontSize: 12, fontWeight: 500, marginTop: 3 }}>{formatPrice(booking.svc.price)}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusBadge status={booking.status} />
        {canCancel && !confirming && (
          <button
            onClick={() => setConfirming(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}
          >
            <i className="ti ti-trash" style={{ fontSize: 13 }} /> Cancel
          </button>
        )}
        {canCancel && confirming && (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { onCancel(booking.id); setConfirming(false); }} style={{ padding: "5px 10px", borderRadius: 999, background: "var(--danger)", color: "#fff", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirm</button>
            <button onClick={() => setConfirming(false)} style={{ padding: "5px 10px", borderRadius: 999, background: "none", border: "1px solid #D6D3D1", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Keep</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage({ bookings, onCancel, onStart }) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcoming = bookings.filter((b) => b.status === "Pending" || b.status === "Confirmed");
  const history  = bookings.filter((b) => b.status === "Completed" || b.status === "Cancelled");
  const list = activeTab === "upcoming" ? upcoming : history;

  return (
    <div className="fade-up" style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px" }}>
      <h1 className="serif" style={{ fontSize: 34, fontWeight: 700, marginBottom: 32 }}>My bookings</h1>

      <div className="booking-tabs">
        {[["upcoming", `Upcoming (${upcoming.length})`], ["history", `History (${history.length})`]].map(([key, label]) => (
          <button key={key} className={`booking-tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 56, height: 56, background: "#F5F5F4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <i className="ti ti-calendar" style={{ fontSize: 22, color: "#D6D3D1" }} />
          </div>
          <p className="serif" style={{ fontSize: 20, marginBottom: 8 }}>
            {activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments yet"}
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            {activeTab === "upcoming" ? "When you book, it'll appear here." : "Completed & cancelled bookings appear here."}
          </p>
          {activeTab === "upcoming" && (
            <GoldBtn onClick={onStart} style={{ borderRadius: 999, padding: "11px 26px" }}>Book an appointment</GoldBtn>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
}

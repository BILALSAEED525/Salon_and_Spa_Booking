import { useState } from "react";
import { minsToLabel, fmtLong } from "../../utils/helpers";
import { updateBookingStatus } from "../../api/client";

/* ══════════════════════════════════════════════════════════════════════════
   BARBER DASHBOARD — Bookings Table
══════════════════════════════════════════════════════════════════════════ */
const STATUS_STYLES = {
  Pending: { bg: "#FEF3E2", color: "#C27B0A" },
  Confirmed: { bg: "#E7EFE7", color: "#4F7A52" },
  Completed: { bg: "#EFEDE8", color: "#8A8378" },
  Cancelled: { bg: "#F6E7E4", color: "#B4483C" },
};

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const ACTIONS = {
  Pending: [
    { label: "Confirm", next: "Confirmed", icon: "ti-check", color: "#4F7A52" },
    {
      label: "Cancel",
      next: "Cancelled",
      icon: "ti-x",
      color: "var(--danger)",
    },
  ],
  Confirmed: [
    {
      label: "Complete",
      next: "Completed",
      icon: "ti-circle-check",
      color: "var(--gold-d)",
    },
    {
      label: "Cancel",
      next: "Cancelled",
      icon: "ti-x",
      color: "var(--danger)",
    },
  ],
  Completed: [],
  Cancelled: [],
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function ActionBtn({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: `1.5px solid ${color}`,
        borderRadius: 7,
        cursor: "pointer",
        color,
        fontSize: 11,
        fontWeight: 600,
        padding: "5px 10px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: "all .14s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color;
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = color;
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 13 }} /> {label}
    </button>
  );
}

export default function BookingsTable({ bookings, onStatusChange }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter((b) => {
    if (filter !== "All" && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.customerName?.toLowerCase().includes(q) ||
        b.svc?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

  const handleAction = async (booking, nextStatus) => {
    try {
      await updateBookingStatus(booking.id, nextStatus);
      onStatusChange(booking.id, nextStatus);
    } catch (err) {
      console.error("Failed to update booking:", err);
      alert("Couldn't update this booking. Please try again.");
    }
  };

  return (
    <div>
      <div
        className="bt-toolbar"
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <i
            className="ti ti-search"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 15,
              color: "var(--muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or service…"
            style={{
              width: "100%",
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              background: "#fff",
              color: "var(--ink)",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "1.5px solid",
                borderColor: filter === f ? "var(--gold)" : "var(--border)",
                background: filter === f ? "var(--gold-l)" : "#fff",
                color: filter === f ? "var(--gold-d)" : "var(--muted)",
                transition: "all .14s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
        {sorted.length} {sorted.length === 1 ? "booking" : "bookings"}
        {filter !== "All" ? ` · ${filter}` : ""}
      </p>

      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--muted)",
          }}
        >
          <i
            className="ti ti-calendar-off"
            style={{
              fontSize: 40,
              opacity: 0.3,
              display: "block",
              marginBottom: 12,
            }}
          />
          <p style={{ fontSize: 14 }}>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((b) => {
            const actions = ACTIONS[b.status] ?? [];
            return (
              <div
                key={b.id}
                className="bt-card"
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--gold-l)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--gold-d)",
                      flexShrink: 0,
                    }}
                  >
                    {(b.customerName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}
                    >
                      {b.customerName || "Customer"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      {b.svc?.name} &middot;{" "}
                      {b.date ? fmtLong(new Date(b.date)) : "—"} &middot;{" "}
                      {b.time != null ? minsToLabel(b.time) : "—"}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginTop: 2,
                      }}
                    >
                      Rs. {(b.svc?.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className="bt-card-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <StatusPill status={b.status} />
                  {actions.map((act) => (
                    <ActionBtn
                      key={act.next}
                      label={act.label}
                      icon={act.icon}
                      color={act.color}
                      onClick={() => handleAction(b, act.next)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

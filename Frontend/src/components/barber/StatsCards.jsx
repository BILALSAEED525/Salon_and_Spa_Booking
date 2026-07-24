/* ══════════════════════════════════════════════════════════════════════════
   BARBER DASHBOARD — Stats Cards row
══════════════════════════════════════════════════════════════════════════ */
function StatCard({ icon, label, value, sub, color = "var(--gold)" }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
      padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className={`ti ${icon}`} style={{ fontSize: 22, color }} />
      </div>
      <div>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: "var(--ink)" }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function StatsCards({ bookings }) {
  const total     = bookings.length;
  const pending   = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  const revenue   = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.svc?.price ?? 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = bookings.filter((b) => {
    if (!b.date) return false;
    const d = new Date(b.date); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime() && b.status !== "Cancelled";
  }).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
      <StatCard icon="ti-calendar-event"  label="Total bookings" value={total}              color="var(--gold)"    />
      <StatCard icon="ti-clock"           label="Pending"         value={pending}            color="#E9A830"        sub={`${confirmed} confirmed`} />
      <StatCard icon="ti-calendar-today"  label="Today"           value={todayCount}         color="#5A8A80"        sub="appointments" />
      <StatCard icon="ti-coin"            label="Revenue"         value={`Rs. ${revenue.toLocaleString()}`} color="#9E6A8A" sub={`${completed} completed`} />
    </div>
  );
}

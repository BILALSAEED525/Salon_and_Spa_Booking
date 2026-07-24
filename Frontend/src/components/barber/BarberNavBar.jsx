/* ══════════════════════════════════════════════════════════════════════════
   BARBER PORTAL — NavBar
   Dark theme to visually separate it from the customer portal.
══════════════════════════════════════════════════════════════════════════ */
const TABS = [
  { key: "overview",  label: "Overview",     icon: "ti-layout-dashboard" },
  { key: "bookings",  label: "Bookings",      icon: "ti-calendar" },
  { key: "profile",   label: "My Profile",    icon: "ti-user" },
];

export default function BarberNavBar({ activeTab, onTab, barber, onLogout, onGoCustomer }) {
  return (
    <nav style={{
      background: "var(--ink)", borderBottom: "1px solid rgba(255,255,255,.08)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64, padding: "0 24px", position: "sticky", top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div>
          <div className="serif" style={{ fontSize: 18, letterSpacing: "0.18em", color: "var(--gold)" }}>LUXE</div>
          <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginTop: 2 }}>
            Barber Portal
          </div>
        </div>
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,.12)", marginLeft: 6 }} />
        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onTab(key)}
              style={{
                background: activeTab === key ? "rgba(198,168,124,.15)" : "none",
                border: "none",
                borderBottom: activeTab === key ? "2px solid var(--gold)" : "2px solid transparent",
                color: activeTab === key ? "var(--gold)" : "rgba(255,255,255,.55)",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                padding: "0 14px",
                height: 64,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all .15s",
              }}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 15 }} />
              <span className="bp-tab-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* customer portal link */}
        <button
          onClick={onGoCustomer}
          style={{ background: "none", border: "1px solid rgba(255,255,255,.2)", borderRadius: 7, cursor: "pointer", color: "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 500, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}
        >
          <i className="ti ti-external-link" style={{ fontSize: 13 }} />
          Customer view
        </button>

        {/* barber initials avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {barber?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>{barber?.name?.split(" ")[0]}</span>
        </div>

        {/* logout */}
        <button
          onClick={onLogout}
          title="Log out"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 6 }}
        >
          <i className="ti ti-logout" style={{ fontSize: 17, color: "rgba(255,255,255,.5)" }} />
        </button>
      </div>
    </nav>
  );
}

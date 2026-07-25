import { useState } from "react";
import Logo from "./atoms/Logo";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "booking", label: "Services" },
  { key: "about", label: "About" },
  { key: "bookings", label: "My bookings" },
];

export default function NavBar({ activeView, onNavigate, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Logo onClick={() => go("home")} />

      <div className="nav-links-desktop" style={{ display: "flex", gap: 28 }}>
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            className={`nav-link ${activeView === key ? "active" : ""}`}
            onClick={() => go(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="navbar-right-desktop"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <button
          onClick={() => go("barber-login")}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 7,
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: 12,
            fontWeight: 500,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "all .15s",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.color = "var(--gold-d)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <i className="ti ti-scissors" style={{ fontSize: 13 }} />
          For professionals
        </button>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => go("bookings")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--gold-l)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--gold-d)",
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span
                style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}
              >
                {user.name.split(" ")[0]}
              </span>
            </button>
            <button
              onClick={onLogout}
              title="Log out"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                borderRadius: "50%",
              }}
            >
              <i
                className="ti ti-logout"
                style={{ fontSize: 16, color: "#57534E" }}
              />
            </button>
          </div>
        ) : (
          <button
            onClick={() => go("login")}
            title="Log in"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: "50%",
            }}
          >
            <i
              className="ti ti-user"
              style={{ fontSize: 18, color: "#57534E" }}
            />
          </button>
        )}
      </div>

      <button
        className="nav-burger"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menu"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
        }}
      >
        <i
          className={`ti ${mobileOpen ? "ti-x" : "ti-menu-2"}`}
          style={{ fontSize: 22, color: "var(--ink)" }}
        />
      </button>

      {mobileOpen && (
        <div className="nav-mobile-panel">
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`nav-mobile-link ${activeView === key ? "active" : ""}`}
              onClick={() => go(key)}
            >
              {label}
            </button>
          ))}
          <div className="nav-mobile-divider" />
          <button
            className="nav-mobile-link"
            onClick={() => go("barber-login")}
          >
            <i className="ti ti-scissors" style={{ marginRight: 8 }} /> For
            professionals
          </button>
          {user ? (
            <>
              <button
                className="nav-mobile-link"
                onClick={() => go("bookings")}
              >
                <i className="ti ti-user-circle" style={{ marginRight: 8 }} />{" "}
                {user.name}
              </button>
              <button
                className="nav-mobile-link"
                onClick={() => {
                  onLogout();
                  setMobileOpen(false);
                }}
              >
                <i className="ti ti-logout" style={{ marginRight: 8 }} /> Log
                out
              </button>
            </>
          ) : (
            <button className="nav-mobile-link" onClick={() => go("login")}>
              <i className="ti ti-user" style={{ marginRight: 8 }} /> Log in
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

import { useState } from "react";
import Input from "../atoms/Input";
import { GoldBtn } from "../atoms/Button";
import { specialistLogin } from "../../api/client";
import { mapSpecialistToSession } from "../../utils/helpers";
import { saveBarberSession } from "../../utils/barberAuth";

/* ══════════════════════════════════════════════════════════════════════════
   BARBER LOGIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function BarberLoginPage({
  onLogin,
  onSwitchToRegister,
  onGoCustomer,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill in both fields.");
    setLoading(true);
    try {
      const specialist = await specialistLogin({ email, password });
      const session = mapSpecialistToSession(specialist);
      saveBarberSession(session);
      onLogin(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#F5F6FA",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* back to customer */}
        <button
          onClick={onGoCustomer}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 28,
            padding: 0,
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: 15 }} /> Back to
          customer portal
        </button>

        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "36px 32px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              className="serif"
              style={{
                fontSize: 20,
                letterSpacing: ".18em",
                color: "var(--gold)",
                marginBottom: 6,
              }}
            >
              LUXE
            </div>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".18em",
                color: "var(--muted)",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Barber Portal
            </p>
            <h1 className="serif" style={{ fontSize: 24, fontWeight: 700 }}>
              Welcome back
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "center",
                  marginBottom: 14,
                  padding: "9px 14px",
                  background: "#F6E7E4",
                  borderRadius: 8,
                }}
              >
                <i className="ti ti-alert-circle" style={{ marginRight: 5 }} />
                {error}
              </p>
            )}

            <GoldBtn
              fullWidth
              disabled={loading}
              style={{ padding: 13, marginTop: 4 }}
            >
              {loading ? "Logging in…" : "Log in to portal"}
            </GoldBtn>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 22,
            }}
          >
            New professional?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--gold-d)",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Create a barber profile
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

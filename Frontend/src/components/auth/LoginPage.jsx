import { useState } from "react";
import Input from "../atoms/Input";
import { GoldBtn } from "../atoms/Button";
import { saveSession, isValidEmail } from "../../utils/auth";
import { loginCustomer } from "../../api/client";
/* ══════════════════════════════════════════════════════════════════════════
   AUTH — LoginPage
══════════════════════════════════════════════════════════════════════════ */
export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const customer = await loginCustomer({ email, password });
      const session = {
        id: customer.id,
        name: customer.full_name,
        email: customer.email,
      };
      saveSession(session);
      onLogin(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fade-up"
      style={{
        padding: "64px 20px",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="auth-card">
        <p
          style={{
            fontSize: 11,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontWeight: 600,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Welcome back
        </p>
        <h1
          className="serif"
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 26,
            textAlign: "center",
          }}
        >
          Log in to Luxe
        </h1>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
              className="field-error"
              style={{ marginBottom: 14, textAlign: "center" }}
            >
              {error}
            </p>
          )}

          <GoldBtn
            fullWidth
            disabled={loading}
            style={{ padding: 13, marginTop: 6 }}
          >
            {loading ? "Logging in…" : "Log in"}
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
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

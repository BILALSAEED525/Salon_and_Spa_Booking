import { useState } from "react";
import Input from "../atoms/Input";
import { GoldBtn } from "../atoms/Button";
import { saveSession, isValidEmail } from "../../utils/auth";
import { registerCustomer } from "../../api/client";

/* ══════════════════════════════════════════════════════════════════════════
   AUTH — SignupPage
══════════════════════════════════════════════════════════════════════════ */
export default function SignupPage({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerCustomer({ full_name: name, email, password });
      setRegistered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
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
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Almost there
          </p>
          <h1
            className="serif"
            style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            We sent a verification link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (registered) {
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
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Almost there
          </p>
          <h1
            className="serif"
            style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            We sent a verification link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (registered) {
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
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Almost there
          </p>
          <h1
            className="serif"
            style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            We sent a verification link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (registered) {
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
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Almost there
          </p>
          <h1
            className="serif"
            style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            We sent a verification link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (registered) {
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
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Almost there
          </p>
          <h1
            className="serif"
            style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            We sent a verification link to <strong>{email}</strong>. Click it to
            activate your account, then come back and log in.
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

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
          Join Luxe
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
          Create your account
        </h1>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ayesha Khan"
            autoComplete="name"
          />
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
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
            {loading ? "Creating account…" : "Create account"}
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--gold-d)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

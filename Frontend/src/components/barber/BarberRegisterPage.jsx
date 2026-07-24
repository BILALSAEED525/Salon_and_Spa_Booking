import { useState } from "react";
import Input from "../atoms/Input";
import { GoldBtn, GhostBtn } from "../atoms/Button";
import { registerSpecialist, addSpecialistService } from "../../api/client";
import { minsToTimeString } from "../../utils/helpers";
import { isValidEmail, saveBarberSession } from "../../utils/barberAuth";
/* ── helpers ── */
function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
const TIME_OPTIONS = Array.from({ length: 29 }, (_, i) => {
  const totalMins = 360 + i * 30; // 6:00 AM → 10:00 PM
  const h = Math.floor(totalMins / 60),
    m = totalMins % 60;
  const ap = h >= 12 ? "PM" : "AM",
    h12 = h % 12 || 12;
  return { value: totalMins, label: `${h12}:${pad(m)} ${ap}` };
});

/* ══════════════════════════════════════════════════════════════════════════
   BARBER REGISTER PAGE — two-section form
══════════════════════════════════════════════════════════════════════════ */
export default function BarberRegisterPage({
  onRegister,
  onSwitchToLogin,
  categories,
}) {
  /* ── personal info ── */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  /* ── professional info ── */
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [services, setServices] = useState([]);
  const [workStart, setWorkStart] = useState(540); // 9:00 AM
  const [workEnd, setWorkEnd] = useState(1020); // 5:00 PM

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSvc = (id) =>
    setServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirm)
      return setError("Please fill in all required fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");
    if (!/^\+?[\d\s\-()]{7,15}$/.test(phone))
      return setError("Please enter a valid phone number.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (services.length === 0)
      return setError("Please select at least one service you offer.");
    if (workEnd <= workStart)
      return setError("Work end time must be after start time.");

    setLoading(true);
    try {
      const specialist = await registerSpecialist({
        full_name: name,
        email,
        password_hash: password,
        phone,
        title: title || "Specialist",
        bio,
        work_start: minsToTimeString(workStart),
        work_end: minsToTimeString(workEnd),
      });
      await Promise.all(
        services.map((serviceId) =>
          addSpecialistService(specialist.id, serviceId),
        ),
      );
      const session = {
        id: specialist.id,
        name: specialist.full_name,
        email: specialist.email,
        phone: specialist.phone,
        title: specialist.title,
        bio: specialist.bio,
        services,
        workStart,
        workEnd,
        rating: 5.0,
        joinedAt: specialist.joined_at,
      };
      saveBarberSession(session);
      onRegister(session);
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
        padding: "40px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            className="serif"
            style={{
              fontSize: 22,
              letterSpacing: ".18em",
              color: "var(--gold)",
              marginBottom: 4,
            }}
          >
            LUXE
          </div>
          <h1
            className="serif"
            style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}
          >
            Join as a Professional
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Create your barber profile and start receiving bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Section 1: Personal Info ── */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "24px 28px",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </span>
              Personal Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Input
                label="Full name *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Raza"
              />
              <Input
                label="Phone number *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
              />
              <Input
                label="Email address *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                label="Password *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <Input
                label="Confirm password *"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* ── Section 2: Professional Info ── */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "24px 28px",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </span>
              Professional Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <Input
                label="Professional title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Stylist"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div className="field">
                  <label>Work start</label>
                  <select
                    value={workStart}
                    onChange={(e) => setWorkStart(Number(e.target.value))}
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Work end</label>
                  <select
                    value={workEnd}
                    onChange={(e) => setWorkEnd(Number(e.target.value))}
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 20 }}>
              <label>Short bio (optional)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell clients about your experience, style and what you specialise in…"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* services checkboxes */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--ink)",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Services you offer *{" "}
                <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                  (select all that apply)
                </span>
              </label>
              {(categories || []).map((cat) => (
                <div key={cat.cat} style={{ marginBottom: 14 }}>
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      color: cat.color,
                      fontWeight: 700,
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <i className={`ti ${cat.icon}`} /> {cat.cat}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cat.items.map((item) => {
                      const checked = services.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            cursor: "pointer",
                            fontSize: 13,
                            background: checked ? cat.bg : "#F9F8F6",
                            border: `1.5px solid ${checked ? cat.color : "var(--border)"}`,
                            borderRadius: 9,
                            padding: "7px 13px",
                            transition: "all .14s",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSvc(item.id)}
                            style={{
                              accentColor: cat.color,
                              width: 14,
                              height: 14,
                              cursor: "pointer",
                            }}
                          />
                          <span
                            style={{
                              color: checked ? "var(--ink)" : "var(--muted)",
                            }}
                          >
                            {item.name}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>
                            · {item.dur}m
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "center",
                marginBottom: 12,
                padding: "10px 16px",
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
            style={{ padding: 14, fontSize: 15 }}
          >
            {loading ? "Creating your profile…" : "Create barber profile"}
          </GoldBtn>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 20,
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

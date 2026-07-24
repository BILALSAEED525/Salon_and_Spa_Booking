/* ══════════════════════════════════════════════════════════════════════════
   MOLECULES — ProgressSteps
══════════════════════════════════════════════════════════════════════════ */
const STEP_LABELS = ["Service", "Specialist", "Date & time", "Confirm"];

export default function ProgressSteps({ step, onJump }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        {/* connector line */}
        <div style={{
          position: "absolute", left: 0, top: 16, width: "100%",
          height: 1, background: "var(--border)", zIndex: 0,
        }} />

        {[1, 2, 3, 4].map((n, i) => {
          const isActive = step === n, isPast = step > n;
          return (
            <button
              key={n}
              disabled={n > step}
              onClick={() => onJump(n)}
              style={{
                position: "relative", zIndex: 1,
                display: "flex", flexDirection: "column", alignItems: "center",
                background: "var(--cream)", padding: "0 8px",
                border: "none", cursor: n <= step ? "pointer" : "not-allowed",
              }}
            >
              {/* circle */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 500, transition: "all .28s",
                background: isActive ? "var(--gold)" : isPast ? "var(--ink)" : "#fff",
                color: isActive || isPast ? "#fff" : "#A8A29E",
                border: isActive || isPast ? "none" : "1px solid #D6D3D1",
                boxShadow: isActive ? "0 0 0 4px rgba(198,168,124,.22)" : "none",
              }}>
                {isPast
                  ? <i className="ti ti-check" style={{ fontSize: 14 }} />
                  : n}
              </div>
              {/* label */}
              <span
                className="step-label"
                style={{
                  position: "absolute", top: 40,
                  fontSize: 10, fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: ".08em", whiteSpace: "nowrap",
                  color: isActive ? "var(--ink)" : "#A8A29E",
                }}
              >
                {STEP_LABELS[i]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

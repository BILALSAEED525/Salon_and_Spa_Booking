/* ── GoldBtn ── */
export function GoldBtn({ children, onClick, disabled, style, fullWidth }) {
  return (
    <button
      className="btn btn-gold"
      onClick={onClick}
      disabled={disabled}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
    >
      {children}
    </button>
  );
}

/* ── GhostBtn ── */
export function GhostBtn({ children, onClick, disabled, style }) {
  return (
    <button className="btn btn-ghost" onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

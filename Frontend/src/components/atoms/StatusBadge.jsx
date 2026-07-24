/* ── StatusBadge ── */
const STATUS_STYLES = {
  Pending:   { background: "#F3ECE0", color: "#B0946A" },
  Confirmed: { background: "#E7EFE7", color: "#4F7A52" },
  Completed: { background: "#EFEDE8", color: "#8A8378" },
  Cancelled: { background: "#F6E7E4", color: "#B4483C" },
};
export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span style={{
      ...s, padding: "4px 10px", borderRadius: 999,
      fontSize: 10, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

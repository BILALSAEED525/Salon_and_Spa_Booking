/* ══════════════════════════════════════════════════════════════════════════
   ATOMS — Input
══════════════════════════════════════════════════════════════════════════ */
export default function Input({ label, error, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input {...rest} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════════════════════════ */
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap');
      @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --cream: #FDFBF7; --ink: #1C1C1C;
        --gold: #C6A87C; --gold-d: #B0946A; --gold-l: #F3ECE0;
        --muted: #78716C; --border: #E7E5E4; --danger: #B4483C;
      }

      body {
        font-family: 'Inter', sans-serif;
        background: var(--cream);
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
      }

      .serif { font-family: 'Playfair Display', serif; }

      /* ── Buttons ── */
      .btn {
        display: inline-flex; align-items: center; justify-content: center;
        font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px;
        letter-spacing: 0.04em; border-radius: 8px; border: none;
        cursor: pointer; transition: opacity .15s, transform .12s;
      }
      .btn:active { transform: translateY(1px); }
      .btn:disabled { opacity: .45; cursor: not-allowed; }
      .btn-gold { background: var(--gold); color: #fff; padding: 11px 24px; }
      .btn-gold:hover:not(:disabled) { opacity: .88; }
      .btn-ghost {
        background: transparent; color: var(--ink);
        border: 1.5px solid #D6D3D1; padding: 10px 22px;
      }
      .btn-ghost:hover:not(:disabled) { border-color: var(--gold); }

      /* ── Nav ── */
      .nav-link {
        background: none; border: none; border-bottom: 2px solid transparent;
        font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
        color: var(--muted); padding: 6px 0; cursor: pointer; transition: all .15s;
      }
      .nav-link:hover { color: var(--ink); }
      .nav-link.active { color: var(--ink); border-bottom-color: var(--gold); }

      /* ── Animations ── */
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      .fade-up { animation: fadeUp .38s cubic-bezier(.22,1,.36,1) both; }

      @keyframes scaleIn { from { opacity: 0; transform: scale(.82); } to { opacity: 1; transform: none; } }
      .scale-in { animation: scaleIn .42s cubic-bezier(.22,1,.36,1) both; }

      @keyframes checkDraw { from { stroke-dashoffset: 48; } to { stroke-dashoffset: 0; } }
      .check-path { stroke-dasharray: 48; animation: checkDraw .55s ease .2s both; }

      /* ── Hoverable cards ── */
      .hoverable { transition: transform .2s ease, box-shadow .2s ease; }
      .hoverable:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }

      /* ── Layout ── */
      .page-wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
      .booking-layout { display: flex; gap: 40px; align-items: flex-start; }
      .booking-main { flex: 1; min-width: 0; }
      .booking-sidebar-wrap { width: 260px; flex-shrink: 0; position: sticky; top: 80px; }

      /* ── Service category tabs ── */
      .cat-tabs { display: flex; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; }
      .cat-tab {
        flex: 1; min-width: 120px; max-width: 200px;
        display: flex; flex-direction: column; align-items: center; gap: 10px;
        padding: 18px 14px; border-radius: 14px; border: 2px solid var(--border);
        background: #fff; cursor: pointer; transition: all .2s;
      }
      .cat-tab.active {
        border-color: var(--active-color, var(--gold));
        background: var(--active-bg, var(--gold-l));
      }
      .cat-icon-circle {
        width: 58px; height: 58px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background .2s;
      }

      /* ── Date/Time layout ── */
      .datetime-grid { display: flex; gap: 32px; }
      .calendar-col { flex: 0 0 auto; width: 280px; }
      .slots-col { flex: 1; border-left: 1px solid #F0EDE8; padding-left: 28px; }
      .cal-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
      .slot-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }

      /* ── Booking tabs ── */
      .booking-tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
      .booking-tab {
        padding: 11px 18px; font-family: 'Inter', sans-serif; font-size: 12px;
        font-weight: 500; text-transform: uppercase; letter-spacing: .06em;
        background: none; border: none; border-bottom: 2px solid transparent;
        margin-bottom: -1px; color: #A8A29E; cursor: pointer; transition: all .15s;
      }
      .booking-tab.active { color: var(--ink); border-bottom-color: var(--gold); }

      /* ── Auth card ── */
      .auth-card {
        width: 100%; max-width: 400px; margin: 0 auto;
        background: #fff; border: 1px solid var(--border);
        border-radius: 18px; padding: 36px 32px;
      }

      /* ── Form fields ── */
      .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
      .field label {
        font-size: 12px; font-weight: 600; color: var(--ink); letter-spacing: .02em;
      }
      .field input,
      .field select,
      .field textarea {
        padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 8px;
        font-size: 13px; font-family: 'Inter', sans-serif; color: var(--ink);
        background: #fff; outline: none; transition: border-color .15s;
        width: 100%;
      }
      .field input:focus,
      .field select:focus,
      .field textarea:focus { border-color: var(--gold); }
      .field input::placeholder,
      .field textarea::placeholder { color: #C4C0BB; }
      .field select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; }
      .field textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
      .field-error { font-size: 12px; color: var(--danger); margin-top: 2px; }

      /* ── Barber portal nav tab label ── */
      @media (max-width: 700px) {
        .bp-tab-label { display: none; }
      }

      /* ── Responsive ── */
      @media (max-width: 860px) {
        .booking-layout { flex-direction: column; }
        .booking-sidebar-wrap { width: 100%; position: static; order: -1; }
        .datetime-grid { flex-direction: column; }
        .slots-col { border-left: none; padding-left: 0; border-top: 1px solid #F0EDE8; padding-top: 20px; }
        .calendar-col { width: 100%; }
      }
      @media (max-width: 640px) {
        .nav-links { gap: 14px; }
        .nav-link { font-size: 11px; }
        .step-label { display: none; }
        .cat-tabs { gap: 8px; }
        .cat-tab { min-width: 90px; padding: 14px 8px; }
        .auth-card { padding: 28px 20px; }
      }
    `}</style>
  );
}

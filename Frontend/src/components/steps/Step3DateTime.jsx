import { buildCalGrid, sameDay, startDay, genSlots } from "../../utils/helpers";
import { GoldBtn, GhostBtn } from "../atoms/Button";

/* ══════════════════════════════════════════════════════════════════════════
   STEP 3 — Date & Time
   └─ CalendarMonth   →  monthly calendar with prev/next navigation
   └─ TimeSlotPicker  →  grid of available/booked time slots
   └─ Step3DateTime   →  assembled step
══════════════════════════════════════════════════════════════════════════ */
function CalendarMonth({ vMonth, canPrev, onPrev, onNext, selDate, onSelectDate }) {
  const today = startDay(new Date());
  const cells = buildCalGrid(vMonth);
  const monthLabel = vMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      {/* month header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button
          onClick={onPrev}
          disabled={!canPrev}
          style={{ width: 34, height: 34, borderRadius: "50%", background: "#F5F5F4", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: canPrev ? "pointer" : "not-allowed", opacity: canPrev ? 1 : .3 }}
        >
          <i className="ti ti-chevron-left" style={{ fontSize: 16, color: "var(--muted)" }} />
        </button>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{monthLabel}</h3>
        <button
          onClick={onNext}
          style={{ width: 34, height: 34, borderRadius: "50%", background: "#F5F5F4", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <i className="ti ti-chevron-right" style={{ fontSize: 16, color: "var(--muted)" }} />
        </button>
      </div>

      {/* day grid */}
      <div className="cal-days">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#A8A29E", paddingBottom: 6 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isPast = d < today;
          const isSel  = selDate && sameDay(d, selDate);
          const isToday = sameDay(d, today);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => onSelectDate(d)}
                disabled={isPast}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: isSel ? 600 : 400,
                  border: isToday && !isSel ? "1.5px solid var(--gold)" : "1.5px solid transparent",
                  background: isSel ? "var(--gold)" : "transparent",
                  color: isPast ? "#D6D3D1" : isSel ? "#fff" : "var(--ink)",
                  cursor: isPast ? "not-allowed" : "pointer",
                  boxShadow: isSel ? "0 4px 10px rgba(198,168,124,.4)" : "none",
                  transition: "all .14s",
                }}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlotPicker({ slots, selTime, onSelectTime }) {
  if (!slots) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#A8A29E" }}>
        <i className="ti ti-calendar" style={{ fontSize: 38, opacity: .25, display: "block", marginBottom: 10 }} />
        <p style={{ fontSize: 13 }}>Select a date to view available times</p>
      </div>
    );
  }
  if (slots.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#A8A29E" }}>
        <i className="ti ti-info-circle" style={{ fontSize: 30, opacity: .35, display: "block", marginBottom: 10 }} />
        <p style={{ fontSize: 13 }}>No openings today — try another date.</p>
      </div>
    );
  }
  return (
    <div className="slot-grid">
      {slots.map((s) => {
        const isSel = selTime === s.start;
        return (
          <button
            key={s.start}
            onClick={() => onSelectTime(s.start)}
            disabled={!s.avail}
            style={{
              padding: "10px 6px", borderRadius: 10,
              border: `1.5px solid ${isSel ? "var(--gold)" : "var(--border)"}`,
              background: isSel ? "var(--gold)" : "transparent",
              color: isSel ? "#fff" : s.avail ? "var(--ink)" : "#D6D3D1",
              fontSize: 12, fontWeight: 500,
              cursor: s.avail ? "pointer" : "not-allowed",
              textDecoration: s.avail ? "none" : "line-through",
              transition: "all .14s",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Step3DateTime({ svc, staff, existingSlots, vMonth, setVMonth, selDate, setSelDate, selTime, setSelTime, onBack, onNext }) {
  const today = startDay(new Date());
  const canPrev = vMonth.getFullYear() > today.getFullYear() || vMonth.getMonth() > today.getMonth();

  const slots = selDate
    ? genSlots(staff, selDate, svc.dur, existingSlots)
    : null;

  const handleSelectDate = (d) => { setSelDate(d); setSelTime(null); };
  const changeMonth = (dir) => setVMonth(new Date(vMonth.getFullYear(), vMonth.getMonth() + dir, 1));

  const canProceed = selDate && selTime != null;

  return (
    <div className="fade-up">
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Select date &amp; time</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>Pick your preferred appointment slot.</p>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, padding: 24 }}>
        <div className="datetime-grid">
          <div className="calendar-col">
            <CalendarMonth
              vMonth={vMonth}
              canPrev={canPrev}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
              selDate={selDate}
              onSelectDate={handleSelectDate}
            />
          </div>
          <div className="slots-col">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Available slots</h3>
            <TimeSlotPicker slots={slots} selTime={selTime} onSelectTime={setSelTime} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <GhostBtn onClick={onBack}>Back</GhostBtn>
        <GoldBtn onClick={onNext} disabled={!canProceed} style={{ opacity: canProceed ? 1 : .45 }}>
          Next: confirmation
        </GoldBtn>
      </div>
    </div>
  );
}

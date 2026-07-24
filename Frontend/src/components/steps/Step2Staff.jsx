import Avatar from "../atoms/Avatar";
import { GoldBtn, GhostBtn } from "../atoms/Button";

function SpecialtyIcon({ name, icon }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "#F5F5F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className={`ti ${icon}`}
          style={{ fontSize: 15, color: "var(--muted)" }}
        />
      </div>
      <span style={{ fontSize: 10, color: "var(--muted)" }}>{name}</span>
    </div>
  );
}

function StaffCard({ member, isSelected, onSelect }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `2px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
        borderRadius: 18,
        overflow: "hidden",
        transform: isSelected ? "translateY(-4px)" : "none",
        boxShadow: isSelected ? "0 16px 32px rgba(198,168,124,.18)" : "none",
        transition: "all .25s",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#F3ECE0,#E8D5C0)",
          padding: "22px 16px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255,255,255,.9)",
            borderRadius: 999,
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <i
            className="ti ti-star-filled"
            style={{ fontSize: 11, color: "#F59E0B" }}
          />
          <span style={{ fontSize: 12, fontWeight: 700 }}>{member.rating}</span>
        </div>

        <div style={{ border: "3px solid #fff", borderRadius: "50%" }}>
          <Avatar staffId={member.id} name={member.name} size={90} />
        </div>

        <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
          <h3 className="serif" style={{ fontSize: 16, fontWeight: 700 }}>
            {member.name}
          </h3>
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: "#A8A29E",
              fontWeight: 500,
              marginTop: 3,
            }}
          >
            {member.title}
          </p>
        </div>
      </div>

      <div
        style={{ padding: "14px 16px 18px", borderTop: "1px solid #F5F5F4" }}
      >
        <p
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: ".1em",
            color: "#A8A29E",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Specialties
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {member.specs.map(([name, icon]) => (
            <SpecialtyIcon key={name} name={name} icon={icon} />
          ))}
        </div>
        <button
          onClick={() => onSelect(member)}
          className="btn btn-gold"
          style={{
            width: "100%",
            padding: 10,
            fontSize: 12,
            letterSpacing: ".05em",
            textTransform: "uppercase",
            borderRadius: 10,
            background: isSelected ? "var(--gold)" : "#F5F5F4",
            color: isSelected ? "#fff" : "#57534E",
          }}
        >
          {isSelected ? "✓ Selected" : "Select stylist"}
        </button>
      </div>
    </div>
  );
}

export default function Step2Staff({
  specialists,
  selectedStaff,
  onSelectStaff,
  onBack,
  onNext,
}) {
  if (!specialists || specialists.length === 0) {
    return (
      <div className="fade-up">
        <p style={{ color: "var(--muted)" }}>Loading specialists…</p>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <h1
        className="serif"
        style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}
      >
        Choose your specialist
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
        Our certified professionals are here to make you look your best.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 18,
          marginBottom: 32,
        }}
      >
        {specialists.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            isSelected={selectedStaff?.id === member.id}
            onSelect={onSelectStaff}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <GhostBtn onClick={onBack}>Back</GhostBtn>
        <GoldBtn
          onClick={onNext}
          disabled={!selectedStaff}
          style={{ opacity: selectedStaff ? 1 : 0.45 }}
        >
          Next: date &amp; time
        </GoldBtn>
      </div>
    </div>
  );
}

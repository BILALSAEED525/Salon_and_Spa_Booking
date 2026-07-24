import { formatPrice } from "../../utils/helpers";

function CategoryTabs({ categories, activeCatIdx, onChange }) {
  return (
    <div className="cat-tabs">
      {categories.map((s, i) => {
        const isActive = activeCatIdx === i;
        return (
          <button
            key={s.cat}
            className={`cat-tab ${isActive ? "active" : ""}`}
            style={{ "--active-color": s.color, "--active-bg": s.bg }}
            onClick={() => onChange(i)}
          >
            <div
              className="cat-icon-circle"
              style={{ background: isActive ? s.color : s.bg }}
            >
              <i
                className={`ti ${s.icon}`}
                style={{ fontSize: 26, color: isActive ? "#fff" : s.color }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isActive ? "var(--ink)" : "var(--muted)",
                textAlign: "center",
              }}
            >
              {s.cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ServiceItem({ item, category, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        background: isSelected ? category.bg : "#fff",
        border: `1.5px solid ${isSelected ? category.color : "var(--border)"}`,
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        transition: "all .18s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 10,
            flexShrink: 0,
            background: isSelected ? category.color : category.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .18s",
          }}
        >
          <i
            className={`ti ${category.icon}`}
            style={{
              fontSize: 20,
              color: isSelected ? "#fff" : category.color,
            }}
          />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
            {item.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <i className="ti ti-clock" style={{ fontSize: 12 }} /> {item.dur}{" "}
            min
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {formatPrice(item.price)}
        </span>
        <i
          className="ti ti-chevron-right"
          style={{
            fontSize: 18,
            color: isSelected ? category.color : "#D6D3D1",
          }}
        />
      </div>
    </button>
  );
}

export default function Step1Service({
  svc,
  catIdx,
  onCatChange,
  onSelectSvc,
  categories,
}) {
  if (!categories || categories.length === 0) {
    return (
      <div className="fade-up">
        <p style={{ color: "var(--muted)" }}>Loading services…</p>
      </div>
    );
  }

  const activeCat = categories[catIdx] || categories[0];

  return (
    <div className="fade-up">
      <h1
        className="serif"
        style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}
      >
        Choose your service
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
        Select from our curated menu of premium treatments.
      </p>

      <CategoryTabs
        categories={categories}
        activeCatIdx={catIdx}
        onChange={onCatChange}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activeCat.items.map((item) => (
          <ServiceItem
            key={item.id}
            item={item}
            category={activeCat}
            isSelected={svc?.id === item.id}
            onSelect={onSelectSvc}
          />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import BarberNavBar from "./BarberNavBar";
import StatsCards from "./StatsCards";
import BookingsTable from "./BookingsTable";
import { GoldBtn } from "../atoms/Button";
import Input from "../atoms/Input";
import {
  getBookings,
  getCustomers,
  updateSpecialist,
  getSpecialistServices,
  addSpecialistService,
  removeSpecialistService,
} from "../../api/client";
import {
  minsToLabel,
  fmtLong,
  minsToTimeString,
  mapBookingForBarber,
} from "../../utils/helpers";

/* ══════════════════════════════════════════════════════════════════════════
   helpers
══════════════════════════════════════════════════════════════════════════ */
function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
function minsToTimeStr(m) {
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}
function timeStrToMins(s) {
  const [h, mn] = s.split(":").map(Number);
  return h * 60 + mn;
}

function allServiceItems(categories) {
  return (categories || []).flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      catName: cat.cat,
      catIcon: cat.icon,
      catColor: cat.color,
      catBg: cat.bg,
    })),
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════════════════════════════════════ */
function TodaySchedule({ bookings }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayBookings = bookings
    .filter((b) => {
      if (!b.date || b.status === "Cancelled") return false;
      const d = new Date(b.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    })
    .sort((a, b) => (a.time ?? 0) - (b.time ?? 0));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 22,
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <i
          className="ti ti-calendar-today"
          style={{ color: "var(--gold)", fontSize: 18 }}
        />{" "}
        Today&apos;s Schedule
      </h3>
      {todayBookings.length === 0 ? (
        <p
          style={{
            color: "var(--muted)",
            fontSize: 13,
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No appointments today
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {todayBookings.map((b) => (
            <div
              key={b.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "var(--gold-l)",
                borderRadius: 10,
              }}
            >
              <div style={{ textAlign: "center", minWidth: 48 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gold-d)",
                  }}
                >
                  {b.time != null ? minsToLabel(b.time) : "—"}
                </p>
              </div>
              <div
                style={{
                  width: 1,
                  height: 32,
                  background: "var(--gold)",
                  opacity: 0.35,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>
                  {b.customerName || "Customer"}
                </p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>
                  {b.svc?.name}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--gold-d)",
                }}
              >
                Rs. {(b.svc?.price || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewTab({ barber, bookings, onStatusChange }) {
  const recent = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
  return (
    <div>
      <StatsCards bookings={bookings} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <TodaySchedule bookings={bookings} />
        {/* recent activity */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 22,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i
              className="ti ti-history"
              style={{ color: "var(--gold)", fontSize: 18 }}
            />{" "}
            Recent Bookings
          </h3>
          {recent.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No bookings yet
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recent.map((b) => {
                const ss = {
                  Pending: "#E9A830",
                  Confirmed: "#4F7A52",
                  Completed: "#8A8378",
                  Cancelled: "#B4483C",
                };
                return (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #F5F5F4",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>
                        {b.customerName || "Customer"}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>
                        {b.svc?.name}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: ss[b.status] || "var(--muted)",
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════════════════════════════════════════ */
function ProfileTab({ barber, onSave, categories }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...barber });
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleSvc = (id) => {
    const list = form.services || [];
    setForm((f) => ({
      ...f,
      services: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    }));
  };

  const handleSave = () => {
    const updated = {
      ...form,
      workStart:
        typeof form.workStart === "string"
          ? timeStrToMins(form.workStart)
          : form.workStart,
      workEnd:
        typeof form.workEnd === "string"
          ? timeStrToMins(form.workEnd)
          : form.workEnd,
    };
    onSave(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayWorkStart =
    typeof form.workStart === "number"
      ? minsToTimeStr(form.workStart)
      : form.workStart;
  const displayWorkEnd =
    typeof form.workEnd === "number"
      ? minsToTimeStr(form.workEnd)
      : form.workEnd;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* profile card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, var(--gold-l), #E8D5C0)",
            padding: "32px 20px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              margin: "0 auto 16px",
              border: "3px solid #fff",
            }}
          >
            {barber.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="serif" style={{ fontSize: 20, fontWeight: 700 }}>
            {barber.name}
          </h2>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            {barber.title}
          </p>
        </div>
        <div style={{ padding: "18px 20px" }}>
          {[
            ["ti-mail", barber.email],
            ["ti-phone", barber.phone],
            ["ti-clock", `${displayWorkStart} – ${displayWorkEnd}`],
          ].map(([icon, val]) => (
            <div
              key={icon}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <i
                className={`ti ${icon}`}
                style={{
                  fontSize: 16,
                  color: "var(--gold)",
                  width: 20,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{val}</span>
            </div>
          ))}
          {/* services offered tags */}
          <div style={{ marginTop: 8 }}>
            <p
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".1em",
                color: "#A8A29E",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Services offered
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(barber.services || []).map((id) => {
                const svc = allServiceItems(categories).find(
                  (s) => s.id === id,
                );
                if (!svc) return null;
                return (
                  <span
                    key={id}
                    style={{
                      background: svc.catBg,
                      color: svc.catColor,
                      border: `1px solid ${svc.catColor}30`,
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 9px",
                    }}
                  >
                    {svc.name}
                  </span>
                );
              })}
            </div>
          </div>
          {barber.bio && (
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.65,
                marginTop: 14,
                borderTop: "1px solid var(--border)",
                paddingTop: 14,
              }}
            >
              {barber.bio}
            </p>
          )}
        </div>
      </div>

      {/* edit form */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Profile</h3>
          {saved && (
            <span
              style={{
                fontSize: 12,
                color: "#4F7A52",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <i className="ti ti-check" /> Saved!
            </span>
          )}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <Input
            label="Full name"
            value={form.name}
            onChange={set("name")}
            type="text"
          />
          <Input
            label="Phone number"
            value={form.phone}
            onChange={set("phone")}
            type="tel"
          />
          <Input
            label="Professional title"
            value={form.title}
            onChange={set("title")}
            type="text"
            placeholder="e.g. Senior Stylist"
          />
          <Input
            label="Email"
            value={form.email}
            onChange={set("email")}
            type="email"
          />
          <div className="field">
            <label>Work start</label>
            <input
              type="time"
              value={displayWorkStart}
              onChange={(e) =>
                setForm((f) => ({ ...f, workStart: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Work end</label>
            <input
              type="time"
              value={displayWorkEnd}
              onChange={(e) =>
                setForm((f) => ({ ...f, workEnd: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: 6 }}>
          <label>Short bio</label>
          <textarea
            value={form.bio || ""}
            onChange={set("bio")}
            rows={3}
            placeholder="Tell clients about your experience and style…"
            style={{ resize: "vertical" }}
          />
        </div>

        {/* services checkboxes */}
        <div style={{ marginTop: 6 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink)",
              display: "block",
              marginBottom: 10,
            }}
          >
            Services you offer
          </label>
          {(categories || []).map((cat) => (
            <div key={cat.cat} style={{ marginBottom: 12 }}>
              <p
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  color: cat.color,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                <i className={`ti ${cat.icon}`} style={{ marginRight: 5 }} />
                {cat.cat}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.items.map((item) => {
                  const checked = (form.services || []).includes(item.id);
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
                        borderRadius: 8,
                        padding: "6px 12px",
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
                        }}
                      />
                      <span
                        style={{
                          color: checked ? "var(--ink)" : "var(--muted)",
                        }}
                      >
                        {item.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <GoldBtn
          onClick={handleSave}
          style={{ marginTop: 18, padding: "11px 28px" }}
        >
          <i className="ti ti-device-floppy" style={{ marginRight: 6 }} /> Save
          changes
        </GoldBtn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BARBER DASHBOARD — Root
══════════════════════════════════════════════════════════════════════════ */
export default function BarberDashboard({
  barber: initialBarber,
  onLogout,
  onGoCustomer,
  categories,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [barber, setBarber] = useState(initialBarber);
  const [bookings, setBookings] = useState([]);

  const loadBookings = () => {
    Promise.all([getBookings(), getCustomers()])
      .then(([allBookings, customers]) => {
        const mine = allBookings
          .filter((b) => b.specialist === barber.id)
          .map((b) => mapBookingForBarber(b, categories, customers));
        setBookings(mine);
      })
      .catch((err) => console.error("Failed to load bookings:", err));
  };

  /* refresh every 5 s from Postgres so new customer bookings appear live */
  useEffect(() => {
    loadBookings();
    const id = setInterval(loadBookings, 5000);
    return () => clearInterval(id);
  }, [barber.id]);

  const handleSaveProfile = async (updates) => {
    try {
      const updated = await updateSpecialist(barber.id, {
        full_name: updates.name,
        email: updates.email,
        phone: updates.phone,
        title: updates.title,
        bio: updates.bio,
        work_start: minsToTimeString(updates.workStart),
        work_end: minsToTimeString(updates.workEnd),
      });

      const links = await getSpecialistServices();
      const mine = links.filter((l) => l.specialist === barber.id);
      const currentIds = mine.map((l) => l.service);
      const desiredIds = updates.services || [];
      const toAdd = desiredIds.filter((id) => !currentIds.includes(id));
      const toRemove = mine.filter((l) => !desiredIds.includes(l.service));

      await Promise.all([
        ...toAdd.map((serviceId) => addSpecialistService(barber.id, serviceId)),
        ...toRemove.map((l) => removeSpecialistService(l.id)),
      ]);

      setBarber({
        ...barber,
        name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        title: updated.title,
        bio: updated.bio,
        workStart: updates.workStart,
        workEnd: updates.workEnd,
        services: desiredIds,
      });
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Couldn't save your profile. Please try again.");
    }
  };

  const handleStatusChange = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  };
  return (
    <div style={{ background: "#F5F6FA", minHeight: "100vh" }}>
      <BarberNavBar
        activeTab={activeTab}
        onTab={setActiveTab}
        barber={barber}
        onLogout={onLogout}
        onGoCustomer={onGoCustomer}
      />

      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}
      >
        {/* welcome line */}
        <div style={{ marginBottom: 24 }}>
          <h1
            className="serif"
            style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}
          >
            Welcome back, {barber.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>
            {barber.title} &middot; {barber.email}
          </p>
        </div>

        {activeTab === "overview" && (
          <OverviewTab
            barber={barber}
            bookings={bookings}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "bookings" && (
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              All Bookings
            </h2>
            <BookingsTable
              bookings={bookings}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
        {activeTab === "profile" && (
          <ProfileTab
            barber={barber}
            onSave={handleSaveProfile}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}

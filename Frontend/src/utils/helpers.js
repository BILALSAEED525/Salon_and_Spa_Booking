/* ══════════════════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════════════════ */
export const pad = (n) => (n < 10 ? "0" + n : "" + n);

export const minsToLabel = (m) => {
  const h = Math.floor(m / 60),
    mn = m % 60,
    ap = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${pad(mn)} ${ap}`;
};

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const startDay = (d) => {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
};

export const fmtLong = (d) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const fmtShort = (d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatPrice = (p) => `Rs. ${p.toLocaleString()}`;

export const buildCalGrid = (v) => {
  const y = v.getFullYear(),
    m = v.getMonth();
  const sw = new Date(y, m, 1).getDay(),
    dim = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < sw; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(y, m, d));
  return cells;
};

export const genSlots = (staff, date, dur, existingSlots) => {
  if (!staff || !date) return [];
  const now = new Date(),
    isToday = sameDay(date, now);
  const nowM = now.getHours() * 60 + now.getMinutes();
  const dayBusy = existingSlots.filter(
    (b) => b.sid === staff.id && sameDay(b.date, date),
  );
  const slots = [];
  for (let t = staff.ws; t + dur <= staff.we; t += 30) {
    const blocked = dayBusy.some((b) => t < b.e && t + dur > b.s);
    const past = isToday && t <= nowM + 30;
    slots.push({ start: t, label: minsToLabel(t), avail: !blocked && !past });
  }
  return slots;
};

export const makeExistingSlots = () => {
  const t = new Date();
  const mk = (sid, dayOff, s, e) => {
    const dt = new Date(t);
    dt.setDate(dt.getDate() + dayOff);
    dt.setHours(0, 0, 0, 0);
    return { sid, date: dt, s, e };
  };
  return [
    mk("st1", 0, 11 * 60, 12 * 60),
    mk("st1", 0, 14 * 60, 16 * 60),
    mk("st2", 1, 9 * 60, 10 * 60),
    mk("st3", 1, 12 * 60, 13.5 * 60),
  ];
};
const CATEGORY_STYLE = {
  "Hair care": { icon: "ti-cut", color: "#C6A87C", bg: "#F3ECE0" },
  "Makeup artistry": { icon: "ti-sparkles", color: "#9E6A8A", bg: "#F8F0F5" },
  "Body & spa": { icon: "ti-droplet", color: "#5A8A80", bg: "#EEF6F4" },
};
const DEFAULT_STYLE = { icon: "ti-star", color: "#8A8A8A", bg: "#F0F0F0" };

export function groupServicesByCategory(categories, services) {
  return categories.map((cat) => {
    const style = CATEGORY_STYLE[cat.name] || DEFAULT_STYLE;
    return {
      cat: cat.name,
      icon: style.icon,
      color: style.color,
      bg: style.bg,
      items: services
        .filter((s) => s.category === cat.id)
        .map((s) => ({
          id: s.id,
          name: s.name,
          dur: s.duration_minutes,
          price: Number(s.price),
        })),
    };
  });
}

function timeStringToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function mapSpecialistFromApi(specialist, categories) {
  const specs = (specialist.services || []).slice(0, 3).map((s) => {
    const cat = categories.find((c) => c.items.some((it) => it.id === s.id));
    return [s.name, cat ? cat.icon : "ti-star"];
  });
  return {
    id: specialist.id,
    name: specialist.full_name,
    title: specialist.title || "Specialist",
    rating: Number(specialist.rating),
    ws: timeStringToMinutes(specialist.work_start),
    we: timeStringToMinutes(specialist.work_end),
    specs: specs.length ? specs : [["Service", "ti-cut"]],
  };
}
// Turns a JS Date into "YYYY-MM-DD" — the format Postgres expects for booking_date
export const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Turns minutes-since-midnight (e.g. 540) into "HH:MM:SS" — the format Postgres expects for start_time
export const minsToTimeString = (m) =>
  `${pad(Math.floor(m / 60))}:${pad(m % 60)}:00`;

// Takes a raw booking row straight from the API and reshapes it into what
// MyBookingsPage's cards already expect: nested svc/staff objects, a real
// Date object, and time as minutes-since-midnight instead of a "HH:MM:SS" string.
export function mapBookingFromApi(booking, categories, specialists) {
  let serviceName = "Service";
  for (const cat of categories) {
    const found = cat.items.find((it) => it.id === booking.service);
    if (found) {
      serviceName = found.name;
      break;
    }
  }
  const specialist = specialists.find((s) => s.id === booking.specialist);
  return {
    id: booking.id,
    svc: {
      id: booking.service,
      name: serviceName,
      price: Number(booking.price),
    },
    staff: {
      id: booking.specialist,
      name: specialist ? specialist.name : "Specialist",
    },
    date: new Date(`${booking.booking_date}T00:00:00`),
    time: timeStringToMinutes(booking.start_time),
    status: booking.status,
  };
}

// Takes a raw booking row and reshapes it into the { sid, date, s, e } format
// that genSlots() already knows how to check for overlaps — this is the exact
// piece that will let "is this slot taken" check real bookings instead of the
// old hardcoded fake array.
export function mapBookingToSlot(booking) {
  const s = timeStringToMinutes(booking.start_time);
  return {
    id: booking.id,
    sid: booking.specialist,
    date: new Date(`${booking.booking_date}T00:00:00`),
    s,
    e: s + booking.duration_minutes,
  };
}
export function mapSpecialistToSession(specialist) {
  return {
    id: specialist.id,
    name: specialist.full_name,
    email: specialist.email,
    phone: specialist.phone || "",
    title: specialist.title || "Specialist",
    bio: specialist.bio || "",
    services: (specialist.services || []).map((s) => s.id),
    workStart: timeStringToMinutes(specialist.work_start),
    workEnd: timeStringToMinutes(specialist.work_end),
    rating: Number(specialist.rating),
    joinedAt: specialist.joined_at,
  };
}

export function mapBookingForBarber(booking, categories, customers) {
  let serviceName = "Service";
  for (const cat of categories) {
    const found = cat.items.find((it) => it.id === booking.service);
    if (found) {
      serviceName = found.name;
      break;
    }
  }
  const customer = customers.find((c) => c.id === booking.customer);
  return {
    id: booking.id,
    customerName: customer ? customer.full_name : "Customer",
    svc: { name: serviceName, price: Number(booking.price) },
    date: new Date(`${booking.booking_date}T00:00:00`),
    time: timeStringToMinutes(booking.start_time),
    status: booking.status,
  };
}

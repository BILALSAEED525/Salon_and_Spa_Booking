/* ══════════════════════════════════════════════════════════════════════════
   BARBER AUTH — localStorage-backed barber store
   Same pattern as customer auth.js — swap these functions for real API
   calls before going to production.
══════════════════════════════════════════════════════════════════════════ */
const BARBERS_KEY = "luxe_barbers";
const BARBER_SESSION_KEY = "luxe_barber_session";

/* ── internal helpers ── */
const obfuscate = (str) =>
  btoa(unescape(encodeURIComponent(str)))
    .split("")
    .reverse()
    .join("");
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(BARBERS_KEY)) || [];
  } catch {
    return [];
  }
};
const writeAll = (arr) =>
  localStorage.setItem(BARBERS_KEY, JSON.stringify(arr));

/* ── session ── */
export const getBarberSession = () => {
  try {
    return JSON.parse(localStorage.getItem(BARBER_SESSION_KEY));
  } catch {
    return null;
  }
};
const _saveSession = (barber) => {
  const {
    id,
    name,
    email,
    phone,
    title,
    bio,
    services,
    workStart,
    workEnd,
    rating,
    joinedAt,
  } = barber;
  localStorage.setItem(
    BARBER_SESSION_KEY,
    JSON.stringify({
      id,
      name,
      email,
      phone,
      title,
      bio,
      services,
      workStart,
      workEnd,
      rating,
      joinedAt,
    }),
  );
};
export const clearBarberSession = () =>
  localStorage.removeItem(BARBER_SESSION_KEY);

/* ── read all registered barbers (used by customer portal staff list) ── */
export const getRegisteredBarbers = () =>
  readAll().map(({ passwordHash, ...pub }) => pub);

/* ── register ── */
export const barberSignup = ({
  name,
  email,
  phone,
  password,
  title,
  bio,
  services,
  workStart,
  workEnd,
}) => {
  const barbers = readAll();
  if (barbers.some((b) => b.email.toLowerCase() === email.toLowerCase()))
    throw new Error("An account with this email already exists.");

  const newBarber = {
    id: "b_" + Date.now(),
    name,
    email,
    phone,
    title,
    bio,
    services, // array of service IDs e.g. ["h1","h2"]
    workStart, // minutes from midnight e.g. 540 = 9:00 AM
    workEnd, // minutes from midnight e.g. 1020 = 5:00 PM
    rating: 5.0,
    joinedAt: new Date().toISOString(),
    passwordHash: obfuscate(password),
  };
  writeAll([...barbers, newBarber]);
  _saveSession(newBarber);
  return newBarber;
};

/* ── login ── */
export const barberLogin = ({ email, password }) => {
  const match = readAll().find(
    (b) => b.email.toLowerCase() === email.toLowerCase(),
  );
  if (!match || match.passwordHash !== obfuscate(password))
    throw new Error("Invalid email or password.");
  _saveSession(match);
  return match;
};

/* ── update profile ── */
export const updateBarberProfile = (id, updates) => {
  const list = readAll();
  const updated = list.map((b) => (b.id === id ? { ...b, ...updates } : b));
  writeAll(updated);
  const fresh = updated.find((b) => b.id === id);
  if (fresh) _saveSession(fresh);
  return fresh;
};
/* ── save a real (API-backed) session ── */
export const saveBarberSession = (barber) => {
  localStorage.setItem(BARBER_SESSION_KEY, JSON.stringify(barber));
};

/* ══════════════════════════════════════════════════════════════════════════
   BOOKINGS STORE — persists bookings to localStorage so both portals share
   the same data. Dates are serialised as ISO strings and revived on read.
══════════════════════════════════════════════════════════════════════════ */
const KEY = "luxe_bookings";

const revive   = (b) => ({ ...b, date: b.date ? new Date(b.date) : null });
const serial   = (b) => ({ ...b, date: b.date instanceof Date ? b.date.toISOString() : b.date });
const readRaw  = ()  => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const writeRaw = (arr) => localStorage.setItem(KEY, JSON.stringify(arr.map(serial)));

/* ── public API ── */
export const getAllBookings        = ()          => readRaw().map(revive);
export const getBookingsForUser   = (userId)    => getAllBookings().filter((b) => b.userId === userId);
export const getBookingsForBarber = (barberId)  => getAllBookings().filter((b) => b.staff?.id === barberId);

export const saveBooking = (booking) => writeRaw([booking, ...getAllBookings()]);

export const updateBookingStatus = (id, status) => {
  const updated = getAllBookings().map((b) => (b.id === id ? { ...b, status } : b));
  writeRaw(updated);
  return updated;
};

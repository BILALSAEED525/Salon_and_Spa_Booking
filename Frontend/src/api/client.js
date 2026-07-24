const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.detail || JSON.stringify(data);
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getServiceCategories = () => request("/service-categories/");
export const getServices = () => request("/services/");
export const getSpecialists = () => request("/specialists/");

export const registerCustomer = (payload) =>
  request("/auth/register/", { method: "POST", body: JSON.stringify(payload) });
export const loginCustomer = (payload) =>
  request("/auth/login/", { method: "POST", body: JSON.stringify(payload) });
export const getBookings = () => request("/bookings/");
export const createBooking = (payload) =>
  request("/bookings/", { method: "POST", body: JSON.stringify(payload) });
export const cancelBooking = (id) =>
  request(`/bookings/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Cancelled" }),
  });
export const registerSpecialist = (payload) =>
  request("/specialists/", { method: "POST", body: JSON.stringify(payload) });
export const specialistLogin = (payload) =>
  request("/auth/specialist-login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateSpecialist = (id, payload) =>
  request(`/specialists/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export const addSpecialistService = (specialistId, serviceId) =>
  request("/specialist-services/", {
    method: "POST",
    body: JSON.stringify({ specialist: specialistId, service: serviceId }),
  });
export const removeSpecialistService = (linkId) =>
  request(`/specialist-services/${linkId}/`, { method: "DELETE" });
export const getSpecialistServices = () => request("/specialist-services/");
export const getCustomers = () => request("/customers/");
export const updateBookingStatus = (id, status) =>
  request(`/bookings/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

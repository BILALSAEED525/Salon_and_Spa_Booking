/* ══════════════════════════════════════════════════════════════════════════
   AUTH — mock, localStorage-backed user store
   NOTE: This is a demo-only auth layer so the app works with zero backend.
   Passwords are lightly obfuscated on the client, NOT securely hashed.
   Before shipping to production, swap the bodies of signup()/login() for
   real API calls (e.g. POST /api/signup, POST /api/login) and let the
   server handle password hashing (bcrypt/argon2) and session tokens.
══════════════════════════════════════════════════════════════════════════ */
const USERS_KEY = "luxe_users";
const SESSION_KEY = "luxe_session";

const obfuscate = (str) =>
  btoa(unescape(encodeURIComponent(str))).split("").reverse().join("");

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (user) => {
  const { id, name, email } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id, name, email }));
};

export const clearSession = () => localStorage.removeItem(SESSION_KEY);

export const signup = ({ name, email, password }) => {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const newUser = { id: "u_" + Date.now(), name, email, passwordHash: obfuscate(password) };
  writeUsers([...users, newUser]);
  const session = { id: newUser.id, name: newUser.name, email: newUser.email };
  saveSession(session);
  return session;
};

export const login = ({ email, password }) => {
  const users = readUsers();
  const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!match || match.passwordHash !== obfuscate(password)) {
    throw new Error("Invalid email or password.");
  }
  const session = { id: match.id, name: match.name, email: match.email };
  saveSession(session);
  return session;
};

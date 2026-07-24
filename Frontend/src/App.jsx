import { useState, useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import BookingFlow from "./components/BookingFlow";
import MyBookingsPage from "./components/MyBookingsPage";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import BarberLoginPage from "./components/barber/BarberLoginPage";
import BarberRegisterPage from "./components/barber/BarberRegisterPage";
import BarberDashboard from "./components/barber/BarberDashboard";
import {
  groupServicesByCategory,
  mapSpecialistFromApi,
  mapBookingFromApi,
  mapBookingToSlot,
  toISODate,
  minsToTimeString,
} from "./utils/helpers";
import {
  getServiceCategories,
  getServices,
  getSpecialists,
  getBookings,
  createBooking,
  cancelBooking,
} from "./api/client";
import { getSession, clearSession } from "./utils/auth";
import { getBarberSession, clearBarberSession } from "./utils/barberAuth";

const NAV_KEYS = ["home", "booking", "about", "bookings"];

/* ══════════════════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  // ── routing ──
  // views: home | booking | about | bookings | login | signup
  //        barber-login | barber-register | barber-dashboard
  const [view, setView] = useState(() => {
    // If a barber session already exists, open their dashboard immediately
    if (getBarberSession()) return "barber-dashboard";
    return "home";
  });

  // ── customer auth ──
  const [user, setUser] = useState(() => getSession());
  const [postLoginRedirect, setPostLoginRedirect] = useState(null);

  // ── barber auth ──
  const [barberSession, setBarberSession] = useState(() => getBarberSession());
  const [categories, setCategories] = useState([]);

  const [specialists, setSpecialists] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [justBooked, setJustBooked] = useState(null);
  const [existingSlots, setExistingSlots] = useState([]);

  useEffect(() => {
    Promise.all([
      getServiceCategories(),
      getServices(),
      getSpecialists(),
      getBookings(),
    ])
      .then(([cats, services, specialistsRaw, bookingsRaw]) => {
        const grouped = groupServicesByCategory(cats, services);
        const mappedSpecialists = specialistsRaw.map((s) =>
          mapSpecialistFromApi(s, grouped),
        );
        setCategories(grouped);
        setSpecialists(mappedSpecialists);
        setAllBookings(bookingsRaw);
        setExistingSlots(
          bookingsRaw
            .filter((b) => b.status !== "Cancelled")
            .map(mapBookingToSlot),
        );
        if (user) {
          setBookings(
            bookingsRaw
              .filter((b) => b.customer === user.id)
              .map((b) => mapBookingFromApi(b, grouped, mappedSpecialists)),
          );
        }
      })
      .catch((err) => console.error("Failed to load data:", err));
  }, []);

  // ── booking wizard ──
  const [step, setStep] = useState(1);
  const [catIdx, setCatIdx] = useState(0);
  const [svc, setSvc] = useState(null);
  const [staff, setStaff] = useState(null);
  const [vMonth, setVMonth] = useState(new Date());
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);

  // ── in-memory bookings + justBooked ──

  /* ── customer navigation ── */
  const navigate = (dest) => {
    if (dest === "bookings" && !user) {
      setPostLoginRedirect({ view: "bookings" });
      setView("login");
      return;
    }
    setView(dest);
    if (dest === "booking") {
      setStep(1);
      setJustBooked(null);
    }
    if (dest === "home") {
      setJustBooked(null);
    }
  };

  /* ── customer auth ── */
  const handleCustomerLogin = (sessionUser) => {
    setUser(sessionUser);
    setBookings(
      allBookings
        .filter((b) => b.customer === sessionUser.id)
        .map((b) => mapBookingFromApi(b, categories, specialists)),
    );
    if (postLoginRedirect) {
      setView(postLoginRedirect.view);
      if (postLoginRedirect.step) setStep(postLoginRedirect.step);
      setPostLoginRedirect(null);
    } else {
      setView("home");
    }
  };

  const handleCustomerLogout = () => {
    clearSession();
    setUser(null);
    setBookings([]);
    setView("home");
  };

  /* ── barber auth ── */
  const handleBarberLogin = (session) => {
    setBarberSession(session);
    setView("barber-dashboard");
  };

  const handleBarberLogout = () => {
    clearBarberSession();
    setBarberSession(null);
    setView("home");
  };

  /* ── booking actions ── */
  const handleSelectSvc = (item) => {
    if (svc?.id !== item.id) {
      setSelDate(null);
      setSelTime(null);
    }
    setSvc(item);
    categories.forEach((s, i) => {
      if (s.items.find((x) => x.id === item.id)) setCatIdx(i);
    });
  };

  const handleConfirm = async () => {
    if (!user) {
      setPostLoginRedirect({ view: "booking", step: 4 });
      setView("login");
      return;
    }
    try {
      const created = await createBooking({
        customer: user.id,
        specialist: staff.id,
        service: svc.id,
        booking_date: toISODate(selDate),
        start_time: minsToTimeString(selTime),
        duration_minutes: svc.dur,
        price: svc.price,
      });
      const uiBooking = mapBookingFromApi(created, categories, specialists);
      setAllBookings((prev) => [created, ...prev]);
      setExistingSlots((prev) => [...prev, mapBookingToSlot(created)]);
      setBookings((prev) => [uiBooking, ...prev]);
      setJustBooked(uiBooking);
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert(
        err.message ||
          "Something went wrong creating your booking. Please try again.",
      );
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
      );
      setAllBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)),
      );
      setExistingSlots((prev) => prev.filter((slot) => slot.id !== id));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Couldn't cancel this booking. Please try again.");
    }
  };

  const handleBookAnother = () => {
    setSvc(null);
    setStaff(null);
    setSelDate(null);
    setSelTime(null);
    setJustBooked(null);
    setStep(1);
    setView("booking");
  };

  const activeView = NAV_KEYS.includes(view) ? view : null;

  /* ════════════════════════════════════════════════════════════════════════
     BARBER PORTAL
  ════════════════════════════════════════════════════════════════════════ */
  if (view === "barber-login") {
    return (
      <>
        <GlobalStyles />
        <BarberLoginPage
          onLogin={handleBarberLogin}
          onSwitchToRegister={() => setView("barber-register")}
          onGoCustomer={() => setView("home")}
        />
      </>
    );
  }

  if (view === "barber-register") {
    return (
      <>
        <GlobalStyles />
        <BarberRegisterPage
          categories={categories}
          onRegister={handleBarberLogin}
          onSwitchToLogin={() => setView("barber-login")}
        />
      </>
    );
  }

  if (view === "barber-dashboard" && barberSession) {
    return (
      <>
        <GlobalStyles />
        <BarberDashboard
          barber={barberSession}
          categories={categories}
          onLogout={handleBarberLogout}
          onGoCustomer={() => {
            clearBarberSession();
            setBarberSession(null);
            setView("home");
          }}
        />
      </>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════
     CUSTOMER PORTAL
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <GlobalStyles />
      <NavBar
        activeView={activeView}
        onNavigate={navigate}
        user={user}
        onLogout={handleCustomerLogout}
      />

      {view === "home" && <HomePage onBook={() => navigate("booking")} />}

      {view === "about" && <AboutPage onBook={() => navigate("booking")} />}

      {view === "login" && (
        <LoginPage
          onLogin={handleCustomerLogin}
          onSwitchToSignup={() => setView("signup")}
        />
      )}

      {view === "signup" && (
        <SignupPage
          onSignup={handleCustomerLogin}
          onSwitchToLogin={() => setView("login")}
        />
      )}

      {view === "booking" && (
        <div
          className="page-wrap"
          style={{ paddingTop: 32, paddingBottom: 72 }}
        >
          <BookingFlow
            step={step}
            onJump={setStep}
            catIdx={catIdx}
            onCatChange={setCatIdx}
            categories={categories}
            specialists={specialists}
            svc={svc}
            onSelectSvc={handleSelectSvc}
            staff={staff}
            onSelectStaff={setStaff}
            existingSlots={existingSlots}
            vMonth={vMonth}
            setVMonth={setVMonth}
            selDate={selDate}
            setSelDate={setSelDate}
            selTime={selTime}
            setSelTime={setSelTime}
            onConfirm={handleConfirm}
            justBooked={justBooked}
            onViewBookings={() => navigate("bookings")}
            onBookAnother={handleBookAnother}
          />
        </div>
      )}

      {view === "bookings" && user && (
        <MyBookingsPage
          bookings={bookings}
          onCancel={handleCancelBooking}
          onStart={() => navigate("booking")}
        />
      )}
    </>
  );
}

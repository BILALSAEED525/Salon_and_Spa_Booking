import ProgressSteps from "./ProgressSteps";
import BookingSidebar from "./BookingSidebar";
import BookingSuccess from "./BookingSuccess";
import Step1Service from "./steps/Step1Service";
import Step2Staff from "./steps/Step2Staff";
import Step3DateTime from "./steps/Step3DateTime";
import Step4Confirm from "./steps/Step4Confirm";

/* ══════════════════════════════════════════════════════════════════════════
   BOOKING FLOW — container that orchestrates the 4 steps
══════════════════════════════════════════════════════════════════════════ */
export default function BookingFlow({
  step,
  onJump,
  svc,
  onSelectSvc,
  staff,
  onSelectStaff,
  catIdx,
  onCatChange,
  categories,
  specialists,
  existingSlots,
  vMonth,
  setVMonth,
  selDate,
  setSelDate,
  selTime,
  setSelTime,
  onConfirm,
  justBooked,
  onViewBookings,
  onBookAnother,
}) {
  if (justBooked) {
    return (
      <BookingSuccess
        booking={justBooked}
        onViewBookings={onViewBookings}
        onBookAnother={onBookAnother}
      />
    );
  }

  return (
    <div className="booking-layout">
      {/* main steps column */}
      <div className="booking-main">
        <ProgressSteps step={step} onJump={onJump} />

        {step === 1 && (
          <Step1Service
            svc={svc}
            catIdx={catIdx}
            onCatChange={onCatChange}
            categories={categories}
            onSelectSvc={(item) => {
              onSelectSvc(item);
              onJump(2);
            }}
          />
        )}
        {step === 2 && svc && (
          <Step2Staff
            specialists={specialists}
            selectedStaff={staff}
            onSelectStaff={onSelectStaff}
            onBack={() => onJump(1)}
            onNext={() => staff && onJump(3)}
          />
        )}
        {step === 3 && svc && staff && (
          <Step3DateTime
            svc={svc}
            staff={staff}
            existingSlots={existingSlots}
            vMonth={vMonth}
            setVMonth={setVMonth}
            selDate={selDate}
            setSelDate={setSelDate}
            selTime={selTime}
            setSelTime={setSelTime}
            onBack={() => onJump(2)}
            onNext={() => selDate && selTime != null && onJump(4)}
          />
        )}
        {step === 4 && svc && staff && selDate && selTime != null && (
          <Step4Confirm
            svc={svc}
            staff={staff}
            selDate={selDate}
            selTime={selTime}
            onBack={() => onJump(3)}
            onConfirm={onConfirm}
          />
        )}
      </div>

      {/* summary sidebar */}
      <div className="booking-sidebar-wrap">
        <BookingSidebar
          svc={svc}
          staff={staff}
          selDate={selDate}
          selTime={selTime}
        />
      </div>
    </div>
  );
}

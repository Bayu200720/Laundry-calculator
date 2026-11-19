/**
 * Komponen utama aplikasi LaundryCalc & Catalog yang menyatukan katalog, kalkulator estimasi, dan checkout WhatsApp.
 */

import { useMemo, useRef, useState } from "react";
import { AddonSection } from "./components/AddonSection.tsx";
import { CustomerFormSection } from "./components/CustomerFormSection.tsx";
import { KiloanSection } from "./components/KiloanSection.tsx";
import { OrderBreakdownModal } from "./components/OrderBreakdownModal.tsx";
import { SatuanSection } from "./components/SatuanSection.tsx";
import { StickySummaryBar } from "./components/StickySummaryBar.tsx";
import { StoreInfoBanner } from "./components/StoreInfoBanner.tsx";
import { STORE_CONFIG } from "./config.ts";
import { calculateOrderSummary } from "./lib/calculator.ts";
import { formatWeightKg, parseWeightInput } from "./lib/formatters.ts";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  validateCheckout,
  type CheckoutErrors,
  type CustomerFormInput,
} from "./lib/whatsapp.ts";

export default function App() {
  const [selectedKiloanId, setSelectedKiloanId] = useState<string | null>(null);
  const [weightInput, setWeightInput] = useState<string>("");
  const [actualWeightKg, setActualWeightKg] = useState<number>(0);
  const [weightError, setWeightError] = useState<string | null>(null);

  const [satuanQuantities, setSatuanQuantities] = useState<
    Record<string, number>
  >({});

  const [pickupDelivery, setPickupDelivery] = useState<boolean>(false);
  const [premiumFragrance, setPremiumFragrance] = useState<boolean>(false);

  const [customerForm, setCustomerForm] = useState<CustomerFormInput>({
    name: "",
    address: "",
    notes: "",
  });
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(false);

  const kiloanSectionRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const addressInputRef = useRef<HTMLTextAreaElement | null>(null);
  const waAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const summary = useMemo(
    () =>
      calculateOrderSummary({
        selectedKiloanId,
        actualWeightKg,
        satuanQuantities,
        pickupDelivery,
        premiumFragrance,
      }),
    [
      selectedKiloanId,
      actualWeightKg,
      satuanQuantities,
      pickupDelivery,
      premiumFragrance,
    ],
  );

  const clearCartError = () => {
    if (checkoutErrors.cart) {
      setCheckoutErrors((prev) => ({ ...prev, cart: undefined }));
    }
    if (submittedUrl) {
      setSubmittedUrl(null);
    }
  };

  const handleSelectKiloan = (packageId: string) => {
    clearCartError();
    if (selectedKiloanId === packageId) {
      setSelectedKiloanId(null);
      setActualWeightKg(0);
      setWeightInput("");
      setWeightError(null);
      setPremiumFragrance(false);
      return;
    }

    setSelectedKiloanId(packageId);
    if (actualWeightKg <= 0) {
      setActualWeightKg(STORE_CONFIG.minChargeKg);
      setWeightInput(formatWeightKg(STORE_CONFIG.minChargeKg));
      setWeightError(null);
    }
  };

  const handleClearKiloan = () => {
    setSelectedKiloanId(null);
    setActualWeightKg(0);
    setWeightInput("");
    setWeightError(null);
    setPremiumFragrance(false);
    setSubmittedUrl(null);
  };

  const handleWeightInputChange = (rawValue: string) => {
    clearCartError();
    setWeightInput(rawValue);
    const parsed = parseWeightInput(rawValue);
    if (parsed.error) {
      setWeightError(parsed.error);
      setActualWeightKg(0);
      setPremiumFragrance(false);
      return;
    }

    setWeightError(null);
    setActualWeightKg(parsed.value);
    if (parsed.value <= 0) {
      setPremiumFragrance(false);
    }
  };

  const handleStepWeight = (delta: number) => {
    clearCartError();
    const next = Math.max(0, Math.round((actualWeightKg + delta) * 10) / 10);
    setActualWeightKg(next);
    setWeightInput(next > 0 ? formatWeightKg(next) : "0,0");
    setWeightError(null);
    if (next <= 0) {
      setPremiumFragrance(false);
    }
  };

  const handleChangeSatuanQty = (itemId: string, delta: number) => {
    clearCartError();
    setSatuanQuantities((prev) => {
      const current = prev[itemId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const handleTogglePickup = () => {
    setSubmittedUrl(null);
    setPickupDelivery((prev) => {
      const next = !prev;
      if (!next && checkoutErrors.address) {
        setCheckoutErrors((errPrev) => ({ ...errPrev, address: undefined }));
      }
      return next;
    });
  };

  const handleToggleFragrance = () => {
    if (!summary.fragranceEligible) {
      return;
    }
    setSubmittedUrl(null);
    setPremiumFragrance((prev) => !prev);
  };

  const handleChangeCustomerField = (
    field: keyof CustomerFormInput,
    value: string,
  ) => {
    setSubmittedUrl(null);
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && checkoutErrors.name) {
      setCheckoutErrors((prev) => ({ ...prev, name: undefined }));
    }
    if (field === "address" && checkoutErrors.address) {
      setCheckoutErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const handleCheckout = () => {
    if (weightError) {
      kiloanSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const validation = validateCheckout(summary, customerForm, pickupDelivery);
    if (!validation.isValid) {
      setCheckoutErrors(validation.errors);
      setSubmittedUrl(null);

      if (validation.firstErrorField === "cart") {
        kiloanSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (validation.firstErrorField === "name") {
        nameInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        nameInputRef.current?.focus();
      } else if (validation.firstErrorField === "address") {
        addressInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        addressInputRef.current?.focus();
      }
      return;
    }

    setCheckoutErrors({});
    const message = buildWhatsAppMessage(summary, customerForm);
    const waUrl = buildWhatsAppUrl(message, STORE_CONFIG.whatsappNumber);
    setSubmittedUrl(waUrl);

    if (waAnchorRef.current) {
      waAnchorRef.current.href = waUrl;
      waAnchorRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-28 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-8">
          <StoreInfoBanner />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <main className="flex flex-col gap-8 lg:col-span-7">
              <KiloanSection
                sectionRef={kiloanSectionRef}
                selectedPackageId={selectedKiloanId}
                weightInput={weightInput}
                weightError={weightError}
                actualWeightKg={actualWeightKg}
                billedWeightKg={summary.billedWeightKg}
                minChargeApplied={summary.minChargeApplied}
                kiloanSubtotal={summary.kiloanSubtotal}
                onSelectPackage={handleSelectKiloan}
                onClearPackage={handleClearKiloan}
                onWeightInputChange={handleWeightInputChange}
                onStepWeight={handleStepWeight}
              />

              <SatuanSection
                quantities={satuanQuantities}
                onChangeQuantity={handleChangeSatuanQty}
              />

              <AddonSection
                pickupDelivery={pickupDelivery}
                premiumFragrance={summary.premiumFragranceActive}
                fragranceEligible={summary.fragranceEligible}
                billedWeightKg={summary.billedWeightKg}
                onTogglePickup={handleTogglePickup}
                onToggleFragrance={handleToggleFragrance}
              />

              <CustomerFormSection
                form={customerForm}
                pickupDelivery={pickupDelivery}
                errors={checkoutErrors}
                submittedUrl={submittedUrl}
                nameInputRef={nameInputRef}
                addressInputRef={addressInputRef}
                onChangeField={handleChangeCustomerField}
                onSubmit={handleCheckout}
              />
            </main>

            <div className="lg:col-span-5">
              <StickySummaryBar
                summary={summary}
                onOpenBreakdown={() => setIsBreakdownOpen(true)}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      <OrderBreakdownModal
        isOpen={isBreakdownOpen}
        summary={summary}
        onClose={() => setIsBreakdownOpen(false)}
      />

      <a
        ref={waAnchorRef}
        href="#whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        WhatsApp
      </a>
    </div>
  );
}

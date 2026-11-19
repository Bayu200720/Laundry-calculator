/**
 * Komponen katalog paket kiloan dan kalkulator berat dengan aturan batas minimal 3,0 kg (FT-01, FT-02).
 */

import { AlertCircle, Check, Info, Minus, Plus } from "lucide-react";
import type { RefObject } from "react";
import { KILOAN_PACKAGES, STORE_CONFIG } from "../config.ts";
import { formatRupiah, formatWeightKg } from "../lib/formatters.ts";

interface KiloanSectionProps {
  selectedPackageId: string | null;
  weightInput: string;
  weightError: string | null;
  actualWeightKg: number;
  billedWeightKg: number;
  minChargeApplied: boolean;
  kiloanSubtotal: number;
  onSelectPackage: (packageId: string) => void;
  onClearPackage: () => void;
  onWeightInputChange: (rawValue: string) => void;
  onStepWeight: (delta: number) => void;
  sectionRef?: RefObject<HTMLElement | null>;
}

export function KiloanSection({
  selectedPackageId,
  weightInput,
  weightError,
  actualWeightKg,
  billedWeightKg,
  minChargeApplied,
  kiloanSubtotal,
  onSelectPackage,
  onClearPackage,
  onWeightInputChange,
  onStepWeight,
  sectionRef,
}: KiloanSectionProps) {
  const activePackages = KILOAN_PACKAGES.filter((pkg) => pkg.isActive);
  const hasSelectedPackage = selectedPackageId !== null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="heading-kiloan"
      className="flex flex-col gap-3"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="heading-kiloan"
          className="text-lg font-semibold text-neutral-900"
        >
          Layanan Kiloan
        </h2>
        {hasSelectedPackage && (
          <button
            type="button"
            onClick={onClearPackage}
            className="min-h-[44px] px-2 text-sm font-medium text-blue-700 hover:text-blue-800 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
          >
            Batalkan Paket
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col gap-6">
        <div
          role="radiogroup"
          aria-labelledby="heading-kiloan"
          className="flex flex-col gap-3"
        >
          {activePackages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectPackage(pkg.id)}
                className={`w-full min-h-[44px] text-left rounded-xl p-4 border transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  isSelected
                    ? "border-blue-700 bg-blue-50"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-neutral-400 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <div className="text-base font-semibold text-neutral-900">
                        {pkg.name}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {pkg.description}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600 tabular-nums">
                        Estimasi {pkg.estimatedDays} hari
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                      {formatRupiah(pkg.pricePerKg)}
                    </span>
                    <span className="block text-sm text-neutral-600">/kg</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-neutral-200 pt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label
              htmlFor="weight-input"
              className="text-sm font-medium text-neutral-900"
            >
              Estimasi Berat Cucian (kg)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Kurangi berat 0,1 kg"
                disabled={!hasSelectedPackage || actualWeightKg <= 0}
                onClick={() => onStepWeight(-STORE_CONFIG.weightStepKg)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative w-28">
                <input
                  id="weight-input"
                  name="actualWeightKg"
                  type="text"
                  inputMode="decimal"
                  disabled={!hasSelectedPackage}
                  value={hasSelectedPackage ? weightInput : ""}
                  placeholder={hasSelectedPackage ? "0,0" : "Pilih paket"}
                  onChange={(e) => onWeightInputChange(e.target.value)}
                  aria-invalid={weightError !== null}
                  aria-describedby="weight-guide"
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-center text-base font-medium text-neutral-900 tabular-nums placeholder:text-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                />
              </div>

              <button
                type="button"
                aria-label="Tambah berat 0,1 kg"
                disabled={!hasSelectedPackage}
                onClick={() => onStepWeight(STORE_CONFIG.weightStepKg)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {!hasSelectedPackage && (
            <p className="text-sm text-neutral-600">
              Pilih salah satu paket kiloan di atas untuk mengisi berat cucian.
            </p>
          )}

          {weightError && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{weightError}</span>
            </p>
          )}

          {minChargeApplied && !weightError && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Batas minimal {formatWeightKg(STORE_CONFIG.minChargeKg)} kg
                berlaku. Berat ditagih menjadi{" "}
                <strong className="font-semibold tabular-nums">
                  {formatWeightKg(billedWeightKg)} kg
                </strong>
                .
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p id="weight-guide" className="text-sm text-neutral-600">
              {STORE_CONFIG.weightGuideText}
            </p>
            {hasSelectedPackage && kiloanSubtotal > 0 && (
              <p className="text-sm font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                Subtotal: {formatRupiah(kiloanSubtotal)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

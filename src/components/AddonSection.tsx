/**
 * Komponen panel layanan tambahan kondisional untuk Antar-Jemput dan Pewangi Premium (FT-04).
 */

import { Check } from "lucide-react";
import { ADDON_SERVICES } from "../config.ts";
import { formatRupiah, formatWeightKg } from "../lib/formatters.ts";

interface AddonSectionProps {
  pickupDelivery: boolean;
  premiumFragrance: boolean;
  fragranceEligible: boolean;
  billedWeightKg: number;
  onTogglePickup: () => void;
  onToggleFragrance: () => void;
}

export function AddonSection({
  pickupDelivery,
  premiumFragrance,
  fragranceEligible,
  billedWeightKg,
  onTogglePickup,
  onToggleFragrance,
}: AddonSectionProps) {
  const pickupService = ADDON_SERVICES.find((a) => a.id === "A01");
  const fragranceService = ADDON_SERVICES.find((a) => a.id === "A02");

  return (
    <section aria-labelledby="heading-addon" className="flex flex-col gap-3">
      <h2 id="heading-addon" className="text-lg font-semibold text-neutral-900">
        Layanan Tambahan
      </h2>

      <div className="bg-white rounded-2xl divide-y divide-neutral-200">
        {pickupService && (
          <label
            htmlFor="addon-pickup"
            className={`min-h-[44px] p-4 sm:p-6 flex items-start justify-between gap-3 cursor-pointer rounded-t-2xl transition-colors duration-150 ease-out motion-reduce:transition-none ${
              pickupDelivery ? "bg-blue-50" : "bg-white hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                id="addon-pickup"
                type="checkbox"
                checked={pickupDelivery}
                onChange={onTogglePickup}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  pickupDelivery
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-neutral-400 bg-white"
                }`}
              >
                {pickupDelivery && <Check className="h-3.5 w-3.5" />}
              </span>
              <div>
                <span className="block text-base font-semibold text-neutral-900">
                  {pickupService.name}
                </span>
                <span className="mt-1 block text-sm text-neutral-600">
                  {pickupService.notes}
                </span>
              </div>
            </div>
            <span className="text-base font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
              {formatRupiah(pickupService.price)}
            </span>
          </label>
        )}

        {fragranceService && (
          <label
            htmlFor="addon-fragrance"
            className={`min-h-[44px] p-4 sm:p-6 flex items-start justify-between gap-3 rounded-b-2xl transition-colors duration-150 ease-out motion-reduce:transition-none ${
              !fragranceEligible
                ? "bg-neutral-50 opacity-70 cursor-not-allowed"
                : premiumFragrance
                  ? "bg-blue-50 cursor-pointer"
                  : "bg-white hover:bg-neutral-50 cursor-pointer"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                id="addon-fragrance"
                type="checkbox"
                checked={fragranceEligible && premiumFragrance}
                disabled={!fragranceEligible}
                onChange={onToggleFragrance}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  fragranceEligible && premiumFragrance
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-neutral-400 bg-white"
                }`}
              >
                {fragranceEligible && premiumFragrance && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>
              <div>
                <span className="block text-base font-semibold text-neutral-900">
                  {fragranceService.name}
                </span>
                <span className="mt-1 block text-sm text-neutral-600">
                  {fragranceEligible
                    ? `${fragranceService.notes} (${formatWeightKg(
                        billedWeightKg,
                      )} kg)`
                    : "Khusus cucian kiloan. Pilih paket kiloan dan berat lebih dari 0 kg."}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                {formatRupiah(fragranceService.price)}
              </span>
              <span className="block text-sm text-neutral-600">/kg</span>
            </div>
          </label>
        )}
      </div>
    </section>
  );
}

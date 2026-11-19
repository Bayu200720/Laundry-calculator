/**
 * Fungsi perhitungan murni untuk berat ditagih (minimum charge) dan total estimasi biaya laundry.
 */

import {
  ADDON_SERVICES,
  KILOAN_PACKAGES,
  SATUAN_ITEMS,
  STORE_CONFIG,
  type KiloanPackage,
  type SatuanItem,
} from "../config.ts";

export interface OrderCalculationInput {
  selectedKiloanId: string | null;
  actualWeightKg: number;
  satuanQuantities: Record<string, number>;
  pickupDelivery: boolean;
  premiumFragrance: boolean;
}

export interface SatuanOrderLine {
  item: SatuanItem;
  quantity: number;
  subtotal: number;
}

export interface OrderSummary {
  kiloanPackage: KiloanPackage | null;
  actualWeightKg: number;
  billedWeightKg: number;
  minChargeApplied: boolean;
  kiloanSubtotal: number;
  satuanLines: SatuanOrderLine[];
  satuanSubtotal: number;
  pickupDeliveryActive: boolean;
  pickupFee: number;
  fragranceEligible: boolean;
  premiumFragranceActive: boolean;
  fragranceFee: number;
  totalEstimate: number;
  hasItems: boolean;
}

/**
 * Menghitung berat yang ditagih berdasarkan aturan BL-01 (minimum charge 3,0 kg).
 */
export function calculateBilledWeight(
  actualWeightKg: number,
  hasKiloanPackage: boolean,
  minChargeKg: number = STORE_CONFIG.minChargeKg,
): number {
  if (!hasKiloanPackage || !Number.isFinite(actualWeightKg) || actualWeightKg <= 0) {
    return 0;
  }
  const cleanWeight = Math.round(actualWeightKg * 10) / 10;
  return Math.max(minChargeKg, cleanWeight);
}

/**
 * Mengecek apakah batas minimal berat 3,0 kg sedang diterapkan pada input pengguna.
 */
export function isMinChargeApplied(
  actualWeightKg: number,
  hasKiloanPackage: boolean,
  minChargeKg: number = STORE_CONFIG.minChargeKg,
): boolean {
  if (!hasKiloanPackage || !Number.isFinite(actualWeightKg)) {
    return false;
  }
  return actualWeightKg > 0 && actualWeightKg < minChargeKg;
}

/**
 * Menghitung seluruh rincian biaya layanan kiloan, satuan, dan add-on sesuai BL-01 dan BL-02.
 */
export function calculateOrderSummary(input: OrderCalculationInput): OrderSummary {
  const activeKiloan =
    KILOAN_PACKAGES.find(
      (pkg) => pkg.isActive && pkg.id === input.selectedKiloanId,
    ) ?? null;

  const cleanActualWeight =
    activeKiloan && Number.isFinite(input.actualWeightKg) && input.actualWeightKg > 0
      ? Math.round(input.actualWeightKg * 10) / 10
      : 0;

  const billedWeightKg = calculateBilledWeight(
    cleanActualWeight,
    activeKiloan !== null,
    STORE_CONFIG.minChargeKg,
  );

  const minChargeApplied = isMinChargeApplied(
    cleanActualWeight,
    activeKiloan !== null,
    STORE_CONFIG.minChargeKg,
  );

  const kiloanSubtotal =
    activeKiloan && billedWeightKg > 0
      ? Math.round(billedWeightKg * activeKiloan.pricePerKg)
      : 0;

  const satuanLines: SatuanOrderLine[] = [];
  let satuanSubtotal = 0;

  for (const item of SATUAN_ITEMS) {
    if (!item.isActive) continue;
    const rawQty = input.satuanQuantities[item.id] ?? 0;
    const quantity = Number.isFinite(rawQty) && rawQty > 0 ? Math.floor(rawQty) : 0;
    if (quantity > 0) {
      const subtotal = Math.round(quantity * item.pricePerUnit);
      satuanLines.push({ item, quantity, subtotal });
      satuanSubtotal += subtotal;
    }
  }

  const pickupAddon = ADDON_SERVICES.find((a) => a.id === "A01");
  const fragranceAddon = ADDON_SERVICES.find((a) => a.id === "A02");

  const hasKiloanOrder = activeKiloan !== null && billedWeightKg > 0;
  const hasSatuanOrder = satuanLines.length > 0;
  const hasItems = hasKiloanOrder || hasSatuanOrder;

  const pickupDeliveryActive = input.pickupDelivery;
  const pickupFee =
    pickupDeliveryActive && pickupAddon ? Math.round(pickupAddon.price) : 0;

  const fragranceEligible = hasKiloanOrder;
  const premiumFragranceActive = fragranceEligible && input.premiumFragrance;
  const fragranceFee =
    premiumFragranceActive && fragranceAddon
      ? Math.round(billedWeightKg * fragranceAddon.price)
      : 0;

  const totalEstimate = Math.round(
    kiloanSubtotal + satuanSubtotal + pickupFee + fragranceFee,
  );

  return {
    kiloanPackage: activeKiloan,
    actualWeightKg: cleanActualWeight,
    billedWeightKg,
    minChargeApplied,
    kiloanSubtotal,
    satuanLines,
    satuanSubtotal,
    pickupDeliveryActive,
    pickupFee,
    fragranceEligible,
    premiumFragranceActive,
    fragranceFee,
    totalEstimate,
    hasItems,
  };
}

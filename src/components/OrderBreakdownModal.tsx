/**
 * Komponen laci/modal rincian perhitungan biaya pesanan (FT-05).
 */

import { X } from "lucide-react";
import { STORE_CONFIG } from "../config.ts";
import type { OrderSummary } from "../lib/calculator.ts";
import { formatRupiah, formatWeightKg } from "../lib/formatters.ts";

interface OrderBreakdownModalProps {
  isOpen: boolean;
  summary: OrderSummary;
  onClose: () => void;
}

export function OrderBreakdownModal({
  isOpen,
  summary,
  onClose,
}: OrderBreakdownModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-rincian-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <h2
            id="modal-rincian-title"
            className="text-lg font-semibold text-neutral-900"
          >
            Rincian Estimasi Biaya
          </h2>
          <button
            type="button"
            aria-label="Tutup rincian"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {!summary.hasItems ? (
          <p className="py-4 text-base text-neutral-600">
            Anda belum memilih layanan kiloan maupun satuan.
          </p>
        ) : (
          <div className="flex flex-col gap-3 text-sm">
            {summary.kiloanPackage && summary.actualWeightKg > 0 && (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-neutral-900">
                    {summary.kiloanPackage.name}
                  </div>
                  <div className="text-neutral-600 tabular-nums">
                    Estimasi {formatWeightKg(summary.actualWeightKg)} kg ·
                    Ditagih {formatWeightKg(summary.billedWeightKg)} kg ×{" "}
                    {formatRupiah(summary.kiloanPackage.pricePerKg)}
                  </div>
                </div>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(summary.kiloanSubtotal)}
                </span>
              </div>
            )}

            {summary.satuanLines.map((line) => (
              <div
                key={line.item.id}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-neutral-900">
                    {line.item.name}
                  </div>
                  <div className="text-neutral-600 tabular-nums">
                    {line.quantity} {line.item.unitLabel} ×{" "}
                    {formatRupiah(line.item.pricePerUnit)}
                  </div>
                </div>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(line.subtotal)}
                </span>
              </div>
            ))}

            {summary.pickupDeliveryActive && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-900">Antar-Jemput</span>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(summary.pickupFee)}
                </span>
              </div>
            )}

            {summary.premiumFragranceActive && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-900 tabular-nums">
                  Pewangi Premium ({formatWeightKg(summary.billedWeightKg)} kg)
                </span>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(summary.fragranceFee)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-neutral-200 pt-3 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-neutral-900">
            Total Estimasi
          </span>
          <span className="text-2xl font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
            {formatRupiah(summary.totalEstimate)}
          </span>
        </div>

        <p className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">
          {STORE_CONFIG.disclaimerText}
        </p>
      </div>
    </div>
  );
}

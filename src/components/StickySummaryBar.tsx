/**
 * Komponen bilah ringkasan melayang di bawah layar seluler dan panel ringkasan desktop (FT-05, FT-06).
 */

import { ChevronUp, MessageCircle } from "lucide-react";
import { STORE_CONFIG } from "../config.ts";
import type { OrderSummary } from "../lib/calculator.ts";
import { formatRupiah, formatWeightKg } from "../lib/formatters.ts";

interface StickySummaryBarProps {
  summary: OrderSummary;
  onOpenBreakdown: () => void;
  onCheckout: () => void;
}

export function StickySummaryBar({
  summary,
  onOpenBreakdown,
  onCheckout,
}: StickySummaryBarProps) {
  return (
    <>
      <aside
        aria-label="Ringkasan Estimasi Pesanan"
        className="hidden lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-6 bg-white rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h2 className="text-lg font-semibold text-neutral-900">
          Ringkasan Estimasi
        </h2>

        {!summary.hasItems ? (
          <p className="text-sm text-neutral-600">
            Pilih paket kiloan atau item satuan untuk melihat perkiraan biaya.
          </p>
        ) : (
          <div className="flex flex-col gap-3 text-sm border-t border-neutral-200 pt-4">
            {summary.kiloanPackage && summary.actualWeightKg > 0 && (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-neutral-900">
                    {summary.kiloanPackage.name}
                  </div>
                  <div className="text-neutral-600 tabular-nums">
                    {formatWeightKg(summary.actualWeightKg)} kg (ditagih{" "}
                    {formatWeightKg(summary.billedWeightKg)} kg)
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
                className="flex items-start justify-between gap-2"
              >
                <span className="text-neutral-900">
                  {line.item.name} ({line.quantity}x)
                </span>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(line.subtotal)}
                </span>
              </div>
            ))}

            {summary.pickupDeliveryActive && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-900">Antar-Jemput</span>
                <span className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatRupiah(summary.pickupFee)}
                </span>
              </div>
            )}

            {summary.premiumFragranceActive && (
              <div className="flex items-center justify-between gap-2">
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

        <div className="border-t border-neutral-200 pt-4 flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-neutral-600">
            Total Estimasi
          </span>
          <span className="text-3xl font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
            {formatRupiah(summary.totalEstimate)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Kirim Pesanan ke WhatsApp</span>
        </button>

        <p className="text-sm text-neutral-600">{STORE_CONFIG.disclaimerText}</p>
      </aside>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm text-neutral-600">Estimasi</span>
              <button
                type="button"
                onClick={onOpenBreakdown}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 py-1 px-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
              >
                <span>Rincian</span>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="text-2xl font-semibold text-neutral-900 tabular-nums truncate">
              {formatRupiah(summary.totalEstimate)}
            </div>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="min-h-[44px] shrink-0 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>
      </div>
    </>
  );
}

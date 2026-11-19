/**
 * Komponen daftar item layanan satuan beserta pemilih kuantitas stepper (FT-01, FT-03).
 */

import { Minus, Plus } from "lucide-react";
import { SATUAN_ITEMS } from "../config.ts";
import { formatRupiah } from "../lib/formatters.ts";

interface SatuanSectionProps {
  quantities: Record<string, number>;
  onChangeQuantity: (itemId: string, delta: number) => void;
}

export function SatuanSection({
  quantities,
  onChangeQuantity,
}: SatuanSectionProps) {
  const activeItems = SATUAN_ITEMS.filter((item) => item.isActive);

  return (
    <section aria-labelledby="heading-satuan" className="flex flex-col gap-3">
      <div>
        <h2
          id="heading-satuan"
          className="text-lg font-semibold text-neutral-900"
        >
          Layanan Satuan
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Dapat dipesan sendiri atau digabung dengan cucian kiloan.
        </p>
      </div>

      <div className="bg-white rounded-2xl divide-y divide-neutral-200">
        {activeItems.map((item) => {
          const qty = quantities[item.id] ?? 0;
          const subtotal = qty * item.pricePerUnit;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-150 ease-out motion-reduce:transition-none ${
                qty > 0 ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-neutral-900">
                  {item.name}
                </h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
                <p className="text-sm text-neutral-600 tabular-nums">
                  {formatRupiah(item.pricePerUnit)}/{item.unitLabel} · Estimasi{" "}
                  {item.estimatedDays} hari
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Kurangi jumlah ${item.name}`}
                    disabled={qty <= 0}
                    onClick={() => onChangeQuantity(item.id, -1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <span
                    aria-live="polite"
                    className="w-8 text-center text-base font-semibold text-neutral-900 tabular-nums"
                  >
                    {qty}
                  </span>

                  <button
                    type="button"
                    aria-label={`Tambah jumlah ${item.name}`}
                    onClick={() => onChangeQuantity(item.id, 1)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {qty > 0 && (
                  <span className="text-sm font-semibold text-blue-700 tabular-nums whitespace-nowrap">
                    {formatRupiah(subtotal)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

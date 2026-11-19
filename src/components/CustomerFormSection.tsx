/**
 * Komponen formulir data pemesan dan validasi checkout WhatsApp (FT-06).
 */

import { AlertCircle, ExternalLink, MessageCircle } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import type { CheckoutErrors, CustomerFormInput } from "../lib/whatsapp.ts";

interface CustomerFormSectionProps {
  form: CustomerFormInput;
  pickupDelivery: boolean;
  errors: CheckoutErrors;
  submittedUrl: string | null;
  nameInputRef: RefObject<HTMLInputElement | null>;
  addressInputRef: RefObject<HTMLTextAreaElement | null>;
  onChangeField: (field: keyof CustomerFormInput, value: string) => void;
  onSubmit: () => void;
}

export function CustomerFormSection({
  form,
  pickupDelivery,
  errors,
  submittedUrl,
  nameInputRef,
  addressInputRef,
  onChangeField,
  onSubmit,
}: CustomerFormSectionProps) {
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section aria-labelledby="heading-customer" className="flex flex-col gap-3">
      <h2
        id="heading-customer"
        className="text-lg font-semibold text-neutral-900"
      >
        Data Pemesan
      </h2>

      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col gap-4"
      >
        {errors.cart && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errors.cart}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="customer-name"
            className="text-sm font-medium text-neutral-900"
          >
            Nama Anda
          </label>
          <input
            ref={nameInputRef}
            id="customer-name"
            name="customerName"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            placeholder="Contoh: Rina"
            onChange={(e) => onChangeField("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={`min-h-[44px] w-full rounded-xl border px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
              errors.name ? "border-red-800 bg-red-50" : "border-neutral-200 bg-white"
            }`}
          />
          {errors.name && (
            <p
              id="error-name"
              role="alert"
              className="flex items-center gap-2 text-sm text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {pickupDelivery && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="customer-address"
              className="text-sm font-medium text-neutral-900"
            >
              Alamat Penjemputan
            </label>
            <textarea
              ref={addressInputRef}
              id="customer-address"
              name="pickupAddress"
              autoComplete="street-address"
              rows={3}
              required
              value={form.address}
              placeholder="Contoh: Jl. Melati No. 12, RT 02 (dekat masjid)"
              onChange={(e) => onChangeField("address", e.target.value)}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "error-address" : undefined}
              className={`w-full rounded-xl border px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                errors.address
                  ? "border-red-800 bg-red-50"
                  : "border-neutral-200 bg-white"
              }`}
            />
            {errors.address && (
              <p
                id="error-address"
                role="alert"
                className="flex items-center gap-2 text-sm text-red-800"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="customer-notes"
            className="text-sm font-medium text-neutral-900"
          >
            Catatan Khusus (Opsional)
          </label>
          <textarea
            id="customer-notes"
            name="orderNotes"
            rows={2}
            value={form.notes}
            placeholder="Contoh: Pisahkan pakaian putih dan batik"
            onChange={(e) => onChangeField("notes", e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          />
        </div>

        <button
          type="submit"
          className="hidden lg:flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white hover:bg-blue-800 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 whitespace-nowrap"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Kirim Pesanan ke WhatsApp</span>
        </button>

        {submittedUrl && (
          <div
            role="status"
            className="flex flex-col gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            <p className="font-medium">
              Tautan pesanan WhatsApp sudah siap. Jika tab belum terbuka, tekan
              tautan di bawah ini.
            </p>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <span>Buka Pesanan di WhatsApp</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        )}
      </form>
    </section>
  );
}

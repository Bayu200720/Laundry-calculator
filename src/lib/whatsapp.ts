/**
 * Validasi formulir checkout dan generator pesan serta tautan WhatsApp sesuai BL-03 dan Bagian 7 PRD.
 */

import { STORE_CONFIG } from "../config.ts";
import type { OrderSummary } from "./calculator.ts";
import { formatRupiah, formatWeightKg } from "./formatters.ts";

export interface CustomerFormInput {
  name: string;
  address: string;
  notes: string;
}

export interface CheckoutErrors {
  cart?: string;
  name?: string;
  address?: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  firstErrorField: keyof CheckoutErrors | null;
  errors: CheckoutErrors;
}

/**
 * Memvalidasi keranjang pesanan, nama pelanggan (min. 2 karakter non-spasi),
 * serta alamat penjemputan apabila opsi Antar-Jemput aktif.
 */
export function validateCheckout(
  summary: OrderSummary,
  form: CustomerFormInput,
  pickupDelivery: boolean,
): CheckoutValidationResult {
  const errors: CheckoutErrors = {};

  if (!summary.hasItems || summary.totalEstimate <= 0) {
    errors.cart =
      "Pilih minimal satu paket kiloan (berat > 0 kg) atau satu item satuan terlebih dahulu.";
  }

  const trimmedName = form.name.trim();
  if (trimmedName.length < 2) {
    errors.name = "Isi nama Anda minimal 2 huruf, misalnya Rina.";
  }

  if (pickupDelivery && form.address.trim().length === 0) {
    errors.address =
      "Isi alamat penjemputan lengkap, misalnya Jl. Melati No. 12, RT 02.";
  }

  const firstErrorField: keyof CheckoutErrors | null = errors.cart
    ? "cart"
    : errors.name
      ? "name"
      : errors.address
        ? "address"
        : null;

  return {
    isValid: firstErrorField === null,
    firstErrorField,
    errors,
  };
}

/**
 * Menyusun pesan teks WhatsApp berformat baku sesuai template di Bagian 7 PRD.
 */
export function buildWhatsAppMessage(
  summary: OrderSummary,
  form: CustomerFormInput,
): string {
  const trimmedName = form.name.trim();
  const methodLabel = summary.pickupDeliveryActive
    ? "Antar-Jemput"
    : "Antar Sendiri ke Toko";
  const addressText = summary.pickupDeliveryActive
    ? form.address.trim() || "-"
    : "-";
  const notesText = form.notes.trim() || "-";

  const kiloanLine =
    summary.kiloanPackage && summary.actualWeightKg > 0
      ? `• Paket Kiloan: ${summary.kiloanPackage.name} — Estimasi ${formatWeightKg(
          summary.actualWeightKg,
        )} kg (Ditagih ${formatWeightKg(summary.billedWeightKg)} kg) = ${formatRupiah(
          summary.kiloanSubtotal,
        )}`
      : "• Paket Kiloan: -";

  const satuanSection =
    summary.satuanLines.length > 0
      ? [
          "• Layanan Satuan:",
          ...summary.satuanLines.map(
            (line) =>
              `  - ${line.item.name} (${line.quantity}x) = ${formatRupiah(line.subtotal)}`,
          ),
        ].join("\n")
      : "• Layanan Satuan: -";

  const pickupAddonText = summary.pickupDeliveryActive
    ? `Ya (${formatRupiah(summary.pickupFee)})`
    : "Tidak";
  const fragranceAddonText = summary.premiumFragranceActive
    ? `Ya (${formatRupiah(summary.fragranceFee)})`
    : "Tidak";

  return [
    "Halo Admin Laundry, saya ingin memesan layanan dengan rincian estimasi berikut:",
    "",
    `*Nama:* ${trimmedName}`,
    `*Metode:* ${methodLabel}`,
    `*Alamat:* ${addressText}`,
    "",
    "*Rincian Pesanan:*",
    kiloanLine,
    satuanSection,
    "• Layanan Tambahan:",
    `  - Antar-Jemput: ${pickupAddonText}`,
    `  - Pewangi Premium: ${fragranceAddonText}`,
    "",
    `*Catatan:* ${notesText}`,
    `*Estimasi Total Biaya:* *${formatRupiah(summary.totalEstimate)}*`,
    "",
    `_(Catatan: ${STORE_CONFIG.disclaimerText})_`,
  ].join("\n");
}

/**
 * Menghasilkan URL deep-link resmi WhatsApp dengan encoding URI yang aman.
 */
export function buildWhatsAppUrl(
  message: string,
  whatsappNumber: string = STORE_CONFIG.whatsappNumber,
): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

/**
 * Fungsi pemformatan angka Rupiah, desimal berat, dan parser input numerik.
 */

/**
 * Memformat bilangan bulat menjadi teks Rupiah dengan pemisah ribuan titik,
 * mengikuti format di PRD (contoh: Rp 24.000).
 */
export function formatRupiah(amount: number): string {
  const safeAmount = Math.round(Number.isFinite(amount) ? amount : 0);
  const formatted = Math.abs(safeAmount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return safeAmount < 0 ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Memformat angka berat dalam kilogram memakai koma desimal (contoh: 3,0 atau 1,8).
 */
export function formatWeightKg(weight: number): string {
  const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 0;
  return safeWeight.toFixed(1).replace(".", ",");
}

/**
 * Memformat angka desimal Indonesia tanpa nol berlebih di belakang koma (contoh: 4,5 atau 3).
 */
export function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  const rounded = Math.round(value * 10) / 10;
  return rounded.toString().replace(".", ",");
}

/**
 * Mengurai teks input berat dari pengguna (mendukung koma maupun titik).
 * Mengembalikan null bila teks tidak valid atau bernilai negatif.
 */
export function parseWeightInput(rawValue: string): {
  value: number;
  error: string | null;
} {
  const trimmed = rawValue.trim();
  if (trimmed === "") {
    return { value: 0, error: null };
  }

  const normalized = trimmed.replace(",", ".");
  if (!/^-?\d*(\.\d*)?$/.test(normalized) || normalized === "." || normalized === "-") {
    return {
      value: 0,
      error: "Masukkan angka berat yang benar, misalnya 2,5.",
    };
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return {
      value: 0,
      error: "Berat tidak boleh kurang dari 0 kg, misalnya 1,5.",
    };
  }

  const rounded = Math.round(parsed * 10) / 10;
  return { value: rounded, error: null };
}

/**
 * Konfigurasi master data katalog laundry, aturan bisnis, dan info operasional toko.
 */

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  operatingHours: string;
  pickupHours: string;
  pickupRadiusKm: number;
  minChargeKg: number;
  weightStepKg: number;
  disclaimerText: string;
  weightGuideText: string;
}

export interface KiloanPackage {
  id: string;
  name: string;
  pricePerKg: number;
  estimatedDays: number;
  description: string;
  isActive: boolean;
}

export interface SatuanItem {
  id: string;
  name: string;
  unitLabel: string;
  pricePerUnit: number;
  estimatedDays: number;
  description: string;
  isActive: boolean;
}

export interface AddonService {
  id: "A01" | "A02";
  name: string;
  price: number;
  chargeType: "flat" | "per_billed_kg";
  requiresKiloan: boolean;
  notes: string;
}

export const STORE_CONFIG: StoreConfig = {
  storeName: "LaundryCalc",
  whatsappNumber: "6281234567890",
  operatingHours: "Senin–Jumat, 08.00–20.00 WIB",
  pickupHours: "09.00–17.00 WIB",
  pickupRadiusKm: 5,
  minChargeKg: 3.0,
  weightStepKg: 0.1,
  disclaimerText:
    "Nominal di atas merupakan estimasi awal. Berat dan jumlah pasti akan dikonfirmasi kembali setelah penimbangan oleh tim toko.",
  weightGuideText: "Panduan: 10–12 potong kaos dewasa sekitar 2 kg.",
};

export const KILOAN_PACKAGES: KiloanPackage[] = [
  {
    id: "K01",
    name: "Cuci Lipat Reguler",
    pricePerKg: 6000,
    estimatedDays: 3,
    description: "Cuci bersih, kering, dan lipat rapi.",
    isActive: true,
  },
  {
    id: "K02",
    name: "Cuci Setrika Reguler",
    pricePerKg: 8000,
    estimatedDays: 3,
    description: "Cuci bersih, setrika uap, dan lipat rapi.",
    isActive: true,
  },
  {
    id: "K03",
    name: "Cuci Setrika Ekspres",
    pricePerKg: 15000,
    estimatedDays: 1,
    description: "Selesai lebih cepat dalam 1 hari.",
    isActive: true,
  },
];

export const SATUAN_ITEMS: SatuanItem[] = [
  {
    id: "S01",
    name: "Bedcover Besar (King/Queen)",
    unitLabel: "pcs",
    pricePerUnit: 25000,
    estimatedDays: 3,
    description: "Pencucian khusus bedcover ukuran besar.",
    isActive: true,
  },
  {
    id: "S02",
    name: "Selimut / Sprei Set",
    unitLabel: "pcs",
    pricePerUnit: 15000,
    estimatedDays: 3,
    description: "Perawatan lembut untuk selimut dan sprei.",
    isActive: true,
  },
  {
    id: "S03",
    name: "Sepatu / Tas Ransel",
    unitLabel: "pcs",
    pricePerUnit: 30000,
    estimatedDays: 3,
    description: "Cuci menyeluruh dan pengeringan aman.",
    isActive: true,
  },
];

export const ADDON_SERVICES: AddonService[] = [
  {
    id: "A01",
    name: "Antar-Jemput",
    price: 10000,
    chargeType: "flat",
    requiresKiloan: false,
    notes: "Tarif flat per pesanan, maks. radius 5 km.",
  },
  {
    id: "A02",
    name: "Pewangi Premium",
    price: 2000,
    chargeType: "per_billed_kg",
    requiresKiloan: true,
    notes: "Khusus cucian kiloan, dihitung per kg ditagih.",
  },
];

/**
 * Komponen banner informasi operasional toko di bagian atas halaman (FT-07).
 */

import { Clock, MapPin, Truck } from "lucide-react";
import { STORE_CONFIG } from "../config.ts";

export function StoreInfoBanner() {
  return (
    <header className="bg-white rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {STORE_CONFIG.storeName}
          </h1>
          <p className="mt-1 text-base text-neutral-600">
            Cek tarif layanan dan hitung estimasi cucian Anda sebelum memesan.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-2 pt-3 border-t border-neutral-200 sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <div>
              <dt className="inline font-medium text-neutral-900">Jam Buka: </dt>
              <dd className="inline tabular-nums">{STORE_CONFIG.operatingHours}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Truck className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <div>
              <dt className="inline font-medium text-neutral-900">Jemput Kurir: </dt>
              <dd className="inline tabular-nums">{STORE_CONFIG.pickupHours}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <div>
              <dt className="inline font-medium text-neutral-900">Radius Antar: </dt>
              <dd className="inline tabular-nums">
                Maks. {STORE_CONFIG.pickupRadiusKm} km
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </header>
  );
}

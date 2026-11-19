# Keputusan Desain LaundryCalc & Catalog

Dokumen ini mencatat seluruh keputusan desain yang disepakati pengguna beserta token visual yang dipakai di aplikasi.

## Keputusan Pengguna

| Keputusan | Pilihan Terkonfirmasi |
| :--- | :--- |
| Kesan visual | Ramah dan hangat (Plus Jakarta Sans) |
| Warna aksen | Biru (`blue-700`, hover `blue-800`, pilihan `bg-blue-50` & `border-blue-700`) |
| Sapaan pengguna | Anda |
| Susunan halaman | Satu halaman bergulir dengan bagian terpisah (dan ringkasan berdampingan di layar lebar) |
| Posisi aksi utama | Bilah ringkasan menempel di bawah layar seluler (`FT-05`) dan panel ringkasan kanan di desktop |
| Gambar katalog | Tanpa gambar agar ringkas dan cepat dipindai |

## Token Visual & Tata Letak

- **Latar & Permukaan:** Latar halaman `bg-neutral-50`, permukaan kartu/panel `bg-white`, garis tepi hanya untuk input, tabel, dan pemisah (`border-neutral-200`). Tidak ada kartu di dalam kartu.
- **Teks:** Teks utama `text-neutral-900`, teks pendukung `text-neutral-600`, placeholder `text-neutral-500` (kontras minimal 4,5:1).
- **Tipografi:** Font tunggal `Plus Jakarta Sans` (ketebalan 400, 500, 600) terpasang lokal lewat `@fontsource/plus-jakarta-sans`. Angka menggunakan `tabular-nums`. Ukuran isi dan input minimal `16px` (`text-base`), label minimal `14px` (`text-sm`).
- **Sudut & Bayangan:** Kartu/panel `rounded-2xl`, tombol/input `rounded-xl`, badge `rounded-full`. Bayangan hanya untuk elemen melayang (`shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]`).
- **Status:** Pasangan warna `-800` dan `-50` (hijau berhasil, amber info minimum charge, merah error), selalu disertai ikon `lucide-react` dan label teks.
- **Aksesibilitas & Gerak:** Area sentuh minimal `44 × 44 px`, cincin fokus `focus-visible` 2 px aksen biru dengan offset 2 px, transisi hanya `transform` dan `opacity` (150–200 ms `ease-out`) serta menghormati `motion-reduce:`.

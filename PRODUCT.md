# Daftar Fitur LaundryCalc & Catalog

Dokumen ini merangkum fitur dari PRD LaundryCalc & Catalog v0.1 beserta prioritas, ketergantungan, dan status pengerjaannya.

## Daftar Fitur

| Kode | Nama Fitur | Prioritas | Ketergantungan | Status |
| :--- | :--- | :--- | :--- | :--- |
| FT-07 | Banner Info Operasional Toko | Should Have | Tidak ada | Selesai |
| FT-01 | Katalog Layanan Kiloan & Satuan | Must Have | Tidak ada | Selesai |
| FT-02 | Kalkulator Berat & Info Minimum Charge | Must Have | FT-01 | Selesai |
| FT-03 | Pemilih Kuantitas Item Satuan | Must Have | FT-01 | Selesai |
| FT-04 | Panel Add-on Kondisional | Must Have | FT-01, FT-02 | Selesai |
| FT-05 | Sticky Summary & Rincian Biaya | Must Have | FT-01, FT-02, FT-03, FT-04 | Selesai |
| FT-06 | Formulir Data Pemesan & Checkout WA | Must Have | FT-01, FT-02, FT-03, FT-04, FT-05 | Selesai |

## Keputusan & Catatan PRD

1. Data jam operasional (`Senin–Jumat, 08.00–20.00 WIB`), jadwal penjemputan kurir (`09.00–17.00 WIB`), nomor WhatsApp contoh (`6281234567890`), dan tarif `[Proposed Assumption]` berasal dari konfigurasi statis agar mudah diubah oleh pemilik toko.
2. Pilihan desain yang telah disetujui pengguna: kesan ramah dan hangat (Plus Jakarta Sans), warna aksen biru, sapaan "Anda", tanpa gambar pada katalog, dan susunan satu halaman bergulir dengan bagian terpisah serta bilah ringkasan di bawah layar.

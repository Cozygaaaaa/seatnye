# Resto Menu → Kasir

Aplikasi web sederhana untuk input menu restoran dan kirim transaksi langsung ke antrian kasir.

## Fitur
- Daftar menu makanan/minuman lengkap dengan gambar pada setiap item (kartu bisa diklik langsung).
- Keranjang pesanan aktif dengan total otomatis.
- Input nama pelanggan, nomor meja, dan metode pembayaran.
- Tombol **Kirim ke Kasir** untuk membuat transaksi.
- Riwayat antrian kasir tersimpan di `localStorage`.

## Menjalankan
Karena ini aplikasi statis, cukup jalankan server lokal:

```bash
python3 -m http.server 4173
```

Lalu buka `http://localhost:4173`.

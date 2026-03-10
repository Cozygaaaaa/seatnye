# Resto Menu → Kasir

Aplikasi web sederhana berbasis Single Page Application (SPA) untuk input menu restoran dan kirim transaksi langsung ke antrian kasir.

## Fitur
- Konsep Single Page Application (SPA) dengan route hash: `#/menu`, `#/cart`, `#/queue`, `#/dashboard` dan navigasi bawah (bottom nav).
- Mode mobile (HP) dengan UI terpisah per layar: Daftar Menu, Pesanan Aktif (Keranjang), dan Antrian Kasir.
- Daftar menu makanan/minuman lengkap dengan gambar, termasuk pilihan level untuk menu pedas tertentu.
- Keranjang pesanan dengan kontrol jumlah (+/-), subtotal, pajak 10% otomatis, dan total otomatis.
- Input nama pelanggan, nomor meja, dan metode pembayaran.
- Tombol **Kirim ke Kasir** untuk membuat transaksi.
- Dashboard kasir khusus untuk monitor pesanan masuk terbaru.
- Tombol **Selesai** di dashboard untuk memindahkan pesanan dari **Orderan Baru** ke **Orderan Selesai**.
- Realtime lokal antar-tab/browser pada device yang sama via `storage event` + `BroadcastChannel`.
- Notifikasi pesanan baru: badge dashboard, bunyi beep, dan notifikasi sistem browser (jika diizinkan).
- Riwayat antrian kasir tersimpan di `localStorage`.

## Menjalankan
Karena ini aplikasi statis, cukup jalankan server lokal:

```bash
python3 -m http.server 4173
```

Lalu buka `http://localhost:4173`.

## Deploy ke Vercel
Repo ini sudah menyertakan `vercel.json` agar diperlakukan sebagai static site tanpa build command framework.


# OTA Booking Engine (MVP)

Project ini adalah fondasi OTA sederhana yang **sudah bisa dijalankan end-to-end**:

- Search hotel dari frontend
- Create booking ke backend API
- Simulasi konfirmasi pembayaran (webhook)

## Struktur

- `frontend/` : UI pages (`index.html`, `search.html`, `hotel.html`, `booking.html`)
- `backend/` : API server Express + route modular
- `database/schema.sql` : skema database awal

## Cara Menjalankan

### 1) Jalankan backend

```bash
cd backend
npm install
npm start
```

Backend aktif di `http://localhost:3000`.

### 2) Jalankan frontend static

Buka terminal baru:

```bash
cd frontend
python3 -m http.server 4173
```

Buka browser ke `http://localhost:4173/search.html`.

## API Utama

- `GET /api/health`
- `GET /api/hotels?city=&q=&minPrice=&maxPrice=`
- `GET /api/hotels/:id`
- `POST /api/bookings`
- `POST /api/bookings/:id/pay` (simulasi webhook payment success)
- `GET /api/bookings`

## Flow Booking

1. User search hotel
2. User pilih hotel/room
3. User isi data tamu
4. Backend create booking dengan status `pending_payment`
5. Payment webhook hit `POST /api/bookings/:id/pay`
6. Booking jadi `confirmed`

## Tahapan Lanjut (Roadmap)

1. Integrasi PostgreSQL nyata
2. Integrasi Midtrans/Xendit
3. Dashboard hotel partner
4. Dashboard admin

## Deploy ke Vercel

Repo ini dikonfigurasi agar request root domain (`/`) diarahkan ke frontend OTA yang berada di subfolder:

- `vercel.json` di root project me-rewrite `/` ke `ota-booking-engine/frontend/index.html`
- path seperti `/search.html` dan `/booking.html` juga diarahkan ke `ota-booking-engine/frontend/*`

Dengan ini, deploy tidak lagi gagal hanya karena `index.html` tidak ada di root repository.

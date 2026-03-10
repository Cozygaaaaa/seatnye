# Smart Home Prototype (React + Tailwind)

Prototype Web App Smart Home dengan panel CCTV dan TV Remote.

## Menjalankan project

```bash
cd smart-home
npm install
npm start
```

## Troubleshooting `npm install` gagal 403 Forbidden

Jika muncul error seperti ini:

```txt
npm ERR! code E403
npm ERR! 403 Forbidden - GET https://registry.npmjs.org/<package>
```

biasanya penyebabnya salah satu dari berikut:

1. Registry npm diarahkan ke server privat / policy perusahaan.
2. Konfigurasi proxy salah (`proxy` / `https-proxy`).
3. Token autentikasi npm tidak valid / tidak punya akses.
4. Jaringan memblokir akses keluar ke `registry.npmjs.org`.

### Langkah perbaikan cepat

Cek registry aktif:

```bash
npm config get registry
```

Set ke registry publik npm:

```bash
npm config set registry https://registry.npmjs.org/
```

Hapus konfigurasi proxy yang sering bikin gagal:

```bash
npm config delete proxy
npm config delete https-proxy
```

Jika ada env proxy di shell, bersihkan lalu coba lagi:

```bash
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy
```

Bersihkan cache dan install ulang:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Jika tetap 403

- Coba jaringan lain (hotspot/VPN kantor/non-kantor).
- Pastikan firewall/DNS perusahaan mengizinkan `https://registry.npmjs.org`.
- Jika pakai private registry, login ulang:

```bash
npm login
```

### Catatan untuk Vercel

Build Vercel juga membutuhkan akses ke npm registry saat install dependencies.
Jika environment lokal/CI memblokir registry, deployment akan gagal saat install.


## Troubleshooting Vercel `404 NOT_FOUND`

Jika deployment sukses tetapi URL preview menampilkan `404 NOT_FOUND`, umumnya masalahnya ada di **konfigurasi output/build**, bukan di komponen React.

### Root cause (yang terjadi)

- Vercel mencari file hasil build (mis. `index.html`) di lokasi output yang tidak sesuai.
- Atau request ke path tertentu tidak di-rewrite ke `index.html` pada Single Page App.

### Fix yang dipakai di repo ini

Konfigurasi `vercel.json` sekarang:

- install/build dijalankan di subfolder `smart-home`.
- output diarahkan ke `smart-home/build` (folder output CRA).
- semua path di-rewrite ke `/index.html` agar route SPA tidak 404.

### Warning signs ke depan

- App ada di subfolder, tapi Vercel masih build dari root tanpa pengaturan root/output.
- Build sukses, tapi saat buka preview langsung `NOT_FOUND`.
- Route non-root (mis. `/tv`, `/dashboard`) selalu 404 setelah refresh.

### Alternatif valid

1. **Set Root Directory di Vercel Project Settings** ke `smart-home` (tanpa banyak config file).
2. **Pertahankan project di root repo** agar auto-detect framework berjalan default.
3. **Gunakan `vercel.json` seperti sekarang** untuk kontrol eksplisit (lebih jelas, tapi perlu maintenance saat struktur folder berubah).

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


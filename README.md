backend/
├── cmd/
│   └── api/
│       └── main.go       # Entry point aplikasi
├── internal/
│   ├── config/           # Konfigurasi database & env
│   ├── controllers/      # Handler HTTP (misal: VehicleController)
│   ├── models/           # Skema GORM (Vehicle, Driver, dsb)
│   ├── routes/           # Definisi endpoint API
│   └── repository/       # Akses langsung ke database
├── go.mod
└── go.sum


frontend-parago/
├── public/                 # Aset statis (gambar, icon, logo)
├── src/
│   ├── app/                # 🚦 ROUTING & HALAMAN (App Router)
│   │   ├── (auth)/         # Route Group untuk autentikasi (URL tidak pakai /auth)
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/    # Route Group untuk halaman dalam dashboard
│   │   │   ├── layout.tsx  # Layout khusus dashboard (Sidebar + Navbar)
│   │   │   ├── tracking/   # Halaman Peta Live Tracking
│   │   │   │   └── page.tsx
│   │   │   ├── vehicles/   # Halaman Manajemen Kendaraan
│   │   │   │   └── page.tsx
│   │   │   └── drivers/    # Halaman Manajemen Pengemudi
│   │   │       └── page.tsx
│   │   ├── globals.css     # CSS Global (Tailwind)
│   │   ├── layout.tsx      # Root Layout (Provider TanStack diletakkan di sini)
│   │   └── page.tsx        # Landing page atau redirect ke login
│   │
│   ├── components/         # 🧩 KOMPONEN REACT
│   │   ├── maps/           # Komponen spesifik peta (Leaflet/Mapbox, Markers)
│   │   ├── layouts/        # Komponen layout (Sidebar, Header, Topbar)
│   │   └── ui/             # Komponen UI dasar yang dapat dipakai ulang (Button, Card, Input)
│   │
│   ├── hooks/              # 🪝 CUSTOM HOOKS
│   │   ├── api/            # Tempat fungsi TanStack Query (misal: useVehicles.ts)
│   │   └── useWebSocket.ts # Hook untuk koneksi real-time lokasi
│   │
│   ├── lib/                # 🛠️ UTILITIES & CONFIG
│   │   ├── api.ts          # Konfigurasi Fetch/Axios (Base URL, Interceptor)
│   │   └── utils.ts        # Fungsi helper (format tanggal, format rupiah, dsb)
│   │
│   ├── store/              # 💾 GLOBAL STATE (Zustand)
│   │   └── useFleetStore.ts# Menyimpan state frontend (misal: filter kendaraan aktif)
│   │
│   └── types/              # 🏷️ TYPESCRIPT DEFINITIONS
│       ├── vehicle.d.ts    # Tipe data dari Backend Go untuk Kendaraan
│       └── driver.d.ts     # Tipe data dari Backend Go untuk Pengemudi
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json

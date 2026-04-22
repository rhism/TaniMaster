# Tani Master - Agricultural Business Management Platform

## Project Overview
Tani Master is a web-based management platform for agriculture/farming businesses. It helps farmers manage inventory, production, finances, tasks, and user settings.

## Tech Stack
- **Frontend**: React 18 + Vite, Tailwind CSS, NextUI, React Router v6, Axios, jsPDF
- **Backend**: Node.js + Express, PostgreSQL (via `pg`), JWT authentication, Multer for file uploads

## Architecture
- **Frontend** runs on port **5000** (Vite dev server, `0.0.0.0`)
- **Backend** runs on port **3000** (Express, localhost)
- Vite proxies `/api`, `/upload-profile`, `/profile-picture` to the backend at port 3000
- Frontend uses relative URLs (e.g., `/api/todos`) — no hardcoded localhost

## Project Structure
```
Backend/
  config/db.js          - PostgreSQL pool with MySQL-compatible interface (?→$n placeholders)
  controllers/          - Request handlers
  middlewares/
    authMiddleware.js   - JWT authentication middleware
  models/               - Data access layer (raw SQL)
  routes/               - API route definitions
  server.js             - Express entry point (PORT=3000)

Frontend/
  src/
    components/         - Reusable UI components organized by feature
      ComponentDashboard/   - HeaderDashboard, ToDo
      ComponentInventaris/  - InventoriBibit, InventoriBaku (API-connected)
      ComponentKeuangan/    - HeaderKeuangan, RiwayatKeuangan
      ComponentPengaturan/  - Settings UI stubs
      ComponentProduksi/    - Produksi, Penjualan
      Landing/              - Navbar, Hero, Fitur, Rekomendasi, Contact, Footer
      Layout/               - Layout wrappers with Sidebar
    pages/              - Top-level page components
    main.jsx            - React entry point
    App.jsx             - Routing (react-router-dom)
  vite.config.js        - Vite config: port 5000, proxy to backend
```

## Database
- Uses Replit's built-in PostgreSQL database
- Tables: users, todos, bahan_baku, bahan_bibit, produksi, hasil_panen, ringkasan_keuangan, riwayat_keuangan
- `db.js` provides MySQL-compatible API (translates `?` to `$n` PostgreSQL placeholders)

## Environment Variables
- `PORT=3000` — Backend port
- `JWT_SECRET` — JWT signing key
- `DATABASE_URL` — PostgreSQL connection string (provided by Replit)

## Workflows
- **Start application**: `cd Frontend && npm run dev` → port 5000 (webview)
- **Start Backend**: `cd Backend && node server.js` → port 3000 (console)

## Design System (April 2026 Redesign)
- **Colors**: Green/emerald primary accents, `bg-slate-50` app background
- **Cards**: `bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700`
- **Inputs**: `rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700`
- **Primary button**: `bg-green-600 hover:bg-green-700 text-white rounded-xl`
- **Dark mode**: `ThemeContext.jsx` toggles `dark` class on `<html>` (Tailwind `darkMode: 'class'`)

## Dark Mode
- `ThemeContext.jsx` provides `isDark` + `toggleTheme` via React context
- `App.jsx` wraps all routes in `<ThemeProvider>`
- Sidebar has sun/moon toggle button at the bottom
- PengaturanPage has Mode Terang / Mode Gelap selector buttons
- Theme persisted in `localStorage` under key `tanimaster-theme`

## Features & Status
| Feature | Status |
|---|---|
| Landing page | ✅ Complete |
| Auth (register/login) | ✅ Complete |
| Dashboard (header + tasks + quick cards) | ✅ Redesigned + dark mode |
| Inventaris (bibit & baku) | ✅ API-connected, redesigned + dark mode |
| Keuangan (header + riwayat) | ✅ API-connected, redesigned + dark mode |
| Produksi (produksi + penjualan) | ✅ Redesigned + dark mode (local state) |
| Panduan | ✅ Redesigned custom accordion + dark mode |
| Pengaturan | ✅ Redesigned single-page, theme toggle |

## Cleanup Applied (April 2026)
- Removed: `userRoutes.js`, `emailService.js`, `uploadMiddleware.js`, `userModel.js`
- Removed unused frontend: `auth.js`, `vite.svg`, `money1.png`, `tanimaster.svg`, `README.md`
- Removed unused packages: `@react-oauth/google`, `@shadcn/ui`, `@radix-ui/*`, `mysql`, `mysql2`, `sequelize`, `nodemailer`
- Old Pengaturan sub-components (AkunPribadi, KeamananPrivasi, Preferensi, Integrasi, LanggananPembayaran, ContainerPengaturan, HeaderPengaturan) superseded by single PengaturanPage.jsx
- All Layout files unified to same dark-mode-aware pattern (bg-slate-50 dark:bg-gray-900)

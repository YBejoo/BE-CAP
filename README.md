# SI-CAP API

Backend API untuk **SI-CAP (Sistem Informasi Capaian Pembelajaran)** - Manajemen RPS, CPMK, dan CPL berbasis OBE (Outcome-Based Education).

## 🛠️ Tech Stack

- **Runtime:** Bun / Cloudflare Workers
- **Framework:** Hono
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Auth:** JWT

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Database

Buat D1 database (jika belum):
```bash
bunx wrangler d1 create si-cap-db
```

Copy `database_id` ke `wrangler.jsonc`.

### 3. Setup Environment

Buat file `.dev.vars`:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

### 4. Run Migrations

```bash
bun run db:generate
bun run db:migrate
```

### 5. Start Development Server

```bash
bun run dev
```

Server akan berjalan di `http://localhost:8787`

## 📁 Project Structure

```
src/
├── index.ts              # Entry point
├── db/
│   ├── schema.ts         # Database schema (Drizzle)
│   └── relations.ts      # Table relations
├── routes/
│   ├── auth.ts           # Authentication
│   ├── prodi.ts          # Program Studi
│   ├── kurikulum.ts      # Kurikulum
│   ├── profil-lulusan.ts # Profil Lulusan
│   ├── kompetensi-utama.ts # KUL
│   ├── cpl.ts            # CPL + Matrix CPL-PL
│   ├── bahan-kajian.ts   # Bahan Kajian + Matrix CPL-BK
│   ├── mata-kuliah.ts    # MK + Matrix CPL-MK + Penugasan Dosen
│   ├── dosen.ts          # Dosen
│   ├── cpmk.ts           # CPMK + Sub-CPMK
│   ├── rps.ts            # RPS + Workflow + Minggu
│   └── laporan.ts        # Reports
├── middleware/
│   ├── auth.ts           # JWT Auth + Role-based
│   └── error-handler.ts  # Error handling
├── validators/           # Zod schemas
├── utils/                # Helpers
└── types/                # TypeScript types
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Kurikulum
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kurikulum` | List all |
| POST | `/api/kurikulum` | Create |
| GET | `/api/kurikulum/:id` | Get by ID |
| PUT | `/api/kurikulum/:id` | Update |
| DELETE | `/api/kurikulum/:id` | Delete |
| PATCH | `/api/kurikulum/:id/activate` | Activate |

### CPL
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cpl` | List all |
| POST | `/api/cpl` | Create |
| GET | `/api/cpl/:id` | Get by ID |
| PUT | `/api/cpl/:id` | Update |
| DELETE | `/api/cpl/:id` | Delete |
| GET | `/api/cpl/matrix/pl` | Get Matrix CPL-PL |
| POST | `/api/cpl/matrix/pl` | Save Matrix CPL-PL |

### RPS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rps` | List all |
| POST | `/api/rps` | Create |
| GET | `/api/rps/:id` | Get with minggu |
| PUT | `/api/rps/:id` | Update |
| DELETE | `/api/rps/:id` | Delete |
| PATCH | `/api/rps/:id/submit` | Submit for validation |
| PATCH | `/api/rps/:id/validate` | Validate (Kaprodi) |
| PATCH | `/api/rps/:id/reject` | Reject (Kaprodi) |
| POST | `/api/rps/:id/minggu` | Add minggu |

### Laporan
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/laporan/cpl-mk` | Matrix CPL-MK |
| GET | `/api/laporan/rps-status` | RPS completion |
| GET | `/api/laporan/mk-dosen` | MK-Dosen assignment |
| GET | `/api/laporan/cpl-progress` | CPL achievement |

## 🔐 Authentication

Gunakan JWT token di header:
```
Authorization: Bearer <token>
```

### Roles
- `admin` - Full access
- `kaprodi` - Manage kurikulum, validate RPS
- `dosen` - Manage CPMK, RPS

## 📝 Scripts

```bash
bun run dev          # Development server
bun run deploy       # Deploy to Cloudflare
bun run db:generate  # Generate migrations
bun run db:migrate   # Apply migrations (local)
bun run db:migrate:prod  # Apply migrations (production)
bun run db:studio    # Open Drizzle Studio
bun run typecheck    # TypeScript check
```

## 🧪 Testing API

Install REST Client extension di VS Code, lalu buka `api.http` untuk test endpoints.

## 📄 License

MIT
```

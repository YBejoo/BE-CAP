# 🤖 SI-CAP Backend Development Agent Guide

## 📋 Project Overview

**Project:** SI-CAP (Sistem Informasi Capaian Pembelajaran)  
**Purpose:** Backend API untuk manajemen RPS, CPMK, dan CPL berbasis OBE (Outcome-Based Education)  
**Tech Stack:** Bun + Hono + Drizzle ORM + Cloudflare Workers + D1 Database
**Status:** ✅ Production Ready (All Newman Tests Passing)

---

## 🛠️ Technology Stack

### Runtime & Package Manager
- **Bun** - Fast JavaScript runtime & package manager
- Version: Latest stable (1.1+)
- Used for: Development, testing, bundling

### Web Framework
- **Hono** - Ultrafast web framework for Edge
- Version: ^4.x
- Features: Middleware, routing, validation, OpenAPI

### ORM & Database
- **Drizzle ORM** - TypeScript ORM with type-safe queries
- **Cloudflare D1** - SQLite-compatible serverless database
- Migrations: Drizzle Kit

### Testing & Automation
- **Newman** - CLI tool for running Postman collections
- **Newman HTML Reporter** - Generate test reports
- **Postman Collection** - Complete API test suite (50+ endpoints)

### Testing & Automation
- **Newman** - CLI tool for running Postman collections
- **Newman HTML Reporter** - Generate test reports
- **Postman Collection** - Complete API test suite (50+ endpoints)

### Deployment
- **Cloudflare Workers** - Edge computing platform
- **Wrangler** - Cloudflare CLI tool

---

## 🧪 Testing & Quality Assurance

### Automated Testing with Newman

The project includes comprehensive automated testing using Newman CLI:

```bash
# Run all tests
npm run test:api

# Run tests with detailed output
npm run test:api:verbose

# Run tests and stop on first failure
npm run test:api:bail

# Generate HTML test report
npm run test:api:report
```

### Test Coverage

**Postman Collection:** `postman/SI-CAP-API.postman_collection.json`
- ✅ **50+ API Endpoints** tested
- ✅ **Authentication** (Login, Register, Refresh Token)
- ✅ **CRUD Operations** for all entities
- ✅ **Matrix Operations** (CPL-PL, CPL-BK, CPL-MK)
- ✅ **Workflow Operations** (RPS Submit/Validate/Reject)
- ✅ **Business Logic** validation
- ✅ **Error Handling** verification

### Test Scripts Features

Each endpoint includes:
- **Pre-request Scripts**: Generate unique test data, create dependencies
- **Test Assertions**: Status codes, response structure, data validation
- **Auto-save IDs**: Collection variables for chaining requests
- **Error Recovery**: Handle dependency creation failures

### Package.json Test Scripts

```json
{
  "scripts": {
    "test:api": "newman run postman/SI-CAP-API.postman_collection.json --environment postman/SI-CAP-API.postman_environment.json",
    "test:api:bail": "newman run postman/SI-CAP-API.postman_collection.json --environment postman/SI-CAP-API.postman_environment.json --bail",
    "test:api:verbose": "newman run postman/SI-CAP-API.postman_collection.json --environment postman/SI-CAP-API.postman_environment.json --verbose",
    "test:api:report": "newman run postman/SI-CAP-API.postman_collection.json --environment postman/SI-CAP-API.postman_environment.json --reporters html --reporter-html-export reports/test-report.html"
  }
}
```

### CI/CD Integration

For continuous integration:

```yaml
# .github/workflows/test-api.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test:api:bail
```

---

## 📁 Project Structure

```
si-cap-api/
├── src/
│   ├── index.ts                 # Entry point, Hono app initialization
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.ts              # Authentication routes
│   │   ├── kurikulum.ts         # Kurikulum CRUD
│   │   ├── profil-lulusan.ts    # Profil Lulusan CRUD
│   │   ├── kompetensi-utama.ts  # KUL CRUD
│   │   ├── cpl.ts               # CPL CRUD + Matrix CPL-PL
│   │   ├── bahan-kajian.ts      # Bahan Kajian CRUD + Matrix CPL-BK
│   │   ├── mata-kuliah.ts       # Mata Kuliah CRUD + Matrix CPL-MK
│   │   ├── dosen.ts             # Dosen CRUD + Penugasan
│   │   ├── cpmk.ts              # CPMK & Sub-CPMK CRUD
│   │   ├── rps.ts               # RPS CRUD
│   │   └── laporan.ts           # Reporting endpoints
│   ├── db/
│   │   ├── schema.ts            # Drizzle schema definitions
│   │   ├── relations.ts         # Table relations
│   │   ├── index.ts             # DB client export
│   │   └── migrations/          # SQL migrations
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── cors.ts              # CORS configuration
│   │   ├── logger.ts            # Request logging
│   │   └── error-handler.ts     # Global error handling
│   ├── services/
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── kurikulum.service.ts
│   │   ├── cpl.service.ts
│   │   ├── matrix.service.ts    # Matrix calculations
│   │   └── ...
│   ├── validators/
│   │   ├── auth.validator.ts    # Zod schemas for auth
│   │   ├── kurikulum.validator.ts
│   │   └── ...
│   ├── types/
│   │   ├── index.ts             # Shared types
│   │   └── env.d.ts             # Environment types
│   └── utils/
│       ├── response.ts          # Standard API response
│       ├── pagination.ts        # Pagination helpers
│       └── helpers.ts           # Utility functions
├── drizzle/
│   └── migrations/              # Generated migrations
├── tests/
│   ├── unit/
│   └── integration/
├── wrangler.toml                # Cloudflare Workers config
├── drizzle.config.ts            # Drizzle configuration
├── package.json
├── tsconfig.json
└── .dev.vars                    # Local environment variables
```

---

## 📊 Database Schema (Drizzle)

### Core Entities

```typescript
// src/db/schema.ts

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ==================== USERS & AUTH ====================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  nama: text('nama').notNull(),
  role: text('role', { enum: ['admin', 'kaprodi', 'dosen'] }).notNull().default('dosen'),
  id_prodi: text('id_prodi').references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PRODI ====================
export const prodi = sqliteTable('prodi', {
  id: text('id').primaryKey(),
  kode_prodi: text('kode_prodi').notNull().unique(),
  nama_prodi: text('nama_prodi').notNull(),
  fakultas: text('fakultas').notNull(),
  jenjang: text('jenjang', { enum: ['D3', 'D4', 'S1', 'S2', 'S3'] }).notNull(),
  akreditasi: text('akreditasi'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KURIKULUM ====================
export const kurikulum = sqliteTable('kurikulum', {
  id: text('id').primaryKey(),
  nama_kurikulum: text('nama_kurikulum').notNull(),
  tahun_berlaku: integer('tahun_berlaku').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  id_prodi: text('id_prodi').notNull().references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PROFIL LULUSAN ====================
export const profilLulusan = sqliteTable('profil_lulusan', {
  id: text('id').primaryKey(),
  kode_profil: text('kode_profil').notNull(), // PL-01, PL-02
  profil_lulusan: text('profil_lulusan').notNull(),
  deskripsi: text('deskripsi').notNull(),
  sumber: text('sumber').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KOMPETENSI UTAMA LULUSAN (KUL) ====================
export const kompetensiUtama = sqliteTable('kompetensi_utama', {
  id: text('id').primaryKey(),
  kode_kul: text('kode_kul').notNull(), // S1, P1, KU1, KK1
  kompetensi_lulusan: text('kompetensi_lulusan').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPL (Capaian Pembelajaran Lulusan) ====================
export const cpl = sqliteTable('cpl', {
  id: text('id').primaryKey(),
  kode_cpl: text('kode_cpl').notNull(), // CPL-01 atau S1, P1
  deskripsi_cpl: text('deskripsi_cpl').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-PL ====================
export const matrixCplPl = sqliteTable('matrix_cpl_pl', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_profil: text('id_profil').notNull().references(() => profilLulusan.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== BAHAN KAJIAN ====================
export const bahanKajian = sqliteTable('bahan_kajian', {
  id: text('id').primaryKey(),
  kode_bk: text('kode_bk').notNull(), // BK-01, BK-02
  nama_bahan_kajian: text('nama_bahan_kajian').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  ranah_keilmuan: text('ranah_keilmuan').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-BK ====================
export const matrixCplBk = sqliteTable('matrix_cpl_bk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_bk: text('id_bk').notNull().references(() => bahanKajian.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== DOSEN ====================
export const dosen = sqliteTable('dosen', {
  id: text('id').primaryKey(),
  nip: text('nip').notNull().unique(),
  nama_dosen: text('nama_dosen').notNull(),
  email: text('email'),
  bidang_keahlian: text('bidang_keahlian'),
  jabatan_fungsional: text('jabatan_fungsional', { 
    enum: ['Tenaga Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] 
  }),
  id_prodi: text('id_prodi').references(() => prodi.id),
  id_user: text('id_user').references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATA KULIAH ====================
export const mataKuliah = sqliteTable('mata_kuliah', {
  id: text('id').primaryKey(),
  kode_mk: text('kode_mk').notNull().unique(),
  nama_mk: text('nama_mk').notNull(),
  sks: integer('sks').notNull(),
  semester: integer('semester').notNull(), // 1-8
  sifat: text('sifat', { enum: ['Wajib', 'Pilihan'] }).notNull(),
  deskripsi: text('deskripsi'),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  id_bahan_kajian: text('id_bahan_kajian').references(() => bahanKajian.id), // 1 BK per MK
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-MK ====================
export const matrixCplMk = sqliteTable('matrix_cpl_mk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PENUGASAN DOSEN (MK-Dosen) ====================
export const penugasanDosen = sqliteTable('penugasan_dosen', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_dosen: text('id_dosen').notNull().references(() => dosen.id, { onDelete: 'cascade' }),
  is_koordinator: integer('is_koordinator', { mode: 'boolean' }).notNull().default(false),
  tahun_akademik: text('tahun_akademik').notNull(), // 2024/2025
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPMK ====================
export const cpmk = sqliteTable('cpmk', {
  id: text('id').primaryKey(),
  kode_cpmk: text('kode_cpmk').notNull(), // CPMK-1, CPMK-2
  deskripsi_cpmk: text('deskripsi_cpmk').notNull(),
  bobot_persentase: real('bobot_persentase').notNull(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== SUB-CPMK ====================
export const subCpmk = sqliteTable('sub_cpmk', {
  id: text('id').primaryKey(),
  kode_sub: text('kode_sub').notNull(), // L1.1, L1.2
  deskripsi_sub_cpmk: text('deskripsi_sub_cpmk').notNull(),
  indikator: text('indikator').notNull(),
  kriteria_penilaian: text('kriteria_penilaian').notNull(),
  id_cpmk: text('id_cpmk').notNull().references(() => cpmk.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS ====================
export const rps = sqliteTable('rps', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id),
  versi: integer('versi').notNull().default(1),
  tahun_akademik: text('tahun_akademik').notNull(),
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  tgl_penyusunan: integer('tgl_penyusunan', { mode: 'timestamp' }),
  tgl_validasi: integer('tgl_validasi', { mode: 'timestamp' }),
  status: text('status', { enum: ['Draft', 'Menunggu Validasi', 'Terbit'] }).notNull().default('Draft'),
  deskripsi_mk: text('deskripsi_mk'),
  pustaka_utama: text('pustaka_utama'),
  pustaka_pendukung: text('pustaka_pendukung'),
  id_koordinator: text('id_koordinator').references(() => dosen.id),
  id_kaprodi: text('id_kaprodi').references(() => dosen.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS MINGGU ====================
export const rpsMinggu = sqliteTable('rps_minggu', {
  id: text('id').primaryKey(),
  id_rps: text('id_rps').notNull().references(() => rps.id, { onDelete: 'cascade' }),
  minggu_ke: integer('minggu_ke').notNull(),
  id_sub_cpmk: text('id_sub_cpmk').references(() => subCpmk.id),
  materi: text('materi').notNull(),
  metode_pembelajaran: text('metode_pembelajaran'), // JSON array
  waktu_menit: integer('waktu_menit').notNull().default(150),
  pengalaman_belajar: text('pengalaman_belajar'),
  bentuk_penilaian: text('bentuk_penilaian'), // JSON array
  bobot_penilaian: real('bobot_penilaian'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});
```

---

## 🔌 API Endpoints Design

### Authentication
```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login, returns JWT
POST   /api/auth/refresh          # Refresh token
POST   /api/auth/logout           # Logout
GET    /api/auth/me               # Get current user
```

### Kurikulum
```
GET    /api/kurikulum             # List all (with filters)
GET    /api/kurikulum/:id         # Get by ID
POST   /api/kurikulum             # Create
PUT    /api/kurikulum/:id         # Update
DELETE /api/kurikulum/:id         # Delete
PATCH  /api/kurikulum/:id/activate # Set as active
```

### Profil Lulusan
```
GET    /api/profil-lulusan                    # List all
GET    /api/profil-lulusan/:id                # Get by ID
POST   /api/profil-lulusan                    # Create
PUT    /api/profil-lulusan/:id                # Update
DELETE /api/profil-lulusan/:id                # Delete
GET    /api/profil-lulusan/kurikulum/:id      # Get by kurikulum
```

### Kompetensi Utama (KUL)
```
GET    /api/kul                   # List all
GET    /api/kul/:id               # Get by ID
POST   /api/kul                   # Create
PUT    /api/kul/:id               # Update
DELETE /api/kul/:id               # Delete
GET    /api/kul/kurikulum/:id     # Get by kurikulum
GET    /api/kul/aspek/:aspek      # Get by aspek (S/P/KU/KK)
```

### CPL
```
GET    /api/cpl                   # List all
GET    /api/cpl/:id               # Get by ID
POST   /api/cpl                   # Create
PUT    /api/cpl/:id               # Update
DELETE /api/cpl/:id               # Delete
GET    /api/cpl/kurikulum/:id     # Get by kurikulum

# Matrix CPL-PL
GET    /api/cpl/matrix/pl         # Get matrix CPL-Profil Lulusan
POST   /api/cpl/matrix/pl         # Save matrix mappings
```

### Bahan Kajian
```
GET    /api/bahan-kajian                      # List all
GET    /api/bahan-kajian/:id                  # Get by ID
POST   /api/bahan-kajian                      # Create
PUT    /api/bahan-kajian/:id                  # Update
DELETE /api/bahan-kajian/:id                  # Delete
GET    /api/bahan-kajian/kurikulum/:id        # Get by kurikulum

# Matrix CPL-BK
GET    /api/bahan-kajian/matrix/cpl           # Get matrix CPL-BK
POST   /api/bahan-kajian/matrix/cpl           # Save matrix mappings
```

### Mata Kuliah
```
GET    /api/mata-kuliah                       # List all
GET    /api/mata-kuliah/:id                   # Get by ID
POST   /api/mata-kuliah                       # Create
PUT    /api/mata-kuliah/:id                   # Update
DELETE /api/mata-kuliah/:id                   # Delete
GET    /api/mata-kuliah/kurikulum/:id         # Get by kurikulum
GET    /api/mata-kuliah/semester/:sem         # Get by semester

# Matrix CPL-MK
GET    /api/mata-kuliah/matrix/cpl            # Get matrix CPL-MK
POST   /api/mata-kuliah/matrix/cpl            # Save matrix mappings

# Penugasan Dosen
GET    /api/mata-kuliah/:id/dosen             # Get assigned dosen
POST   /api/mata-kuliah/:id/dosen             # Assign dosen
DELETE /api/mata-kuliah/:id/dosen/:dosenId    # Remove dosen
```

### Dosen
```
GET    /api/dosen                 # List all
GET    /api/dosen/:id             # Get by ID
POST   /api/dosen                 # Create
PUT    /api/dosen/:id             # Update
DELETE /api/dosen/:id             # Delete
GET    /api/dosen/:id/mata-kuliah # Get assigned MK
GET    /api/dosen/search          # Search dosen (for dropdown)
```

### CPMK & Sub-CPMK
```
GET    /api/cpmk                  # List all
GET    /api/cpmk/:id              # Get by ID with sub-cpmk
POST   /api/cpmk                  # Create
PUT    /api/cpmk/:id              # Update
DELETE /api/cpmk/:id              # Delete
GET    /api/cpmk/mata-kuliah/:id  # Get CPMK by MK

# Sub-CPMK
POST   /api/cpmk/:id/sub          # Create sub-cpmk
PUT    /api/cpmk/:id/sub/:subId   # Update sub-cpmk
DELETE /api/cpmk/:id/sub/:subId   # Delete sub-cpmk
```

### RPS
```
GET    /api/rps                   # List all
GET    /api/rps/:id               # Get by ID with minggu
POST   /api/rps                   # Create
PUT    /api/rps/:id               # Update
DELETE /api/rps/:id               # Delete
GET    /api/rps/mata-kuliah/:id   # Get RPS by MK

# RPS Workflow
PATCH  /api/rps/:id/submit        # Submit for validation
PATCH  /api/rps/:id/validate      # Validate (Kaprodi only)
PATCH  /api/rps/:id/reject        # Reject (Kaprodi only)

# RPS Minggu
GET    /api/rps/:id/minggu        # Get all minggu
POST   /api/rps/:id/minggu        # Add minggu
PUT    /api/rps/:id/minggu/:mingguId  # Update minggu
DELETE /api/rps/:id/minggu/:mingguId  # Delete minggu
```

### Laporan
```
GET    /api/laporan/cpl-mk        # Matrix CPL-MK report
GET    /api/laporan/cpl-progress  # CPL achievement progress
GET    /api/laporan/rps-status    # RPS completion status
GET    /api/laporan/mk-dosen      # MK-Dosen assignment report
GET    /api/laporan/export/:type  # Export (pdf, excel)
```

---

## 🔧 Setup & Configuration

### 1. Initialize Project
```bash
# Create project
mkdir si-cap-api && cd si-cap-api
bun init

# Install dependencies
bun add hono @hono/zod-validator zod drizzle-orm
bun add -d drizzle-kit wrangler @cloudflare/workers-types typescript

# Optional: Auth & Utils
bun add hono-jwt bcryptjs nanoid
bun add -d @types/bcryptjs
```

### 2. Wrangler Configuration
```toml
# wrangler.toml
name = "si-cap-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "si-cap-db"
database_id = "your-database-id"

[env.development]
vars = { ENVIRONMENT = "development" }

[env.staging]
vars = { ENVIRONMENT = "staging" }
```

### 3. Drizzle Configuration
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_D1_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
```

### 4. TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["@cloudflare/workers-types", "bun-types"],
    "lib": ["ES2022"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 📝 Code Patterns & Examples

### Entry Point (index.ts)
```typescript
// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { drizzle } from 'drizzle-orm/d1';

import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import * as schema from './db/schema';

// Routes
import authRoutes from './routes/auth';
import kurikulumRoutes from './routes/kurikulum';
import cplRoutes from './routes/cpl';
import mataKuliahRoutes from './routes/mata-kuliah';
import dosenRoutes from './routes/dosen';
import rpsRoutes from './routes/rps';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
};

type Variables = {
  db: ReturnType<typeof drizzle>;
  user: { id: string; email: string; role: string };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://si-cap.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Database middleware
app.use('*', async (c, next) => {
  const db = drizzle(c.env.DB, { schema });
  c.set('db', db);
  await next();
});

// Error handler
app.onError(errorHandler);

// Health check
app.get('/', (c) => c.json({ 
  status: 'ok', 
  message: 'SI-CAP API v1.0',
  timestamp: new Date().toISOString()
}));

// Public routes
app.route('/api/auth', authRoutes);

// Protected routes
app.use('/api/*', authMiddleware);
app.route('/api/kurikulum', kurikulumRoutes);
app.route('/api/cpl', cplRoutes);
app.route('/api/mata-kuliah', mataKuliahRoutes);
app.route('/api/dosen', dosenRoutes);
app.route('/api/rps', rpsRoutes);

// 404 handler
app.notFound((c) => c.json({ success: false, error: 'Not Found' }, 404));

export default app;
```

### Route Example (mata-kuliah.ts)
```typescript
// src/routes/mata-kuliah.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { mataKuliah, matrixCplMk, penugasanDosen, cpl, dosen } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';

const app = new Hono();

// Validators
const createMKSchema = z.object({
  kode_mk: z.string().min(1),
  nama_mk: z.string().min(1),
  sks: z.number().int().min(1).max(6),
  semester: z.number().int().min(1).max(8),
  sifat: z.enum(['Wajib', 'Pilihan']),
  deskripsi: z.string().optional(),
  id_kurikulum: z.string(),
  id_bahan_kajian: z.string().optional(),
});

// GET /api/mata-kuliah
app.get('/', async (c) => {
  const db = c.get('db');
  const { kurikulum, semester, sifat } = c.req.query();

  try {
    let query = db.select().from(mataKuliah);
    
    // Apply filters
    const conditions = [];
    if (kurikulum) conditions.push(eq(mataKuliah.id_kurikulum, kurikulum));
    if (semester) conditions.push(eq(mataKuliah.semester, parseInt(semester)));
    if (sifat) conditions.push(eq(mataKuliah.sifat, sifat as 'Wajib' | 'Pilihan'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(mataKuliah.semester, mataKuliah.kode_mk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch mata kuliah'), 500);
  }
});

// GET /api/mata-kuliah/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.id, id),
      with: {
        bahanKajian: true,
        cplList: {
          with: { cpl: true }
        },
        dosenPengampu: {
          with: { dosen: true }
        }
      }
    });

    if (!result) {
      return c.json(errorResponse('Mata kuliah not found'), 404);
    }

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch mata kuliah'), 500);
  }
});

// POST /api/mata-kuliah
app.post('/', zValidator('json', createMKSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(mataKuliah).values({ id, ...data });

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(result[0], 'Mata kuliah created'), 201);
  } catch (error) {
    return c.json(errorResponse('Failed to create mata kuliah'), 500);
  }
});

// PUT /api/mata-kuliah/:id
app.put('/:id', zValidator('json', createMKSchema.partial()), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(mataKuliah)
      .set({ ...data, updated_at: new Date() })
      .where(eq(mataKuliah.id, id));

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(result[0], 'Mata kuliah updated'));
  } catch (error) {
    return c.json(errorResponse('Failed to update mata kuliah'), 500);
  }
});

// DELETE /api/mata-kuliah/:id
app.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    await db.delete(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(null, 'Mata kuliah deleted'));
  } catch (error) {
    return c.json(errorResponse('Failed to delete mata kuliah'), 500);
  }
});

// ==================== Matrix CPL-MK ====================

// GET /api/mata-kuliah/matrix/cpl
app.get('/matrix/cpl', async (c) => {
  const db = c.get('db');
  const { kurikulum } = c.req.query();

  try {
    // Get all CPL
    const cplList = await db.select().from(cpl)
      .where(kurikulum ? eq(cpl.id_kurikulum, kurikulum) : undefined);

    // Get all MK
    const mkList = await db.select().from(mataKuliah)
      .where(kurikulum ? eq(mataKuliah.id_kurikulum, kurikulum) : undefined);

    // Get all mappings
    const mappings = await db.select().from(matrixCplMk);

    // Build matrix
    const matrix = cplList.map(cplItem => ({
      cpl: cplItem,
      mappings: mkList.map(mk => ({
        mk,
        isLinked: mappings.some(m => m.id_cpl === cplItem.id && m.id_mk === mk.id)
      }))
    }));

    return c.json(successResponse({ cplList, mkList, matrix }));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch matrix'), 500);
  }
});

// POST /api/mata-kuliah/matrix/cpl
const matrixSchema = z.object({
  mappings: z.array(z.object({
    id_cpl: z.string(),
    id_mk: z.string(),
  }))
});

app.post('/matrix/cpl', zValidator('json', matrixSchema), async (c) => {
  const db = c.get('db');
  const { mappings } = c.req.valid('json');

  try {
    // Clear existing mappings
    await db.delete(matrixCplMk);

    // Insert new mappings
    if (mappings.length > 0) {
      await db.insert(matrixCplMk).values(
        mappings.map(m => ({ id: nanoid(), ...m }))
      );
    }

    return c.json(successResponse(null, 'Matrix saved successfully'));
  } catch (error) {
    return c.json(errorResponse('Failed to save matrix'), 500);
  }
});

// ==================== Penugasan Dosen ====================

// GET /api/mata-kuliah/:id/dosen
app.get('/:id/dosen', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      penugasan: penugasanDosen,
      dosen: dosen
    })
    .from(penugasanDosen)
    .innerJoin(dosen, eq(penugasanDosen.id_dosen, dosen.id))
    .where(eq(penugasanDosen.id_mk, id));

    return c.json(successResponse(result.map(r => ({
      ...r.dosen,
      is_koordinator: r.penugasan.is_koordinator,
      tahun_akademik: r.penugasan.tahun_akademik,
      semester_akademik: r.penugasan.semester_akademik
    }))));
  } catch (error) {
    return c.json(errorResponse('Failed to fetch dosen'), 500);
  }
});

// POST /api/mata-kuliah/:id/dosen
const penugasanSchema = z.object({
  dosen_ids: z.array(z.string()),
  tahun_akademik: z.string(),
  semester_akademik: z.enum(['Ganjil', 'Genap']),
  koordinator_id: z.string().optional()
});

app.post('/:id/dosen', zValidator('json', penugasanSchema), async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');
  const { dosen_ids, tahun_akademik, semester_akademik, koordinator_id } = c.req.valid('json');

  try {
    // Remove existing assignments for this MK and period
    await db.delete(penugasanDosen).where(
      and(
        eq(penugasanDosen.id_mk, mkId),
        eq(penugasanDosen.tahun_akademik, tahun_akademik),
        eq(penugasanDosen.semester_akademik, semester_akademik)
      )
    );

    // Insert new assignments
    if (dosen_ids.length > 0) {
      await db.insert(penugasanDosen).values(
        dosen_ids.map(dosenId => ({
          id: nanoid(),
          id_mk: mkId,
          id_dosen: dosenId,
          tahun_akademik,
          semester_akademik,
          is_koordinator: dosenId === koordinator_id
        }))
      );
    }

    return c.json(successResponse(null, 'Dosen assigned successfully'));
  } catch (error) {
    return c.json(errorResponse('Failed to assign dosen'), 500);
  }
});

export default app;
```

### Response Utility
```typescript
// src/utils/response.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(
  data: T, 
  message?: string,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta
  };
}

export function errorResponse(error: string, details?: unknown): ApiResponse {
  return {
    success: false,
    error,
    ...(process.env.NODE_ENV === 'development' && details ? { details } : {})
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

### Auth Middleware
```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
}

// Role-based middleware
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    
    if (!user || !roles.includes(user.role)) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    
    await next();
  };
}
```

---

## 🚀 Deployment Commands

### Development
```bash
# Run locally with D1 local database
bun run dev
# or
wrangler dev --local --persist

# Run Drizzle Studio (for DB inspection)
bun run db:studio
```

### Database Migration
```bash
# Generate migration
bun run db:generate

# Apply migration to local D1
wrangler d1 migrations apply si-cap-db --local

# Apply migration to production D1
wrangler d1 migrations apply si-cap-db --remote
```

### Production Deployment
```bash
# Deploy to Cloudflare Workers
wrangler deploy

# Deploy to staging
wrangler deploy --env staging

# View logs
wrangler tail
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "wrangler dev --local --persist",
    "deploy": "wrangler deploy",
    "deploy:staging": "wrangler deploy --env staging",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "wrangler d1 migrations apply si-cap-db --local",
    "db:migrate:prod": "wrangler d1 migrations apply si-cap-db --remote",
    "db:studio": "drizzle-kit studio",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "test:watch": "bun test --watch"
  }
}
```

---

## ⚠️ Important Notes

### Aspek Enum Values
- **S** = Sikap
- **P** = Pengetahuan
- **KU** = Keterampilan Umum
- **KK** = Keterampilan Khusus

### Business Rules
1. **Kurikulum** - Hanya 1 kurikulum aktif per prodi
2. **MK → BK** - 1 MK memiliki 1 Bahan Kajian
3. **MK → CPL** - 1 MK memiliki minimal 2 CPL
4. **RPS** - Harus divalidasi Kaprodi sebelum Terbit
5. **CPMK** - Total bobot harus 100%
6. **Penugasan Dosen** - 1 MK bisa memiliki multiple dosen, 1 koordinator

### Frontend Integration
- Base URL: `https://si-cap-api.workers.dev` (production)
- Local: `http://localhost:8787`
- Auth: Send `Authorization: Bearer <token>` header
- Content-Type: `application/json`

### Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🎯 Frontend Integration Guide

> **Catatan Integrasi:** Disarankan menggunakan **Axios** sebagai HTTP client agar pengelolaan base URL, interceptor token, dan error handling lebih konsisten.

### Authentication Flow

```typescript
// 1. Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    // Redirect to dashboard
  }
};

// 2. Use token in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
};

// 3. Handle token refresh
const refreshToken = async () => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      refreshToken: localStorage.getItem('refreshToken') 
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.data.token);
  } else {
    // Redirect to login
    localStorage.clear();
    window.location.href = '/login';
  }
};
```

### Data Fetching Patterns

```typescript
// Generic API call with error handling
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const baseURL = import.meta.env.PROD 
    ? 'https://si-cap-api.workers.dev' 
    : 'http://localhost:8787';
    
  const url = `${baseURL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (response.status === 401) {
      // Try refresh token
      await refreshToken();
      // Retry request
      return apiCall(endpoint, options);
    }
    
    if (!data.success) {
      throw new Error(data.error || 'API Error');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Usage examples
const kurikulumList = await apiCall('/api/kurikulum');
const mataKuliah = await apiCall('/api/mata-kuliah', { 
  method: 'POST', 
  body: JSON.stringify(mkData) 
});
```

### State Management Integration

```typescript
// React Query / SWR pattern
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useKurikulum = () => {
  return useQuery({
    queryKey: ['kurikulum'],
    queryFn: () => apiCall('/api/kurikulum')
  });
};

const useCreateMataKuliah = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => apiCall('/api/mata-kuliah', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mata-kuliah'] });
    }
  });
};
```

### Form Validation & Error Handling

```typescript
// Zod schema matching backend validators
import { z } from 'zod';

const mataKuliahSchema = z.object({
  kode_mk: z.string().min(1, 'Kode MK wajib diisi'),
  nama_mk: z.string().min(1, 'Nama MK wajib diisi'),
  sks: z.number().int().min(1).max(6),
  semester: z.number().int().min(1).max(8),
  sifat: z.enum(['Wajib', 'Pilihan']),
  deskripsi: z.string().optional(),
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
  id_bahan_kajian: z.string().optional()
});

// Form submission with validation
const handleSubmit = async (formData) => {
  try {
    const validatedData = mataKuliahSchema.parse(formData);
    await createMataKuliah.mutateAsync(validatedData);
    // Success handling
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      setErrors(error.errors);
    } else {
      // Handle API errors
      setError(error.message);
    }
  }
};
```

### Matrix Operations

```typescript
// Fetch matrix data
const fetchMatrix = async (type: 'cpl-pl' | 'cpl-bk' | 'cpl-mk') => {
  const endpoints = {
    'cpl-pl': '/api/cpl/matrix/pl',
    'cpl-bk': '/api/bahan-kajian/matrix/cpl',
    'cpl-mk': '/api/mata-kuliah/matrix/cpl'
  };
  
  return await apiCall(endpoints[type]);
};

// Save matrix mappings
const saveMatrix = async (type: string, mappings: any[]) => {
  const endpoints = {
    'cpl-pl': '/api/cpl/matrix/pl',
    'cpl-bk': '/api/bahan-kajian/matrix/cpl',
    'cpl-mk': '/api/mata-kuliah/matrix/cpl'
  };
  
  return await apiCall(endpoints[type], {
    method: 'POST',
    body: JSON.stringify({ mappings })
  });
};
```

### RPS Workflow

```typescript
// Submit RPS for validation
const submitRPS = async (rpsId: string, kaprodiId: string) => {
  return await apiCall(`/api/rps/${rpsId}/submit`, {
    method: 'PATCH',
    body: JSON.stringify({ id_kaprodi: kaprodiId })
  });
};

// Validate RPS (Kaprodi only)
const validateRPS = async (rpsId: string) => {
  return await apiCall(`/api/rps/${rpsId}/validate`, {
    method: 'PATCH'
  });
};

// Reject RPS (Kaprodi only)
const rejectRPS = async (rpsId: string) => {
  return await apiCall(`/api/rps/${rpsId}/reject`, {
    method: 'PATCH'
  });
};
```

### File Upload Handling

```typescript
// For future file upload features (RPS attachments, etc.)
const uploadFile = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return await apiCall('/api/upload', {
    method: 'POST',
    headers: {
      // Don't set Content-Type, let browser set it with boundary
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
};
```

### Real-time Updates (Future Enhancement)

```typescript
// WebSocket connection for real-time updates
const connectWebSocket = () => {
  const ws = new WebSocket('wss://si-cap-api.workers.dev/ws');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle real-time updates (RPS status changes, etc.)
  };
  
  return ws;
};
```

---

## � Quick Start for Frontend Developers

### 1. Environment Setup

```bash
# Clone frontend project
git clone <your-frontend-repo>
cd your-frontend-project

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8787
VITE_API_PROD_URL=https://si-cap-api.workers.dev
```

### 2. API Client Setup

Create a simple API client:

```typescript
// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private token: string | null = null;
  
  setToken(token: string) {
    this.token = token;
  }
  
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API Error');
    }
    
    return data.data;
  }
  
  // Auth methods
  async login(credentials: { email: string; password: string }) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.setToken(data.token);
    return data;
  }
  
  // CRUD methods
  async getKurikulum() {
    return this.request('/api/kurikulum');
  }
  
  async createMataKuliah(data: any) {
    return this.request('/api/mata-kuliah', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  // Add more methods as needed...
}

export const api = new ApiClient();
```

### 3. Component Example

```tsx
// src/components/MataKuliahForm.tsx
import { useState } from 'react';
import { api } from '../lib/api';

export function MataKuliahForm() {
  const [formData, setFormData] = useState({
    kode_mk: '',
    nama_mk: '',
    sks: 3,
    semester: 1,
    sifat: 'Wajib',
    id_kurikulum: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.createMataKuliah(formData);
      // Success: redirect or show success message
      alert('Mata Kuliah berhasil dibuat!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kode MK:</label>
        <input
          type="text"
          value={formData.kode_mk}
          onChange={(e) => setFormData({...formData, kode_mk: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Nama MK:</label>
        <input
          type="text"
          value={formData.nama_mk}
          onChange={(e) => setFormData({...formData, nama_mk: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>SKS:</label>
        <input
          type="number"
          min="1"
          max="6"
          value={formData.sks}
          onChange={(e) => setFormData({...formData, sks: parseInt(e.target.value)})}
          required
        />
      </div>
      
      <div>
        <label>Semester:</label>
        <input
          type="number"
          min="1"
          max="8"
          value={formData.semester}
          onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
          required
        />
      </div>
      
      <div>
        <label>Sifat:</label>
        <select
          value={formData.sifat}
          onChange={(e) => setFormData({...formData, sifat: e.target.value as 'Wajib' | 'Pilihan'})}
        >
          <option value="Wajib">Wajib</option>
          <option value="Pilihan">Pilihan</option>
        </select>
      </div>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
```

### 4. Testing Integration

```bash
# Start backend locally
cd path/to/backend
bun run dev

# Start frontend
cd path/to/frontend
npm run dev

# Test API integration
# Use browser dev tools to check network requests
# Verify authentication flow
# Test CRUD operations
```

### 5. Production Deployment

```typescript
// Update API client for production
const API_BASE = import.meta.env.PROD 
  ? import.meta.env.VITE_API_PROD_URL 
  : import.meta.env.VITE_API_BASE_URL;
```

---

## 📊 API Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "kode_mk": "TI101",
    "nama_mk": "Algoritma dan Pemrograman",
    "sks": 3,
    "semester": 1,
    "sifat": "Wajib",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "Mata kuliah created"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["nama_mk"],
      "message": "Required"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    { "id": "abc123", "nama_mk": "Algoritma" },
    { "id": "def456", "nama_mk": "Struktur Data" }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## 🔧 Troubleshooting

### Common Frontend Integration Issues

#### 1. CORS Errors
```javascript
// Error: Access to XMLHttpRequest at 'https://api.example.com/auth/login' 
// from origin 'http://localhost:3000' has been blocked by CORS policy

// Solution: Configure CORS in your API client
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true, // Important for cookies/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// For development, ensure your dev server proxies API calls
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
```

#### 2. Token Expiration Handling
```javascript
// Automatic token refresh with axios interceptors
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post('/auth/refresh');
        const { access_token } = data.data;
        
        localStorage.setItem('access_token', access_token);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        
        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

#### 3. Validation Error Handling
```javascript
// Handle Zod validation errors from API
const handleApiError = (error) => {
  if (error.response?.data?.success === false) {
    const { error: errorMessage, details } = error.response.data;
    
    if (details && Array.isArray(details)) {
      // Zod validation errors
      const fieldErrors = {};
      details.forEach(detail => {
        const field = detail.path?.[0];
        if (field) {
          fieldErrors[field] = detail.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      // General error
      setError(errorMessage || 'An error occurred');
    }
  }
};

// Usage in form submission
const onSubmit = async (data) => {
  try {
    await apiClient.post('/mata-kuliah', data);
    // Success handling
  } catch (error) {
    handleApiError(error);
  }
};
```

#### 4. Network Error Handling
```javascript
// Robust error handling with retry logic
const apiCallWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Only retry on network errors, not 4xx/5xx
      if (!error.response) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw error;
    }
  }
};

// Usage
const fetchData = () => apiCallWithRetry(() => apiClient.get('/data'));
```

#### 5. Development Tips

**Environment Variables:**
```javascript
// .env.local
VITE_API_BASE_URL=http://localhost:8787
VITE_API_PROD_URL=https://api.yourdomain.com

// Use in code
const API_BASE = import.meta.env.PROD 
  ? import.meta.env.VITE_API_PROD_URL 
  : import.meta.env.VITE_API_BASE_URL;
```

**API Client Setup:**
```javascript
// src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

**Form Validation with React Hook Form + Zod:**
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const mataKuliahSchema = z.object({
  kode_mk: z.string().min(1, 'Kode mata kuliah wajib diisi'),
  nama_mk: z.string().min(1, 'Nama mata kuliah wajib diisi'),
  sks: z.number().min(1).max(6),
  semester: z.number().min(1).max(8),
  sifat: z.enum(['Wajib', 'Pilihan']),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(mataKuliahSchema),
});
```

#### 6. Performance Optimization

**Debounced Search:**
```javascript
import { useState, useEffect, useCallback } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search component
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      apiClient.get(`/mata-kuliah/search?q=${debouncedSearchTerm}`);
    }
  }, [debouncedSearchTerm]);
};
```

**Infinite Scroll for Large Lists:**
```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

const useInfiniteMataKuliah = () => {
  return useInfiniteQuery({
    queryKey: ['mata-kuliah'],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.get(`/mata-kuliah?page=${pageParam}&limit=20`),
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage.data;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });
};
```

---

- [Hono Documentation](https://hono.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
- [Bun Documentation](https://bun.sh)

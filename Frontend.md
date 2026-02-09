# 🎨 SI-CAP Frontend Development Guide

## 📋 Project Overview

**Project:** SI-CAP (Sistem Informasi Capaian Pembelajaran)  
**Type:** Frontend Web Application  
**Purpose:** Manajemen kurikulum berbasis OBE (Outcome-Based Education)  
**Tech Stack:** React Router v7 + TypeScript + Tailwind CSS v4 + Vite  
**Status:** ✅ In Active Development - UI Consolidation Phase Complete

---

## 🎯 Project Context

**SI-CAP** adalah aplikasi web untuk mengelola kurikulum akademik Program Studi Manajemen Informatika, Universitas Sriwijaya, berbasis **Outcome-Based Education (OBE)**. 

### Fitur Utama
- **Kurikulum** - Master kurikulum program studi
- **Profil Lulusan (PL)** - Profil kompetensi lulusan
- **Kompetensi Utama Lulusan (KUL)** - Kompetensi dengan aspek S, P, KU, KK
- **Capaian Pembelajaran Lulusan (CPL)** - Learning outcomes
- **Bahan Kajian (BK)** - Materi pembelajaran
- **Mata Kuliah (MK)** - Courses dengan penugasan dosen (PJ & Anggota)
- **CPMK & Sub-CPMK** - Course learning outcomes
- **RPS** - Rencana Pembelajaran Semester
- **Matrix Management** - CPL-PL, CPL-BK, CPL-MK
- **Dashboard & Laporan** - Visualisasi dan reporting

---

## 🛠️ Technology Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.3 | UI library |
| **React Router** | 7.12.0 | File-based routing, SSR |
| **TypeScript** | 5.9.2 | Type safety |
| **Vite** | 7.1.7 | Build tool & dev server |

### Styling & UI
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.1.13 | Utility-first CSS |
| **@tailwindcss/vite** | 4.1.13 | Tailwind v4 plugin |
| **Recharts** | 3.7.0 | Data visualization |
| **Custom UI Components** | - | Handmade component library |

### State & Data
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Axios** | - | HTTP client |
| **Custom Hooks** | - | Data fetching & state |
| **Context API** | - | Shared state (sidebar) |

### Development Tools
| Tool | Purpose |
|------|---------|
| **vite-tsconfig-paths** | Path aliases (~/) |
| **@types/node** | Node.js types |
| **@react-router/dev** | Dev tools |

---

## 📁 Project Structure

```
SI-CAP/
├── app/                              # Application source
│   ├── root.tsx                      # Root layout + ErrorBoundary
│   ├── routes.ts                     # Route configuration
│   ├── app.css                       # Global styles + Tailwind
│   │
│   ├── components/                   # React components
│   │   ├── header.tsx                # Top navigation + breadcrumb
│   │   ├── sidebar.tsx               # Collapsible sidebar
│   │   └── ui/                       # UI component library
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── icons.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── table.tsx
│   │       ├── textarea.tsx
│   │       ├── tooltip.tsx
│   │       └── index.ts
│   │
│   ├── contexts/                     # React Context
│   │   └── sidebar-context.tsx      # Sidebar state
│   │
│   ├── data/                         # Mock data
│   │   ├── dummy-data.ts            # Development data
│   │   └── evaluasi-data.ts         # Evaluation data
│   │
│   ├── hooks/                        # Custom hooks (14 files)
│   │   ├── useBahanKajian.ts        # Bahan Kajian CRUD
│   │   ├── useCpl.ts                # CPL CRUD
│   │   ├── useCpmk.ts               # CPMK CRUD
│   │   ├── useDashboard.ts          # Dashboard data
│   │   ├── useDosen.ts              # Dosen CRUD
│   │   ├── useKompetensiUtama.ts    # KUL CRUD
│   │   ├── useKurikulum.ts          # Kurikulum CRUD
│   │   ├── useLaporan.ts            # Reports
│   │   ├── useMahasiswa.ts          # Mahasiswa
│   │   ├── useMataKuliah.ts         # Mata Kuliah CRUD
│   │   ├── usePenilaian.ts          # Penilaian
│   │   ├── useProdi.ts              # Prodi
│   │   ├── useProfilLulusan.ts      # Profil Lulusan CRUD
│   │   └── useRps.ts                # RPS CRUD
│   │
│   ├── layouts/
│   │   └── main-layout.tsx          # Main app layout
│   │
│   ├── lib/                          # Utilities
│   │   ├── api.ts                   # Axios instance
│   │   ├── constants.ts             # App constants
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── pages/                        # Page components (13 files)
│   │   ├── bahan-kajian.tsx         # BK + Matrix CPL-BK
│   │   ├── cpl.tsx                  # CPL + Matrix CPL-PL
│   │   ├── cpmk.tsx                 # CPMK management
│   │   ├── dashboard.tsx            # Dashboard
│   │   ├── evaluasi.tsx             # Evaluasi
│   │   ├── kompetensi-utama.tsx     # KUL management
│   │   ├── kurikulum.tsx            # Kurikulum
│   │   ├── laporan.tsx              # Reports
│   │   ├── mata-kuliah.tsx          # MK + Dosen PJ/Anggota
│   │   ├── penilaian.tsx            # Penilaian
│   │   ├── prodi.tsx                # Prodi
│   │   ├── profil-lulusan.tsx       # Profil Lulusan
│   │   └── rps/
│   │       ├── index.tsx            # RPS list
│   │       └── new.tsx              # RPS form
│   │
│   ├── routes/
│   │   └── home.tsx                 # Home route
│   │
│   ├── services/                     # API services (15 files)
│   │   ├── bahan-kajian.service.ts
│   │   ├── cpl.service.ts
│   │   ├── cpmk.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── dosen.service.ts
│   │   ├── index.ts
│   │   ├── kul.service.ts
│   │   ├── kurikulum.service.ts
│   │   ├── laporan.service.ts
│   │   ├── mahasiswa.service.ts
│   │   ├── mata-kuliah.service.ts
│   │   ├── penilaian.service.ts
│   │   ├── prodi.service.ts
│   │   ├── profil-lulusan.service.ts
│   │   ├── rps.service.ts
│   │   └── utils.ts
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript types (423 lines)
│   │
│   └── welcome/
│       └── welcome.tsx              # Landing page
│
├── public/                           # Static assets
├── AGENT.md                          # Backend API guide (1967 lines)
├── FRONTEND.AGENT.md                 # This file
├── API.ENDPOINT.md                   # API documentation
├── Dockerfile                        # Docker config
├── package.json                      # Dependencies
├── react-router.config.ts            # React Router config
├── README.md                         # Project readme
├── tsconfig.json                     # TypeScript config
└── vite.config.ts                    # Vite config
```

**Total Files:**
- Pages: 13 files
- Hooks: 14 files
- Services: 15 files
- UI Components: 14 files
- Types: 1 file (423 lines)

---

## 📊 Data Architecture

### Aspek System (Core Concept)
```typescript
// Aspek = Kategori kompetensi dalam OBE
export type AspekKUL = 'S' | 'P' | 'KU' | 'KK';

// S  = Sikap              → amber-500 (warning)
// P  = Pengetahuan        → green-500 (success)
// KU = Keterampilan Umum  → blue-500 (info)
// KK = Keterampilan Khusus → purple-500 (purple)
```

### Core Entity Types

#### 1. Kurikulum (Root Container)
```typescript
interface Kurikulum {
  id_kurikulum: string;
  nama_kurikulum: string;
  tahun_berlaku: number;
  is_active: boolean;
  id_prodi?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 2. Profil Lulusan (PL)
```typescript
interface ProfilLulusan {
  id_profil: string;
  kode_profil: string;      // PL-01, PL-02
  profil_lulusan: string;   // Software Engineer, Data Analyst
  deskripsi: string;
  sumber: string;           // Referensi
  id_kurikulum: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 3. Kompetensi Utama Lulusan (KUL)
```typescript
interface KompetensiUtamaLulusan {
  id_kul: string;
  kode_kul: string;           // S1, P1, KU1, KK1
  kompetensi_lulusan: string;
  aspek: AspekKUL;            // S, P, KU, KK
  id_kurikulum: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 4. CPL (Capaian Pembelajaran Lulusan)
```typescript
interface CPL {
  id_cpl: string;
  kode_cpl: string;         // CPL-01 atau S1, P1
  deskripsi_cpl: string;
  aspek: AspekKUL;          // S, P, KU, KK
  id_kurikulum: string;
  profil_list?: ProfilLulusan[];  // Many-to-many
  created_at?: Date;
  updated_at?: Date;
}
```

#### 5. Bahan Kajian (BK)
```typescript
interface BahanKajian {
  id_bahan_kajian: string;
  kode_bk: string;          // BK-01, BK-02
  nama_bahan_kajian: string;
  aspek: AspekKUL;
  ranah_keilmuan: string;
  id_kurikulum: string;
  cpl_list?: CPL[];         // Many-to-many
  created_at?: Date;
  updated_at?: Date;
}
```

#### 6. Mata Kuliah (MK)
```typescript
interface MataKuliah {
  id_mk: string;
  kode_mk: string;          // TI101, TI102
  nama_mk: string;
  sks: number;              // 1-6
  semester: number;         // 1-8
  sifat: 'Wajib' | 'Pilihan';
  deskripsi?: string;
  id_kurikulum: string;
  id_bahan_kajian?: string; // 1:1 relationship
  bahan_kajian?: BahanKajian;
  cpl_list?: CPL[];         // Many-to-many
  dosen_pengampu?: Dosen[]; // Many-to-many
  created_at?: Date;
  updated_at?: Date;
}
```

#### 7. Dosen (Lecturer)
```typescript
interface Dosen {
  id_dosen: string;
  nip: string;
  nama_dosen: string;
  email?: string;
  bidang_keahlian?: string;
  jabatan_fungsional?: 
    | 'Tenaga Pengajar' 
    | 'Asisten Ahli' 
    | 'Lektor' 
    | 'Lektor Kepala' 
    | 'Guru Besar';
  id_prodi?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 8. CPMK & Sub-CPMK
```typescript
interface CPMK {
  id_cpmk: string;
  kode_cpmk: string;        // CPMK-1, CPMK-2
  deskripsi_cpmk: string;
  bobot_persentase: number; // Total = 100%
  id_mk: string;
  id_cpl: string;
  sub_cpmk_list?: SubCPMK[];
  created_at?: Date;
  updated_at?: Date;
}

interface SubCPMK {
  id_sub_cpmk: string;
  kode_sub: string;           // L1.1, L1.2
  deskripsi_sub_cpmk: string;
  indikator: string;
  kriteria_penilaian: string;
  id_cpmk: string;
  created_at?: Date;
  updated_at?: Date;
}
```

#### 9. RPS (Rencana Pembelajaran Semester)
```typescript
interface RPS {
  id_rps: string;
  id_mk: string;
  versi: number;
  tahun_akademik: string;     // 2024/2025
  semester_akademik: 'Ganjil' | 'Genap';
  status: 'Draft' | 'Menunggu Validasi' | 'Terbit';
  deskripsi_mk?: string;
  pustaka_utama?: string;
  pustaka_pendukung?: string;
  id_koordinator?: string;
  id_kaprodi?: string;
  minggu_list?: RPSMinggu[];
  created_at?: Date;
  updated_at?: Date;
}

interface RPSMinggu {
  id_minggu: string;
  id_rps: string;
  minggu_ke: number;          // 1-16
  id_sub_cpmk?: string;
  materi: string;
  metode_pembelajaran?: string[];
  waktu_menit: number;        // Default 150
  pengalaman_belajar?: string;
  bentuk_penilaian?: string[];
  bobot_penilaian?: number;
  created_at?: Date;
  updated_at?: Date;
}
```

### Entity Relationships
```
Kurikulum (1)
  ├── ProfilLulusan (N)
  ├── KompetensiUtamaLulusan (N)
  ├── CPL (N)
  ├── BahanKajian (N)
  └── MataKuliah (N)

CPL (N) ←→ ProfilLulusan (N)    [Matrix CPL-PL]
CPL (N) ←→ BahanKajian (N)      [Matrix CPL-BK]
CPL (N) ←→ MataKuliah (N)       [Matrix CPL-MK]

MataKuliah (1) → BahanKajian (1)
MataKuliah (N) ←→ Dosen (N)     [Penugasan: PJ vs Anggota]
MataKuliah (1) → CPMK (N)
CPMK (1) → SubCPMK (N)
MataKuliah (1) → RPS (N)
RPS (1) → RPSMinggu (N)
```

---

## 🎨 UI Component Library

### Design System

**Color Palette:**
```typescript
// Primary
Primary: blue-500, blue-600

// Aspek Colors
S (Sikap):              amber-500, amber-600   (warning)
P (Pengetahuan):        green-500, green-600   (success)
KU (Keterampilan Umum): blue-500, blue-600     (info)
KK (Keterampilan Khusus): purple-500, purple-600 (purple)

// Dosen Role Colors
PJ (Penanggung Jawab):  amber-500
Anggota:                blue-500

// Status Colors
Success:  green-500
Warning:  amber-500
Danger:   red-500
Info:     blue-500
```

**Typography:**
- Font Family: Inter (Google Fonts)
- Sizes: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px)

### Core Components

#### Card Component
```tsx
import { Card, CardHeader, CardContent } from "~/components/ui/card";

<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Card Title</h2>
      <Button>Action</Button>
    </div>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

#### Dialog Component
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Form fields */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Badge Component
```tsx
import { Badge } from "~/components/ui/badge";

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="purple">Purple</Badge>

// Aspek Badge
<Badge variant="warning">S</Badge>  {/* Sikap */}
<Badge variant="success">P</Badge>  {/* Pengetahuan */}
<Badge variant="info">KU</Badge>    {/* Keterampilan Umum */}
<Badge variant="purple">KK</Badge>  {/* Keterampilan Khusus */}

// Dosen Role Badge
<Badge variant="warning">PJ</Badge>      {/* Penanggung Jawab */}
<Badge variant="info">Anggota</Badge>    {/* Anggota */}
```

#### Table Component
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead className="text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
        <TableCell className="text-center">
          <Button size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Avatar Component
```tsx
import { Avatar } from "~/components/ui/avatar";

// Basic usage
<Avatar src={user.avatar} alt={user.name} size="md" />

// With ring (for PJ vs Anggota)
<Avatar 
  src={dosen.avatar} 
  alt={dosen.nama_dosen}
  className={isPJ ? "ring-2 ring-amber-500" : "ring-2 ring-blue-500"}
  size="sm"
/>
```

#### Button Component
```tsx
import { Button } from "~/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icon
<Button>
  <Icons.Plus size={16} className="mr-2" />
  Add Item
</Button>
```

---

## 🔧 Custom Hooks Pattern

### Hook Architecture

Every entity has a dedicated hook following this pattern:

```typescript
// Pattern: app/hooks/use{Entity}.ts
export function useEntity(options: EnrichOptions = {}) {
  // 1. State
  const [itemsRaw, setItemsRaw] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Data enrichment (optional)
  const enrich = useCallback((items: Entity[]) => {
    return items.map(item => ({
      ...item,
      // Add related data
    }));
  }, [dependencies]);

  const items = useMemo(() => enrich(itemsRaw), [enrich, itemsRaw]);

  // 3. CRUD operations
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.fetchList();
      setItemsRaw(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: EntityForm) => {
    const created = await service.create(payload);
    setItemsRaw(prev => [...prev, created]);
    return created;
  }, []);

  const update = useCallback(async (id: string, payload: Partial<EntityForm>) => {
    const updated = await service.update(id, payload);
    setItemsRaw(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await service.remove(id);
    setItemsRaw(prev => prev.filter(item => item.id !== id));
  }, []);

  // 4. Auto-fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 5. Return interface
  return {
    items,
    loading,
    error,
    refresh,
    create,
    update,
    remove
  };
}
```

### Available Hooks

| Hook | Purpose | Key Features |
|------|---------|-------------|
| `useBahanKajian()` | Bahan Kajian CRUD | Matrix CPL-BK support |
| `useCpl()` | CPL CRUD | Matrix CPL-PL, enriched with Profil |
| `useCpmk()` | CPMK & Sub-CPMK | Nested sub-CPMK management |
| `useDashboard()` | Dashboard data | Statistics, charts data |
| `useDosen()` | Dosen CRUD | Search for dropdown, filter by prodi |
| `useKompetensiUtama()` | KUL CRUD | Filter by aspek (S/P/KU/KK) |
| `useKurikulum()` | Kurikulum CRUD | Activate/deactivate, filter by prodi |
| `useLaporan()` | Report data | CPL progress, RPS status, etc |
| `useMahasiswa()` | Mahasiswa CRUD | Filter by angkatan, prodi |
| `useMataKuliah()` | Mata Kuliah CRUD | Matrix CPL-MK, Dosen assignment |
| `usePenilaian()` | Penilaian | Per CPMK scoring |
| `useProdi()` | Prodi CRUD | Basic CRUD |
| `useProfilLulusan()` | Profil Lulusan | Filter by kurikulum |
| `useRps()` | RPS CRUD | Workflow: submit, validate, reject |

### Hook Usage Example

```typescript
// app/pages/mata-kuliah.tsx
import { useMataKuliah } from "~/hooks/useMataKuliah";
import { useBahanKajian } from "~/hooks/useBahanKajian";
import { useCpl } from "~/hooks/useCpl";

export default function MataKuliahPage() {
  // Load related data first
  const { bahanKajianList } = useBahanKajian();
  const { cplList } = useCpl();
  
  // Pass as enrichment options
  const { 
    mataKuliahList,   // Enriched with BK and CPL data
    loading,
    error,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah
  } = useMataKuliah({ 
    bahanKajianList, 
    cplList 
  });

  // Use in component
  const handleCreate = async (formData) => {
    try {
      await createMataKuliah(formData);
      // State automatically updated
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {mataKuliahList.map(mk => (
        <div key={mk.id_mk}>
          <h3>{mk.nama_mk}</h3>
          {/* BK automatically enriched */}
          <p>BK: {mk.bahan_kajian?.nama_bahan_kajian}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔌 Service Layer Pattern

### Service Architecture

```typescript
// Pattern: app/services/{entity}.service.ts
import api from "~/lib/api";
import type { Entity, EntityForm } from "~/types";

// List all
export async function fetchList(): Promise<Entity[]> {
  const response = await api.get("/entity");
  return response.data.data;
}

// Get by ID
export async function fetchById(id: string): Promise<Entity> {
  const response = await api.get(`/entity/${id}`);
  return response.data.data;
}

// Create
export async function create(payload: EntityForm): Promise<Entity> {
  const response = await api.post("/entity", payload);
  return response.data.data;
}

// Update
export async function update(id: string, payload: Partial<EntityForm>): Promise<Entity> {
  const response = await api.put(`/entity/${id}`, payload);
  return response.data.data;
}

// Delete
export async function remove(id: string): Promise<void> {
  await api.delete(`/entity/${id}`);
}
```

### API Client Setup

```typescript
// app/lib/api.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";
const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000);
const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY ?? "token";

const api = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(tokenKey);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Expected API Response Format

```typescript
// Success response
{
  "success": true,
  "data": {
    "id_mk": "mk-123",
    "kode_mk": "TI101",
    "nama_mk": "Algoritma dan Pemrograman",
    // ...
  },
  "message": "Success message" // Optional
}

// List response
{
  "success": true,
  "data": [
    { /* item 1 */ },
    { /* item 2 */ }
  ],
  "meta": {  // Optional for pagination
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}

// Error response
{
  "success": false,
  "error": "Error message",
  "details": [  // Optional (Zod validation errors)
    {
      "code": "invalid_type",
      "path": ["nama_mk"],
      "message": "Required"
    }
  ]
}
```

---

## 📄 Page Component Pattern

### Standard Page Structure

```typescript
// app/pages/entity.tsx
import { useState } from "react";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Icons } from "~/components/ui/icons";
import { useEntity } from "~/hooks/useEntity";
import type { Entity, EntityForm } from "~/types";

export default function EntityPage() {
  // 1. Hooks
  const { 
    items,
    loading,
    create,
    update,
    remove
  } = useEntity();

  // 2. State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Entity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<EntityForm>({
    // Initial form state
  });

  // 3. Derived state
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Event handlers
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await update(editingItem.id, formData);
      } else {
        await create(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleEdit = (item: Entity) => {
    setEditingItem(item);
    setFormData({
      // Populate form from item
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await remove(id);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      // Reset to initial state
    });
  };

  // 5. Early return for loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // 6. Render
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Page Title</h1>
          <p className="text-sm text-slate-500 mt-1">
            Page description
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Icons.Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">List Title</h2>
            <div className="relative w-64">
              <Icons.Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
              />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column 1</TableHead>
                <TableHead>Column 2</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Icons.Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icons.Trash size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Form fields */}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setIsDialogOpen(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 🎯 Key Features Implementation

### 1. Dosen PJ (Penanggung Jawab) & Anggota System

**Business Rule:**
- First dosen selected = **PJ (Penanggung Jawab)** → Amber badge & ring
- Subsequent dosen = **Anggota** → Blue badge & ring

**Implementation:**

```typescript
// app/pages/mata-kuliah.tsx
const [dosenPengampuMap, setDosenPengampuMap] = useState<Record<string, Dosen[]>>({});
const [selectedDosenIds, setSelectedDosenIds] = useState<string[]>([]);
const [selectedMKId, setSelectedMKId] = useState<string | null>(null);

// Get dosen list for specific MK
const getDosenPengampu = (mkId: string): Dosen[] => {
  return dosenPengampuMap[mkId] || [];
};

// Open dialog to assign dosen
const openDosenDialog = (mkId: string) => {
  setSelectedMKId(mkId);
  const currentDosen = getDosenPengampu(mkId);
  setSelectedDosenIds(currentDosen.map(d => d.id_dosen));
  setIsDosenDialogOpen(true);
};

// Save dosen assignment
const savePenugasanDosen = async () => {
  if (!selectedMKId) return;

  const selectedDosen = dosenList.filter(d => 
    selectedDosenIds.includes(d.id_dosen)
  );
  
  // Update local state
  setDosenPengampuMap(prev => ({
    ...prev,
    [selectedMKId]: selectedDosen
  }));
  
  // API call (optional if using real backend)
  await assignDosen(selectedMKId, {
    dosen_ids: selectedDosenIds,
    tahun_akademik: "2024/2025",
    semester_akademik: "Ganjil",
    koordinator_id: selectedDosenIds[0] // First = PJ
  });

  setIsDosenDialogOpen(false);
};

// Display in table
<TableCell>
  <div className="flex items-center gap-2">
    {getDosenPengampu(mk.id_mk).length > 0 ? (
      <div className="flex -space-x-2">
        {getDosenPengampu(mk.id_mk).map((dosen, index) => (
          <Avatar
            key={dosen.id_dosen}
            src={dosen.avatar}
            alt={dosen.nama_dosen}
            size="sm"
            className={index === 0 
              ? "ring-2 ring-amber-500" 
              : "ring-2 ring-blue-500"
            }
            title={`${dosen.nama_dosen} (${index === 0 ? 'PJ' : 'Anggota'})`}
          />
        ))}
      </div>
    ) : (
      <span className="text-slate-400 text-sm">Belum ada dosen</span>
    )}
  </div>
</TableCell>

// In dialog
<div className="space-y-2">
  {dosenList.map((dosen, index) => {
    const isSelected = selectedDosenIds.includes(dosen.id_dosen);
    const selectedIndex = selectedDosenIds.indexOf(dosen.id_dosen);
    const isPJ = selectedIndex === 0 && isSelected;

    return (
      <label key={dosen.id_dosen} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedDosenIds(prev => [...prev, dosen.id_dosen]);
            } else {
              setSelectedDosenIds(prev => prev.filter(id => id !== dosen.id_dosen));
            }
          }}
        />
        <Avatar src={dosen.avatar} alt={dosen.nama_dosen} size="sm" />
        <div className="flex-1">
          <p className="font-medium">{dosen.nama_dosen}</p>
          <p className="text-sm text-slate-500">{dosen.bidang_keahlian}</p>
        </div>
        {isPJ && (
          <Badge variant="warning">PJ</Badge>
        )}
        {isSelected && !isPJ && (
          <Badge variant="info">Anggota</Badge>
        )}
      </label>
    );
  })}
</div>

// Info box in dialog
{selectedDosenIds.length > 0 && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <Icons.Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
      <div className="text-sm text-blue-700">
        <p className="font-medium mb-1">Informasi Penugasan:</p>
        <ul className="space-y-1">
          <li>• Dosen pertama yang dipilih otomatis menjadi <strong>PJ (Penanggung Jawab)</strong></li>
          <li>• Dosen berikutnya menjadi <strong>Anggota</strong></li>
          <li>• Saat ini {selectedDosenIds.length > 0 
            ? `${dosenList.find(d => d.id_dosen === selectedDosenIds[0])?.nama_dosen} akan menjadi PJ`
            : "belum ada dosen dipilih"
          }</li>
        </ul>
      </div>
    </div>
  </div>
)}
```

**Visual Result:**
- Avatar with amber ring = PJ
- Avatar with blue ring = Anggota
- Badge colors match avatar rings
- First selected dosen is always PJ

---

### 2. Matrix CPL-PL, CPL-BK, CPL-MK

**UI Pattern:**
- Tab navigation: **Daftar** vs **Matrix**
- Checkbox matrix with highlighting
- Save all mappings at once

**Implementation (CPL-PL Matrix):**

```typescript
// app/pages/cpl.tsx
const [activeTab, setActiveTab] = useState<"daftar" | "matrix">("daftar");
const [matrixData, setMatrixData] = useState<boolean[][]>([]);

// Load matrix data
const fetchMatrix = async () => {
  const data = await fetchMatrixCplPl(selectedKurikulum);
  
  // Build matrix: cplList (rows) x profilLulusanList (columns)
  const matrix = cplList.map(cpl => 
    profilLulusanList.map(pl => 
      data.mappings.some(m => 
        m.id_cpl === cpl.id_cpl && m.id_profil === pl.id_profil
      )
    )
  );
  
  setMatrixData(matrix);
};

// Toggle checkbox
const toggleMatrix = (cplIndex: number, plIndex: number) => {
  const newMatrix = [...matrixData];
  newMatrix[cplIndex][plIndex] = !newMatrix[cplIndex][plIndex];
  setMatrixData(newMatrix);
};

// Save matrix
const saveMatrix = async () => {
  const mappings: Array<{ id_cpl: string; id_profil: string }> = [];
  
  matrixData.forEach((row, cplIndex) => {
    row.forEach((isLinked, plIndex) => {
      if (isLinked) {
        mappings.push({
          id_cpl: cplList[cplIndex].id_cpl,
          id_profil: profilLulusanList[plIndex].id_profil
        });
      }
    });
  });
  
  await saveMatrixCplPl(mappings);
  alert("Matrix saved successfully!");
};

// Render tabs
<div className="flex gap-2 mb-4">
  <Button
    variant={activeTab === "daftar" ? "default" : "outline"}
    onClick={() => setActiveTab("daftar")}
  >
    Daftar CPL
  </Button>
  <Button
    variant={activeTab === "matrix" ? "default" : "outline"}
    onClick={() => setActiveTab("matrix")}
  >
    Matrix CPL-PL
  </Button>
</div>

// Render matrix table
{activeTab === "matrix" && (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Matrix CPL - Profil Lulusan</h2>
        <Button onClick={saveMatrix}>
          <Icons.Save size={16} className="mr-2" />
          Save Matrix
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">CPL</TableHead>
              {profilLulusanList.map(pl => (
                <TableHead key={pl.id_profil} className="text-center min-w-[100px]">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{pl.kode_profil}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {pl.profil_lulusan}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cplList.map((cpl, cplIndex) => (
              <TableRow key={cpl.id_cpl}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getAspekColor(cpl.aspek)}>
                        {cpl.aspek}
                      </Badge>
                      <span className="font-semibold">{cpl.kode_cpl}</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {cpl.deskripsi_cpl}
                    </p>
                  </div>
                </TableCell>
                {profilLulusanList.map((pl, plIndex) => (
                  <TableCell key={pl.id_profil} className="text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={matrixData[cplIndex]?.[plIndex] || false}
                        onChange={() => toggleMatrix(cplIndex, plIndex)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
)}
```

**Same pattern applies to:**
- Matrix CPL-BK (in bahan-kajian.tsx)
- Matrix CPL-MK (in mata-kuliah.tsx)

---

### 3. UI Consolidation Pattern

**Requirement:** Merge stats cards + search + table into **single card**

**Before (Multiple Cards):**
```tsx
{/* Stats Cards */}
<div className="grid grid-cols-4 gap-4 mb-6">
  <StatCard title="Total MK" value={totalMK} />
  <StatCard title="Wajib" value={totalWajib} />
  <StatCard title="Pilihan" value={totalPilihan} />
  <StatCard title="Total SKS" value={totalSKS} />
</div>

{/* Search Card */}
<Card className="mb-6">
  <CardContent>
    <Input placeholder="Search..." />
  </CardContent>
</Card>

{/* Table Card */}
<Card>
  <CardHeader>
    <h2>Daftar Mata Kuliah</h2>
  </CardHeader>
  <CardContent>
    <Table>{/* ... */}</Table>
  </CardContent>
</Card>
```

**After (Consolidated):**
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Daftar Mata Kuliah</h2>
      <div className="flex items-center gap-3">
        {/* Search in header */}
        <div className="relative w-64">
          <Icons.Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          />
          <Input
            type="text"
            placeholder="Cari mata kuliah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Action buttons */}
        <Button>
          <Icons.Plus size={16} className="mr-2" />
          Tambah
        </Button>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    {/* Optional: Legend/Keterangan section */}
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold mb-2">Keterangan Aspek:</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="warning">S</Badge>
          <span className="text-sm">Sikap</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">P</Badge>
          <span className="text-sm">Pengetahuan</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">KU</Badge>
          <span className="text-sm">Keterampilan Umum</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">KK</Badge>
          <span className="text-sm">Keterampilan Khusus</span>
        </div>
      </div>
    </div>

    {/* Table */}
    <Table>
      {/* ... */}
    </Table>
  </CardContent>
</Card>
```

**Benefits:**
- Cleaner UI with single card
- Better visual hierarchy
- More screen space for data table
- Consistent pattern across all pages

---

### 4. Aspek Badge System

**Color Mapping:**
```typescript
const getAspekColor = (aspek: AspekKUL): string => {
  switch (aspek) {
    case 'S': return 'warning';   // amber-500
    case 'P': return 'success';   // green-500
    case 'KU': return 'info';     // blue-500
    case 'KK': return 'purple';   // purple-500
    default: return 'default';
  }
};

const getAspekLabel = (aspek: AspekKUL): string => {
  switch (aspek) {
    case 'S': return 'S - Sikap';
    case 'P': return 'P - Pengetahuan';
    case 'KU': return 'KU - Keterampilan Umum';
    case 'KK': return 'KK - Keterampilan Khusus';
    default: return aspek;
  }
};

// Usage
<Badge variant={getAspekColor(item.aspek)}>
  {item.aspek}
</Badge>
```

**Reusable Component:**
```typescript
// app/components/ui/aspek-badge.tsx
export function AspekBadge({ aspek }: { aspek: AspekKUL }) {
  const variants = {
    S: { color: 'warning' as const, label: 'S - Sikap' },
    P: { color: 'success' as const, label: 'P - Pengetahuan' },
    KU: { color: 'info' as const, label: 'KU - Keterampilan Umum' },
    KK: { color: 'purple' as const, label: 'KK - Keterampilan Khusus' }
  };

  const { color, label } = variants[aspek];

  return (
    <Badge variant={color} title={label}>
      {aspek}
    </Badge>
  );
}

// Usage
<AspekBadge aspek={item.aspek} />
```

---

## 🚀 Development Workflow

### Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd SI-CAP

# Install dependencies
npm install
# or
bun install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_AUTH_TOKEN_KEY=token
```

### Development Commands

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run start
```

### Adding New Page

**1. Create page component:**
```typescript
// app/pages/new-page.tsx
export default function NewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Page</h1>
    </div>
  );
}
```

**2. Update routes (if using file-based routing):**
```typescript
// app/routes.ts
import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/main-layout.tsx", [
    index("pages/dashboard.tsx"),
    route("/new-page", "pages/new-page.tsx"),
    // ...
  ])
] satisfies RouteConfig;
```

**3. Add to navigation:**
```typescript
// app/lib/constants.ts
export const NAV_ITEMS = [
  // ...existing items
  { title: "New Page", href: "/new-page", icon: "FileText" },
];
```

---

## 🐛 Common Issues & Solutions

### 1. TypeScript Errors

**Issue:** `Cannot find name 'setMataKuliahList'`

**Cause:** Custom hooks don't expose setter functions

**Solution:**
```typescript
// ❌ Wrong
const { mataKuliahList, setMataKuliahList } = useMataKuliah();
setMataKuliahList(newList);

// ✅ Correct
const { mataKuliahList, updateMataKuliah } = useMataKuliah();
await updateMataKuliah(id, payload);
```

---

### 2. JSX Structure Errors

**Issue:** `Unterminated regular expression` in Vite build

**Cause:** Duplicate closing tags or mismatched fragments

**Solution:**
```typescript
// ❌ Wrong
<Card>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
</Card> {/* Duplicate closing tag */}

// ❌ Wrong
<>
  <Card>
    {/* content */}
  </Card>
</> {/* Extra fragment */}

// ✅ Correct
<Card>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

---

### 3. Tailwind Class Warnings

**Issue:** `flex-shrink-0 can be written as shrink-0`

**Solution:** Use Tailwind v4 shorthand
```typescript
// ❌ Old (Tailwind v3)
className="flex-shrink-0 flex-grow-0"

// ✅ New (Tailwind v4)
className="shrink-0 grow-0"
```

---

### 4. State Not Updating After API Call

**Issue:** Component doesn't re-render after create/update/delete

**Solution:** Ensure hook updates local state
```typescript
const createMataKuliah = useCallback(async (payload) => {
  const created = await service.createMataKuliah(payload);
  
  // ❌ Missing state update
  return created;

  // ✅ Correct - update state
  setMataKuliahRaw(prev => [...prev, created]);
  return created;
}, []);
```

---

### 5. Dialog Not Closing After Submit

**Issue:** Dialog stays open after form submission

**Solution:**
```typescript
const handleSubmit = async () => {
  try {
    await createMataKuliah(formData);
    
    // Close dialog
    setIsDialogOpen(false);
    
    // Reset form
    resetForm();
  } catch (error) {
    console.error(error);
    // Don't close dialog on error
  }
};
```

---

## 📚 Code Conventions

### File Naming
- Components: **PascalCase** (`MataKuliah.tsx`, `DialogForm.tsx`)
- Hooks: **camelCase** with `use` prefix (`useMataKuliah.ts`)
- Services: **kebab-case** with `.service.ts` (`mata-kuliah.service.ts`)
- Types: `index.ts` in `/types`
- Constants: `constants.ts`

### Component Structure Order
```typescript
// 1. Imports (grouped: external, components, hooks, types)
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { useMataKuliah } from "~/hooks/useMataKuliah";
import type { MataKuliah } from "~/types";

// 2. Types/Interfaces (if local to file)
interface Props {
  // ...
}

// 3. Component function
export default function ComponentName({ props }: Props) {
  // 3.1. Hooks
  const { items } = useMataKuliah();
  
  // 3.2. State
  const [isOpen, setIsOpen] = useState(false);
  
  // 3.3. Derived state
  const filteredItems = items.filter(/* ... */);
  
  // 3.4. Event handlers
  const handleClick = () => { /* ... */ };
  
  // 3.5. Effects
  useEffect(() => { /* ... */ }, []);
  
  // 3.6. Early returns
  if (loading) return <div>Loading...</div>;
  
  // 3.7. Render
  return <div>{/* JSX */}</div>;
}
```

### TypeScript Best Practices
```typescript
// ✅ Use explicit types
interface MataKuliahProps {
  item: MataKuliah;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void; // Optional prop
}

// ✅ Safe access with optional chaining
const bkName = mk.bahan_kajian?.nama_bahan_kajian ?? "-";

// ✅ Type guards
if (typeof value === "string") {
  // value is string here
}

// ❌ Avoid 'any'
function Component(props: any) { /* ... */ }

// ❌ Unsafe access
const bkName = mk.bahan_kajian.nama_bahan_kajian || "-"; // Can throw
```

### CSS/Tailwind Conventions
```typescript
import { cn } from "~/lib/utils";

// Use cn() for conditional classes
<div className={cn(
  "base-classes p-4 rounded-lg",
  isActive && "bg-blue-50 text-blue-600",
  variant === "primary" ? "border-blue-500" : "border-slate-200"
)}>
  {children}
</div>
```

---

## 🔍 Testing Strategy

### Manual Testing Checklist

**CRUD Operations:**
- [ ] Create: Validation, API call, state update, dialog close
- [ ] Read: Loading state, error handling, empty state
- [ ] Update: Form prefill, validation, state update
- [ ] Delete: Confirmation, API call, state update

**UI/UX:**
- [ ] Search/filter works correctly
- [ ] Sorting (if applicable)
- [ ] Pagination (if applicable)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading states shown
- [ ] Error messages displayed
- [ ] Empty states handled

**Integration:**
- [ ] Navigation between pages
- [ ] Data consistency (MK → BK → CPL)
- [ ] Matrix operations (save/load)
- [ ] Dosen assignment (PJ vs Anggota)

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📦 Deployment

### Docker Build

```bash
# Build image
docker build -t si-cap-frontend .

# Run container
docker run -p 3000:3000 si-cap-frontend
```

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Environment Variables (Production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=15000
VITE_AUTH_TOKEN_KEY=token
```

---

## 📖 Additional Resources

### Documentation
- [React Router v7 Docs](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Recharts Documentation](https://recharts.org/)

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Error Translator**
- **Pretty TypeScript Errors**
- **Auto Rename Tag**

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/entity-improvements

# Commit with meaningful messages
git commit -m "feat(entity): add feature description"

# Push and create PR
git push origin feature/entity-improvements
```

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` UI/styling changes
- `docs:` Documentation
- `chore:` Build/config

---

## 🎓 Recent Development History

### UI Consolidation Phase (Completed)
- ✅ Merged stats cards into single comprehensive cards
- ✅ Consolidated search + filter + table layouts
- ✅ Added legend/keterangan sections inside cards
- ✅ Fixed JSX structure errors (3 files)
- ✅ Updated Tailwind classes to v4 syntax

**Files Modified:**
1. `app/pages/kurikulum.tsx` - Merged search and table
2. `app/pages/profil-lulusan.tsx` - Removed 2 stats cards
3. `app/pages/kompetensi-utama.tsx` - Removed 5 stats cards
4. `app/pages/cpl.tsx` - Consolidated both tabs
5. `app/pages/bahan-kajian.tsx` - Consolidated both tabs
6. `app/pages/mata-kuliah.tsx` - Removed 4 stats cards + PJ/Anggota feature

### PJ/Anggota Feature (Completed)
- ✅ First dosen = PJ (amber badge & ring)
- ✅ Subsequent dosen = Anggota (blue badge & ring)
- ✅ Visual indicators in table and dialog
- ✅ Info box explaining PJ/Anggota roles
- ✅ Local state management (dosenPengampuMap)

---

## 📞 Contact & Support

**Development Team:**
- Frontend: SI-CAP Dev Team
- Backend: See [AGENT.md](AGENT.md)
- UI/UX: Design Team

**Project Repository:** [GitHub URL]

---

## 📝 Version History

### v1.0.0 (Current - Feb 2026)
- ✅ Complete UI component library (14 components)
- ✅ 14 custom hooks for data management
- ✅ 15 service layer modules
- ✅ 13 page components
- ✅ CRUD operations for all entities
- ✅ Matrix CPL-PL, CPL-BK, CPL-MK
- ✅ Dosen PJ/Anggota system
- ✅ Dashboard with Recharts
- ✅ UI consolidation pattern
- ✅ Responsive design
- ✅ TypeScript strict mode

### Roadmap (Future)
- [ ] Authentication & authorization
- [ ] RPS workflow (submit, validate, reject)
- [ ] CPMK & Sub-CPMK full implementation
- [ ] Penilaian mahasiswa per CPMK
- [ ] Advanced reporting (PDF, Excel export)
- [ ] Real-time updates (WebSocket)
- [ ] Internationalization (i18n)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Dark mode (full support)
- [ ] Accessibility (WCAG 2.1 AA)

---

**Last Updated:** February 9, 2026  
**Document Version:** 1.0  
**Maintained By:** SI-CAP Frontend Development Team

---

_This guide is a living document. Please update it as the project evolves._

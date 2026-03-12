# 📱 RINGKASAN FRONTEND - SI-CAP (Sistem CPMK)

## 📋 Informasi Proyek

**Nama Proyek:** SI-CAP - Sistem Informasi Capaian Pembelajaran  
**Jenis:** Single Page Application (SPA) dengan Server-Side Rendering  
**Tujuan:** Sistem manajemen kurikulum berbasis **OBE (Outcome-Based Education)**  
**Institusi:** Program Studi Manajemen Informatika, Universitas Sriwijaya  
**Status:** ✅ Aktif dalam Pengembangan

---

## 🎯 Apa itu Sistem CPMK?

**SI-CAP** adalah aplikasi web modern untuk mengelola kurikulum akademik berbasis **Outcome-Based Education (OBE)**, yaitu pendekatan pendidikan yang fokus pada **capaian pembelajaran (learning outcomes)** mahasiswa.

### Konsep Utama OBE:
1. **Profil Lulusan (PL)** - Profil kompetensi yang diharapkan dari lulusan
2. **Kompetensi Utama Lulusan (KUL)** - Kompetensi berdasarkan aspek S, P, KU, KK
3. **Capaian Pembelajaran Lulusan (CPL)** - Target pembelajaran tingkat program studi
4. **Bahan Kajian (BK)** - Materi/topik pembelajaran
5. **Mata Kuliah (MK)** - Courses yang mengajarkan bahan kajian
6. **CPMK & Sub-CPMK** - Capaian pembelajaran tingkat mata kuliah
7. **RPS** - Rencana Pembelajaran Semester (silabus detail)

### Aspek Kompetensi (4 Kategori):
| Kode | Aspek | Warna | Deskripsi |
|------|-------|-------|-----------|
| **S** | Sikap | 🟡 Amber | Sikap dan perilaku profesional |
| **P** | Pengetahuan | 🟢 Green | Penguasaan teori dan konsep |
| **KU** | Keterampilan Umum | 🔵 Blue | Soft skills dan keterampilan universal |
| **KK** | Keterampilan Khusus | 🟣 Purple | Hard skills dan keahlian bidang |

---

## 🛠️ Technology Stack

### Core Framework
```
React 19.2.3              → UI Library  
React Router 7.12.0       → Routing & SSR framework  
TypeScript 5.9.2          → Type safety  
Vite 7.1.7                → Build tool & dev server  
```

### Styling & UI
```
Tailwind CSS 4.1.13       → Utility-first CSS framework  
@tailwindcss/vite         → Tailwind v4 integration  
Recharts 3.7.0            → Charts dan visualisasi data  
Custom UI Components      → Library komponen handmade  
```

### State Management
```
React Context API         → Shared state (sidebar, auth)  
Custom Hooks              → Data fetching & business logic  
Axios                     → HTTP client untuk API calls  
```

### Development Tools
```
vite-tsconfig-paths       → Path aliases (~/)  
@react-router/dev         → React Router dev tools  
@types/node               → Node.js type definitions  
```

---

## 📁 Struktur Folder Proyek

```
SI-CAP/
├── app/                              # 🎯 Source code utama
│   ├── root.tsx                      # Root layout + Error boundary
│   ├── routes.ts                     # Konfigurasi routing
│   ├── app.css                       # Global styles + Tailwind
│   │
│   ├── components/                   # 🧩 React components
│   │   ├── header.tsx                # Top navigation + breadcrumb
│   │   ├── sidebar.tsx               # Collapsible sidebar navigation
│   │   └── ui/                       # 14 UI components library
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
│   │       └── tooltip.tsx
│   │
│   ├── contexts/                     # ⚡ React Context
│   │   ├── auth-context.tsx          # Authentication state
│   │   └── sidebar-context.tsx       # Sidebar collapse state
│   │
│   ├── hooks/                        # 🎣 Custom hooks (14 hooks)
│   │   ├── useBahanKajian.ts         # Bahan Kajian CRUD
│   │   ├── useCpl.ts                 # CPL CRUD + Matrix
│   │   ├── useCpmk.ts                # CPMK management
│   │   ├── useDashboard.ts           # Dashboard statistics
│   │   ├── useDosen.ts               # Dosen management
│   │   ├── useKompetensiUtama.ts     # KUL management
│   │   ├── useKurikulum.ts           # Kurikulum CRUD
│   │   ├── useLaporan.ts             # Reports & analytics
│   │   ├── useMahasiswa.ts           # Mahasiswa data
│   │   ├── useMataKuliah.ts          # Mata Kuliah + Dosen assignment
│   │   ├── usePenilaian.ts           # Penilaian/evaluasi
│   │   ├── useProdi.ts               # Program Studi
│   │   ├── useProfilLulusan.ts       # Profil Lulusan CRUD
│   │   └── useRps.ts                 # RPS CRUD + workflow
│   │
│   ├── layouts/                      # 📐 Layout templates
│   │   ├── auth-layout.tsx           # Layout untuk login
│   │   └── main-layout.tsx           # Main app layout (sidebar + header)
│   │
│   ├── lib/                          # 🔧 Utilities
│   │   ├── api.ts                    # Axios instance dengan JWT
│   │   ├── constants.ts              # App constants & config
│   │   ├── storage.ts                # LocalStorage helpers
│   │   └── utils.ts                  # Helper functions (cn, format, etc)
│   │
│   ├── pages/                        # 📄 Page components (13 pages)
│   │   ├── dashboard.tsx             # Dashboard + statistics
│   │   ├── prodi.tsx                 # Program Studi management
│   │   ├── kurikulum.tsx             # Kurikulum management
│   │   ├── profil-lulusan.tsx        # Profil Lulusan CRUD
│   │   ├── kompetensi-utama.tsx      # KUL CRUD
│   │   ├── cpl.tsx                   # CPL + Matrix CPL-PL
│   │   ├── bahan-kajian.tsx          # Bahan Kajian + Matrix CPL-BK
│   │   ├── mata-kuliah.tsx           # Mata Kuliah + Dosen + Matrix CPL-MK
│   │   ├── cpmk.tsx                  # CPMK management
│   │   ├── evaluasi.tsx              # Evaluasi pembelajaran
│   │   ├── penilaian.tsx             # Penilaian mahasiswa
│   │   ├── laporan.tsx               # Reports & analytics
│   │   ├── login.tsx                 # Login page
│   │   └── rps/                      # RPS module
│   │       ├── index.tsx             # RPS list & status
│   │       └── new.tsx               # RPS form editor
│   │
│   ├── services/                     # 🌐 API services (15 services)
│   │   ├── auth.service.ts           # Authentication API
│   │   ├── dashboard.service.ts      # Dashboard API
│   │   ├── prodi.service.ts          # Prodi API
│   │   ├── kurikulum.service.ts      # Kurikulum API
│   │   ├── profil-lulusan.service.ts # Profil Lulusan API
│   │   ├── kul.service.ts            # KUL API
│   │   ├── cpl.service.ts            # CPL + Matrix API
│   │   ├── bahan-kajian.service.ts   # Bahan Kajian + Matrix API
│   │   ├── mata-kuliah.service.ts    # Mata Kuliah + Matrix API
│   │   ├── dosen.service.ts          # Dosen API
│   │   ├── cpmk.service.ts           # CPMK API
│   │   ├── rps.service.ts            # RPS API + workflow
│   │   ├── mahasiswa.service.ts      # Mahasiswa API
│   │   ├── penilaian.service.ts      # Penilaian API
│   │   ├── laporan.service.ts        # Reports API
│   │   ├── utils.ts                  # Service utilities
│   │   └── index.ts                  # Service exports
│   │
│   ├── types/
│   │   └── index.ts                  # 📝 TypeScript types (423 lines)
│   │
│   └── welcome/
│       └── welcome.tsx               # Landing/welcome page
│
├── public/                           # Static assets
├── AGENT.md                          # Backend API documentation
├── FRONTEND.md                       # Frontend development guide
├── API.ENDPOINT.md                   # API endpoints documentation
├── RINGKASAN_FRONTEND.md             # 📄 Dokumen ini
├── Dockerfile                        # Docker configuration
├── package.json                      # Dependencies & scripts
├── react-router.config.ts            # React Router configuration
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite build configuration
```

**Total Files:**
- 📄 Pages: 13 files
- 🎣 Hooks: 14 files  
- 🌐 Services: 15 files
- 🧩 UI Components: 14 files
- 📝 Types: 1 file (423 lines)

---

## 🎯 Fitur-Fitur Utama

### 1. 🔐 Authentication & Authorization
- Login dengan email/password
- JWT token-based authentication
- Role-based access: **Admin**, **Kaprodi**, **Dosen**
- Auto-logout saat token expired
- Protected routes

**Default Admin Account:**
```
Email: admin@example.com
Password: password123
```

### 2. 📊 Dashboard & Analytics
- Statistik total CPL, CPMK, Mata Kuliah, RPS
- Visualisasi distribusi aspek (S, P, KU, KK)
- Charts menggunakan Recharts
- Real-time data updates
- Filter berdasarkan kurikulum

### 3. 🎓 Manajemen Kurikulum
- **Prodi** - Program Studi management
- **Kurikulum** - Master kurikulum (tahun, status aktif/arsip)
- **Profil Lulusan** - Target profil kompetensi lulusan
- **KUL** - Kompetensi Utama Lulusan dengan aspek
- **CPL** - Capaian Pembelajaran Lulusan
- **Bahan Kajian** - Topik/materi pembelajaran
- **Mata Kuliah** - Courses dengan SKS, semester, sifat

### 4. 🔗 Matrix Management
Sistem pemetaan many-to-many relationships:

#### Matrix CPL-PL (CPL ↔ Profil Lulusan)
- Checkbox grid untuk mapping
- Filter berdasarkan aspek
- Bulk update

#### Matrix CPL-BK (CPL ↔ Bahan Kajian)
- Visual matrix untuk pemetaan
- Color-coded aspek

#### Matrix CPL-MK (CPL ↔ Mata Kuliah)
- Mapping CPL ke Mata Kuliah
- Multiple CPL per MK

### 5. 👨‍🏫 Pengelolaan Dosen
- CRUD data dosen
- Assignment dosen ke mata kuliah
- Sistem **PJ (Penanggung Jawab)** & **Anggota**
- Multiple dosen per mata kuliah

### 6. 📝 CPMK Management
- CRUD CPMK (Capaian Pembelajaran Mata Kuliah)
- Sub-CPMK dengan indikator & kriteria
- Bobot persentase
- Relasi ke CPL parent

### 7. 📄 RPS (Rencana Pembelajaran Semester)
- Form builder untuk RPS lengkap
- **Workflow system:**
  - Draft → Pending Review → Validated/Rejected
- 16 minggu pertemuan
- Metode pembelajaran, assessment, materi
- Komponen penilaian dengan bobot
- Referensi/pustaka

### 8. 📈 Laporan & Evaluasi
- Export laporan dalam berbagai format
- Analytics capaian pembelajaran
- Evaluasi efektivitas kurikulum
- Reports per semester

---

## 🗂️ Arsitektur Data

### Entity Relationship

```
Kurikulum (Root Container)
    │
    ├─→ Profil Lulusan (PL)
    │       └─→ CPL (many-to-many)
    │
    ├─→ Kompetensi Utama Lulusan (KUL)
    │       └─→ Aspek: S, P, KU, KK
    │
    ├─→ CPL (Capaian Pembelajaran Lulusan)
    │       ├─→ Matrix: CPL-PL (many-to-many)
    │       ├─→ Matrix: CPL-BK (many-to-many)
    │       └─→ Matrix: CPL-MK (many-to-many)
    │
    ├─→ Bahan Kajian (BK)
    │       ├─→ CPL (many-to-many)
    │       └─→ Mata Kuliah (one-to-one)
    │
    ├─→ Mata Kuliah (MK)
    │       ├─→ Bahan Kajian (one-to-one)
    │       ├─→ CPL (many-to-many)
    │       ├─→ Dosen Pengampu (many-to-many)
    │       └─→ CPMK (one-to-many)
    │
    ├─→ CPMK
    │       ├─→ CPL (many-to-one)
    │       └─→ Sub-CPMK (one-to-many)
    │
    └─→ RPS
            ├─→ Mata Kuliah (one-to-one)
            └─→ Status Workflow
```

### Key Interfaces

#### Kurikulum
```typescript
interface Kurikulum {
  id_kurikulum: string;
  nama_kurikulum: string;
  tahun_berlaku: number;
  is_active: boolean;
  id_prodi?: string;
}
```

#### CPL (Capaian Pembelajaran Lulusan)
```typescript
interface CPL {
  id_cpl: string;
  kode_cpl: string;        // CPL-01, S1, P1, dll
  deskripsi_cpl: string;
  aspek: 'S' | 'P' | 'KU' | 'KK';
  id_kurikulum: string;
  profil_list?: ProfilLulusan[];  // many-to-many via Matrix
}
```

#### Mata Kuliah
```typescript
interface MataKuliah {
  id_mk: string;
  kode_mk: string;         // TI101, TI201
  nama_mk: string;
  sks: number;             // 1-6
  semester: number;        // 1-8
  sifat: 'Wajib' | 'Pilihan';
  id_bahan_kajian?: string;
  cpl_list?: CPL[];        // many-to-many
  dosen_pengampu?: Dosen[]; // many-to-many
}
```

#### CPMK
```typescript
interface CPMK {
  id_cpmk: string;
  kode_cpmk: string;       // M1, M2, M3
  deskripsi_cpmk: string;
  bobot_persentase: number;
  id_mk: string;
  id_cpl: string;          // Parent CPL
}
```

---

## 🔄 Alur Kerja Aplikasi

### 1. Authentication Flow
```
User → Login Page 
    → Email + Password 
    → Backend API /api/auth/login
    → Receive JWT Token
    → Save to localStorage
    → Redirect to Dashboard
    → All API calls include: Authorization: Bearer TOKEN
```

### 2. CRUD Flow (Contoh: CPL)
```
User → CPL Page
    → useCpl hook calls cplService.getAll()
    → Display in Table
    → Click "Tambah CPL"
    → Open Dialog Form
    → Fill: kode, deskripsi, aspek
    → Submit → cplService.create()
    → Refresh data
    → Show success notification
```

### 3. Matrix Management Flow (CPL-PL)
```
User → CPL Page → Tab "Matrix CPL-PL"
    → Load existing matrix mappings
    → Display checkbox grid:
        Rows: CPL
        Columns: Profil Lulusan
    → User checks/unchecks boxes
    → Click "Simpan Matrix"
    → Send all mappings to backend
    → Backend replaces all mappings
    → Show confirmation
```

### 4. RPS Workflow
```
Dosen → Create RPS (Draft)
     → Fill 16 weeks data
     → Save as Draft
     → Submit for Review (status: pending)
Kaprodi → Review RPS
        → Validate ✅ atau Reject ❌
        → Add feedback/notes
Dosen → Fix RPS if rejected
     → Re-submit
Final → Status: Validated
```

---

## 🎨 Komponen UI Library

### Button Component
```tsx
<Button variant="primary" size="md">
  Simpan
</Button>
```
Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`

### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Judul</CardTitle>
  </CardHeader>
  <CardContent>Konten</CardContent>
</Card>
```

### Dialog (Modal)
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Form Dialog</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### Table Component
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Kode</TableHead>
      <TableHead>Nama</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.kode}</TableCell>
        <TableCell>{item.nama}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Badge (Aspek Indicator)
```tsx
<Badge variant={getAspekVariant(aspek)}>
  {aspek}
</Badge>
```

---

## 🚀 Development Guide

### Prerequisites
- Node.js 18+ atau Bun
- Backend API running di `http://localhost:8787`

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Aplikasi berjalan di: `http://localhost:5173`

### Build Production
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Run Production Build
```bash
npm run start
```

### Docker Deployment
```bash
docker build -t si-cap-frontend .
docker run -p 3000:3000 si-cap-frontend
```

---

## 📡 API Integration

### Base URL
```
Development: http://localhost:8787
Production: (sesuaikan dengan backend URL)
```

### Axios Instance Setup
```typescript
// app/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8787/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept semua request untuk inject JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Service Pattern
```typescript
// app/services/cpl.service.ts
import api from '~/lib/api';

export const cplService = {
  async getAll(id_kurikulum: string) {
    const response = await api.get(`/cpl?id_kurikulum=${id_kurikulum}`);
    return response.data;
  },
  
  async create(data: CreateCPLInput) {
    const response = await api.post('/cpl', data);
    return response.data;
  },
  
  async update(id: string, data: UpdateCPLInput) {
    const response = await api.put(`/cpl/${id}`, data);
    return response.data;
  },
  
  async delete(id: string) {
    await api.delete(`/cpl/${id}`);
  }
};
```

### Custom Hook Pattern
```typescript
// app/hooks/useCpl.ts
import { useState, useEffect } from 'react';
import { cplService } from '~/services/cpl.service';

export function useCpl(id_kurikulum: string) {
  const [cplList, setCplList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCpl = async () => {
    setLoading(true);
    const data = await cplService.getAll(id_kurikulum);
    setCplList(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchCpl();
  }, [id_kurikulum]);
  
  return { cplList, loading, refetch: fetchCpl };
}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS v4
Proyek menggunakan Tailwind CSS v4 dengan plugin Vite.

### Color Scheme (Aspek)
```css
/* Sikap */
.aspek-s { @apply bg-amber-100 text-amber-800 border-amber-300; }

/* Pengetahuan */
.aspek-p { @apply bg-green-100 text-green-800 border-green-300; }

/* Keterampilan Umum */
.aspek-ku { @apply bg-blue-100 text-blue-800 border-blue-300; }

/* Keterampilan Khusus */
.aspek-kk { @apply bg-purple-100 text-purple-800 border-purple-300; }
```

### Responsive Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Utility Function
```typescript
// app/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 📦 Key Dependencies

### Production
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "react-router": "7.12.0",
  "@react-router/node": "7.12.0",
  "@react-router/serve": "7.12.0",
  "recharts": "^3.7.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.2"
}
```

### Development
```json
{
  "@react-router/dev": "7.12.0",
  "@tailwindcss/vite": "^4.1.13",
  "tailwindcss": "^4.1.13",
  "typescript": "^5.9.2",
  "vite": "^7.1.7",
  "vite-tsconfig-paths": "^5.1.4"
}
```

---

## 🔒 Security Considerations

### 1. JWT Token Storage
- Token disimpan di `localStorage`
- Auto-clear saat logout
- Expired token handling

### 2. Protected Routes
- Check authentication sebelum render
- Redirect ke login jika tidak authenticated

### 3. API Security
- Semua API call menggunakan JWT
- HTTPS recommended untuk production
- CORS configuration di backend

### 4. Input Validation
- Client-side validation di form
- Server-side validation mandatory
- XSS prevention

---

## 📊 Performance Optimization

### 1. Code Splitting
React Router automatic code splitting per route

### 2. Lazy Loading
```typescript
// Dynamic imports untuk heavy components
const RechartsComponent = lazy(() => import('~/components/charts'));
```

### 3. Memoization
```typescript
// useMemo untuk expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.aspek === selectedAspek);
}, [data, selectedAspek]);
```

### 4. Debouncing
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchTerm(value), 300),
  []
);
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Pastikan backend mengizinkan origin `http://localhost:5173`

### Issue: 401 Unauthorized
**Solution:** 
- Check token di localStorage
- Token mungkin expired, login ulang
- Pastikan header Authorization terset

### Issue: Data tidak muncul
**Solution:**
- Check network tab di DevTools
- Pastikan backend API running
- Verify API endpoint URL correct

### Issue: Build Error
**Solution:**
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Best Practices

### 1. Component Structure
```tsx
// ✅ Good
export default function ComponentName() {
  // State
  // Effects
  // Handlers
  // Render
}

// ❌ Avoid inline functions in JSX
<button onClick={() => handler()}>Click</button>

// ✅ Better
<button onClick={handler}>Click</button>
```

### 2. Type Safety
```typescript
// ✅ Always define interfaces
interface Props {
  data: CPL[];
  onSelect: (id: string) => void;
}

// ✅ Use type inference
const [count, setCount] = useState(0); // number inferred
```

### 3. Error Handling
```typescript
try {
  const data = await service.getData();
  setData(data);
} catch (error) {
  console.error('Error fetching data:', error);
  toast.error('Gagal memuat data');
}
```

### 4. Naming Conventions
```
Components: PascalCase (MyComponent.tsx)
Hooks: camelCase with 'use' prefix (useMyHook.ts)
Services: camelCase with '.service.ts' suffix
Types: PascalCase (MyType)
Constants: UPPER_SNAKE_CASE
```

---

## 📚 Resources

### Documentation
- [React Router v7 Docs](https://reactrouter.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Documentation](https://recharts.org/)

### Internal Docs
- `FRONTEND.md` - Detailed frontend development guide
- `API.ENDPOINT.md` - Complete API documentation
- `AGENT.md` - Backend API implementation guide

---

## 🤝 Contributing

### Development Workflow
1. Pull latest changes
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Implement changes
4. Test thoroughly
5. Commit with clear message
6. Push and create Pull Request

### Code Review Checklist
- ✅ Type safety (no `any` types)
- ✅ Error handling implemented
- ✅ Components properly structured
- ✅ No console.log in production code
- ✅ Responsive design working
- ✅ Accessibility considerations

---

## 📞 Support

Untuk pertanyaan atau issue:
- Baca dokumentasi lengkap di `FRONTEND.md`
- Check API documentation di `API.ENDPOINT.md`
- Review type definitions di `app/types/index.ts`

---

**Last Updated:** February 23, 2026  
**Version:** 1.0  
**Maintained by:** SI-CAP Development Team

---

## 🎉 Kesimpulan

**SI-CAP** adalah sistem modern dan komprehensif untuk manajemen kurikulum berbasis OBE dengan fitur:

✅ **13 Module Lengkap** - Dashboard, Prodi, Kurikulum, PL, KUL, CPL, BK, MK, CPMK, RPS, Evaluasi, Penilaian, Laporan  
✅ **Matrix Management** - Pemetaan CPL-PL, CPL-BK, CPL-MK  
✅ **RPS Workflow** - Draft → Review → Validate  
✅ **Modern Tech Stack** - React Router v7, TypeScript, Tailwind v4  
✅ **Type-Safe** - Full TypeScript coverage  
✅ **Responsive UI** - Mobile-friendly design  
✅ **Real-time Dashboard** - Analytics & visualizations  

Sistem ini dirancang untuk mempermudah pengelolaan kurikulum akademik dengan pendekatan **Outcome-Based Education (OBE)** yang terstruktur dan sistematis.

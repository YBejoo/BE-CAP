# 🔧 REFACTOR FRONTEND - INTEGRASI PENUH DENGAN BACKEND

**Target:** Integrasi 100% antara Frontend dan Backend SI-CAP  
**Acuan Struktur:** `RINGKASAN_FRONTEND.md`  
**Referensi API:** `API-ENDPOINTS.md`  
**Status:** 📋 Planning Phase  
**Tanggal:** February 23, 2026

---

## 📊 STATUS INTEGRASI SAAT INI

### ✅ Yang Sudah Terintegrasi
- [x] Authentication & Login flow
- [x] Dashboard basic statistics
- [x] Struktur folder dan arsitektur frontend
- [x] UI Components library (14 components)
- [x] TypeScript types definition

### ⚠️ Yang Perlu Perbaikan/Refactor
- [ ] **Services layer** - Sesuaikan dengan endpoint backend aktual
- [ ] **Hooks** - Refactor custom hooks sesuai response API backend
- [ ] **Matrix management** - Implementasi lengkap CPL-PL, CPL-BK, CPL-MK
- [ ] **Dosen assignment** - Sistem PJ & Anggota
- [ ] **RPS workflow** - Draft → Pending → Validate/Reject
- [ ] **Data enrichment** - Support `?enrich=true` parameter
- [ ] **Error handling** - Standardisasi error response
- [ ] **Loading states** - Konsisten di semua komponen
- [ ] **Form validation** - Client-side validation lengkap

### ❌ Yang Belum Ada
- [ ] Sub-CPMK management UI (backend sudah ready)
- [ ] RPS Minggu detail view
- [ ] Laporan export functionality
- [ ] Bulk operations (delete, update)
- [ ] Advanced filtering & search
- [ ] Pagination support
- [ ] Real-time notifications

---

## 🎯 STRATEGI REFACTOR

### Prinsip Utama
1. **API-First Approach** - Pastikan 100% sesuai dengan backend API
2. **Type Safety** - Semua response API harus di-type dengan benar
3. **Error Handling** - Standardisasi error handling di semua service
4. **Loading States** - Konsisten loading UX di semua komponen
5. **Reusability** - Maksimalkan reuse components dan hooks

### Prioritas Pengerjaan
```
HIGH PRIORITY (🔴)
├─ Fix core services & hooks agar match dengan backend
├─ Matrix management (CPL-PL, CPL-BK, CPL-MK)
├─ Dosen assignment system
└─ RPS workflow lengkap

MEDIUM PRIORITY (🟡)
├─ Sub-CPMK management
├─ Data enrichment support
├─ Advanced filtering & search
└─ Error handling & validation

LOW PRIORITY (🟢)
├─ Pagination implementation
├─ Export/Import features
├─ Real-time notifications
└─ Performance optimization
```

---

## 📋 CHECKLIST REFACTOR PER MODUL

### 🔴 1. Authentication & Authorization

**Backend Endpoints:**
```
POST /api/auth/login
POST /api/auth/register  
GET  /api/auth/me
POST /api/auth/logout
```

**Frontend Files:**
- `app/services/auth.service.ts`
- `app/contexts/auth-context.tsx`
- `app/pages/login.tsx`

**Tasks:**
- [ ] Verify login response structure matches backend
- [ ] Implement token refresh mechanism (jika backend support)
- [ ] Add remember me functionality
- [ ] Handle expired token auto-logout
- [ ] Add role-based route protection
- [ ] Test dengan 3 roles: Admin, Kaprodi, Dosen

**API Response Type:**
```typescript
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    nama: string;
    role: 'admin' | 'kaprodi' | 'dosen';
  };
}
```

---

### 🔴 2. Dashboard

**Backend Endpoint:**
```
GET /api/dashboard?id_kurikulum={id}
```

**Frontend Files:**
- `app/services/dashboard.service.ts`
- `app/hooks/useDashboard.ts`
- `app/pages/dashboard.tsx`

**Tasks:**
- [ ] Verify response structure dari backend
- [ ] Implementasi charts dengan data real (Recharts)
- [ ] Add filter berdasarkan kurikulum
- [ ] Display distribusi aspek (S, P, KU, KK)
- [ ] Show total: CPL, CPMK, Mata Kuliah, RPS
- [ ] Add refresh button untuk reload data
- [ ] Loading skeleton saat fetch data

**Expected Response:**
```typescript
interface DashboardStats {
  total_cpl: number;
  total_cpmk: number;
  total_mk: number;
  total_rps: number;
  distribusi_aspek: {
    S: number;
    P: number;
    KU: number;
    KK: number;
  };
  rps_status: {
    draft: number;
    pending: number;
    validated: number;
    rejected: number;
  };
}
```

---

### 🔴 3. Prodi (Program Studi)

**Backend Endpoints:**
```
GET    /api/prodi
POST   /api/prodi
PUT    /api/prodi/:id
DELETE /api/prodi/:id
GET    /api/prodi/:id
```

**Frontend Files:**
- `app/services/prodi.service.ts`
- `app/hooks/useProdi.ts`
- `app/pages/prodi.tsx`

**Tasks:**
- [ ] Implement full CRUD operations
- [ ] Form validation (required fields)
- [ ] Add confirmation dialog untuk delete
- [ ] Display fakultas, jenjang, akreditasi
- [ ] Search & filter functionality
- [ ] Error handling untuk duplicate kode_prodi

**Interface:**
```typescript
interface Prodi {
  id_prodi: string;
  kode_prodi: string;        // Required, unique
  nama_prodi: string;         // Required
  fakultas?: string;
  jenjang: 'D3' | 'S1' | 'S2' | 'S3';
  akreditasi?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

### 🔴 4. Kurikulum

**Backend Endpoints:**
```
GET    /api/kurikulum?id_prodi={id}
POST   /api/kurikulum
PUT    /api/kurikulum/:id
DELETE /api/kurikulum/:id
PATCH  /api/kurikulum/:id/activate
```

**Frontend Files:**
- `app/services/kurikulum.service.ts`
- `app/hooks/useKurikulum.ts`
- `app/pages/kurikulum.tsx`

**Tasks:**
- [ ] List kurikulum berdasarkan prodi
- [ ] Filter active/archived kurikulum
- [ ] Toggle active/inactive (hanya 1 active per prodi)
- [ ] Form: nama, tahun_berlaku, is_active
- [ ] Validation: tahun_berlaku harus valid year
- [ ] Show warning saat activate: akan disable kurikulum lain
- [ ] Display related count: CPL, MK, RPS

**Interface:**
```typescript
interface Kurikulum {
  id_kurikulum: string;
  nama_kurikulum: string;
  tahun_berlaku: number;
  is_active: boolean;
  id_prodi?: string;
  created_at?: string;
  updated_at?: string;
  
  // Enriched data
  _count?: {
    cpl: number;
    mata_kuliah: number;
    rps: number;
  };
}
```

---

### 🔴 5. Profil Lulusan

**Backend Endpoints:**
```
GET    /api/profil-lulusan?id_kurikulum={id}
POST   /api/profil-lulusan
PUT    /api/profil-lulusan/:id
DELETE /api/profil-lulusan/:id
```

**Frontend Files:**
- `app/services/profil-lulusan.service.ts`
- `app/hooks/useProfilLulusan.ts`
- `app/pages/profil-lulusan.tsx`

**Tasks:**
- [ ] CRUD operations
- [ ] Display dengan kurikulum selector
- [ ] Form fields: kode_profil, profil_lulusan, deskripsi, sumber
- [ ] Validation: kode_profil unique per kurikulum
- [ ] Show related CPL count (via matrix)
- [ ] Export to PDF/Excel (optional)

**Interface:**
```typescript
interface ProfilLulusan {
  id_profil: string;
  kode_profil: string;        // PL-01, PL-02, dst
  profil_lulusan: string;
  deskripsi?: string;
  sumber?: string;
  id_kurikulum: string;
  
  // From Matrix CPL-PL
  cpl_list?: CPL[];
}
```

---

### 🔴 6. Kompetensi Utama Lulusan (KUL)

**Backend Endpoints:**
```
GET    /api/kul?id_kurikulum={id}&aspek={aspek}
POST   /api/kul
PUT    /api/kul/:id
DELETE /api/kul/:id
```

**Frontend Files:**
- `app/services/kul.service.ts`
- `app/hooks/useKompetensiUtama.ts`
- `app/pages/kompetensi-utama.tsx`

**Tasks:**
- [ ] CRUD operations
- [ ] Tab/filter berdasarkan aspek: S, P, KU, KK
- [ ] Form: kode_kul, kompetensi_lulusan, aspek
- [ ] Color-coded badges untuk aspek
- [ ] Validation: aspek harus salah satu dari enum
- [ ] Sort by aspek & kode_kul

**Interface:**
```typescript
interface KompetensiUtama {
  id_kul: string;
  kode_kul: string;           // KUL-S-01, KUL-P-01
  kompetensi_lulusan: string;
  aspek: 'S' | 'P' | 'KU' | 'KK';
  id_kurikulum: string;
}
```

---

### 🔴 7. CPL (Capaian Pembelajaran Lulusan)

**Backend Endpoints:**
```
GET    /api/cpl?id_kurikulum={id}&enrich=true
POST   /api/cpl
PUT    /api/cpl/:id
DELETE /api/cpl/:id

# Matrix CPL-PL
GET    /api/cpl/matrix/pl?id_kurikulum={id}
POST   /api/cpl/matrix/pl
```

**Frontend Files:**
- `app/services/cpl.service.ts`
- `app/hooks/useCpl.ts`
- `app/pages/cpl.tsx`

**Tasks:**
- [ ] CRUD operations
- [ ] Tab view: Data CPL | Matrix CPL-PL
- [ ] Filter by aspek
- [ ] Display related: BK, MK, CPMK count
- [ ] **Matrix CPL-PL:** Checkbox grid (rows: CPL, cols: Profil Lulusan)
- [ ] Save matrix dengan bulk replace
- [ ] Visual indicator: mapped vs unmapped
- [ ] Export matrix to Excel

**Interface:**
```typescript
interface CPL {
  id_cpl: string;
  kode_cpl: string;           // CPL-S-01, CPL-P-01
  deskripsi_cpl: string;
  aspek: 'S' | 'P' | 'KU' | 'KK';
  id_kurikulum: string;
  
  // With enrich=true
  profil_list?: ProfilLulusan[];
  
  // Counts
  _count?: {
    bahan_kajian: number;
    mata_kuliah: number;
    cpmk: number;
  };
}

interface MatrixCplPl {
  id_matrix: string;
  id_cpl: string;
  id_profil: string;
}
```

---

### 🔴 8. Bahan Kajian

**Backend Endpoints:**
```
GET    /api/bahan-kajian?id_kurikulum={id}&enrich=true
POST   /api/bahan-kajian
PUT    /api/bahan-kajian/:id
DELETE /api/bahan-kajian/:id

# Matrix CPL-BK
GET    /api/bahan-kajian/matrix/cpl?id_kurikulum={id}
POST   /api/bahan-kajian/matrix/cpl
```

**Frontend Files:**
- `app/services/bahan-kajian.service.ts`
- `app/hooks/useBahanKajian.ts`
- `app/pages/bahan-kajian.tsx`

**Tasks:**
- [ ] CRUD operations
- [ ] Tab view: Data BK | Matrix CPL-BK
- [ ] Form: kode_bk, nama_bahan_kajian, aspek, ranah_keilmuan
- [ ] Filter by aspek & ranah_keilmuan
- [ ] **Matrix CPL-BK:** Grid mapping
- [ ] Show related Mata Kuliah
- [ ] Validation: one-to-one dengan Mata Kuliah (optional)

**Interface:**
```typescript
interface BahanKajian {
  id_bk: string;
  kode_bk: string;            // BK-01, BK-02
  nama_bahan_kajian: string;
  aspek: 'S' | 'P' | 'KU' | 'KK';
  ranah_keilmuan: 'Inti' | 'Pilihan';
  id_kurikulum: string;
  
  // With enrich=true
  cpl_list?: CPL[];
  mata_kuliah?: MataKuliah;
}
```

---

### 🔴 9. Mata Kuliah

**Backend Endpoints:**
```
GET    /api/mata-kuliah?id_kurikulum={id}&enrich=full
POST   /api/mata-kuliah
PUT    /api/mata-kuliah/:id
DELETE /api/mata-kuliah/:id

# Matrix CPL-MK
GET    /api/mata-kuliah/matrix/cpl?id_kurikulum={id}
POST   /api/mata-kuliah/matrix/cpl

# Dosen Assignment
POST   /api/mata-kuliah/:id/dosen
GET    /api/mata-kuliah/:id/dosen
PUT    /api/mata-kuliah/:id/dosen/:id_penugasan
DELETE /api/mata-kuliah/:id/dosen/:id_penugasan
```

**Frontend Files:**
- `app/services/mata-kuliah.service.ts`
- `app/hooks/useMataKuliah.ts`
- `app/pages/mata-kuliah.tsx`

**Tasks:**
- [ ] CRUD operations
- [ ] Tab view: Data MK | Matrix CPL-MK | Dosen Pengampu
- [ ] Form: kode_mk, nama_mk, sks, semester, sifat
- [ ] Link to Bahan Kajian (dropdown)
- [ ] **Matrix CPL-MK:** Multi-select CPL per MK
- [ ] **Dosen Assignment:**
  - [ ] Select multiple dosen
  - [ ] Set PJ (Penanggung Jawab) - only one
  - [ ] Set Anggota (multiple)
  - [ ] Tahun akademik & semester
- [ ] Display total CPL, CPMK, RPS per MK
- [ ] Filter by semester & sifat

**Interface:**
```typescript
interface MataKuliah {
  id_mk: string;
  kode_mk: string;            // IF101, IF201
  nama_mk: string;
  sks: number;                // 1-6
  semester: number;           // 1-8
  sifat: 'Wajib' | 'Pilihan';
  deskripsi?: string;
  id_kurikulum: string;
  id_bahan_kajian?: string;
  
  // With enrich=full
  cpl_list?: CPL[];
  dosen_pengampu?: DosenPengampu[];
  bahan_kajian?: BahanKajian;
  
  _count?: {
    cpmk: number;
    rps: number;
  };
}

interface DosenPengampu {
  id_penugasan: string;
  id_dosen: string;
  id_mk: string;
  tahun_akademik: string;     // "2024/2025"
  semester_akademik: 'Ganjil' | 'Genap';
  is_koordinator: boolean;    // true = PJ, false = Anggota
  
  dosen?: Dosen;
}
```

---

### 🔴 10. Dosen

**Backend Endpoints:**
```
GET    /api/dosen?id_prodi={id}
POST   /api/dosen
PUT    /api/dosen/:id
DELETE /api/dosen/:id
GET    /api/dosen/:id
```

**Frontend Files:**
- `app/services/dosen.service.ts`
- `app/hooks/useDosen.ts`
- `app/pages/dosen.tsx` (jika ada dedicated page)

**Tasks:**
- [ ] CRUD operations
- [ ] Form: nip, nama_dosen, email, bidang_keahlian, jabatan_fungsional
- [ ] Link to user account (id_user) - optional
- [ ] Display mata kuliah yang diampu
- [ ] Filter by prodi & jabatan
- [ ] Validation: email & nip unique

**Interface:**
```typescript
interface Dosen {
  id_dosen: string;
  nip: string;
  nama_dosen: string;
  email: string;
  bidang_keahlian?: string;
  jabatan_fungsional?: string;
  id_prodi: string;
  id_user?: string;
  
  // Related data
  mata_kuliah_diampu?: MataKuliah[];
}
```

---

### 🔴 11. CPMK

**Backend Endpoints:**
```
GET    /api/cpmk?id_mk={id}
POST   /api/cpmk
PUT    /api/cpmk/:id
DELETE /api/cpmk/:id

# Sub-CPMK
GET    /api/cpmk/:id_cpmk/sub
POST   /api/cpmk/:id_cpmk/sub
PUT    /api/cpmk/sub/:id
DELETE /api/cpmk/sub/:id
```

**Frontend Files:**
- `app/services/cpmk.service.ts`
- `app/hooks/useCpmk.ts`
- `app/pages/cpmk.tsx`

**Tasks:**
- [ ] CRUD operations CPMK
- [ ] Form: kode_cpmk, deskripsi_cpmk, bobot_persentase, id_cpl
- [ ] Select parent CPL (dropdown)
- [ ] Display by Mata Kuliah
- [ ] **Sub-CPMK Management:**
  - [ ] Nested table/accordion per CPMK
  - [ ] Form: kode_sub, deskripsi_sub_cpmk, indikator, kriteria_penilaian
  - [ ] CRUD operations Sub-CPMK
- [ ] Validation: total bobot CPMK per MK = 100%
- [ ] Show warning jika bobot tidak 100%

**Interface:**
```typescript
interface CPMK {
  id_cpmk: string;
  kode_cpmk: string;          // CPMK-01, CPMK-02
  deskripsi_cpmk: string;
  bobot_persentase: number;   // 0-100
  id_mk: string;
  id_cpl: string;
  
  // Related
  cpl?: CPL;
  mata_kuliah?: MataKuliah;
  sub_cpmk?: SubCPMK[];
}

interface SubCPMK {
  id_sub: string;
  kode_sub: string;           // SUB-CPMK-01.1
  deskripsi_sub_cpmk: string;
  indikator?: string;
  kriteria_penilaian?: string;
  id_cpmk: string;
}
```

---

### 🔴 12. RPS (Rencana Pembelajaran Semester)

**Backend Endpoints:**
```
GET    /api/rps?id_mk={id}&status={status}
POST   /api/rps
PUT    /api/rps/:id
DELETE /api/rps/:id
GET    /api/rps/:id

# Workflow
PATCH  /api/rps/:id/submit
PATCH  /api/rps/:id/validate
PATCH  /api/rps/:id/reject

# RPS Minggu
POST   /api/rps/:id_rps/minggu
PUT    /api/rps/minggu/:id
DELETE /api/rps/minggu/:id
```

**Frontend Files:**
- `app/services/rps.service.ts`
- `app/hooks/useRps.ts`
- `app/pages/rps/index.tsx`
- `app/pages/rps/new.tsx`

**Tasks:**
- [ ] **List RPS:** Filter by status (Draft, Pending, Validated, Rejected)
- [ ] **Form RPS:**
  - [ ] Basic info: versi, tahun_akademik, semester_akademik, deskripsi_mk
  - [ ] Pustaka: utama & pendukung
  - [ ] Koordinator: select dari dosen pengampu
  - [ ] 16 Minggu pertemuan (RPS Minggu)
- [ ] **RPS Minggu:**
  - [ ] Week 1-16 input form
  - [ ] Fields: minggu_ke, materi, metode, waktu, pengalaman_belajar
  - [ ] Link to Sub-CPMK
  - [ ] Penilaian: bentuk, bobot
- [ ] **Workflow Buttons:**
  - [ ] Save as Draft
  - [ ] Submit for Review (Dosen → status: Pending)
  - [ ] Validate (Kaprodi → status: Validated)
  - [ ] Reject (Kaprodi → status: Rejected, add notes)
- [ ] Role-based actions:
  - [ ] Dosen: create, edit draft, submit
  - [ ] Kaprodi: validate, reject
  - [ ] Admin: full access
- [ ] Status badges with colors
- [ ] History/activity log (optional)

**Interface:**
```typescript
interface RPS {
  id_rps: string;
  id_mk: string;
  versi: number;              // 1, 2, 3, dst
  tahun_akademik: string;     // "2024/2025"
  semester_akademik: 'Ganjil' | 'Genap';
  tgl_penyusunan: string;     // ISO date
  deskripsi_mk?: string;
  pustaka_utama?: string;
  pustaka_pendukung?: string;
  status: 'Draft' | 'Menunggu Validasi' | 'Terbit' | 'Ditolak';
  id_koordinator: string;
  catatan_validasi?: string;
  tgl_validasi?: string;
  
  // Related
  mata_kuliah?: MataKuliah;
  koordinator?: Dosen;
  minggu?: RPSMinggu[];
}

interface RPSMinggu {
  id_rps_minggu: string;
  id_rps: string;
  minggu_ke: number;          // 1-16
  id_sub_cpmk?: string;
  materi?: string;
  metode_pembelajaran?: string;
  waktu_menit?: number;
  pengalaman_belajar?: string;
  bentuk_penilaian?: string;
  bobot_penilaian?: number;
  
  sub_cpmk?: SubCPMK;
}
```

---

### 🟡 13. Laporan

**Backend Endpoints:**
```
GET /api/laporan/cpl?id_kurikulum={id}
GET /api/laporan/mk?id_kurikulum={id}
GET /api/laporan/rps?id_kurikulum={id}&tahun_akademik={tahun}
GET /api/laporan/matrix/cpl-pl?id_kurikulum={id}
GET /api/laporan/matrix/cpl-bk?id_kurikulum={id}
GET /api/laporan/matrix/cpl-mk?id_kurikulum={id}
```

**Frontend Files:**
- `app/services/laporan.service.ts`
- `app/hooks/useLaporan.ts`
- `app/pages/laporan.tsx`

**Tasks:**
- [ ] Report selector: CPL, MK, RPS, Matrix
- [ ] Filter: kurikulum, tahun akademik, semester
- [ ] Display data di table
- [ ] **Export functionality:**
  - [ ] Export to PDF
  - [ ] Export to Excel
  - [ ] Export to CSV
- [ ] Print preview
- [ ] Charts & visualizations untuk analytics
- [ ] Custom date range (optional)

---

## 🔧 LANGKAH-LANGKAH REFACTOR DETAIL

### Step 1: Setup & Preparation (1-2 hari)

**1.1. Update API Base URL**
```typescript
// app/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
```

**1.2. Standardize Error Handling**
```typescript
// app/lib/api.ts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Standardize error format
    const message = error.response?.data?.message || 'Terjadi kesalahan';
    throw new Error(message);
  }
);
```

**1.3. Update TypeScript Types**
```typescript
// app/types/index.ts
// Sesuaikan dengan backend schema
// Reference: src/db/schema.ts di backend
```

---

### Step 2: Refactor Core Services (3-5 hari)

**Untuk setiap service file:**

1. **Verify endpoint URLs** dengan `API-ENDPOINTS.md`
2. **Update request/response types** sesuai backend
3. **Add error handling** di setiap function
4. **Support optional parameters** (enrich, filter, etc)
5. **Add JSDoc comments** untuk documentation

**Template Service:**
```typescript
// app/services/[entity].service.ts
import api from '~/lib/api';
import type { Entity, CreateEntityInput, UpdateEntityInput } from '~/types';

export const entityService = {
  /**
   * Get all entities
   * @param id_kurikulum - Kurikulum ID (required)
   * @param enrich - Include related data
   */
  async getAll(id_kurikulum: string, enrich = false): Promise<Entity[]> {
    const params = new URLSearchParams({ id_kurikulum });
    if (enrich) params.append('enrich', 'true');
    
    const response = await api.get(`/entity?${params}`);
    return response.data.data; // Adjust based on backend response
  },

  /**
   * Get single entity by ID
   */
  async getById(id: string): Promise<Entity> {
    const response = await api.get(`/entity/${id}`);
    return response.data.data;
  },

  /**
   * Create new entity
   */
  async create(data: CreateEntityInput): Promise<Entity> {
    const response = await api.post('/entity', data);
    return response.data.data;
  },

  /**
   * Update existing entity
   */
  async update(id: string, data: UpdateEntityInput): Promise<Entity> {
    const response = await api.put(`/entity/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/entity/${id}`);
  },
};
```

---

### Step 3: Refactor Custom Hooks (2-3 hari)

**Untuk setiap hook:**

1. **Use updated service functions**
2. **Add proper loading states**
3. **Handle errors gracefully**
4. **Add refetch mechanism**
5. **Support optimistic updates** (optional)

**Template Hook:**
```typescript
// app/hooks/use[Entity].ts
import { useState, useEffect, useCallback } from 'react';
import { entityService } from '~/services/entity.service';
import type { Entity, CreateEntityInput } from '~/types';

export function useEntity(id_kurikulum: string, enrich = false) {
  const [data, setData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await entityService.getAll(id_kurikulum, enrich);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [id_kurikulum, enrich]);

  useEffect(() => {
    if (id_kurikulum) {
      fetchData();
    }
  }, [fetchData]);

  // Create
  const create = async (input: CreateEntityInput) => {
    try {
      const newEntity = await entityService.create(input);
      setData(prev => [...prev, newEntity]);
      return newEntity;
    } catch (err) {
      throw err;
    }
  };

  // Update
  const update = async (id: string, input: UpdateEntityInput) => {
    try {
      const updated = await entityService.update(id, input);
      setData(prev => prev.map(item => item.id === id ? updated : item));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  // Delete
  const remove = async (id: string) => {
    try {
      await entityService.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  };
}
```

---

### Step 4: Implement Matrix Management (2-3 hari)

**Matrix UI Pattern:**

```typescript
// Component: MatrixCplPl.tsx
import { useState, useEffect } from 'react';
import { cplService } from '~/services/cpl.service';

export function MatrixCplPl({ id_kurikulum }: { id_kurikulum: string }) {
  const [cpls, setCpls] = useState<CPL[]>([]);
  const [profils, setProfils] = useState<ProfilLulusan[]>([]);
  const [mappings, setMappings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id_kurikulum]);

  const loadData = async () => {
    // Load CPL list
    const cplData = await cplService.getAll(id_kurikulum);
    setCpls(cplData);

    // Load Profil Lulusan list
    const profilData = await profilLulusanService.getAll(id_kurikulum);
    setProfils(profilData);

    // Load existing matrix
    const matrixData = await cplService.getMatrixCplPl(id_kurikulum);
    const mappingSet = new Set(
      matrixData.map(m => `${m.id_cpl}_${m.id_profil}`)
    );
    setMappings(mappingSet);
  };

  const toggleMapping = (id_cpl: string, id_profil: string) => {
    const key = `${id_cpl}_${id_profil}`;
    setMappings(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const saveMatrix = async () => {
    setLoading(true);
    try {
      // Convert Set to array of objects
      const mappingArray = Array.from(mappings).map(key => {
        const [id_cpl, id_profil] = key.split('_');
        return { id_cpl, id_profil };
      });

      await cplService.saveMatrixCplPl({ mappings: mappingArray });
      alert('Matrix berhasil disimpan');
    } catch (err) {
      alert('Gagal menyimpan matrix');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="overflow-auto">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">CPL</th>
              {profils.map(p => (
                <th key={p.id_profil} className="border p-2">
                  {p.kode_profil}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cpls.map(cpl => (
              <tr key={cpl.id_cpl}>
                <td className="border p-2 font-medium">
                  {cpl.kode_cpl}
                </td>
                {profils.map(profil => {
                  const key = `${cpl.id_cpl}_${profil.id_profil}`;
                  const isChecked = mappings.has(key);
                  
                  return (
                    <td key={profil.id_profil} className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMapping(cpl.id_cpl, profil.id_profil)}
                        className="w-4 h-4"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={saveMatrix}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Menyimpan...' : 'Simpan Matrix'}
      </button>
    </div>
  );
}
```

---

### Step 5: Implement Dosen Assignment (1-2 hari)

**Component: DosenAssignment.tsx**

```typescript
export function DosenAssignment({ id_mk }: { id_mk: string }) {
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [selectedDosen, setSelectedDosen] = useState<string[]>([]);
  const [koordinatorId, setKoordinatorId] = useState<string>('');
  const [tahunAkademik, setTahunAkademik] = useState('2024/2025');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  const handleSave = async () => {
    try {
      await mataKuliahService.assignDosen(id_mk, {
        dosen_ids: selectedDosen,
        koordinator_id: koordinatorId,
        tahun_akademik: tahunAkademik,
        semester_akademik: semester,
      });
      alert('Dosen berhasil ditugaskan');
    } catch (err) {
      alert('Gagal menugaskan dosen');
    }
  };

  return (
    <div>
      <h3>Dosen Pengampu</h3>
      
      {/* Multi-select dosen */}
      <div className="mb-4">
        <label>Pilih Dosen:</label>
        {dosenList.map(dosen => (
          <div key={dosen.id_dosen}>
            <input
              type="checkbox"
              checked={selectedDosen.includes(dosen.id_dosen)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDosen(prev => [...prev, dosen.id_dosen]);
                } else {
                  setSelectedDosen(prev => prev.filter(id => id !== dosen.id_dosen));
                }
              }}
            />
            <label>{dosen.nama_dosen}</label>
          </div>
        ))}
      </div>

      {/* Select PJ/Koordinator */}
      <div className="mb-4">
        <label>Penanggung Jawab (PJ):</label>
        <select
          value={koordinatorId}
          onChange={(e) => setKoordinatorId(e.target.value)}
        >
          <option value="">-- Pilih PJ --</option>
          {selectedDosen.map(id => {
            const dosen = dosenList.find(d => d.id_dosen === id);
            return (
              <option key={id} value={id}>
                {dosen?.nama_dosen}
              </option>
            );
          })}
        </select>
      </div>

      {/* Tahun & Semester */}
      <div className="mb-4">
        <input
          type="text"
          value={tahunAkademik}
          onChange={(e) => setTahunAkademik(e.target.value)}
          placeholder="2024/2025"
        />
        <select value={semester} onChange={(e) => setSemester(e.target.value as any)}>
          <option value="Ganjil">Ganjil</option>
          <option value="Genap">Genap</option>
        </select>
      </div>

      <button onClick={handleSave}>Simpan</button>
    </div>
  );
}
```

---

### Step 6: Implement RPS Workflow (3-4 hari)

**Component: RPSWorkflow.tsx**

```typescript
export function RPSWorkflow({ rps }: { rps: RPS }) {
  const { user } = useAuth();
  
  const canEdit = rps.status === 'Draft' && user.role === 'dosen';
  const canSubmit = rps.status === 'Draft' && user.role === 'dosen';
  const canValidate = rps.status === 'Menunggu Validasi' && user.role === 'kaprodi';
  const canReject = rps.status === 'Menunggu Validasi' && user.role === 'kaprodi';

  const handleSubmit = async () => {
    try {
      await rpsService.submit(rps.id_rps);
      alert('RPS berhasil diajukan untuk review');
      // Refresh or redirect
    } catch (err) {
      alert('Gagal mengajukan RPS');
    }
  };

  const handleValidate = async () => {
    try {
      const catatan = prompt('Catatan validasi (opsional):');
      await rpsService.validate(rps.id_rps, catatan || undefined);
      alert('RPS berhasil divalidasi');
    } catch (err) {
      alert('Gagal memvalidasi RPS');
    }
  };

  const handleReject = async () => {
    const catatan = prompt('Alasan penolakan (wajib):');
    if (!catatan) {
      alert('Alasan penolakan harus diisi');
      return;
    }
    
    try {
      await rpsService.reject(rps.id_rps, catatan);
      alert('RPS ditolak');
    } catch (err) {
      alert('Gagal menolak RPS');
    }
  };

  return (
    <div className="flex gap-2">
      {canSubmit && (
        <button onClick={handleSubmit} className="btn-primary">
          Submit untuk Review
        </button>
      )}
      
      {canValidate && (
        <button onClick={handleValidate} className="btn-success">
          Validasi RPS
        </button>
      )}
      
      {canReject && (
        <button onClick={handleReject} className="btn-danger">
          Tolak RPS
        </button>
      )}
    </div>
  );
}
```

---

### Step 7: Add Loading & Error States (1 hari)

**Standardize across all pages:**

```typescript
// Loading Skeleton Component
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-2">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-8 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Error Component
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-4">
      <p className="text-red-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-red-600 underline">
          Coba Lagi
        </button>
      )}
    </div>
  );
}

// Usage in Page
export default function CPLPage() {
  const { data, loading, error, refetch } = useCpl(selectedKurikulum);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

---

### Step 8: Form Validation (1-2 hari)

**Use React Hook Form + Zod:**

```bash
npm install react-hook-form @hookform/resolvers zod
```

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema
const cplSchema = z.object({
  kode_cpl: z.string().min(1, 'Kode CPL wajib diisi'),
  deskripsi_cpl: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  aspek: z.enum(['S', 'P', 'KU', 'KK']),
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
});

// Form Component
export function CPLForm({ onSubmit, initialData }: FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(cplSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Kode CPL</label>
        <input {...register('kode_cpl')} />
        {errors.kode_cpl && <span className="text-red-500">{errors.kode_cpl.message}</span>}
      </div>

      <div>
        <label>Deskripsi</label>
        <textarea {...register('deskripsi_cpl')} />
        {errors.deskripsi_cpl && <span className="text-red-500">{errors.deskripsi_cpl.message}</span>}
      </div>

      <div>
        <label>Aspek</label>
        <select {...register('aspek')}>
          <option value="">-- Pilih Aspek --</option>
          <option value="S">S - Sikap</option>
          <option value="P">P - Pengetahuan</option>
          <option value="KU">KU - Keterampilan Umum</option>
          <option value="KK">KK - Keterampilan Khusus</option>
        </select>
        {errors.aspek && <span className="text-red-500">{errors.aspek.message}</span>}
      </div>

      <button type="submit">Simpan</button>
    </form>
  );
}
```

---

### Step 9: Testing (2-3 hari)

**Test Checklist per Module:**

- [ ] **CRUD Operations:**
  - [ ] Create: Form submission works, data appears in list
  - [ ] Read: Data loads correctly, no errors
  - [ ] Update: Edit form pre-fills, save updates data
  - [ ] Delete: Confirmation dialog, item removed
  
- [ ] **Error Handling:**
  - [ ] Invalid input shows validation error
  - [ ] Network error shows error message
  - [ ] 401 redirects to login
  - [ ] Duplicate entry shows appropriate error
  
- [ ] **Loading States:**
  - [ ] Skeleton shows while loading
  - [ ] Button disabled during submit
  - [ ] Spinner/loading indicator visible
  
- [ ] **Edge Cases:**
  - [ ] Empty state message when no data
  - [ ] Form reset after successful create
  - [ ] Refetch after create/update/delete
  - [ ] Optimistic updates work correctly

**Test Matrix Management:**
- [ ] Grid displays correctly (all CPL × all PL)
- [ ] Checkboxes toggle properly
- [ ] Save persists changes to backend
- [ ] Reload shows saved state

**Test Dosen Assignment:**
- [ ] Multi-select dosen works
- [ ] Only one PJ can be selected
- [ ] Save creates penugasan records
- [ ] Update/delete works

**Test RPS Workflow:**
- [ ] Draft → Submit → Pending works
- [ ] Kaprodi can validate/reject
- [ ] Dosen can edit draft
- [ ] Status changes reflect in UI
- [ ] Rejected RPS can be re-edited

---

### Step 10: Documentation & Cleanup (1 hari)

- [ ] Update `RINGKASAN_FRONTEND.md` dengan perubahan
- [ ] Add JSDoc comments ke semua services
- [ ] Remove unused code & console.logs
- [ ] Check TypeScript errors: `npm run typecheck`
- [ ] Format code: `npm run format` (if available)
- [ ] Update README with new features
- [ ] Create CHANGELOG.md

---

## 📝 BEST PRACTICES

### 1. API Response Handling

**Standardize response format:**
```typescript
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// In service
const response = await api.get<APIResponse<Entity[]>>('/entity');
return response.data.data; // Extract data
```

### 2. Error Messages

**User-friendly error messages:**
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan aksi ini.',
  NOT_FOUND: 'Data tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
};
```

### 3. Loading States

**Consistent loading UX:**
- Use skeleton loaders for table/list
- Disable buttons during submit
- Show spinner for long operations
- Display progress for multi-step processes

### 4. Confirmation Dialogs

**Always confirm destructive actions:**
```typescript
const handleDelete = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    return;
  }
  
  try {
    await service.delete(id);
    // Success handling
  } catch (err) {
    // Error handling
  }
};
```

### 5. Form Reset

**Reset form after successful create:**
```typescript
const handleCreate = async (data: CreateInput) => {
  try {
    await service.create(data);
    form.reset(); // Reset form to initial state
    refetch(); // Refresh list
    setIsDialogOpen(false); // Close dialog
  } catch (err) {
    // Error handling
  }
};
```

---

## 🧪 TESTING CHECKLIST

### Manual Testing

**Per Module Testing:**
```
Module: [Nama Module]

✅ CRUD Operations
  □ Create new record
  □ View list of records
  □ Edit existing record
  □ Delete record
  
✅ Validation
  □ Required fields show error when empty
  □ Format validation (email, number, etc)
  □ Unique constraint checked
  
✅ UI/UX
  □ Loading states work
  □ Error messages clear
  □ Success feedback shown
  □ Responsive on mobile
  
✅ Integration
  □ Related data loads correctly
  □ Filters work
  □ Search works
  □ Pagination works (if applicable)
```

### Integration Testing

**Cross-Module Testing:**
- [ ] Create Kurikulum → Create CPL (relationship works)
- [ ] Assign Dosen → Create RPS (dosen available in RPS form)
- [ ] Create CPMK → Link to CPL (parent relationship)
- [ ] Matrix CPL-PL → CPL shows profil_list
- [ ] RPS Workflow → Status changes across roles

### User Flow Testing

**Complete Workflows:**
1. **Admin Setup Flow:**
   - [ ] Create Prodi
   - [ ] Create Kurikulum
   - [ ] Create Profil Lulusan
   - [ ] Create CPL
   - [ ] Map CPL-PL

2. **Kaprodi Flow:**
   - [ ] Create Bahan Kajian
   - [ ] Create Mata Kuliah
   - [ ] Assign Dosen to MK
   - [ ] Map CPL-MK

3. **Dosen Flow:**
   - [ ] Create CPMK for MK
   - [ ] Create Sub-CPMK
   - [ ] Create RPS Draft
   - [ ] Submit RPS for Review

4. **Kaprodi Validation Flow:**
   - [ ] View Pending RPS
   - [ ] Validate or Reject RPS
   - [ ] Add feedback notes

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Build succeeds without errors

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.sicap.ac.id/api
VITE_APP_NAME=SI-CAP
VITE_APP_VERSION=1.0.0
```

### Build & Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy (adjust based on hosting)
# For Cloudflare Pages:
npx wrangler pages deploy dist

# For Vercel:
vercel --prod

# For custom server:
scp -r dist/* user@server:/var/www/sicap
```

---

## 📚 RESOURCES & REFERENCES

### Internal Docs
- `RINGKASAN_FRONTEND.md` - Frontend architecture overview
- `API-ENDPOINTS.md` - Complete backend API documentation
- `AGENT.md` - Backend implementation guide
- `src/db/schema.ts` - Database schema (backend)

### External Docs
- [React Router v7](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

## ✅ FINAL CHECKLIST

### Completion Criteria

- [ ] **All 13 modules** fully integrated with backend
- [ ] **Matrix management** working for CPL-PL, CPL-BK, CPL-MK
- [ ] **Dosen assignment** with PJ/Anggota system working
- [ ] **RPS workflow** complete with status transitions
- [ ] **Form validations** implemented across all forms
- [ ] **Error handling** consistent and user-friendly
- [ ] **Loading states** showing properly
- [ ] **TypeScript types** match backend schema
- [ ] **Manual testing** completed for all modules
- [ ] **Documentation** updated

### Sign-off

```
Developer: ___________________
Date: ___________________

Reviewer: ___________________
Date: ___________________

Status: □ In Progress  □ Ready for Testing  □ Completed
```

---

**Last Updated:** February 23, 2026  
**Document Version:** 1.0  
**Status:** 📋 Ready for Implementation

---

## 🎯 KESIMPULAN

Dokumen ini adalah **blueprint lengkap** untuk refactor frontend SI-CAP agar terintegrasi 100% dengan backend. 

**Key Points:**
1. ✅ Gunakan struktur dari `RINGKASAN_FRONTEND.md` sebagai foundation
2. ✅ Ikuti endpoint dari `API-ENDPOINTS.md` dengan presisi
3. ✅ Implementasikan setiap checklist secara bertahap
4. ✅ Test setiap module sebelum lanjut ke berikutnya
5. ✅ Dokumentasikan setiap perubahan

**Estimated Timeline:**
- **High Priority Tasks:** 10-15 hari
- **Medium Priority Tasks:** 5-7 hari
- **Low Priority Tasks:** 3-5 hari
- **Total:** ~3-4 minggu untuk complete integration

Semoga sukses dengan refactoring! 🚀

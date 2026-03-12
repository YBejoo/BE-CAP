 # 🌱 SI-CAP Database Seeder Guide

Panduan lengkap untuk menggunakan database seeder SI-CAP API.

---

## 📋 Overview

Database seeder adalah script otomatis yang mengisi database dengan data dummy yang realistis untuk keperluan development dan testing. Seeder ini mencakup **semua fitur** yang ada di SI-CAP API.

> **⚠️ PENTING:** Seeder akan **otomatis menghapus semua data existing** sebelum melakukan seeding ulang. Pastikan Anda tidak menjalankan ini di production database!

---

## 🎯 Data yang Di-seed

Seeder ini akan membuat data untuk semua modul:

### 1. **Authentication & Users** (6 users)
- 1 Admin
- 2 Kaprodi
- 3 Dosen

### 2. **Program Studi** (1 prodi)
- Manajemen Informatika (D3)

### 3. **Kurikulum** (2 kurikulum)
- Kurikulum OBE 2024 - Manajemen Informatika (Active)
- Kurikulum MBKM 2023 - Manajemen Informatika (Inactive)

### 4. **Profil Lulusan** (4 profil)
- Software Engineer
- Data Scientist
- System Analyst
- IT Consultant

### 5. **Kompetensi Utama Lulusan - KUL** (4 kompetensi)
- Sikap (1)
- Pengetahuan (1)
- Keterampilan Umum (1)
- Keterampilan Khusus (1)

### 6. **Capaian Pembelajaran Lulusan - CPL** (8 CPL)
- 2 CPL Sikap (S)
- 2 CPL Pengetahuan (P)
- 2 CPL Keterampilan Umum (KU)
- 2 CPL Keterampilan Khusus (KK)

### 7. **Bahan Kajian** (5 bahan kajian)
- Dasar Pemrograman
- Struktur Data dan Algoritma
- Basis Data
- Rekayasa Perangkat Lunak
- Kecerdasan Buatan

### 8. **Mata Kuliah** (6 mata kuliah)
- IF101: Algoritma dan Pemrograman (Sem 1)
- IF102: Matematika Diskrit (Sem 1)
- IF201: Struktur Data (Sem 2)
- IF202: Basis Data (Sem 2)
- IF301: Rekayasa Perangkat Lunak (Sem 3)
- IF401: Kecerdasan Buatan (Sem 4)

### 9. **Dosen** (3 dosen)
- Prof. Dr. Ahmad Dahlan, M.T. (Software Engineering)
- Dr. Sri Mulyani, M.Kom (Data Science & AI)
- Bambang Sudrajat, M.Kom (Database & IS)

### 10. **Dosen Pengampu** (4 assignments)
- Mapping dosen ke mata kuliah dengan role koordinator

### 11. **RPS** (3 RPS)
- RPS untuk Algoritma & Pemrograman (Terbit)
- RPS untuk Basis Data (Draft)
- RPS untuk Kecerdasan Buatan (Menunggu Validasi)

### 12. **CPMK** (6 CPMK)
- 3 CPMK untuk Algoritma & Pemrograman
- 3 CPMK untuk Basis Data

### 13. **Sub-CPMK** (3 sub-CPMK)
- Sub-CPMK untuk detail learning outcomes

### 14. **RPS Minggu** (3 minggu)
- Rencana pertemuan mingguan untuk RPS

### 15. **Penilaian** (4 jenis)
- Quiz (15%)
- Tugas (25%)
- UTS (30%)
- UAS (30%)

### 16. **Matrix Relationships**
- **CPL-Profil Lulusan**: 10 mappings
- **CPL-Bahan Kajian**: 8 mappings
- **CPL-Mata Kuliah**: 8 mappings

---

## 🚀 Cara Menggunakan

### Prerequisites

Pastikan Anda sudah:
1. Install dependencies: `bun install`
2. Setup database lokal dengan Wrangler
3. Run migrations: `bun run db:migrate`

### Menjalankan Seeder

#### Opsi 1: Menggunakan NPM Script (Recommended)

```bash
# Seed database
bun run db:seed

# Atau reset database (migrate + seed)
bun run db:reset
```

#### Opsi 2: Menjalankan Langsung

```bash
bun run scripts/seed.ts
```

---

## 📝 Default Credentials

Setelah seeding berhasil, Anda bisa login dengan credentials berikut:

### Admin
```
Email:    admin@sicap.ac.id
Password: password123
Role:     admin
```

### Kaprodi
```
Email:    kaprodi.if@sicap.ac.id
Password: password123
Role:     kaprodi

-- atau --

Email:    kaprodi2.mi@sicap.ac.id  
Password: password123
Role:     kaprodi
```

### Dosen
```
Email:    dosen1@sicap.ac.id
Password: password123
Role:     dosen
```

---

## 🧪 Testing dengan Data yang Di-seed

### 1. Login sebagai Admin

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sicap.ac.id",
    "password": "password123"
  }'
```

### 2. Get Dashboard

```bash
curl -X GET "http://localhost:8787/api/dashboard?id_kurikulum=kurikulum_001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get CPL dengan Enrichment

```bash
curl -X GET "http://localhost:8787/api/cpl?id_kurikulum=kurikulum_001&enrich=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Matrix CPL-PL

```bash
curl -X GET "http://localhost:8787/api/cpl/matrix/pl?id_kurikulum=kurikulum_001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔄 Reset Database

Jika Anda ingin menghapus semua data dan seed ulang:

```bash
# Hapus database file (Windows)
Remove-Item .wrangler\state\v3\d1\miniflare-D1DatabaseObject\db.sqlite

# Run migration dan seed
bun run db:migrate
bun run db:seed
```

Atau gunakan shortcut:

```bash
bun run db:reset
```

---

## 💡 Tips & Best Practices

### 1. Gunakan untuk Development
Seeder ini cocok untuk:
- ✅ Local development
- ✅ Testing API endpoints
- ✅ Demo ke stakeholder
- ✅ Onboarding developer baru

### 2. JANGAN Gunakan di Production
- ❌ Jangan run seeder di production database
- ❌ Credentials default sangat lemah
- ❌ Data dummy tidak untuk production use

### 3. Custom Seeder
Jika Anda perlu data custom, edit file `scripts/seed.ts`:

```typescript
// Tambahkan data custom Anda
const customProdi = await db.insert(schema.prodi).values({
  id: 'prodi_custom',
  kode_prodi: 'CUSTOM',
  nama_prodi: 'Your Custom Prodi',
  // ...
}).returning();
```

### 4. ID Management
Seeder menggunakan ID yang fixed untuk kemudahan testing:
- `prodi_001`, `prodi_002`, dll.
- `kurikulum_001`, `kurikulum_002`, dll.
- `cpl_001`, `cpl_002`, dll.

Ini memudahkan Anda untuk menulis test yang konsisten.

---

## 🐛 Troubleshooting

### Error: "table already has data"

Jika tabel sudah berisi data, seeder akan error. Solusi:

```bash
# Hapus database dan reset
Remove-Item .wrangler\state\v3\d1\miniflare-D1DatabaseObject\db.sqlite
bun run db:migrate
bun run db:seed
```

### Error: "Cannot find module 'better-sqlite3'"

Install dependencies:

```bash
bun install
```

### Error: "hashPassword is not a function"

Pastikan fungsi `hashPassword` ada di `src/utils/helpers.ts`:

```typescript
export async function hashPassword(password: string): Promise<string> {
  // Implementation
}
```

---

## 📊 Verifikasi Data

Setelah seeding, verifikasi data dengan Drizzle Studio:

```bash
bun run db:studio
```

Atau query langsung:

```bash
# Cek jumlah users
bun -e "import Database from 'better-sqlite3'; const db = new Database('.wrangler/state/v3/d1/miniflare-D1DatabaseObject/db.sqlite'); console.log(db.prepare('SELECT COUNT(*) FROM users').get());"
```

---

## 🔗 Related Documentation

- [API Endpoints Documentation](API-ENDPOINTS.md)
- [Backend Implementation Guide](AGENT.MD)
- [Frontend Integration Guide](Frontend.md)
- [Testing Guide](postman/TESTING-GUIDE.md)

---

## 📝 Changelog

### Version 1.0.0 (February 12, 2026)
- ✨ Initial seeder for all SI-CAP features
- 📦 18 entity types with relationships
- 🔗 Matrix mappings for CPL-PL, CPL-BK, CPL-MK
- 👥 Multi-role user seeding (Admin, Kaprodi, Dosen)
- 📊 Realistic data for testing dashboard statistics

---

**Last Updated:** February 12, 2026  
**Author:** SI-CAP Development Team  
**Status:** ✅ Production Ready

---

Need help? Check the [main documentation](README.md) or contact the development team.

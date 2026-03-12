# 📊 SI-CAP Seeder Data Statistics

Data yang akan dibuat oleh seeder untuk keperluan development dan testing.

---

## 📈 Total Data by Entity

| Entity | Count | Description |
|--------|-------|-------------|
| 👤 Users | 6 | Admin, Kaprodi, Dosen |
| 🏫 Program Studi | 1 | Manajemen Informatika |
| 📖 Kurikulum | 2 | 1 Active, 1 Inactive |
| 👥 Profil Lulusan | 4 | Software Engineer, Data Scientist, etc. |
| 🎯 KUL | 4 | Sikap, Pengetahuan, KU, KK |
| 📝 CPL | 8 | 2S, 2P, 2KU, 2KK |
| 📚 Bahan Kajian | 5 | Core subjects |
| 📕 Mata Kuliah | 6 | Semester 1-4 |
| 👨‍🏫 Dosen | 3 | With expertise areas |
| 👨‍🏫 Dosen Pengampu | 4 | Course assignments |
| 📄 RPS | 3 | Draft, Published, Waiting |
| ✅ CPMK | 6 | Course learning outcomes |
| 📋 Sub-CPMK | 3 | Detailed outcomes |
| 📅 RPS Minggu | 3 | Weekly plans |
| 📊 Penilaian | 4 | Assessment types |
| 🔗 CPL-PL Mapping | 10 | Relationships |
| 🔗 CPL-BK Mapping | 8 | Relationships |
| 🔗 CPL-MK Mapping | 8 | Relationships |

---

## 🎓 Kurikulum Detail

### Kurikulum 001: OBE 2024 - Manajemen Informatika (Active)

**Hierarchy:**
```
Kurikulum OBE 2024 - Manajemen Informatika
├── Profil Lulusan (4)
│   ├── PL-01: Software Engineer
│   ├── PL-02: Data Scientist
│   ├── PL-03: System Analyst
│   └── PL-04: IT Consultant
├── Kompetensi Utama (4)
│   ├── KUL-S-01: Sikap Religius
│   ├── KUL-P-01: Konsep Teoretis
│   ├── KUL-KU-01: Pemikiran Logis
│   └── KUL-KK-01: Pengembangan Software
├── CPL (8)
│   ├── CPL-S-01, CPL-S-02 (Sikap)
│   ├── CPL-P-01, CPL-P-02 (Pengetahuan)
│   ├── CPL-KU-01, CPL-KU-02 (Keterampilan Umum)
│   └── CPL-KK-01, CPL-KK-02 (Keterampilan Khusus)
├── Bahan Kajian (5)
│   ├── BK-01: Dasar Pemrograman
│   ├── BK-02: Struktur Data & Algoritma
│   ├── BK-03: Basis Data
│   ├── BK-04: Rekayasa Perangkat Lunak
│   └── BK-05: Kecerdasan Buatan
└── Mata Kuliah (6)
    ├── IF101: Algoritma & Pemrograman (Sem 1, 4 SKS)
    ├── IF102: Matematika Diskrit (Sem 1, 3 SKS)
    ├── IF201: Struktur Data (Sem 2, 4 SKS)
    ├── IF202: Basis Data (Sem 2, 3 SKS)
    ├── IF301: Rekayasa Perangkat Lunak (Sem 3, 3 SKS)
    └── IF401: Kecerdasan Buatan (Sem 4, 3 SKS)
```

---

## 👤 Users Detail

### User Roles Distribution

```
┌─────────────────────────────────────┐
│  Admin: 1 user (16.7%)              │
│  Kaprodi: 2 users (33.3%)           │
│  Dosen: 3 users (50%)               │
└─────────────────────────────────────┘
```

### User List

| ID | Email | Role | Name |
|----|-------|------|------|
| user_admin_001 | admin@sicap.ac.id | admin | Administrator SI-CAP |
| user_kaprodi_001 | kaprodi.if@sicap.ac.id | kaprodi | Dr. Budi Santoso, M.Kom (MI) |
| user_kaprodi_002 | kaprodi2.mi@sicap.ac.id | kaprodi | Dr. Ani Wijaya, M.Kom |
| user_dosen_001 | dosen1@sicap.ac.id | dosen | Prof. Dr. Ahmad Dahlan, M.T. |
| user_dosen_002 | dosen2@sicap.ac.id | dosen | Dr. Sri Mulyani, M.Kom |
| user_dosen_003 | dosen3@sicap.ac.id | dosen | Bambang Sudrajat, M.Kom |

**All passwords:** `password123`

---

## 📕 Mata Kuliah Detail

### Semester Distribution

```
Semester 1: 2 MK (7 SKS)
  • IF101: Algoritma & Pemrograman (4 SKS) - Wajib
  • IF102: Matematika Diskrit (3 SKS) - Wajib

Semester 2: 2 MK (7 SKS)
  • IF201: Struktur Data (4 SKS) - Wajib
  • IF202: Basis Data (3 SKS) - Wajib

Semester 3: 1 MK (3 SKS)
  • IF301: Rekayasa Perangkat Lunak (3 SKS) - Wajib

Semester 4: 1 MK (3 SKS)
  • IF401: Kecerdasan Buatan (3 SKS) - Pilihan

Total: 6 MK, 20 SKS
```

### Course Type Distribution

```
Wajib:   5 courses (83.3%) - 17 SKS
Pilihan: 1 course  (16.7%) - 3 SKS
```

---

## 👨‍🏫 Dosen Detail

### Dosen List

| NIP | Name | Expertise | Position |
|-----|------|-----------|----------|
| 197501012000031001 | Prof. Dr. Ahmad Dahlan, M.T. | Software Engineering | Guru Besar |
| 198203152005012002 | Dr. Sri Mulyani, M.Kom | Data Science & AI | Lektor Kepala |
| 198905202010121003 | Bambang Sudrajat, M.Kom | Database & IS | Lektor |

### Dosen Assignment

| Course | Coordinator | Team Members |
|--------|-------------|--------------|
| IF101: Algoritma & Pemrograman | Prof. Ahmad | Dr. Sri Mulyani |
| IF202: Basis Data | Bambang Sudrajat | - |
| IF401: Kecerdasan Buatan | Dr. Sri Mulyani | - |

---

## 📄 RPS Detail

### RPS Status Distribution

```
┌──────────────────────────────────────────┐
│  Terbit: 1 RPS (33.3%)                   │
│  Menunggu Validasi: 1 RPS (33.3%)        │
│  Draft: 1 RPS (33.3%)                    │
└──────────────────────────────────────────┘
```

### RPS List

| ID | Mata Kuliah | Status | Koordinator |
|----|-------------|--------|-------------|
| rps_001 | IF101: Algoritma & Pemrograman | Terbit | Prof. Ahmad Dahlan |
| rps_002 | IF202: Basis Data | Draft | Bambang Sudrajat |
| rps_003 | IF401: Kecerdasan Buatan | Menunggu Validasi | Dr. Sri Mulyani |

---

## ✅ CPMK Detail

### CPMK Distribution

```
IF101 (Algoritma & Pemrograman): 3 CPMK
  • CPMK-01: Memahami konsep algoritma (30%)
  • CPMK-02: Implementasi algoritma (40%)
  • CPMK-03: Analisis kompleksitas (30%)

IF202 (Basis Data): 3 CPMK
  • CPMK-01: Memahami model data (25%)
  • CPMK-02: Merancang basis data (40%)
  • CPMK-03: Implementasi basis data (35%)
```

---

## 🔗 Relationship Matrices

### CPL-Profil Lulusan (10 mappings)

Shows which CPL contribute to each Profil Lulusan:
- Software Engineer: Linked to CPL-S-01, CPL-S-02, CPL-P-01, CPL-P-02, CPL-KK-01
- Data Scientist: Linked to CPL-P-01, CPL-P-02, CPL-KK-02
- System Analyst: Linked to CPL-KU-01, CPL-KU-02
- IT Consultant: (Add more mappings as needed)

### CPL-Bahan Kajian (8 mappings)

Links learning outcomes to study materials:
- CPL-P-01 → BK-01, BK-03
- CPL-P-02 → BK-01, BK-02
- CPL-KK-01 → BK-02, BK-03, BK-04
- CPL-KK-02 → BK-05

### CPL-Mata Kuliah (8 mappings)

Maps which CPL are achieved in each course:
- IF101 → CPL-P-02, CPL-KK-01
- IF102 → CPL-P-01
- IF201 → CPL-P-02, CPL-KK-01
- IF202 → CPL-P-01
- IF301 → CPL-KK-01
- IF401 → CPL-KK-02

---

## 📊 Assessment Detail

### Penilaian (RPS_001 - Algoritma & Pemrograman)

| Type | Weight | Notes |
|------|--------|-------|
| Quiz | 15% | Weekly quizzes |
| Tugas | 25% | Individual & group assignments |
| UTS | 30% | Midterm exam |
| UAS | 30% | Final exam |

**Total:** 100%

---

## 🎯 Usage Scenarios

### Scenario 1: Dashboard Statistics Testing
After seeding, dashboard will show:
- ✅ 2 Kurikulum (1 active)
- ✅ 4 Profil Lulusan
- ✅ 8 CPL
- ✅ 6 Mata Kuliah (20 SKS total)
- ✅ 3 Dosen
- ✅ 3 RPS (various statuses)
- ✅ 26 total relationships (CPL matrices)

### Scenario 2: RPS Workflow Testing
Test complete RPS workflow:
1. Login as Dosen (dosen1@sicap.ac.id)
2. View RPS Draft (rps_002)
3. Edit and submit for validation
4. Login as Kaprodi (kaprodi.if@sicap.ac.id)
5. Validate or reject RPS

### Scenario 3: Matrix Management Testing
Test matrix CRUD operations:
1. View CPL-PL matrix for kurikulum_001
2. Add/remove mappings
3. View CPL-BK matrix
4. Update relationships
5. Check consistency across matrices

---

## 📝 Notes

- All IDs use consistent prefixes (prodi_001, mk_001, etc.) for easy reference
- Relationships are realistic and follow OBE best practices
- Data supports testing all API endpoints
- Suitable for demo presentations
- **NOT for production use** (weak passwords, dummy data)

---

**Generated by:** SI-CAP Seeder v1.0  
**Date:** February 12, 2026  
**For:** Development & Testing Only


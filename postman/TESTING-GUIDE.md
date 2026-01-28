# 📘 SI-CAP API Testing Guide

Panduan lengkap untuk testing API SI-CAP menggunakan Postman.

## 📥 Import Collection

1. Buka **Postman**
2. Klik **Import** (pojok kiri atas)
3. Pilih file `SI-CAP-API.postman_collection.json`
4. Collection akan muncul di sidebar

---

## 🚀 Quick Start

### Step 1: Jalankan Server

Pastikan server sudah berjalan:

```bash
bun run dev
```

Server akan jalan di `http://localhost:8787`

---

### Step 2: Register & Login

#### 2.1 Register Admin (Pertama Kali)

1. Buka folder **Auth** → **Register Admin**
2. Klik **Send**
3. Response sukses:
```json
{
  "success": true,
  "data": {
    "id": "usr_xxxx",
    "email": "admin@sicap.test",
    "nama": "Admin SI-CAP",
    "role": "admin"
  }
}
```

> ⚠️ Jika dapat error `"Email sudah terdaftar"`, langsung ke step Login

#### 2.2 Login

1. Buka folder **Auth** → **Login**
2. Klik **Send**
3. Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

✅ **Token akan otomatis tersimpan** ke collection variables!

---

### Step 3: Test Endpoint Secara Berurutan

Ikuti urutan ini untuk testing lengkap:

| # | Folder | Request | Keterangan |
|---|--------|---------|------------|
| 1 | Auth | Login | ✅ Token auto-save |
| 2 | Prodi | Create Prodi | ✅ prodiId auto-save |
| 3 | Kurikulum | Create Kurikulum | ✅ kurikulumId auto-save |
| 4 | Profil Lulusan | Create Profil Lulusan | ✅ profilLulusanId auto-save |
| 5 | CPL | Create CPL | ✅ cplId auto-save |
| 6 | Bahan Kajian | Create Bahan Kajian | ✅ bkId auto-save |
| 7 | Mata Kuliah | Create Mata Kuliah | ✅ mkId auto-save |
| 8 | Dosen | Create Dosen | ✅ dosenId auto-save |
| 9 | CPMK | Create CPMK | ✅ cpmkId auto-save |
| 10 | RPS | Create RPS | ✅ rpsId auto-save |

> 💡 **ID otomatis tersimpan!** Setiap Create request akan otomatis menyimpan ID ke collection variables

---

## 📁 Struktur Collection

```
SI-CAP API/
├── Health Check/
│   ├── Health Check
│   └── Health Status
├── Auth/
│   ├── Register Admin
│   ├── Register Kaprodi
│   ├── Register Dosen
│   ├── Login ⭐
│   ├── Get Current User
│   └── Refresh Token
├── Prodi/
│   ├── Create Prodi ⭐
│   ├── Get All Prodi
│   ├── Get Prodi by ID
│   ├── Update Prodi
│   └── Delete Prodi
├── Kurikulum/
│   ├── Create Kurikulum ⭐
│   ├── Get All Kurikulum
│   ├── Get Kurikulum by ID
│   ├── Update Kurikulum
│   ├── Activate Kurikulum
│   └── Delete Kurikulum
├── Profil Lulusan/
│   ├── Create Profil Lulusan ⭐
│   ├── Get All Profil Lulusan
│   ├── Get by Kurikulum
│   ├── Get by ID
│   ├── Update
│   └── Delete
├── CPL/
│   ├── Create CPL ⭐
│   ├── Get All CPL
│   ├── Get CPL by ID
│   ├── Update CPL
│   ├── Get Matrix CPL-PL
│   ├── Save Matrix CPL-PL
│   └── Delete CPL
├── Bahan Kajian/
│   ├── Create Bahan Kajian ⭐
│   ├── Get All
│   ├── Get by ID
│   ├── Get Matrix CPL-BK
│   ├── Save Matrix CPL-BK
│   └── Delete
├── Mata Kuliah/
│   ├── Create Mata Kuliah ⭐
│   ├── Get All
│   ├── Get by Semester
│   ├── Get by ID
│   ├── Get Matrix CPL-MK
│   ├── Save Matrix CPL-MK
│   └── Delete
├── Dosen/
│   ├── Create Dosen ⭐
│   ├── Get All Dosen
│   ├── Search Dosen
│   ├── Get by ID
│   ├── Assign Dosen to MK
│   └── Delete
├── CPMK/
│   ├── Create CPMK ⭐
│   ├── Get All CPMK
│   ├── Get by ID
│   ├── Create Sub-CPMK
│   └── Delete
├── RPS/
│   ├── Create RPS ⭐
│   ├── Get All RPS
│   ├── Get by ID
│   ├── Add RPS Minggu
│   ├── Submit for Validation
│   ├── Validate (Kaprodi)
│   ├── Reject (Kaprodi)
│   └── Delete
└── Laporan/
    ├── Matrix CPL-MK
    ├── Status RPS
    ├── MK-Dosen
    └── Progress CPL
```

---

## 🔐 Authentication

Collection ini menggunakan **JWT Bearer Token**.

### Auto-Save Token

Saat Login/Refresh Token berhasil, token **otomatis tersimpan** ke collection variables.

### Cek Variables

1. Klik collection **SI-CAP API**
2. Tab **Variables**
3. Lihat nilai `token` dan ID lainnya

### Manual Update Token

Jika token expired:
1. Jalankan **Login** lagi
2. Token akan di-update otomatis

---

## 📋 Collection Variables

| Variable | Deskripsi | Auto-Save |
|----------|-----------|-----------|
| `baseUrl` | Base URL API | ❌ Manual |
| `token` | JWT Token | ✅ Login |
| `prodiId` | ID Prodi | ✅ Create Prodi |
| `kurikulumId` | ID Kurikulum | ✅ Create Kurikulum |
| `profilLulusanId` | ID Profil Lulusan | ✅ Create PL |
| `cplId` | ID CPL | ✅ Create CPL |
| `bkId` | ID Bahan Kajian | ✅ Create BK |
| `mkId` | ID Mata Kuliah | ✅ Create MK |
| `dosenId` | ID Dosen | ✅ Create Dosen |
| `cpmkId` | ID CPMK | ✅ Create CPMK |
| `rpsId` | ID RPS | ✅ Create RPS |

---

## 🧪 Test Scenario: Full Flow

### Scenario 1: Setup Kurikulum Baru

```
1. Login → admin@sicap.test / admin123
2. Create Prodi → "Teknik Informatika"
3. Create Kurikulum → "Kurikulum 2024 OBE"
4. Create Profil Lulusan → "Software Developer"
5. Create CPL → "CPL-01"
6. Save Matrix CPL-PL → mapping CPL ke PL
```

### Scenario 2: Setup Mata Kuliah

```
1. Login
2. Create Bahan Kajian → "Algoritma dan Pemrograman"
3. Save Matrix CPL-BK → mapping CPL ke BK
4. Create Mata Kuliah → "IF101"
5. Save Matrix CPL-MK → mapping CPL ke MK
6. Create Dosen → "Dr. Budi"
7. Assign Dosen to MK
```

### Scenario 3: Pembuatan RPS

```
1. Login (sebagai dosen)
2. Create CPMK → mapping ke MK dan CPL
3. Create Sub-CPMK → detail indikator
4. Create RPS
5. Add RPS Minggu (1-16)
6. Submit RPS for Validation
7. Login (sebagai kaprodi)
8. Validate/Reject RPS
```

---

## ❗ Troubleshooting

### Error: "Invalid token"

**Solusi:** Login ulang untuk dapat token baru

### Error: "Email sudah terdaftar"

**Solusi:** Normal! Langsung Login saja

### Error: "Unauthorized"

**Solusi:** 
1. Pastikan sudah Login
2. Cek apakah token tersimpan di Variables
3. Login ulang jika perlu

### Error: "Not found"

**Solusi:** Pastikan ID yang digunakan valid. Cek Variables tab.

### Error: "Validation error"

**Solusi:** Cek request body, pastikan semua field required terisi

---

## 🎯 Tips

1. **Selalu mulai dari Login** - Token akan tersimpan otomatis
2. **Ikuti urutan Create** - Prodi → Kurikulum → PL → CPL → dst
3. **Cek Variables** - Pastikan ID tersimpan setelah Create
4. **Console Tab** - Lihat log "ID saved" untuk konfirmasi

---

## 📞 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🤖 Automated Testing dengan Newman

Newman adalah CLI (Command Line Interface) dari Postman yang memungkinkan menjalankan collection secara otomatis dari terminal.

### Instalasi Newman

```bash
# Menggunakan npm (global)
npm install -g newman

# Menggunakan npm (local)
npm install --save-dev newman

# Menggunakan bun
bun add -D newman
```

### Menjalankan Test dengan Newman

#### Basic Run

```bash
# Jalankan semua test
newman run postman/SI-CAP-API.postman_collection.json

# Dengan environment file (opsional)
newman run postman/SI-CAP-API.postman_collection.json -e postman/environment.json
```

#### Dengan Opsi Tambahan

```bash
# Dengan reporter CLI dan HTML
newman run postman/SI-CAP-API.postman_collection.json \
  --reporters cli,html \
  --reporter-html-export reports/newman-report.html

# Hentikan jika ada test yang gagal
newman run postman/SI-CAP-API.postman_collection.json \
  --bail

# Dengan timeout (dalam ms)
newman run postman/SI-CAP-API.postman_collection.json \
  --timeout-request 30000

# Dengan jumlah iterasi
newman run postman/SI-CAP-API.postman_collection.json \
  --iteration-count 3

# Skip SSL verification (untuk development)
newman run postman/SI-CAP-API.postman_collection.json \
  --insecure
```

#### Run Folder Tertentu

```bash
# Hanya folder Health Check dan Auth
newman run postman/SI-CAP-API.postman_collection.json \
  --folder "Health Check" \
  --folder "Auth"

# Hanya folder Prodi
newman run postman/SI-CAP-API.postman_collection.json \
  --folder "Prodi"
```

### NPM Scripts untuk Newman

Tambahkan script berikut ke `package.json`:

```json
{
  "scripts": {
    "test:api": "newman run postman/SI-CAP-API.postman_collection.json",
    "test:api:report": "newman run postman/SI-CAP-API.postman_collection.json --reporters cli,html --reporter-html-export reports/api-test-report.html",
    "test:api:folder": "newman run postman/SI-CAP-API.postman_collection.json --folder"
  }
}
```

Penggunaan:

```bash
# Test semua
npm run test:api

# Test dengan HTML report
npm run test:api:report

# Test folder tertentu
npm run test:api:folder "Auth"
```

### Output Newman

Newman akan menampilkan hasil test seperti:

```
┌─────────────────────────┬───────────────────┬───────────────────┐
│                         │          executed │            failed │
├─────────────────────────┼───────────────────┼───────────────────┤
│              iterations │                 1 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│                requests │                52 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│            test-scripts │               104 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│      prerequest-scripts │                20 │                 0 │
├─────────────────────────┼───────────────────┼───────────────────┤
│              assertions │               156 │                 0 │
├─────────────────────────┴───────────────────┴───────────────────┤
│ total run duration: 12.5s                                       │
├─────────────────────────────────────────────────────────────────┤
│ total data received: 45.2kB (approx)                            │
├─────────────────────────────────────────────────────────────────┤
│ average response time: 125ms [min: 15ms, max: 450ms, s.d.: 85ms]│
└─────────────────────────────────────────────────────────────────┘
```

### CI/CD Integration

#### GitHub Actions

Buat file `.github/workflows/api-test.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Start server
        run: bun run dev &
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Wait for server
        run: sleep 5

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Run API Tests
        run: |
          newman run postman/SI-CAP-API.postman_collection.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/api-test-report.html

      - name: Upload Test Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-report
          path: reports/api-test-report.html
```

### Tips untuk Newman

1. **Selalu jalankan server terlebih dahulu** sebelum menjalankan Newman
2. **Gunakan `--bail`** untuk menghentikan test saat ada kegagalan (berguna di CI/CD)
3. **Export hasil ke HTML** untuk review yang lebih mudah
4. **Gunakan folder** untuk menjalankan subset test tertentu
5. **Set timeout yang sesuai** untuk network yang lambat

---

Happy Testing! 🚀

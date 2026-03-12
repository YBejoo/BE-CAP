# Quick Start - Database Seeder

## Step 1: Setup Database
```powershell
# Install dependencies
bun install

# Run migrations
bun run db:migrate
```

## Step 2: Run Seeder
```powershell
bun run db:seed
```

> **Note:** Seeder automatically clears all existing data before seeding. You can run this command multiple times safely.

## Step 3: Verify
```powershell
# Open Drizzle Studio to verify data
bun run db:studio
```

## Step 4: Test Login
```powershell
# Test login endpoint
curl -X POST http://localhost:8787/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@sicap.ac.id\",\"password\":\"password123\"}'
```

## Default Credentials

### Admin
- Email: admin@sicap.ac.id
- Password: password123

### Kaprodi
- Email: kaprodi.if@sicap.ac.id
- Password: password123

### Kaprodi 2
- Email: kaprodi2.mi@sicap.ac.id
- Password: password123

### Dosen
- Email: dosen1@sicap.ac.id
- Password: password123

## Troubleshooting

### Error: Cannot find module
Solution: Install dependencies
```powershell
bun install
```

### Error: No such table
Solution: Run migrations first
```powershell
bun run db:migrate
```

### Want to completely reset database?
Use the reset script (this will delete migration history):
```powershell
.\reset-and-seed.ps1
```

---

For detailed documentation, see [SEEDER-GUIDE.md](SEEDER-GUIDE.md)

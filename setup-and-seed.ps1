# SI-CAP Database Seeder Setup Script
# Run: .\setup-and-seed.ps1

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  SI-CAP Database Seeder Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if bun is installed
Write-Host "Checking Bun installation..." -ForegroundColor Yellow
$bunVersion = bun --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Bun is not installed!" -ForegroundColor Red
    Write-Host "Please install Bun from: https://bun.sh" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Bun version: $bunVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
bun run db:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to run migrations!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Migrations applied" -ForegroundColor Green
Write-Host ""

# Run seeder
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
bun run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to seed database!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Database seeded successfully" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Database is ready with sample data!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Default Credentials:" -ForegroundColor Yellow
Write-Host "   Admin:   admin@sicap.ac.id / password123"
Write-Host "   Kaprodi: kaprodi.if@sicap.ac.id / password123"
Write-Host "   Dosen:   dosen1@sicap.ac.id / password123"
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start dev server: bun run dev"
Write-Host "   2. Open Drizzle Studio: bun run db:studio"
Write-Host "   3. Test API: See API-ENDPOINTS.md"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Seeder Guide: SEEDER-GUIDE.md"
Write-Host "   - API Docs: API-ENDPOINTS.md"
Write-Host "   - Quick Start: QUICKSTART-SEEDER.md"
Write-Host ""

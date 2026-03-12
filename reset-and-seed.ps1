# SI-CAP Database Reset & Seed Script
# Run: .\reset-and-seed.ps1
# Note: This completely resets the database including migration history
# For just re-seeding data, use: bun run db:seed (which auto-clears data)

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  SI-CAP Database Reset & Seed" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  WARNING: This will DELETE the entire database and migration history!" -ForegroundColor Red
Write-Host "ℹ️  Note: For re-seeding data only, just run: bun run db:seed" -ForegroundColor Yellow
Write-Host ""
$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}
Write-Host ""

# Delete entire .wrangler folder to reset everything
$wranglerPath = ".wrangler"
Write-Host "Deleting .wrangler folder..." -ForegroundColor Yellow
if (Test-Path $wranglerPath) {
    Remove-Item $wranglerPath -Recurse -Force
    Write-Host "✓ Database and cache deleted" -ForegroundColor Green
} else {
    Write-Host "ℹ .wrangler folder not found (this is okay)" -ForegroundColor Gray
}
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
Write-Host "  Reset Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Database has been reset and seeded with fresh data!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Default Credentials:" -ForegroundColor Yellow
Write-Host "   Admin:   admin@sicap.ac.id / password123"
Write-Host "   Kaprodi: kaprodi.if@sicap.ac.id / password123"
Write-Host "   Dosen:   dosen1@sicap.ac.id / password123"
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start dev server: bun run dev"
Write-Host "   2. Open Drizzle Studio: bun run db:studio"
Write-Host "   3. Test API endpoints"
Write-Host ""

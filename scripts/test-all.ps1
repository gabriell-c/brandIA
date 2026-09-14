# OmniRoute Design System — Test All Script (Windows/PowerShell)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "🧪 Running all tests..." -ForegroundColor Green
Write-Host ""

# Backend tests
Write-Host "📦 Running backend tests..." -ForegroundColor Yellow
Push-Location "backend"

Write-Host "Activating virtual environment..."
.\venv\Scripts\Activate.ps1

Write-Host "Running pytest..."
python -m pytest tests/ -v --cov=app --cov-report=term-missing

Write-Host "Deactivating virtual environment..."
deactivate

Pop-Location

# Frontend tests
Write-Host ""
Write-Host "📦 Running frontend tests..." -ForegroundColor Yellow
Push-Location "frontend"

Write-Host "Running Jest tests..."
pnpm test -- --passWithNoTests

Pop-Location

Write-Host ""
Write-Host "✅ All tests passed!" -ForegroundColor Green

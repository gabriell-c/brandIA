# OmniRoute Design System — Setup Script (Windows/PowerShell)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up OmniRoute Design System..." -ForegroundColor Green
Write-Host ""

# Check for required tools
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "❌ Python is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}

$pythonVersion = & python --version 2>&1
Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js 20+ is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}

$nodeVersion = & node --version 2>&1
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpm) {
    Write-Host "❌ pnpm is required but not installed. Install with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

$pnpmVersion = & pnpm --version 2>&1
Write-Host "✅ pnpm: $pnpmVersion" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Backend setup
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
Push-Location "backend"

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv venv
}

Write-Host "Activating virtual environment..."
.\venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Created .env from .env.example — please edit with your AI API keys" -ForegroundColor Yellow
}

# Initialize database
Write-Host "Initializing database..."
python -c "
from app.database import engine, Base
import asyncio
asyncio.run(Base.metadata.create_all(bind=engine))
print('Database initialized')
"

Write-Host "Deactivating virtual environment..."
deactivate
Pop-Location

# Frontend setup
Write-Host ""
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
Push-Location "frontend"

Write-Host "Installing Node.js dependencies..."
pnpm install

Pop-Location

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start development servers:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 5001"
Write-Host "  Frontend: cd frontend; pnpm dev"
Write-Host ""
Write-Host "Then open http://localhost:7000 in your browser" -ForegroundColor Cyan

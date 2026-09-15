# Full test execution
Write-Host "=== OmniRoute Design System - Full Test Suite ===" -ForegroundColor Cyan
Write-Host ""

# Backend tests
Write-Host "🧪 Running Backend Tests (pytest)..." -ForegroundColor Yellow
cd "d:\OmniRoute\design_system\backend"
$backendResult = python run_tests.py
Write-Host $backendResult

# Frontend tests
Write-Host ""
Write-Host "🧪 Running Frontend Tests (Jest)..." -ForegroundColor Yellow
cd "d:\OmniRoute\design_system\frontend"
$frontendResult = npx jest src/lib/utils.test.js --verbose 2>&1
Write-Host $frontendResult

Write-Host ""
Write-Host "=== Test Execution Complete ===" -ForegroundColor Green
# Run Backend (Windows)
Write-Host "Starting backend server..." -ForegroundColor Green
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 5001

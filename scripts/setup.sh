#!/bin/bash

# OmniRoute Design System — Setup Script (Linux/Mac)

set -e

echo "🚀 Setting up OmniRoute Design System..."

# Check for required tools
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3.12+ is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 20+ is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Install with: npm install -g pnpm"; exit 1; }

echo "✅ Prerequisites check passed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env from .env.example — please edit with your AI API keys"
fi

# Initialize database
python -c "
from app.database import engine, Base
import asyncio
asyncio.run(Base.metadata.create_all(bind=engine))
print('Database initialized')
"

deactivate
cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend
pnpm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start development servers:"
echo "  Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 5001"
echo "  Frontend: cd frontend && pnpm dev"
echo ""
echo "Then open http://localhost:7000 in your browser"
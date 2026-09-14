#!/bin/bash

# OmniRoute Design System — Test All Script

set -e

echo "🧪 Running all tests..."

# Backend tests
echo ""
echo "📦 Running backend tests..."
cd backend
source venv/bin/activate
python -m pytest tests/ -v --cov=app --cov-report=term-missing
deactivate
cd ..

# Frontend tests
echo ""
echo "📦 Running frontend tests..."
cd frontend
pnpm test -- --passWithNoTests
cd ..

echo ""
echo "✅ All tests passed!"

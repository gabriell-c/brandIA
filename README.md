# OmniRoute Design System

[![CI](https://github.com/your-username/omni-route-design/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/omni-route-design/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

> **Open source branding & design system tool** — run locally, use your own AI keys.

A local-first tool that helps you generate complete branding and design systems using AI. Configure your own API key (OpenAI, Anthropic, Ollama, etc.) and get professional-grade design tokens for your projects.

## 🎯 Features

- 🎨 **AI-Powered Branding** — Generate color palettes, typography, and visual identity
- ✅ **WCAG Validation** — Automatic accessibility checks with visual indicators
- 📦 **Token Export** — Export to JSON, CSS Variables, and Tailwind Config
- 🔒 **Local & Private** — No data sent to external servers (except your configured AI API)
- 🎯 **BYOK** — Bring Your Own Key — no subscription required
- 🌍 **Multi-Language** — Support for English, Chinese, and more

## 🏗️ Architecture

See [Arquitetura_Design_System.md](./Arquitetura_Design_System.md) for detailed architecture documentation.

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS |
| **Backend** | Python 3.12 + FastAPI + SQLite/PostgreSQL |
| **AI** | OpenAI-compatible API (OpenAI, Anthropic, Ollama, etc.) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Container** | Docker + Docker Compose |

## 📦 Installation

### Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Quick Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/omni-route-design.git
cd omni-route-design

# Run setup script
./scripts/setup.sh  # Linux/Mac
# or on Windows, run setup.ps1 in PowerShell
```

### Manual Installation

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your AI API key
uvicorn app.main:app --reload --port 5001
```

#### Frontend

```bash
cd frontend
pnpm install
pnpm dev -- -p 7000
```

### Docker Compose (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🚀 Usage

1. **Configure AI** — Enter your API provider, base URL, key, and model at `http://localhost:7000/settings`
2. **Create Project** — Add your business name, segment, and description
3. **Generate Branding** — Click "Generate" to create palette, typography, and explanations
4. **Validate** — Check accessibility scores and adjust if needed
5. **Export** — Download tokens in JSON, CSS, or Tailwind format

## 📖 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:5001/docs`
- ReDoc: `http://localhost:5001/redoc`

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
pnpm test
```

### Run All Tests

```bash
# From project root
./scripts/test-all.sh
```

## 🏗️ Project Structure

```
design_system/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── database.py        # Database configuration
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── routes/            # API routes
│   │   └── agents/            # AI agents
│   ├── tests/                  # Test files
│   ├── requirements.txt        # Python dependencies
│   ├── pyproject.toml          # Python project config
│   └── .env.example            # Environment variables
├── frontend/                   # Next.js frontend
│   ├── src/                    # Source code
│   ├── lib/                    # Utilities
│   ├── package.json            # Node dependencies
│   └── tsconfig.json           # TypeScript config
├── docs/                       # Documentation
├── prompt/                     # AI prompts
├── scripts/                    # Utility scripts
├── .github/workflows/          # CI/CD pipelines
├── docker-compose.yml          # Docker configuration
├── Dockerfile.backend          # Backend Docker image
├── Dockerfile.frontend         # Frontend Docker image
├── .gitignore                  # Git ignore rules
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
└── LICENSE                     # MIT License
```

## 📝 Environment Variables

See [.env.example](./backend/.env.example) for all available variables.

Key variables:
- `AI_PROVIDER` — AI provider (openai, anthropic, ollama)
- `AI_BASE_URL` — API base URL
- `AI_API_KEY` — Your API key
- `AI_MODEL` — Model to use

## 🔒 Security

- API keys are stored locally only
- No telemetry or analytics
- All AI requests go directly to your configured provider
- Database is local (SQLite) by default

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ by the OmniRoute Team**

# OmniRoute Design System

> Open source branding & design system tool — run locally, use your own AI keys.

A local-first tool that helps you generate complete branding and design systems using AI. Configure your own API key (OpenAI, Anthropic, Ollama, etc.) and get professional-grade design tokens for your projects.

## Features

- 🎨 **AI-Powered Branding** — Generate color palettes, typography, and visual identity
- ✅ **WCAG Validation** — Automatic accessibility checks with visual indicators
- 📦 **Token Export** — Export to JSON, CSS Variables, and Tailwind Config
- 🔒 **Local & Private** — No data sent to external servers (except your configured AI API)
- 🎯 **BYOK** — Bring Your Own Key — no subscription required

## Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.12 + FastAPI + SQLite
- **AI:** OpenAI-compatible API (OpenAI, Anthropic, Ollama, etc.)

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/omni-route-design.git
cd omni-route-design

# Run setup script
./scripts/setup.sh  # Linux/Mac
# or on Windows, run setup.ps1 in PowerShell
```

### Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your AI API key
uvicorn app.main:app --reload --port 5001

# Terminal 2 - Frontend
cd frontend
pnpm install
pnpm dev -- -p 7000
```

Open http://localhost:7000 in your browser.

## Usage

1. **Configure AI** — Enter your API provider, base URL, key, and model
2. **Create Project** — Add your business name, segment, and tone of voice
3. **Generate Branding** — AI generates palette, typography, and explanations
4. **Validate** — Check accessibility scores and adjust if needed
5. **Export** — Download tokens in JSON, CSS, or Tailwind format

## Architecture

See [Arquitetura_Design_System.md](./Arquitetura_Design_System.md) for detailed architecture documentation.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License — see [LICENSE](./LICENSE) for details.

## Acknowledgments

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
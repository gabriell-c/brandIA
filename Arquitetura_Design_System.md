#### 3.3.3 RAG Local (Hub de Regras)
- **Estrutura:** `.md` por categoria (`color-rules.md`, `typography-rules.md`, etc.)
- **Busca:** Keyword-based (sem embedding, simples e rápido)
- **Uso:** Contexto é injetado no prompt da IA antes da geração

---

## 4. Roadmap de Prioridades — Dividir e Conquistar

> Cada P representa um bloco de funcionalidades. Complete cada P antes de avançar para o próximo.
>
> **Critério de avanço:** Todos os itens do P atual devem estar com status `[x]` no checklist da Seção 14 + testes passando + docs atualizados.

---

### 🟢 P1 — Fundações do Projeto
**Horas estimadas:** ~80h | **Dependências:** Nenhuma | **Risco:** Baixo

> **Objetivo:** Estabelecer a base sólida do projeto com infraestrutura, configurações e documentação mínima viável. Este é o alicerce sobre o qual tudo será construído.

#### 1.1 Setup do monorepo
**Descrição:** Criar a estrutura de diretórios que organize todo o código-fonte de forma clara e escalável.

**Critérios de aceite:**
- [ ] Pastas `frontend/` e `backend/` criadas na raiz do projeto
- [ ] Pasta `docs/` para documentação técnica (arquitetura, especificações)
- [ ] Pasta `prompt/` organizada por agente (`branding/`, `palette/`, `typography/`, `ui/`, `ux/`)
- [ ] Pasta `scripts/` para scripts de automação
- [ ] `.gitignore` configurado para excluir: `venv/`, `node_modules/`, `__pycache__/`, `.env`, `.next/`, `*.pyc`, `*.db`
- [ ] README inicial com: nome do projeto, descrição curta, stack tecnológica, links úteis
- [ ] LICENSE MIT adicionado no root

**Estrutura de diretórios:**
```
omni-route-design/
├── frontend/                    # Next.js + TypeScript + Tailwind
│   ├── app/                     # App Router (pages)
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base
│   │   ├── brand/               # Componentes de branding
│   │   └── design-system/       # Visualizador
│   ├── lib/                     # Utilitários
│   │   ├── ai/                  # Cliente de IA
│   │   ├── tokens/              # Gerenciamento de tokens
│   │   └── validation/          # Validações
│   ├── public/                  # Assets estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # FastAPI + SQLite
│   ├── app/
│   │   ├── agents/              # Agentes de IA
│   │   ├── routes/              # Rotas da API
│   │   ├── models/              # Models Pydantic
│   │   ├── database.py
│   │   └── main.py
│   ├── rules/                   # Regras RAG
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                        # Documentação
│   ├── arquitetura.md
│   ├── especificacao-branding-design-system.md
│   └── prompt-saas-system-design-ia.md
│
├── prompt/                      # Prompts organizados
│   ├── branding/
│   ├── palette/
│   ├── typography/
│   ├── ui/
│   └── ux/
│
├── scripts/                     # Scripts utilitários
│   ├── setup.ps1                # Windows
│   ├── setup.sh                 # Linux/Mac
│   ├── backup.py                # Backup automático
│   └── restore.py               # Restore de backup
│
├── .gitignore
├── LICENSE
└── README.md
```

**Testes de aceite:**
- `git status` mostra apenas arquivos de código (sem venv/node_modules)
- `git ls-files | grep -E "venv|node_modules"` retorna vazio
- README abre corretamente no GitHub com formatação adequada
- LICENSE é reconhecido pelo GitHub

**Riscos e mitigações:**
- *Estrutura muda no futuro* → Documentar decisões de arquitetura em `docs/arquitetura.md`
- *Esquecer arquivo no `.gitignore`* → Revisar `.gitignore` antes do primeiro commit, usar `git check-ignore -v <arquivo>`

---

#### 1.2 Configuração de ambiente
**Descrição:** Configurar todos os arquivos de configuração necessários para desenvolvimento e produção, incluindo variáveis de ambiente, dependências e ferramentas.

**Critérios de aceite:**
- [ ] `.env.example` documentado com todas as variáveis e descrições
- [ ] `requirements.txt` com versões fixas (ex: `fastapi==0.111.0`)
- [ ] `package.json` com scripts: `dev`, `build`, `lint`, `test`, `test:integration`, `test:e2e`
- [ ] `tsconfig.json` com `strict: true` e configurações recomendadas
- [ ] `pyproject.toml` ou `setup.cfg` com configuração do Ruff
- [ ] `.prettierrc` para padronização de código
- [ ] `.eslintrc.json` com regras recomendadas

**Variáveis de ambiente necessárias:**
```env
# ============================================
# IA (Bring Your Own Key)
# ============================================
AI_PROVIDER=openai                    # openai, anthropic, ollama
AI_BASE_URL=https://api.openai.com/v1 # Endpoint da API
AI_API_KEY=sk-...                     # Sua API key
AI_MODEL=gpt-4o                       # Modelo a usar

# Para Ollama local:
# AI_PROVIDER=openai
# AI_BASE_URL=http://localhost:11434/v1
# AI_API_KEY=ollama
# AI_MODEL=llama3.2

# ============================================
# Banco de Dados
# ============================================
DATABASE_URL=sqlite+aiosqlite:///./omni-route-design.db

# ============================================
# Backend
# ============================================
BACKEND_HOST=0.0.0.0
BACKEND_PORT=5001
CORS_ORIGINS=http://localhost:7000

# ============================================
# Frontend
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1

# ============================================
# Segurança
# ============================================
CREDENTIALS_ENCRYPTION_KEY=       # Fernet key para criptografar API keys
```

**Arquivos de configuração:**

`package.json` (scripts):
```json
{
  "scripts": {
    "dev": "next dev -- -p 7000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "cypress run"
  }
}
```

`requirements.txt`:
```
fastapi==0.111.0
uvicorn[standard]==0.30.1
sqlalchemy==2.0.30
aiosqlite==0.20.0
pydantic==2.7.1
pydantic-settings==2.2.1
openai==1.23.2
httpx==0.27.0
python-dotenv==1.0.1
aiofiles==23.2.1
python-multipart==0.0.9
cryptography==42.0.0
ruff==0.1.0
pytest==7.4.0
pytest-asyncio==0.21.0
httpx==0.27.0
```

**Testes de aceite:**
- `cp .env.example .env` e o backend inicia sem erro de variável faltante
- `pnpm dev` inicia o Next.js na porta 7000
- `ruff check .` passa sem erros no backend
- `pnpm lint` passa no frontend

---

#### 1.3 Docker Compose (opcional)
**Descrição:** Containerização para facilitar setup em qualquer máquina, garantindo consistência de ambiente.

**Critérios de aceite:**
- [ ] `docker-compose.yml` com serviços: `backend`, `frontend`
- [ ] `Dockerfile.backend` com Python 3.12-slim
- [ ] `Dockerfile.frontend` com Node 22-alpine
- [ ] Rede Docker configurada
- [ ] Volumes para persistência do banco e dados
- [ ] Health checks configurados

**Exemplo `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    ports:
      - "5001:5001"
    env_file:
      - .env
    volumes:
      - ./backend/data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - omni-route-net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    ports:
      - "7000:7000"
    depends_on:
      backend:
        condition: service_healthy
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5001/api/v1
    networks:
      - omni-route-net

networks:
  omni-route-net:
    driver: bridge
```

**Dockerfile.backend:**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]
```

**Dockerfile.frontend:**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

EXPOSE 7000

CMD ["pnpm", "dev", "--", "-p", "7000"]
```

**Testes de aceite:**
- `docker-compose up -d` inicia ambos os serviços
- `docker-compose ps` mostra ambos como `healthy`
- `curl http://localhost:5001/health` retorna `{"status":"ok"}`
- `curl http://localhost:7000` retorna HTML da página inicial

---

#### 1.4 CI/CD inicial
**Descrição:** Pipeline automatizado para lint, testes e build, garantindo qualidade do código.

**Critérios de aceite:**
- [ ] `.github/workflows/ci.yml` configurado
- [ ] Job de lint: `ruff check` no backend, `eslint` no frontend
- [ ] Job de teste: `pytest` no backend, `jest` no frontend
- [ ] Job de build: `next build` no frontend
- [ ] Job de segurança: `trivy` para扫描 dependências
- [ ] Status badge no README

**Exemplo de workflow (`ci.yml`):**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Backend lint
        run: |
          cd backend
          pip install ruff
          ruff check .

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Frontend lint
        run: |
          cd frontend
          pnpm install
          pnpm lint

  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Backend tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest tests/ -v

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Frontend tests
        run: |
          cd frontend
          pnpm install
          pnpm test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Frontend build
        run: |
          cd frontend
          pnpm install
          pnpm build

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          target: backend/requirements.txt
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
```

**Testes de aceite:**
- Push para branch trigger workflows
- Todos os jobs passam (verde)
- Badge no README mostra status atual

---

#### 1.5 Documentação inicial
**Descrição:** Documentação mínima para uso e contribuição no projeto.

**Critérios de aceite:**
- [ ] `README.md` com: descrição, stack, instalação, uso, configuração, testes
- [ ] `CONTRIBUTING.md` com: guia de contribuição, code style, fluxo de PR
- [ ] `CHANGELOG.md` com formato Keep a Changelog
- [ ] Documentação de API automática via Swagger (FastAPI)
- [ ] README renderiza corretamente no GitHub

**Estrutura do README:**
```markdown
# OmniRoute Design System

> Sistema open source de branding e design system com IA, rodando localmente na sua máquina.

[![CI](https://github.com/gabriell-c/brandIA/actions/workflows/ci.yml/badge.svg)](https://github.com/gabriell-c/brandIA/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Introdução

O OmniRoute Design System é uma ferramenta open source que permite gerar **branding completo + design system navegável** usando IA, rodando **localmente** na sua máquina. Configure sua própria API key (OpenAI, Anthropic, Ollama, etc.) e gere uma identidade visual consistente para seu projeto.

### ✨ Funcionalidades
- Geração de branding com IA (paleta, tipografia, explicação)
- Validação de contraste WCAG em tempo real
- Exportação de design tokens (JSON, CSS, Tailwind)
- Visualizador interativo do design system
- 100% local — seus dados não saem da sua máquina

### 🛠 Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.12 + FastAPI + SQLite
- **IA:** OpenAI-compatible API (OpenAI, Anthropic, Ollama)
- **Arquitetura:** Monorepo

## 📦 Instalação

### Pré-requisitos
- Node.js 22+
- Python 3.12+
- pnpm

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edita .env com suas keys
uvicorn app.main:app --reload --port 5001
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Acesso
- Frontend: http://localhost:7000
- Backend API: http://localhost:5001
- Docs da API: http://localhost:5001/docs

## 🔧 Configuração

Copie `.env.example` para `.env` e preencha:

```env
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-...
AI_MODEL=gpt-4o
```

## 🧪 Testes

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
pnpm test
pnpm test:integration
pnpm test:e2e
```

## 📚 Documentação
- [API Docs](http://localhost:5001/docs) — Swagger automático
- [Contribuindo](CONTRIBUTING.md) — Guia para contribuidores
- [Arquitetura](docs/arquitetura.md) — Detalhes técnicos

## 📄 Licença
MIT — veja [LICENSE](LICENSE) para detalhes.
```

**Testes de aceite:**
- README renderiza corretamente no GitHub
- Links internos funcionam
- Swagger mostra todos os endpoints em `http://localhost:5001/docs`

---

### 🟡 P2 — Backend Core
**Horas estimadas:** ~160h | **Dependências:** P1 | **Risco:** Baixo

> **Objetivo:** Implementar a API REST completa com CRUD de projetos, branding e configuração de IA. O backend é o coração do sistema — sem ele, não há funcionalidade.

#### 2.1 Modelos de dados
**Descrição:** Definir os schemas Pydantic e tabelas SQLite que representam o domínio do projeto.

**Critérios de aceite:**
- [ ] Tabela `projects`: id, name, created_at, updated_at
- [ ] Tabela `brands`: id, project_id, business_name, segment, tone_of_voice, palette, typography, logo_svg, created_at
- [ ] Tabela `design_system`: id, brand_id, tokens, components, created_at
- [ ] Relacionamentos FOREIGN KEY configurados (CASCADE DELETE)
- [ ] Migrações automáticas ao iniciar o servidor
- [ ] Índices em campos frequentemente consultados

**Schema SQLite completo:**
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    business_name TEXT,
    segment TEXT CHECK(segment IN ('tecnologia', 'alimentação', 'saúde', 'educação', 'moda', 'esporte', 'entretenimento', 'finanças', 'outro')),
    tone_of_voice TEXT CHECK(tone_of_voice IN ('formal', 'informal', 'amigável', 'profissional', 'criativo', 'sério', 'descontraído', 'outro')),
    palette JSON,
    typography JSON,
    logo_svg TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE design_system (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    tokens JSON,
    components JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE INDEX idx_brands_project_id ON brands(project_id);
CREATE INDEX idx_design_system_brand_id ON design_system(brand_id);
```

**Pydantic Models (`app/models.py`):**
```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BrandBase(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=100)
    segment: str
    tone_of_voice: str


class BrandCreate(BrandBase):
    project_id: int


class BrandResponse(BrandBase):
    id: int
    project_id: int
    palette: Optional[Dict[str, str]] = None
    typography: Optional[Dict[str, str]] = None
    logo_svg: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DesignSystemResponse(BaseModel):
    id: int
    brand_id: int
    tokens: Dict[str, Any]
    components: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
```

**Testes de aceite:**
- `pytest tests/test_models.py` — todos passam
- Tabelas são criadas ao iniciar o servidor
- Constraints de CHECK funcionam (segmento inválido retorna erro)

---

#### 2.2 Database
**Descrição:** Configurar conexão assíncrona com SQLite usando SQLAlchemy.

**Critérios de aceite:**
- [ ] `database.py` com `AsyncEngine` e `async_session_maker`
- [ ] `get_db()` dependency injetável
- [ ] Migrations automáticas via `Base.metadata.create_all()`
- [ ] Conexão testada com query simples
- [ ] Pool de conexões configurado

**Implementação (`app/database.py`):**
```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./omni-route-design.db")

# Engine assíncrono para operações
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10
)

# Factory de sessões
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False
)


class Base(DeclarativeBase):
    pass


async def init_db():
    """Inicializa tabelas no banco"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    """Dependency injetável para sessões de banco"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

**Testes de aceite:**
- Backend inicia sem erro de conexão
- Arquivo `.db` é criado na primeira inicialização
- Query simples funciona: `SELECT * FROM projects`

---

#### 2.3 Rotas de Projetos
**Critérios de aceite:**
- [ ] `GET /api/v1/projects` — lista todos os projetos
- [ ] `POST /api/v1/projects` — cria projeto (201)
- [ ] `GET /api/v1/projects/{id}` — busca projeto
- [ ] `PUT /api/v1/projects/{id}` — atualiza projeto
- [ ] `DELETE /api/v1/projects/{id}` — deleta projeto (204)
- [ ] Validação de input com Pydantic
- [ ] Erros 404 para projeto não encontrado
- [ ] Erros 422 para input inválido
- [ ] Ordenação por `created_at` descending

**Exemplo de implementação:**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.models import Project

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Lista todos os projetos"""
    result = await db.execute(
        select(Project)
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Cria um novo projeto"""
    db_project = Project(name=project.name)
    db.add(db_project)
    await db.flush()
    await db.refresh(db_project)
    return db_project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Busca projeto por ID"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Atualiza projeto"""
    db_project = await db.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    db_project.name = project.name
    await db.flush()
    await db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Deleta projeto"""
    db_project = await db.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    await db.delete(db_project)
```

**Testes de aceite:**
- `pytest tests/test_projects.py` — todos passam
- POST cria projeto e retorna 201 com ID
- GET retorna projeto existente
- PUT atualiza nome corretamente
- DELETE remove projeto e retorna 204
- GET de projeto inexistente retorna 404
- POST com nome vazio retorna 422

---

#### 2.4 Rotas de Branding
**Critérios de aceite:**
- [ ] `POST /api/v1/brand/generate` — gera branding via IA
- [ ] `POST /api/v1/brand/validate` — valida contraste WCAG
- [ ] `GET /api/v1/brand/{id}` — busca marca
- [ ] Response com palette, typography e explicação
- [ ] Validação WCAG retorna status (pass/fail)
- [ ] Explicação das escolhas de cor/fonte

**Exemplo de response:**
```json
{
  "id": 1,
  "project_id": 1,
  "business_name": "Café Aroma",
  "segment": "alimentação",
  "tone_of_voice": "aconchegante",
  "palette": {
    "primary": "#8B4513",
    "secondary": "#D2B48C",
    "accent": "#2F4F4F",
    "neutral": "#F5F5F5",
    "light": "#FFFFFF",
    "dark": "#1A1A1A"
  },
  "typography": {
    "heading": "Playfair Display",
    "body": "Inter",
    "mono": "JetBrains Mono"
  },
  "explanation": "Cores quentes de café combinadas com tipografia serifada para transmitir tradição e elegância.",
  "accessibility": {
    "passes_wcag_aa": true,
    "passes_wcag_aaa": false,
    "contrast_ratios": {
      "primary_on_light": "7.5:1",
      "primary_on_dark": "4.6:1"
    }
  },
  "created_at": "2026-09-14T10:00:00Z"
}
```

**Testes de aceite:**
- `pytest tests/test_brand.py` — geração e validação passam
- Validação retorna `passes_wcag_aa: true/false`
- Explicação é gerada pela IA

---

#### 2.5 Rotas de AI Config (BYOK)
**Critérios de aceite:**
- [ ] `POST /api/v1/ai-config` — salva configuração criptografada
- [ ] `GET /api/v1/ai-config` — retorna status (sem expor key)
- [ ] `DELETE /api/v1/ai-config` — remove configuração
- [ ] Configuração armazenada criptografada (Fernet)
- [ ] Validação de URL e model
- [ ] Teste de conectividade com a API

**Criptografia:**
```python
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

load_dotenv()

ENCRYPTION_KEY = os.getenv("CREDENTIALS_ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    ENCRYPTION_KEY = Fernet.generate_key().decode()
    os.environ["CREDENTIALS_ENCRYPTION_KEY"] = ENCRYPTION_KEY

fernet = Fernet(ENCRYPTION_KEY.encode())


def encrypt_value(value: str) -> str:
    return fernet.encrypt(value.encode()).decode()


def decrypt_value(encrypted: str) -> str:
    return fernet.decrypt(encrypted.encode()).decode()
```

**Testes de aceite:**
- POST salva config e retorna 200
- GET retorna `{"configured": true, "provider": "openai"}` (sem mostrar key)
- DELETE remove config
- Chave de criptografia é gerada automaticamente se não existir

---

#### 2.6 Validação de input
**Critérios de aceite:**
- [ ] Schemas em `app/schemas.py`
- [ ] Todos os endpoints usam Pydantic models
- [ ] Mensagens de erro claras em português
- [ ] Validação de tipos, required fields, max_length, patterns

**Exemplo de schemas:**
```python
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
import re

class BrandGenerateRequest(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=100)
    segment: str = Field(..., pattern=r"^(tecnologia|alimentação|saúde|educação|moda|esporte|entretenimento|finanças|outro)$")
    tone_of_voice: str = Field(..., pattern=r"^(formal|informal|amigável|profissional|criativo|sério|descontraído|outro)$")
    description: Optional[str] = Field(None, max_length=500)

    @validator('business_name')
    def validate_business_name(cls, v):
        if not re.match(r'^[a-zA-Z0-9\s\-çãéóúïèêëéïîìàÄÖÜßéñçàèéìòùÁÉÍÓÚáéíóúñ]', v):
            raise ValueError('Nome deve conter apenas letras, números e espaços')
        return v
```

**Testes de aceite:**
- Request com campos faltantes retorna 422
- Request com valores inválidos retorna 422 com mensagem clara
- Request válido retorna 200/201

---

#### 2.7 Error handling padronizado
**Critérios de aceite:**
- [ ] Exception handler global para `HTTPException`
- [ ] Logger estruturado em JSON
- [ ] Erros de IA logados com código e mensagem
- [ ] Stack trace apenas em modo debug
- [ ] Respostas de erro consistentes

**Exemplo:**
```python
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

app = FastAPI()


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    logger.warning(f"HTTP error: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "type": "http_error",
            "status_code": exc.status_code
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "type": "validation_error",
            "status_code": 422
        }
    )
```

**Testes de aceite:**
- Erro 404 retorna JSON com `detail` e `type`
- Erro 422 retorna lista de erros detalhados
- Logs são estruturados em JSON

---

#### 2.8 CORS + middleware
**Critérios de aceite:**
- [ ] `CORSMiddleware` permite apenas `localhost:7000`
- [ ] Headers seguros configurados
- [ ] Middleware de logging de requests
- [ ] Timeout configurado (30s)

**Implementação:**
```python
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Testes de aceite:**
- Request de `localhost:7000` tem `Access-Control-Allow-Origin: http://localhost:7000`
- Request de outro origin é rejeitado
- Rate limiting funciona (100 requests/minute)

---

### 🔵 P3 — Frontend Core
**Horas estimadas:** ~120h | **Dependências:** P1 | **Risco:** Baixo

> **Objetivo:** Implementar a interface do usuário com formulários, componentes UI e navegação.

#### 3.1 Página inicial (landing)
**Critérios de aceite:**
- [ ] Hero section com headline e CTA
- [ ] Features highlights (3 cards)
- [ ] Footer com links
- [ ] Responsivo (mobile-first)
- [ ] Acessibilidade (ARIA labels, contraste)

#### 3.2 Formulário de branding
**Critérios de aceite:**
- [ ] 3 passos com progress bar
- [ ] Validação em tempo real
- [ ] Preview ao vivo das escolhas
- [ ] Botão voltar/próximo

#### 3.3 Display de resultados
**Critérios de aceite:**
- [ ] Paleta de cores com hex codes
- [ ] Escala tipográfica visual
- [ ] Botões de exportação

#### 3.4 Componentes UI básicos
**Critérios de aceite:**
- [ ] Button: primary, secondary, ghost
- [ ] Input + Label + Error message
- [ ] Card: info, success, warning, error
- [ ] Modal genérico

#### 3.5 Validação de input
**Critérios de aceite:**
- [ ] Zod schemas no client
- [ ] Erros em tempo real
- [ ] Feedback visual (bordas vermelhas)

#### 3.6 Cliente API
**Critérios de aceite:**
- [ ] `lib/api.ts` com funções typed
- [ ] Error handling com retry
- [ ] Types gerados dos schemas

#### 3.7 Navegação
**Critérios de aceite:**
- [ ] Rotas: `/`, `/brand`, `/design-system`, `/export`
- [ ] Link components
- [ ] Active state

#### 3.8 Layout base
**Critérios de aceite:**
- [ ] Navbar responsivo
- [ ] Footer
- [ ] Theme provider (dark/light)
- [ ] Transições suaves

---

### 🟣 P4 — Integração IA
**Horas estimadas:** ~200h | **Dependências:** P2, P3 | **Risco:** Médio

> **Objetivo:** Integrar agentes de IA para gerar branding, paleta e tipografia.

#### 4.1 Cliente OpenAI compatible
**Critérios de aceite:**
- [ ] Suporta OpenAI, Anthropic, Ollama
- [ ] Configuração BYOK
- [ ] Timeout de 30s
- [ ] Retry 3x com backoff

#### 4.2 Agente de branding
**Critérios de aceite:**
- [ ] System prompt otimizado
- [ ] Output JSON estruturado
- [ ] Validação do response
- [ ] Explicação das escolhas

#### 4.3 Agente de paleta
**Critérios de aceite:**
- [ ] Gera 6 cores (primary, secondary, accent, neutral, light, dark)
- [ ] Calcula contraste WCAG
- [ ] Sugere ajustes se falhar

#### 4.4 Agente de tipografia
**Critérios de aceite:**
- [ ] Seleciona 3 fontes (heading, body, mono)
- [ ] Valida font pairing
- [ ] Escala modular 1.25

#### 4.5 RAG local
**Critérios de aceite:**
- [ ] Regras em `.md` por categoria
- [ ] Busca keyword-based
- [ ] Contexto injetado no prompt

#### 4.6 Retry logic
**Critérios de aceite:**
- [ ] Timeout 30s
- [ ] Retry 3x exponencial
- [ ] Fall back para modelo padrão

#### 4.7 Logging estruturado
**Critérios de aceite:**
- [ ] Log de requests/responses
- [ ] Tempo de resposta
- [ ] Erros da API (4xx/5xx)

---

### 🟠 P5 — Validação & UX
**Horas estimadas:** ~80h | **Dependências:** P4 | **Risco:** Baixo

> **Objetivo:** Implementar validações WCAG e indicadores visuais.

#### 5.1 Validador WCAG
**Critérios de aceite:**
- [ ] Contraste 4.5:1 (AA), 7:1 (AAA)
- [ ] Simulação de daltonismo
- [ ] Feedback visual (cores)

#### 5.2 Indicadores visuais
**Critérios de aceite:**
- [ ] Farol verde/amarelo/vermelho
- [ ] Tooltip explicativo
- [ ] Posição inline

#### 5.3 Tooltips
**Critérios de aceite:**
- [ ] Help text em cada campo
- [ ] Explicação do "porquê"
- [ ] Links para docs

#### 5.4 Modo simples/avançado
**Critérios de aceite:**
- [ ] Toggle no header
- [ ] Simples: defaults otimizados
- [ ] Avançado: controle total

#### 5.5 Feedback em tempo real
**Critérios de aceite:**
- [ ] Validação após cada input
- [ ] Loading states
- [ ] Erros amigáveis

---

### 🟤 P6 — Design System Viewer
**Horas estimadas:** ~100h | **Dependências:** P5 | **Risco:** Baixo

> **Objetivo:** Visualizador interativo do design system.

#### 6.1 Visualização de tokens
**Critérios de aceite:**
- [ ] JSON preview
- [ ] CSS Variables preview
- [ ] Tailwind Config preview

#### 6.2 Preview de componentes
**Critérios de aceite:**
- [ ] Botões (todos variants)
- [ ] Cards (todos tipos)
- [ ] Forms (todos inputs)
- [ ] Navbar, Footer

#### 6.3 Toggle dark/light
**Critérios de aceite:**
- [ ] Theme provider
- [ ] Persistência localStorage
- [ ] Transições suaves

#### 6.4 Exportação
**Critérios de aceite:**
- [ ] JSON (Design Tokens)
- [ ] CSS Variables
- [ ] Tailwind Config
- [ ] Style Dictionary

#### 6.5 Storybook
**Critérios de aceite:**
- [ ] Documentação de componentes
- [ ] Stories para cada variant
- [ ] Controls para testar props

---

### 🔴 P7 — Features Avançadas
**Horas estimadas:** ~160h | **Dependências:** P6 | **Risco:** Médio

> **Objetivo:** Features avançadas e diferenciais.

#### 7.1 Vetorização PNG→SVG
**Critérios de aceite:**
- [ ] Integração potrace/vtracer
- [ ] Upload de logo
- [ ] Export SVG
- [ ] Nota: resultado é "melhor esforço"

#### 7.2 Logo tipográfica
**Critérios de aceite:**
- [ ] Texto + fonte
- [ ] Variações (cor, fundo)
- [ ] Export SVG/PNG

#### 7.3 Banco de paletas
**Critérios de aceite:**
- [ ] CRUD de paletas
- [ ] Rating e comentários
- [ ] Filtros por cor/segmento

#### 7.4 Banco de fontes
**Critérios de aceite:**
- [ ] Font pairing sugerido
- [ ] Preview ao vivo
- [ ] Rating e comentários

#### 7.5 Templates
**Critérios de aceite:**
- [ ] Templates prontos
- [ ] Customização via UI
- [ ] Exportação completa

---

### ⚫ P8 — Comunidade & Ecossistema
**Horas estimadas:** ~120h | **Dependências:** P7 | **Risco:** Médio

> **Objetivo:** Recursos colaborativos.

#### 8.1 Marketplace
**Critérios de aceite:**
- [ ] Listagem de templates
- [ ] Sistema de ratings
- [ ] Compra/venda (Stripe)

#### 8.2 Avaliações
**Critérios de aceite:**
- [ ] Notas 1-5 estrelas
- [ ] Comentários
- [ ] Moderação

#### 8.3 Compartilhamento
**Critérios de aceite:**
- [ ] Galeria pública
- [ ] Feed recente
- [ ] Filtros

#### 8.4 Versionamento
**Critérios de aceite:**
- [ ] Múltiplas versões
- [ ] Diff entre versões
- [ ] Rollback

---

### 🔘 P9 — Deploy & Infra
**Horas estimadas:** ~60h | **Dependências:** P8 | **Risco:** Baixo

> **Objetivo:** Colocar em produção.

#### 9.1 Versão hospedada
**Critérios de aceite:**
- [ ] Vercel (frontend)
- [ ] Railway/Render (backend)
- [ ] Banco na nuvem (opcional)

#### 9.2 Monitoramento
**Critérios de aceite:**
- [ ] Logs (Loki)
- [ ] Métricas (Prometheus)
- [ ] Alertas (Alertmanager)

#### 9.3 Backup
**Critérios de aceite:**
- [ ] Script semanal
- [ ] Task Scheduler
- [ ] Armazenamento local/cloud

#### 9.4 Restore
**Critérios de aceite:**
- [ ] Documentação passo a passo
- [ ] Script de restore
- [ ] Validação de integridade

---

### 🔷 P10 — Monetização
**Horas estimadas:** ~80h | **Dependências:** P9 | **Risco:** Médio

> **Objetivo:** Recursos pagos.

#### 10.1 Templates premium
**Critérios de aceite:**
- [ ] Templates pagos
- [ ] Licenças
- [ ] Downloads pós-pagamento

#### 10.2 Exportação avançada
**Critérios de aceite:**
- [ ] Sketch, Figma, Adobe XD
- [ ] React/Vue components
- [ ] CSS/SCSS modules

#### 10.3 Suporte enterprise
**Critérios de aceite:**
- [ ] Consultoria
- [ ] Implementação dedicada
- [ ] SLA

#### 10.4 API paga
**Critérios de aceite:**
- [ ] Preço por request
- [ ] Rate limiting
- [ ] Dashboard de uso

---

### 🔶 P11 — Integrações
**Horas estimadas:** ~100h | **Dependências:** P10 | **Risco:** Médio

> **Objetivo:** Plugins e exportações.

#### 11.1 Plugin Figma
**Critérios de aceite:**
- [ ] Importar tokens
- [ ] Criar estilos
- [ ] Sincronização bidirecional

#### 11.2 Plugin VS Code
**Critérios de aceite:**
- [ ] Snippets de tokens
- [ ] Preview em tempo real
- [ ] Validação WCAG

#### 11.3 Export React/Vue
**Critérios de aceite:**
- [ ] Components prontos
- [ ] TypeScript types
- [ ] Storybook integrado

#### 11.4 Export CSS/SCSS
**Critérios de aceite:**
- [ ] Variables CSS
- [ ] Tailwind config
- [ ] Style Dictionary
# Arquitetura do Projeto — Design System com IA

> Documento vivo. Última atualização: 11/09/2026

---

## 1. Visão Geral

### 1.1 O que é
Um sistema **open source**, que roda **localmente** na máquina do usuário, onde a pessoa configura a API de IA de sua preferência (OpenAI, Anthropic, Google, modelo local via Ollama, etc.) e usa a ferramenta para gerar um **branding completo + design system navegável**, sem depender de um SaaS de terceiros nem enviar dados para servidores externos.

### 1.2 Problema que resolve
- Pessoas e pequenos negócios sem verba para contratar um designer não conseguem montar uma identidade visual minimamente consistente.
- Ferramentas existentes (Looka, Brandmark, Uizard, Brandfetch) são SaaS fechados, pagos por assinatura, sem controle sobre dados e sem abrir o "porquê" das decisões.
- Devs/indie hackers precisam de algo que já saia em formato utilizável no código (tokens, CSS, etc.), não só uma imagem bonita.

### 1.3 Para quem é
- Pessoas leigas em design, que não sabem nada sobre cores, tipografia ou acessibilidade, mas precisam de algo pronto e confiável.
- Devs/indie hackers que querem algo rápido, consistente, e que já saia em formato de código.
- Pequenas agências que querem acelerar a etapa inicial de proposta de marca para clientes.

### 1.4 Princípios norteadores
1. **Nada de decisão aleatória.** Toda escolha (cor, fonte, contraste) precisa ter uma justificativa rastreável — regra técnica ou raciocínio da IA, nunca "porque sim".
2. **Determinístico sempre que possível, IA só quando necessário.** Tudo que pode ser calculado com regra/matemática não deve depender de IA (mais rápido, mais barato, mais confiável).
3. **Transparência absoluta.** Sempre explicar o "porquê" por trás de cada escolha, usando indicadores visuais tipo farol (verde/amarelo/vermelho) em vez de números crus.
4. **Open source.** Código acessível, instalado localmente, sem dependência de servidores externos (exceto a API de IA que o usuário configura).
5. **BYOK (Bring Your Own Key).** O usuário usa sua própria chave de API — não há custo de IA para o projeto nemlock-in de provedor.

### 1.5 Stack Técnica
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.12 + FastAPI + SQLite
- **IA:** OpenAI-compatible API (OpenAI, Anthropic, Ollama, etc.)
- **Arquitetura:** Monorepo com frontend e backend em pastas separadas

---

## 2. Estrutura do Projeto

```
omni-route-design/
├── frontend/                    # Next.js + TypeScript + Tailwind
│   ├── app/                     # Pages (React Server Components)
│   │   ├── page.tsx             # Página inicial
│   │   └── globals.css          # Estilos globais
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base (botões, inputs, cards)
│   │   ├── design-system/       # Blocos de UI do design system
│   │   ├── brand/               # Componentes de branding (logo, paleta, tipografia)
│   │   └── shared/              # Componentes reutilizáveis
│   ├── lib/                     # Utilitários
│   │   ├── ai/                  # Cliente de IA (OpenAI compatible)
│   │   ├── tokens/              # Gerenciamento de design tokens
│   │   ├── validation/          # Validações (WCAG, teoria das cores, etc.)
│   │   └── api.ts               # Clientes da API backend
│   ├── public/                  # Assets estáticos
│   └── next.config.js           # Configuração Next.js
│
├── backend/                     # FastAPI + SQLite
│   ├── app/
│   │   ├── main.py              # Entry point
│   │   ├── models/              # Schemas SQLite (Pydantic)
│   │   │   ├── project.py       # Modelo de projeto
│   │   │   ├── brand.py         # Modelo de branding
│   │   │   └── design-system.py # Modelo de design system
│   │   ├── routes/              # Rotas da API
│   │   │   ├── projects.py      # CRUD de projetos
│   │   │   ├── brand.py         # Geração de branding
│   │   │   ├── design-system.py # Geração de design system
│   │   │   └── ai-config.py     # Configuração da IA
│   │   ├── agents/              # Agentes de IA
│   │   │   ├── brand-agent.py   # Agente de branding
│   │   │   ├── palette-agent.py # Agente de paleta de cores
│   │   │   └── typography-agent.py # Agente de tipografia
│   │   └── rules/               # Hub de regras (RAG local)
│   │       ├── color-rules.md   # Regras de cor
│   │       ├── typography-rules.md # Regras de tipografia
│   │       └── ui-rules.md      # Regras de UI
│   ├── requirements.txt         # Dependências Python
│   └── .env.example             # Variáveis de exemplo
│
├── docs/                        # Documentação do projeto
│   ├── especificacao-branding-design-system.md # Spec completa
│   ├── prompt-saas-system-design-ia.md         # Prompt para IA
│   └── Sem título*.txt            # Anotações e ideias
│
├── .env.example                 # Variáveis de ambiente
├── docker-compose.yml           # Opcional (pra quem quer container)
└── README.md                    # Instruções de instalação
```

---

## 3. Arquitetura Detalhada

### 3.1 Frontend (Next.js + TypeScript + Tailwind)

#### 3.1.1 Por que Next.js?
- **SSR/SSG:** Páginas rápidas, SEO-friendly (importante se quiser divulgar o projeto)
- **App Router:** Estrutura moderna, components Server/Client bem definidos
- **TypeScript nativo:** Tipagem forte, melhor DX
- **Comunidade enorme:** Milhares de recursos, templates, bibliotecas

#### 3.1.2 Stack do Frontend
```
@next/bundle-analyzer      # Análise de bundle
@radix-ui/*                # Componentes acessíveis
clsx                       # Classes condicionais
framer-motion              # Animações
lucide-react               # Ícones
tailwindcss                # Estilização utility-first
typescript                 # Tipagem estática
zod                        # Validação de schemas
```

#### 3.1.3 Componentes Principais
- **BrandGenerator:** Formulário guiado para gerar branding
  - Passo 1: Informações do negócio (nome, segmento, tom de voz)
  - Passo 2: Escolha de paleta (com validação WCAG em tempo real)
  - Passo 3: Seleção de tipografia (com preview ao vivo)
  - Passo 4: Geração de logo (SVG ou PNG)
  - Passo 5: Exportação de design tokens

- **DesignSystemViewer:** Visualização do design system
  - Paleta de cores com variáveis CSS
  - Escala tipográfica
  - Componentes de UI (botões, cards, forms, navbar)
  - Preview em modo light/dark

- **TokenExporter:** Exportação de tokens
  - JSON (Design Tokens format)
  - CSS Variables
  - Tailwind Config
  - Style Dictionary

### 3.2 Backend (FastAPI + SQLite)

#### 3.2.1 Por que FastAPI?
- **Async:** Alto desempenho para chamadas de IA
- **Tipagem forte:** Pydantic models para validação automática
- **Docs automáticos:** Swagger/ReDoc inclusos
- **Python 3.12:** Performance e recursos modernos

#### 3.2.2 Stack do Backend
```
fastapi                    # Framework web
uvicorn                    # ASGI server
sqlalchemy                 # ORM (opcional, SQLite direto também funciona)
pydantic                   # Validação de dados
openai                     # Cliente OpenAI
python-dotenv              # Variáveis de ambiente
httpx                      # Client HTTP async
```

#### 3.2.3 Banco de Dados (SQLite)
- **Arquivo local:** `.omni-route-design.db` na pasta do projeto
- **Schema:**
  ```sql
  CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    business_name TEXT,
    segment TEXT,
    tone_of_voice TEXT,
    palette JSON,
    typography JSON,
    logo_svg TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE design_system (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER REFERENCES brands(id),
    tokens JSON,
    components JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### 3.2.4 API Endpoints
```
POST   /api/v1/auth/config        # Configurar IA (BYOK)
GET    /api/v1/projects           # Listar projetos
POST   /api/v1/projects           # Criar projeto
GET    /api/v1/projects/{id}      # Buscar projeto
PUT    /api/v1/projects/{id}      # Atualizar projeto
DELETE /api/v1/projects/{id}      # Deletar projeto

POST   /api/v1/brand/generate     # Gerar branding
POST   /api/v1/brand/validate     # Validar branding (WCAG, etc.)

POST   /api/v1/design-system/generate  # Gerar design system
POST   /api/v1/tokens/export      # Exportar tokens (JSON, CSS, Tailwind)
```

### 3.3 IA (OpenAI-Compatible API)

#### 3.3.1 Configuração BYOK
O usuário configura no `.env`:
```env
# AI Provider (OpenAI, Anthropic, Ollama, etc.)
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-...
AI_MODEL=gpt-4o

# Ou para Ollama local
# AI_PROVIDER=openai
# AI_BASE_URL=http://localhost:11434/v1
# AI_API_KEY=ollama
# AI_MODEL=llama3.2
```

#### 3.3.2 Agentes de IA
Cada agente tem um **system prompt** específico e responde em **JSON estruturado**:

**Agente de Branding:**
```json
{
  "brand_name": "Nome da marca",
  "tagline": "Tagline sugestão",
  "palette": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "accent": "#F59E0B",
    "neutral": "#6B7280",
    "light": "#F9FAFB",
    "dark": "#111827"
  },
  "typography": {
    "heading": "Inter",
    "body": "Inter",
    "mono": "JetBrains Mono"
  },
  "explanation": "Por que essas escolhas?"
}
```

**Agente de Paleta:**
```json
{
  "colors": [
    {
      "name": "Primary",
      "hex": "#3B82F6",
      "contrast": {
        "on-light": "7.5:1",
        "on-dark": "4.6:1"
      },
      "wcag": "AAA"
    }
  ],
  "accessibility": {
    "passes_wca_ag": true,
    "passes_wcag_aa": true
  }
}
```

#### 3.3.3 RAG Local (Hub de Regras)
- **Estrutura:** `.md` por categoria (`color-rules.md`, `typography-rules.md`, etc.)
- **Busca:** Keyword-based (sem embedding, simples e rápido)
- **Uso:** Contexto é injetado no prompt da IA antes da geração

---

## 4. Prioridades (P0, P1, P2)

### 🟢 P0 — MVP (Mínimo Viável)
**Semanas 1-4**

1. **Setup do projeto**
   - Monorepo com frontend/backend
   - Configuração de ambiente (`.env.example`, `requirements.txt`, `package.json`)
   - Docker Compose opcional

2. **Backend básico**
   - CRUD de projetos (SQLite)
   - Endpoints de IA (OpenAI compatible)
   - Validação de input

3. **Frontend básico**
   - Página inicial
   - Formulário de branding (nome, segmento, tom)
   - Exibição de resultados (paleta, tipografia)

4. **Integração IA**
   - Configuração BYOK
   - Agente de branding (system prompt + JSON output)
   - Validação de contraste (WCAG)

5. **Exportação básica**
   - JSON de tokens
   - CSS Variables

### 🟡 P1 — Melhorias (Semanas 5-8)

1. **Design System Viewer**
   - Visualização interativa dos tokens
   - Preview em componentes reais (botões, cards, forms)
   - Toggle light/dark mode

2. **Tipografia avançada**
   - Seleção de fontes (Google Fonts)
   - Escala tipográfica (módulos)
   - Preview ao vivo

3. **Logo simples**
   - Geração de logo tipográfica (texto + fonte)
   - Export SVG
   - Variações (cor, fundo)

4. **Melhorias de UX**
   - Indicadores visuais (farol verde/amarelo/vermelho)
   - Tooltips explicativos
   - Modo simples/avançado

### 🔴 P2 — Avançado (Semanas 9-12)

1. **Vetorização PNG→SVG**
   - Integração com `potrace` ou `vtracer`
   - Upload de logo
   - Processamento e export SVG
   - *Nota: resultado automático é "melhor esforço" para logos complexas*

2. **Design System completo**
   - Blocos de UI (navbar, footer, cards, forms)
   - Preview em layout real
   - Export como Storybook

3. **Comunidade**
   - Banco de paletas contribuídas
   - Banco de combinações de fontes
   - Sistema de templates

4. **Versionamento**
   - Salvar múltiplos versões do projeto
   - Diff entre versões
   - Rollback

### ⚪ P3 — Futuro (Sem data definida)

1. **Versão hospedada**
   - Web app para quem não quer rodar local
   - Misma stack, mas deployed (Vercel + Railway/Render)

2. **Monetização**
   - Templates premium
   - Exportação em formatos extras (Sketch, Figma, Adobe XD)
   - Suporte enterprise

3. **Integrações**
   - Plugin para Figma
   - Plugin para VS Code
   - Export para React/Vue components

---

## 5. Fluxo do Usuário

### 5.1 Instalação
```bash
# 1. Clona o repositório
git clone https://github.com/.../omni-route-design
cd omni-route-design

# 2. Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edita .env com suas keys
uvicorn app.main:app --reload --port 5001

# 3. Frontend (em outro terminal)
cd ../frontend
pnpm install
pnpm dev -- -p 7000

# 4. Acesso
# http://localhost:7000
```

### 5.2 Fluxo de Uso
1. **Configurar IA:** Usuário insere `BASE_URL`, `API_KEY`, `MODEL`
2. **Criar projeto:** Nome do negócio, segmento, tom de voz
3. **Gerar branding:** IA retorna paleta + tipografia + explicação
4. **Validar:** Sistema verifica contraste WCAG, sugere ajustes
5. **Ajustar:** Usuário pode modificar manualmente (modo avançado)
6. **Exportar:** Tokens em JSON, CSS vars, Tailwind config

---

## 6. Regras de Negócio

### 6.1 Validação de Cores
- **WCAG AA:** Contraste mínimo 4.5:1 (texto normal), 3:1 (texto grande)
- **WCAG AAA:** Contraste mínimo 7:1 (texto normal), 4.5:1 (texto grande)
- **Simulação de daltonismo:** Verificar se paleta funciona para deficiências

### 6.2 Tipografia
- **Escala modular:**_RATIO_ 1.25 (módulo base)
- **Line-height:** Mínimo 1.5 para corpo de texto
- **Font pairing:** Máximo 2 famílias tipográficas por projeto

### 6.3 Acessibilidade
- **Contraste:** Sempre validar antes de aprovar
- **Foco visível:** Indicadores de foco em todos os elementos interativos
- **Semântica HTML:** Uso correto de tags (h1-h6, button, nav, etc.)

---

## 7. Testes

### 7.1 Frontend
```bash
# Testes unitários
pnpm test

# Testes de integração
pnpm test:integration

# Testes E2E (Cypress)
pnpm test:e2e
```

### 7.2 Backend
```bash
# Testes unitários
pytest tests/unit

# Testes de integração
pytest tests/integration

# Lint
ruff check .
```

---

## 8. Error Handling & Recovery

### 8.1 Frontend
- **Timeout na IA:** Retry 3x com backoff exponencial, depois mostrar erro claro ao usuário
- **Falha na API backend:** Verificar se serviço está rodando (porta 5001), erro amigável
- **Validação de input:** Zod no client + Pydantic no server, erros em tempo real nos formulários
- **Rede offline:** Detectar offline, cache local (IndexedDB) para visualizar último estado

### 8.2 Backend
- **SQLite corrupto:** Backup automático semanal, restoring via `sqlite3 .backup`
- **IA erro 4xx/5xx:** Log estruturado com código de erro, mensagem clara pro usuário
- **Concorrência (raro em local):** Lock no arquivo `.db` se múltiplas instâncias rodarem
- **Rate limit da IA:** Respeitar headers `Retry-After`, implementar fila local se necessário

### 8.3 Recovery
- **Backup automático:** `.omni-route-design-backup.db` criado toda vez que salvar projeto
- **Restore manual:**
```bash
# Parar o backend (Ctrl+C)
# Restaurar backup
cp .omni-route-design-backup.db .omni-route-design.db
# Iniciar backend novamente
uvicorn app.main:app --reload --port 5001
```

---

## 9. Backup & Restore

### 9.1 O que é backupado
- Arquivo `.omni-route-design.db` (todos os projetos, marcas, design systems)
- Configuração da IA (`.env` — **atenção:** contém API keys, backup seguro se fizer)
- Arquivos exportados pelo usuário (design tokens JSON, CSS vars, Tailwind config)

### 9.2 Como fazer backup
- **Automático:** Script `backup.py` roda toda vez que um projeto é salvo — copia `.db` para `.db.backup`
- **Manual:** Usuário copia `.omni-route-design.db` para pasta segura
- **Agendado (opcional):** Cron job / Task Scheduler semanal

### 9.3 Como restaurar
```bash
# 1. Parar backend
# 2. Restaurar
cp /caminho/do/backup/.omni-route-design.db.backup .omni-route-design.db
# 3. Iniciar backend
uvicorn app.main:app --reload --port 5001
```

---

## 10. Scripts de Setup Automatizado

### 10.1 Setup único (primeira vez)
```bash
# setup.ps1 (Windows)
# setup.sh (Linux/Mac)
# O script faz:
# 1. Cria venv Python no backend
# 2. Instala requirements.txt
# 3. Copia .env.example para .env
# 4. Inicializa SQLite (cria tabelas)
# 5. Instala pnpm dependencies no frontend
# 6. Abre dois terminais: backend (porta 5001) + frontend (porta 7000)
```

### 10.2 Estrutura dos scripts
```
scripts/
├── setup.ps1          # Windows PowerShell
├── setup.sh           # Linux/Mac Bash
├── backup.py          # Backup automático do SQLite
├── restore.py         # Restore de backup
└── dev.ps1            # Inicia dev servers (backend + frontend)
```

---

## 11. Versionamento & Changelog

### 11.1 Versionamento Semântico (SemVer)
- **MAJOR:** Breaking changes na API, schema do DB, ou formato de tokens
- **MINOR:** Novas features (ex: novo agente, nova exportação) sem breaking changes
- **PATCH:** Bug fixes, docs, ajustes visuais

### 11.2 Changelog
- Arquivo `CHANGELOG.md` na raiz do projeto
- Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- Entradas por versão com data, categorias: Added, Changed, Deprecated, Removed, Fixed, Security

### 11.3 Tags Git
- Tag em cada release: `v1.0.0`, `v1.1.0`, etc.
- `main` sempre deployável (versão estável)

---

## 12. Guia de Contribuição (CONTRIBUTING.md)

### 12.1 Como contribuir
1. Fork do repositório
2. Branch: `feature/nome-da-feature` ou `fix/nome-do-bug`
3. Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
4. PR com descrição clara + screenshots se UI
5. Testes passam (CI roda automaticamente)

### 12.2 Code Style
- **Frontend:** ESLint + Prettier (config no repo)
- **Backend:** Ruff (lint + format)
- **TypeScript:** Strict mode
- **Python:** Type hints obrigatórios em funções públicas

### 12.3 Reportar Bug
- Use template de Issue no GitHub
- Incluir: passos para reproduzir, esperado vs atual, logs/erros

### 12.4 Propor Feature
- Abra Issue com label `enhancement`
- Descreva: problema, solução proposta, alternativas consideradas

---

## 13. Segurança

Como é local e BYOK:
- **Nenhuma credencial é enviada para servidores externos** (exceto a API de IA configurada pelo usuário)
- **Arquivo `.db` fica local** — nunca é enviado para nuvem
- **`.env` nunca é commitado** — usar `.env.example`
- **Rate limiting:** Respeitar limites da API de IA configurada
- **Input sanitization:** Zod (frontend) + Pydantic (backend) em todos inputs

---

## 14. Próximos Passos

1. [ ] Criar repositório no GitHub
2. [ ] Setup do monorepo (frontend/backend)
3. [ ] Implementar scripts de setup (`scripts/setup.ps1`, `scripts/setup.sh`)
4. [ ] Implementar MVP (P0)
5. [ ] Testar com usuários reais
6. [ ] Coletar feedback
7. [ ] Implementar P1
8. [ ] Documentar uso (README, CONTRIBUTING, CHANGELOG)
9. [ ] Divulgar projeto

---

## 15. Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)

---

**Documento criado por:** Gabriel (OmniRoute)  
**Baseado em:** Anotações de design_system/docs/  
**Versão:** 2.0
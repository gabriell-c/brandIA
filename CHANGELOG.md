# Changelog

Todos os lançamentos notáveis deste projeto serão documentados neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Configuração inicial do monorepo
- Backend FastAPI com estrutura básica
- Frontend Next.js com TypeScript
- Integração com IA (OpenAI, Anthropic, Ollama)
- Validação WCAG para acessibilidade
- Exportação de tokens de design

### Alterado
- (Nenhum ainda)

### Removido
- (Nenhum ainda)

### Corrigido
- (Nenhum ainda)

### Segurança
- (Nenhuma vulnerabilidade conhecida)

---

## [0.1.0] - 2026-09-14

### Adicionado
- **Estrutura do projeto**
  - Monorepo com frontend e backend organizados
  - `.gitignore` configurado para Python e Node.js
  - Arquivos de configuração inicial

- **Backend (FastAPI)**
  - Configuração do banco SQLite
  - Routers para projetos, branding e AI config
  - Modelos e schemas Pydantic
  - Integration com agentes de IA
  - Endpoints de API documentados via Swagger

- **Frontend (Next.js)**
  - Estrutura de componentes
  - Integração com a API backend
  - Configuração Tailwind CSS
  - Tipagem TypeScript

- **Documentação**
  - README com instruções de instalação
  - Especificação do sistema de branding
  - Prompt para sistema de design IA
  - Arquitetura do design system

- **Configuração de Ambiente**
  - `.env.example` com variáveis documentadas
  - `requirements.txt` com dependências fixadas
  - `package.json` com scripts utilitários
  - `tsconfig.json` com strict mode

- **Docker**
  - Dockerfile para backend
  - Dockerfile para frontend
  - docker-compose.yml para ambiente local

- **CI/CD**
  - Workflow GitHub Actions
  - Jobs de lint, teste e build
  - Scanning de segurança com Trivy

- **Qualidade de Código**
  - Configuração Ruff para Python
  - Configuração ESLint para TypeScript
  - Configuração Prettier
  - Configuração pytest

### Segurança
- Adicionado scanning de vulnerabilidades com Trivy
- Variáveis sensíveis nunca commitadas (.gitignore)

---

## [0.0.1] - 2026-09-11

### Adicionado
- Primeiros commits do projeto
- Estrutura básica de diretórios
- Configuração inicial do repositório

---

## Comparação de Versões

[Unreleased]: https://github.com/your-username/omni-route-design/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/omni-route-design/releases/tag/v0.1.0
[0.0.1]: https://github.com/your-username/omni-route-design/releases/tag/v0.0.1

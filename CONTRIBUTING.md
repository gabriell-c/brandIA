# Contributing to OmniRoute Design System

Obrigado por considerar contribuir para o OmniRoute Design System! Este documento fornece diretrizes para contribuir com o projeto.

## Códido de Conduta

Este projeto adota o Código de Conduta de Contribuidores. Ao participar, você deve manter este código.

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado buscando nos issues existentes
2. Crie um novo issue com o template preenchido
3. Inclua passos para reproduzir o problema
4. Adicione informações sobre seu ambiente (OS, navegador, etc.)

### Sugerindo Melhorias

1. Crie um issue descrevendo a melhoria sugerida
2. Explique o problema que a melhoria resolve
3. Seja específico sobre a implementação desejada

### Contribuindo com Código

#### Fluxo de Trabalho

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua contribuição:
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```
4. **Faça suas alterações** seguindo as convenções do projeto
5. **Faça commits** seguindo o padrão Conventional Commits:
   ```
   feat: add new branding agent
   fix: resolve palette generation bug
   docs: update README with installation steps
   test: add unit tests for API endpoints
   ```
6. **Push** sua branch:
   ```bash
   git push origin feature/nome-da-feature
   ```
7. **Abra um Pull Request** descrevendo suas alterações

#### Convenções de Código

**Backend (Python):**
- Siga PEP 8
- Use type hints
- Mantenha funções com no máximo 50 linhas
- Adicione docstrings em todas as funções/classes
- Use ruff para linting

```bash
# No backend
ruff check .
ruff format .
```

**Frontend (TypeScript/Next.js):**
- Siga as convenções do Next.js
- Use TypeScript strict mode
- Componentes funcionais com hooks
- ESLint e Prettier configurados

```bash
# No frontend
pnpm lint
pnpm format
```

#### Testes

- **Backend:** pytest
  ```bash
  cd backend
  pytest tests/ -v
  ```

- **Frontend:** Jest + React Testing Library
  ```bash
  cd frontend
  pnpm test
  ```

#### Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[fim opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem alteração de código)
- `refactor`: Refatoração
- `test`: Adição ou modificação de testes
- `chore`: Manutenção de build/tasks

**Exemplos:**
```
feat(branding): add palette generation agent
fix(api): resolve CORS issue in production
docs(readme): update installation guide
```

#### Pull Requests

1. Atualize a documentação se necessário
2. Adicione testes para suas alterações
3. Garanta que todos os testes passem
4. Mantenha o PR focado em uma única mudança
5. Descreva claramente o que foi feito e por quê

### Review de Código

Todos os PRs precisam de review de pelo menos um mantenedor. Os revisores verificarão:

- Qualidade do código
- Cobertura de testes
- Conformidade com as convenções
- Segurança e performance

## Dependências

Adicione dependências apenas quando necessário:

**Backend:**
```bash
pip install <package>
# Adicione ao requirements.txt
pip freeze > requirements.txt
```

**Frontend:**
```bash
cd frontend
pnpm add <package>
```

## Issues

- Use labels para categorizar issues
- Vincule issues a PRs quando relevante
- Responda aos comentários nos PRs

## Comunicação

- Mantenha uma comunicação respeitosa
- Explique seu raciocínio nas decisões
- Seja aberto a feedback

## Reconhecimento

Contribuidores ativos serão reconhecidos no README do projeto.

---

Agradecemos por ajudar a tornar o OmniRoute Design System melhor! 🚀

#### 3.3.3 RAG Local (Hub de Regras)
- **Estrutura:** `.md` por categoria (`color-rules.md`, `typography-rules.md`, etc.)
- **Busca:** Keyword-based (sem embedding, simples e rápido)
- **Uso:** Contexto é injetado no prompt da IA antes da geração

---

## 4. Roadmap de Prioridades — Dividir e Conquistar

> Cada P representa um bloco de funcionalidades. Complete cada P antes de avançar para o próximo.

---

### 🟢 P1 — Fundações do Projeto
**Horas estimadas:** ~80h | **Dependências:** Nenhuma | **Risco:** Baixo

> **Por que este bloco é importante:** Todo projeto grande começa com uma base sólida. Sem isso, problemas de organização, configuração e documentação vão acumularem e dificultarão cada etapa seguinte. O P1 estabelece os alicerces: estrutura de pastas, configurações de ambiente, containerização, pipeline de CI/CD e documentação básica.

#### 1.1 Setup do monorepo
**O que é:** Definir a arquitetura de diretórios que vai organizar todo o código-fonte do projeto.

**Por que fazer:** Uma estrutura clara desde o início evita confusão futura, facilita a colaboração e permite que novas funcionalidades sejam adicionadas sem desorganizar o código existente. O monorepo (frontend + backend em um único repositório) simplifica o desenvolvimento, pois permite que mudanças em uma parte do sistema sejam vistas e testadas em conjunto.

**O que se espera alcançar:**
- Todos os desenvolvedores sabem onde encontrar cada arquivo
- Novos membros do time conseguem navegar pelo projeto sem dificuldade
- A estrutura escala naturalmente conforme o projeto cresce
- Arquivos desnecessários (como `node_modules` e `venv`) ficam fora do controle de versão

**Entregáveis:**
- Pastas organizadas: `frontend/`, `backend/`, `docs/`, `prompt/`, `scripts/`
- `.gitignore` configurado corretamente
- README inicial com visão geral do projeto
- LICENSE MIT adicionado

---

#### 1.2 Configuração de ambiente
**O que é:** Preparar todos os arquivos de configuração necessários para que o projeto rode tanto em desenvolvimento quanto em produção.

**Por que fazer:** Sem configurações adequadas, o projeto não consegue iniciar ou funciona de forma inconsistente entre diferentes máquinas. Variáveis de ambiente, dependências versionadas e scripts de desenvolvimento são essenciais para reproducibilidade.

**O que se espera alcançar:**
- Qualquer pessoa consegue rodar o projeto localmente seguindo instruções claras
- Variáveis sensíveis (como API keys) nunca são commitadas
- Scripts de desenvolvimento (dev, build, test) funcionam corretamente
- Configurações de lint e format padronizadas

**Entregáveis:**
- `.env.example` documentado com todas as variáveis
- `requirements.txt` com versões fixas
- `package.json` com scripts utilitários
- `tsconfig.json` com strict mode
- Configurações de lint (Ruff, ESLint, Prettier)

---

#### 1.3 Docker Compose (opcional)
**O que é:** Containerização do projeto para facilitar setup em qualquer máquina.

**Por que fazer:** Containers garantem que o projeto rode da mesma forma em qualquer ambiente — desenvolvimento, teste, produção. Isso elimina o famoso "na minha máquina funciona".

**O que se espera alcançar:**
- Setup em novos computadores em menos de 5 minutos
- Isolamento de dependências (Python, Node, etc.)
- Facilidade para contribuidores testarem o projeto
- Preparação para deploy em cloud

**Entregáveis:**
- `docker-compose.yml` com serviços backend e frontend
- `Dockerfile.backend` e `Dockerfile.frontend`
- Rede e volumes configurados
- Health checks para monitoramento

---

#### 1.4 CI/CD inicial
**O que é:** Pipeline automatizado de integração contínua e entrega contínua.

**Por que fazer:** Automatizar testes e validações garante que código novo não quebre funcionalidades existentes. O CI/CD é essencial para manter a qualidade do código em projetos que crescem.

**O que se espera alcançar:**
- Lint e testes rodam automaticamente em cada push
- Build do frontend é validado antes de merge
- Vulnerabilidades em dependências são detectadas
- Status do pipeline é visível no README

**Entregáveis:**
- `.github/workflows/ci.yml` configurado
- Jobs de lint, teste e build
- Badge de status no README
- Scanning de segurança com Trivy

---

#### 1.5 Documentação inicial
**O que é:** Documentação básica para uso e contribuição no projeto.

**Por que fazer:** Documentação clara permite que outros desenvolvedores (e você no futuro) entendam o projeto rapidamente. Sem ela, cada nova pessoa leva tempo demais para se integrar.

**O que se espera alcançar:**
- Novo desenvolvedor consegue rodar o projeto em 10 minutos
- Contribuidores sabem como fazer PRs
- API é documentada automaticamente via Swagger
- Decisões de arquitetura estão registradas

**Entregáveis:**
- `README.md` completo com instalação, uso, configuração
- `CONTRIBUTING.md` com guia de contribuição
- `CHANGELOG.md` com formato Keep a Changelog
- Swagger/ReDoc automático na API

---

### 🟡 P2 — Backend Core
**Horas estimadas:** ~160h | **Dependências:** P1 | **Risco:** Baixo

> **Por que este bloco é importante:** O backend é o coração do sistema. É ele que gerencia dados, processa solicitações e orquestra as chamadas de IA. Sem um backend sólido, não há funcionalidade — apenas uma interface bonita sem capacidade real.

#### 2.1 Modelos de dados
**O que é:** Definir as entidades do domínio do projeto: Projetos, Marcas e Design Systems.

**Por que fazer:** Modelos bem definidos garantem integridade dos dados, facilitam consultas e permitem expansão futura. Cada entidade representa um conceito importante do domínio de branding e design.

**O que se espera alcançar:**
- Dados organizados e relacionais
- Integridade referencial ( CASCADE DELETE)
- Consultas eficientes com índices
- Extensibilidade para novas entidades

**Entregáveis:**
- Tabelas SQL: `projects`, `brands`, `design_system`
- Models Pydantic para validação
- Relacionamentos FOREIGN KEY configurados
- Migrações automáticas

---

#### 2.2 Database
**O que é:** Configurar a camada de acesso ao banco de dados SQLite de forma assíncrona.

**Por que fazer:** SQLite é simples, portátil e não requer servidor separado. A versão assíncrona permite que o FastAPI lide com múltiplas requisições sem bloquear.

**O que se espera alcançar:**
- Conexões eficientes com pool de sessões
- Migrations automáticas ao iniciar
- Transparência para o desenvolvedor (ORM simplificado)
- Backup/restauração simples

**Entregáveis:**
- `database.py` com AsyncEngine e session maker
- `get_db()` dependency injetável
- Inicialização automática de tabelas
- Conexão testada e funcionando

---

#### 2.3 Rotas de Projetos
**O que é:** CRUD completo para gerenciar projetos de branding.

**Por que fazer:** Projetos são a unidade principal de organização. Cada usuário pode ter múltiplos projetos (ex: um para cada cliente ou negócio). O CRUD permite criar, listar, atualizar e deletar projetos.

**O que se espera alcançar:**
- Interface para gerenciar projetos
- Validação de inputs
- Tratamento de erros claro
- Ordenação por data de criação

**Entregáveis:**
- `GET /api/v1/projects` — lista projetos
- `POST /api/v1/projects` — cria projeto
- `GET /api/v1/projects/{id}` — busca projeto
- `PUT /api/v1/projects/{id}` — atualiza projeto
- `DELETE /api/v1/projects/{id}` — deleta projeto

---

#### 2.4 Rotas de Branding
**O que é:** Endpoints para gerar e validar branding usando IA.

**Por que fazer:** Esta é a funcionalidade principal do sistema. O usuário fornece informações sobre seu negócio e recebe uma proposta de branding completa (paleta, tipografia, explicação).

**O que se espera alcançar:**
- Geração de branding via IA
- Validação de contraste WCAG
- Explicação das escolhas feitas
- Persistência no banco de dados

**Entregáveis:**
- `POST /api/v1/brand/generate` — gera branding
- `POST /api/v1/brand/validate` — valida WCAG
- `GET /api/v1/brand/{id}` — busca marca
- Response com palette, typography e explicação

---

#### 2.5 Rotas de AI Config (BYOK)
**O que é:** Configuração da API de IA pelo usuário (Bring Your Own Key).

**Por que fazer:** O sistema é BYOK — o usuário fornece sua própria chave de API. Isso evita custos para o projeto e dá controle total ao usuário sobre quais modelos e provedores usar.

**O que se espera alcançar:**
- Configuração segura de credenciais
- Criptografia das API keys
- Validação de conectividade
- Remoção segura de configurações

**Entregáveis:**
- `POST /api/v1/ai-config` — salva configuração
- `GET /api/v1/ai-config` — retorna status
- `DELETE /api/v1/ai-config` — remove configuração
- Criptografia Fernet das credenciais

---

#### 2.6 Validação de input
**O que é:** Validação de todos os dados de entrada usando Pydantic.

**Por que fazer:** Validação preventiva evita erros em tempo de execução e fornece feedback claro ao usuário. É a primeira linha de defesa contra dados malformados.

**O que se espera alcançar:**
- Mensagens de erro claras em português
- Validação de tipos, tamanhos, padrões
- Feedback imediato para o usuário
- Prevenção de injeções e dados maliciosos

**Entregáveis:**
- Schemas Pydantic em `app/schemas.py`
- Validações com regex, min/max length
- Mensagens de erro customizadas
- Testes de validação passando

---

#### 2.7 Error handling padronizado
**O que é:** Tratamento centralizado de erros em toda a API.

**Por que fazer:** Erros bem tratados melhoram a experiência do usuário e facilitam debugging. Um padrão consistente evita que erros fiquem escondidos ou causem crashes.

**O que se espera alcançar:**
- Respostas de erro consistentes
- Logs estruturados para debugging
- Stack traces apenas em modo debug
- Feedback amigável ao usuário

**Entregáveis:**
- Exception handlers globais
- Logger estruturado em JSON
- Respostas de erro com `detail` e `type`
- Tratamento de exceptions de IA

---

#### 2.8 CORS + middleware
**O que é:** Configuração de Cross-Origin Resource Sharing e middlewares essenciais.

**Por que fazer:** CORS permite que o frontend (porta 7000) faça requisições ao backend (porta 5001). Middlewares adicionam funcionalidades transversais como logging, rate limiting e segurança.

**O que se espera alcançar:**
- Comunicação frontend-backend funcionando
- Segurança contra ataques cross-origin
- Rate limiting para proteger a API
- Logging de todas as requisições

**Entregáveis:**
- `CORSMiddleware` configurado
- Permitir apenas `localhost:7000`
- Rate limiting (100 requests/minute)
- Middleware de logging

---

### 🔵 P3 — Frontend Core
**Horas estimadas:** ~120h | **Dependências:** P1 | **Risco:** Baixo

> **Por que este bloco é importante:** O frontend é a interface com o usuário. Mesmo com um backend perfeito, se a interface for confusa ou lenta, o projeto falha. O P3 estabelece a base da experiência do usuário.

#### 3.1 Página inicial (landing)
**O que é:** A primeira tela que o usuário vê ao acessar o sistema.

**Por que fazer:** É a vitrine do projeto. Deve comunicar rapidamente o valor do sistema e direcionar o usuário para a ação principal (começar um branding).

**O que se espera alcançar:**
- Primeira impressão positiva
- Comunicação clara do propósito
- Call-to-action evidente
- Responsivo para todos os dispositivos

**Entregáveis:**
- Hero section com headline e CTA
- Features highlights (3 cards)
- Footer com links úteis
- Design responsivo

---

#### 3.2 Formulário de branding
**O que é:** Formulário guiado em múltiplos passos para coletar informações do negócio.

**Por que fazer:** O usuário precisa informar sobre seu negócio para que a IA possa gerar um branding relevante. O formulário em passos reduz a carga cognitiva e guia o usuário.

**O que se espera alcançar:**
- Coleta de informações essencial
- Validação em tempo real
- Preview ao vivo das escolhas
- Navegação intuitiva entre passos

**Entregáveis:**
- 3 passos: informações, paleta, tipografia
- Progress bar visual
- Validação Zod em cada campo
- Botões voltar/próximo

---

#### 3.3 Display de resultados
**O que é:** Tela que exibe o branding gerado pela IA.

**Por que fazer:** É o momento de valor — o usuário vê o resultado do trabalho da IA. Deve ser claro, organizado e inspirador.

**O que se espera alcançar:**
- Visualização clara da paleta
- Escala tipográfica apresentada
- Explicação das escolhas
- Opções de exportação

**Entregáveis:**
- Paleta de cores com hex codes
- Escala tipográfica visual
- Texto explicativo da IA
- Botões de exportação

---

#### 3.4 Componentes UI básicos
**O que é:** Biblioteca de componentes reutilizáveis (botões, inputs, cards, modais).

**Por que fazer:** Componentes padronizados garantem consistência visual e aceleram o desenvolvimento. Reutilizar componentes evita duplicação de código.

**O que se espera alcançar:**
- Interface consistente em toda a aplicação
- Desenvolvimento mais rápido
- Facilidade de manutenção
- Acessibilidade implementada

**Entregáveis:**
- Button (primary, secondary, ghost)
- Input + Label + Error message
- Card (info, success, warning, error)
- Modal genérico

---

#### 3.5 Validação de input
**O que é:** Validação de formulários no cliente usando Zod.

**Por que fazer:** Validação no cliente fornece feedback imediato, melhorando a experiência do usuário e reduzindo requisições desnecessárias ao servidor.

**O que se espera alcançar:**
- Feedback em tempo real
- Mensagens de erro claras
- Prevenção de envio de dados inválidos
- Experiência fluida

**Entregáveis:**
- Schemas Zod no client
- Erros exibidos inline
- Feedback visual (bordas vermelhas)
- Prevenção de submit inválido

---

#### 3.6 Cliente API
**O que é:** Camada de comunicação com o backend (funções typed).

**Por que fazer:** Abstrair as chamadas HTTP em funções typed melhora a manutenibilidade e evita erros de tipagem.

**O que se espera alcançar:**
- Código limpo e tipo-seguro
- Error handling centralizado
- Retry automático em falhas
- Types gerados dos schemas

**Entregáveis:**
- `lib/api.ts` com funções typed
- Error handling com retry
- Timeout de 30s
- Types gerados dos schemas

---

#### 3.7 Navegação
**O que é:** Sistema de rotas e navegação do Next.js.

**Por que fazer:** Navegação clara permite que o usuário explore todas as funcionalidades do sistema sem se perder.

**O que se espera alcançar:**
- Rotas bem definidas
- Navegação intuitiva
- Estado ativo visível
- Loading states

**Entregáveis:**
- Rotas: `/`, `/brand`, `/design-system`, `/export`
- Link components
- Active state
- Loading skeletons

---

#### 3.8 Layout base
**O que é:** Estrutura visual comum a todas as páginas (navbar, footer, theme).

**Por que fazer:** Layout consistente proporciona experiência profissional e familiaridade para o usuário.

**O que se espera alcançar:**
- Navbar responsiva
- Footer com links
- Toggle dark/light mode
- Transições suaves

**Entregáveis:**
- Navbar responsivo
- Footer
- Theme provider (dark/light)
- Transições CSS suaves

---

### 🟣 P4 — Integração IA
**Horas estimadas:** ~200h | **Dependências:** P2, P3 | **Risco:** Médio

> **Por que este bloco é importante:** A IA é o diferencial do projeto. Sem ela, o sistema seria apenas um gerador aleatório de cores. Os agentes de IA são quem entendem o contexto do negócio e geram sugestões relevantes.

#### 4.1 Cliente OpenAI compatible
**O que é:** Camada de abstração que permite usar diferentes provedores de IA (OpenAI, Anthropic, Ollama).

**Por que fazer:** A flexibilidade de provedor é essencial — alguns usuários preferem OpenAI, outros querem usar modelos locais via Ollama para privacidade.

**O que se espera alcançar:**
- Suporte a múltiplos provedores
- Configuração BYOK
- Timeout e retry configuráveis
- Padronização de interfaces

**Entregáveis:**
- Cliente HTTP com httpx
- Suporte OpenAI, Anthropic, Ollama
- Timeout de 30s
- Retry 3x com backoff exponencial

---

#### 4.2 Agente de branding
**O que é:** Agente de IA especializado em gerar propostas completas de branding.

**Por que fazer:** Este é o agente principal — ele recebe informações do negócio e gera paleta, tipografia e explicação das escolhas.

**O que se espera alcançar:**
- Branding coerente com o negócio
- Explicação das decisões de design
- JSON estruturado e validado
- Qualidade consistente

**Entregáveis:**
- System prompt otimizado
- Output JSON: palette, typography, explanation
- Validação do response
- Explicação das escolhas

---

#### 4.3 Agente de paleta
**O que é:** Agente especializado em gerar paletas de cores acessíveis.

**Por que fazer:** Cores são fundamentais para identidade visual. O agente garante que as cores sejam harmoniosas e acessíveis (WCAG).

**O que se espera alcançar:**
- 6 cores harmoniosas
- Contraste WCAG válido
- Sugestões de ajustes
- Nomes descritivos para cores

**Entregáveis:**
- Geração de palette completa
- Cálculo de contraste WCAG
- Validação de acessibilidade
- Sugestões de melhorias

---

#### 4.4 Agente de tipografia
**O que é:** Agente especializado em selecionar combinações de fontes.

**Por que fazer:** Tipografia correta transmite a personalidade da marca. O agente escolhe fontes que combinam entre si e são adequadas ao segmento.

**O que se espera alcançar:**
- 3 fontes harmoniosas (heading, body, mono)
- Font pairing válido
- Escala tipográfica modular
- Preview ao vivo

**Entregáveis:**
- Seleção de 3 fontes
- Validação de pairing
- Escala modular (ratio 1.25)
- Preview em tempo real

---

#### 4.5 RAG local
**O que é:** Sistema de busca por regras locais em arquivos Markdown.

**Por que fazer:** Regras locais garantem que a IA siga princípios de design estabelecidos, sem depender de treinamento prévio ou dados externos.

**O que se espera alcançar:**
- Regras de cor, tipografia e UI em `.md`
- Busca keyword-based rápida
- Contexto injetado nos prompts
- Transparência nas decisões

**Entregáveis:**
- `rules/color-rules.md`
- `rules/typography-rules.md`
- `rules/ui-rules.md`
- Busca keyword-based

---

#### 4.6 Retry logic
**O que é:** Mecanismo de retry com backoff exponencial para chamadas de IA.

**Por que fazer:** APIs de IA podem falhar temporariamente (rate limit, timeout). Retry com backoff evita frustração do usuário e aumenta a confiabilidade.

**O que se espera alcançar:**
- Máximo 3 tentativas
- Backoff exponencial (1s, 2s, 4s)
- Timeout de 30s
- Falha clara ao usuário

**Entregáveis:**
- Retry 3x com backoff
- Timeout configurável
- Log de tentativas
- Mensagem de erro clara

---

#### 4.7 Logging estruturado
**O que é:** Registro de todas as interações com a IA em formato estruturado.

**Por que fazer:** Logs permitem debugging, monitoramento de uso e melhoria contínua dos prompts.

**O que se espera alcançar:**
- Logs de requests/responses
- Tempo de resposta
- Códigos de erro
- Métricas de uso

**Entregáveis:**
- Logger estruturado (JSON)
- Tempo de resposta
- Códigos de erro da API
- Métricas de uso

---

### 🟠 P5 — Validação & UX
**Horas estimadas:** ~80h | **Dependências:** P4 | **Risco:** Baixo

> **Por que este bloco é importante:** Validações e UX são o que transformam um prototype funcional em produto confiável. O usuário precisa ter confiança de que o branding gerado é válido e acessível.

#### 5.1 Validador WCAG
**O que é:** Verificador de conformidade com diretrizes de acessibilidade web.

**Por que fazer:** Acessibilidade não é opcional. Produtos que não seguem WCAG excluem usuários com deficiência e podem sofrer consequências legais.

**O que se espera alcançar:**
- Contraste válido (AA e AAA)
- Simulação de daltonismo
- Feedback visual imediato
- Explicação do problema

**Entregáveis:**
- Validador de contraste
- Simulação de deficiências visuais
- Indicadores verdes/amarelos/vermelhos
- Explicações claras

---

#### 5.2 Indicadores visuais (farol)
**O que é:** Sistema de indicadores visuais tipo "semáforo" para feedback rápido.

**Por que fazer:** Indicadores visuais permitem que o usuário entenda rapidamente o status de cada validação sem precisar ler detalhes técnicos.

**O que se espera alcançar:**
- Feedback instantâneo
- Ícones intuitivos
- Tooltips explicativos
- Posição contextual

**Entregáveis:**
- Ícone + cor para cada validação
- Tooltip com explicação
- Posição inline nos campos
- Animação de transição

---

#### 5.3 Tooltips explicativos
**O que é:** Textos de ajuda que explicam o propósito de cada campo.

**Por que fazer:** Usuários leigos em design não sabem o que são "segmento" ou "tom de voz". Tooltips educam e guiam.

**O que se espera alcançar:**
- Explicação clara de cada campo
- Links para recursos externos
- Contexto sobre o "porquê"
- Linguagem acessível

**Entregáveis:**
- Help text em cada campo
- Links para documentação
- Explicações do "porquê"
- Linguagem simples

---

#### 5.4 Modo simples/avançado
**O que é:** Toggle que alterna entre interface simplificada e controle total.

**Por que fazer:** Usuários iniciantes precisam de defaults otimizados. Usuários avançados querem controle total sobre cada parâmetro.

**O que se espera alcançar:**
- Interface adaptativa
- Defaults inteligentes para iniciantes
- Controle granular para avançados
- Persistência da preferência

**Entregáveis:**
- Toggle no header
- Simples: defaults otimizados
- Avançado: todos os parâmetros
- Persistência no localStorage

---

#### 5.5 Feedback em tempo real
**O que é:** Atualizações instantâneas conforme o usuário interage.

**Por que fazer:** Feedback imediato mantém o usuário engajado e evita frustração de esperar por respostas do servidor.

**O que se espera alcançar:**
- Validação após cada input
- Loading states claros
- Erros amigáveis
- Preview ao vivo

**Entregáveis:**
- Validação em tempo real
- Skeletons de loading
- Mensagens de erro claras
- Preview atualizado instantaneamente

---

### 🟤 P6 — Design System Viewer
**Horas estimadas:** ~100h | **Dependências:** P5 | **Risco:** Baixo

> **Por que este bloco é importante:** O viewer permite que o usuário explore, entenda e exporte o design system gerado. É a ponte entre a geração e o uso prático.

#### 6.1 Visualização de tokens
**O que é:** Exibição dos design tokens em formatos legíveis.

**Por que fazer:** Tokens são a base técnica do design system. Visualizá-los ajuda o usuário a entender e customizar.

**O que se espera alcançar:**
- JSON preview
- CSS Variables preview
- Tailwind Config preview
- Estrutura clara

**Entregáveis:**
- Visualização em árvore
- Preview de CSS vars
- Preview de Tailwind config
- Formatação colorida

---

#### 6.2 Preview de componentes
**O que é:** Demonstração dos componentes UI usando o design system.

**Por que fazer:** Ver os componentes em ação ajuda o usuário a entender como o design system se aplica na prática.

**O que se espera alcançar:**
- Todos os componentes visíveis
- Variações apresentadas
- Contexto de uso
- Interatividade

**Entregáveis:**
- Botões (todos variants)
- Cards (todos tipos)
- Forms (todos inputs)
- Navbar, Footer

---

#### 6.3 Toggle dark/light
**O que é:** Alternância entre temas claro e escuro.

**Por que fazer:** Temas permitem que o design system seja avaliado em diferentes contextos visuais.

**O que se espera alcançar:**
- Alternação suave
- Persistência da escolha
- Preview em ambos os temas
- Transições elegantes

**Entregáveis:**
- Theme provider
- Persistência no localStorage
- Transições CSS suaves
- Preview em tempo real

---

#### 6.4 Exportação de tokens
**O que é:** Download dos design tokens em formatos utilizáveis.

**Por que fazer:** O valor real do sistema está em poder usar o design system gerado em projetos reais.

**O que se espera alcançar:**
- Múltiplos formatos
- Prontas para uso
- Documentação inclusa
- Download único ou seletivo

**Entregáveis:**
- JSON (Design Tokens format)
- CSS Variables
- Tailwind Config
- Style Dictionary

---

#### 6.5 Storybook
**O que é:** Documentação interativa dos componentes.

**Por que fazer:** Storybook é o padrão da indústria para documentação de componentes. Permite explorar cada variant e entender o uso correto.

**O que se espera alcançar:**
- Todos os componentes documentados
- Stories para cada variant
- Controls para testar props
- Docs automáticos

**Entregáveis:**
- Documentação de componentes
- Stories para cada variant
- Controls interativos
- Examples de uso

---

### 🔴 P7 — Features Avançadas
**Horas estimadas:** ~160h | **Dependências:** P6 | **Risco:** Médio

> **Por que este bloco é importante:** Features avançadas diferenciam o projeto de alternativas básicas e adicionam valor para usuários mais exigentes.

#### 7.1 Vetorização PNG→SVG
**O que é:** Conversão de logos rasterizadas (PNG) para vetoriais (SVG).

**Por que fazer:** Logos vetoriais são escaláveis e profissionais. A vetorização automática é um diferencial importante.

**O que se espera alcançar:**
- Upload de logo PNG
- Processamento automático
- Export SVG
- Resultado aceitável (melhor esforço)

**Entregáveis:**
- Integração com potrace/vtracer
- Upload de imagem
- Processamento backend
- Download SVG

---

#### 7.2 Logo tipográfica
**O que é:** Geração de logos baseadas em texto + tipografia.

**Por que fazer:** Logos tipográficas são comuns e eficazes para pequenos negócios. Não requerem designer profissional.

**O que se espera alcançar:**
- Texto + fonte selecionada
- Variações de cor e fundo
- Export em múltiplos formatos
- Preview em contexto real

**Entregáveis:**
- Renderização de texto
- Variações (cor, fundo)
- Export SVG/PNG
- Preview em mockups

---

#### 7.3 Banco de paletas
**O que é:** Coleção de paletas contribuídas pela comunidade.

**Por que fazer:** Inspirar usuários com paletas existentes e permitir compartilhamento de conhecimento.

**O que se espera alcançar:**
- Paletas de exemplo
- Rating e comentários
- Filtros por cor/segmento
- Contribuição da comunidade

**Entregáveis:**
- CRUD de paletas
- Sistema de ratings
- Filtros avançados
- Comentários

---

#### 7.4 Banco de fontes
**O que é:** Coleção de combinações de fontes testadas e aprovadas.

**Por que fazer:** Font pairing é difícil para não-designers. Banco de combinações testadas economiza tempo.

**O que se espera alcançar:**
- Combinações pré-testadas
- Preview ao vivo
- Rating da comunidade
- Filtros por estilo

**Entregáveis:**
- Font pairing sugerido
- Preview interativo
- Sistema de ratings
- Filtros por estilo

---

#### 7.5 Templates
**O que é:** Designs prontos para segmentos comuns (blog, portfolio, e-commerce).

**Por que fazer:** Usuários podem começar rapidamente com templates em vez de começar do zero.

**O que se espera alcançar:**
- Templates para segmentos comuns
- Customização via UI
- Exportação completa
- Preview em contexto real

**Entregáveis:**
- Templates prontos
- Customização visual
- Exportação completa
- Preview em mockups

---

### ⚫ P8 — Comunidade & Ecossistema
**Horas estimadas:** ~120h | **Dependências:** P7 | **Risco:** Médio

> **Por que este bloco é importante:** Comunidade transforma um tool individual em plataforma colaborativa. Compartilhamento acelera aprendizado e melhora resultados.

#### 8.1 Marketplace
**O que é:** Loja para venda de templates premium.

**Por que fazer:** Monetização através de templates premium sustenta o projeto e incentiva contribuições de qualidade.

**O que se espera alcançar:**
- Templates à venda
- Sistema de pagamentos
- Downloads seguros
- Proteção de propriedade intelectual

**Entregáveis:**
- Listagem de templates
- Integração Stripe
- Sistema de licenças
- Downloads pós-pagamento

---

#### 8.2 Avaliações e reviews
**O que é:** Sistema de rating e comentários para conteúdo da comunidade.

**Por que fazer:** Feedback da comunidade ajuda outros usuários a escolherem melhores opções e incentiva qualidade.

**O que se espera alcançar:**
- Sistema de notas (1-5 estrelas)
- Comentários
- Moderação
- Perfil do contribuidor

**Entregáveis:**
- Rating de 1 a 5 estrelas
- Comentários
- Moderação de conteúdo
- Perfil do usuário

---

#### 8.3 Compartilhamento de designs
**O que é:** Galeria pública de designs compartilhados.

**Por que fazer:** Inspirar outros usuários e criar senso de comunidade.

**O que se espera alcançar:**
- Galeria pública
- Feed de designs recentes
- Filtros por cor/tipo
- Perfis de contribuidores

**Entregáveis:**
- Galeria pública
- Feed em tempo real
- Filtros avançados
- Perfis de usuários

---

#### 8.4 Versionamento
**O que é:** Sistema de versões para projetos.

**Por que fazer:** Usuários precisam comparar e reverter alterações ao longo do tempo.

**O que se espera alcançar:**
- Múltiplas versões salvas
- Diff entre versões
- Rollback fácil
- Histórico de mudanças

**Entregáveis:**
- Salvar múltiplas versões
- Comparação visual
- Rollback em clique
- Histórico de mudanças

---

### 🔘 P9 — Deploy & Infra
**Horas estimadas:** ~60h | **Dependências:** P8 | **Risco:** Baixo

> **Por que este bloco é importante:** Deploy transforma um projeto local em produto acessível. Infraestrutura adequada garante disponibilidade e confiabilidade.

#### 9.1 Versão hospedada
**O que é:** Deploy para a web para usuários que não querem rodar local.

**Por que fazer:** Nem todos os usuários querem ou podem rodar o projeto localmente. Uma versão hospedada amplia o alcance.

**O que se espera alcançar:**
- Frontend na Vercel
- Backend no Railway/Render
- Banco na nuvem (opcional)
- Domínio próprio

**Entregáveis:**
- Deploy na Vercel
- Deploy no Railway
- Domínio customizado
- SSL automático

---

#### 9.2 Monitoramento
**O que é:** Sistema de monitoramento de logs, métricas e alertas.

**Por que fazer:** Monitoramento permite detectar e resolver problemas rapidamente, garantindo disponibilidade.

**O que se espera alcançar:**
- Logs centralizados
- Métricas de uso
- Alertas de problemas
- Dashboard de saúde

**Entregáveis:**
- Logs com Loki
- Métricas com Prometheus
- Alertas com Alertmanager
- Dashboards Grafana

---

#### 9.3 Backup automático
**O que é:** Backup regular do banco de dados.

**Por que fazer:** Dados são o ativo mais importante. Backup protege contra perda por falhas técnicas.

**O que se espera alcançar:**
- Backups semanais
- Armazenamento seguro
- Retenção configurável
- Notificação de falhas

**Entregáveis:**
- Script de backup
- Agendamento semanal
- Armazenamento local/cloud
- Notificação de falhas

---

#### 9.4 Restore manual
**O que é:** Processo documentado para restaurar backups.

**Por que fazer:** Backup sem processo de restore é inútil. Documentação clara garante recuperação em caso de desastre.

**O que se espera alcançar:**
- Documentação passo a passo
- Script de restore
- Validação de integridade
- Tempo de recuperação mensurável

**Entregáveis:**
- Documentação completa
- Script `restore.py`
- Validação de integridade
- SLA de recuperação

---

### 🔷 P10 — Monetização
**Horas estimadas:** ~80h | **Dependências:** P9 | **Risco:** Médio

> **Por que este bloco é importante:** Monetização sustenta o projeto a longo prazo e permite investir em melhorias contínuas.

#### 10.1 Templates premium
**O que é:** Templates pagos com design profissional.

**Por que fazer:** Usuários dispostos a pagar por qualidade e economia de tempo.

**O que se espera alcançar:**
- Templates de alta qualidade
- Preço justo
- Downloads seguros
- Atualizações inclusas

**Entregáveis:**
- Templates premium
- Sistema de licenças
- Downloads após pagamento
- Atualizações gratuitas

---

#### 10.2 Exportação avançada
**O que é:** Exportação em formatos profissionais (Figma, Sketch, Adobe XD).

**Por que fazer:** Profissionais precisam de integração com suas ferramentas existentes.

**O que se espera alcançar:**
- Export para Figma
- Export para Sketch
- Export para Adobe XD
- Components prontos

**Entregáveis:**
- Plugin Figma
- Plugin Sketch
- Plugin Adobe XD
- Components nativos

---

#### 10.3 Suporte enterprise
**O que é:** Serviços premium para empresas.

**Por que fazer:** Empresas têm necessidades específicas e podem pagar por suporte dedicado.

**O que se espera alcançar:**
- Consultoria personalizada
- Implementação dedicada
- SLA garantido
- Treinamento da equipe

**Entregáveis:**
- Consultoria
- Implementação
- SLA contratual
- Treinamento

---

#### 10.4 API paga (SaaS)
**O que é:** API como serviço para integração em outros produtos.

**Por que fazer:** Revenue recorrente através de uso da API por terceiros.

**O que se espera alcançar:**
- Preço por request
- Rate limiting
- Dashboard de uso
- Documentação para devs

**Entregáveis:**
- API pública
- Preços por tier
- Dashboard de uso
- Documentação API

---

### 🔶 P11 — Integrações
**Horas estimadas:** ~100h | **Dependências:** P10 | **Risco:** Médio

> **Por que este bloco é importante:** Integrações amplificam o valor do projeto, permitindo que usuários usem o design system em suas ferramentas favoritas.

#### 11.1 Plugin Figma
**O que é:** Plugin que sincroniza tokens do OmniRoute para o Figma.

**Por que fazer:** Figma é a ferramenta padrão da indústria para design. Integração nativa é essencial.

**O que se espera alcançar:**
- Importar tokens
- Criar estilos
- Sincronização bidirecional
- Atualização automática

**Entregáveis:**
- Plugin Figma
- Import de tokens
- Criação de estilos
- Sincronização bidirecional

---

#### 11.2 Plugin VS Code
**O que é:** Extensão que auxilia desenvolvedores a usarem tokens.

**Por que fazer:** Desenvolvedores passam a maior parte do tempo no VS Code. Integração facilita adoção.

**O que se espera alcançar:**
- Snippets de tokens
- Preview em tempo real
- Validação WCAG
- Autocompletar

**Entregáveis:**
- Extensão VS Code
- Snippets de tokens
- Preview ao vivo
- Validação WCAG

---

#### 11.3 Export para React/Vue
**O que é:** Geração de componentes prontos para React ou Vue.

**Por que fazer:** Desenvolvedores querem componentes prontos, não apenas tokens.

**O que se espera alcançar:**
- Components prontos
- TypeScript types
- Storybook integrado
- Docs automáticas

**Entregáveis:**
- Components React
- Components Vue
- TypeScript types
- Storybook integrado

---

#### 11.4 Export para CSS/SCSS
**O que é:** Geração de variáveis CSS e SCSS a partir dos tokens.

**Por que fazer:** CSS é a base da web. Variáveis CSS permitem uso direto em projetos existentes.

**O que se espera alcançar:**
- Variables CSS
- Tailwind config
- Style Dictionary
- SCSS modules

**Entregáveis:**
- CSS Variables
- Tailwind Config
- Style Dictionary
- SCSS Modules
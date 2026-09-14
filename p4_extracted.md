###  P4 — Integração IA
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


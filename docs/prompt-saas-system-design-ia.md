# SaaS: Editor Visual de System Design com Avaliação por IA

## 1. Visão do produto

Quero construir um SaaS onde desenvolvedores, arquitetos e equipes desenham visualmente a arquitetura de um sistema usando uma interface baseada em nodes e conexões — visualmente parecida com o **n8n** (cards conectados por linhas, canvas com zoom/pan, sidebar de componentes arrastáveis).

O usuário monta a arquitetura conectando nodes (Frontend → Backend → Banco de Dados → Infra Cloud) e uma IA especializada analisa essa arquitetura como um **Software Architect / Principal Engineer** faria: identifica overengineering, underengineering, gargalos, riscos de segurança, custo estimado e dá uma nota justificada.

O objetivo final é ser um "arquiteto de software virtual" que ajuda a validar decisões técnicas **antes** de escrever código — evitando desperdício de infraestrutura e ensinando boas práticas.

**Como o editor visual vai ser construído (React Flow, Rete.js, etc.) não é preocupação deste prompt — resolver isso é trabalho seu, Cursor, dentro do stack que fizer mais sentido.**

---

## 2. Nodes do editor

### Frontend
- Framework: React, Vue, Angular, Next.js, Svelte
- Biblioteca UI: Tailwind, Material UI, Chakra UI, Design System próprio
- Estado: Redux, Zustand, Context API
- Renderização: SSR, CSR, SSG

### Backend
- Framework: Django, Flask, FastAPI, Spring Boot, NestJS, Laravel, Express

### Banco de Dados
- Relacionais: PostgreSQL, MySQL, MariaDB
- NoSQL: MongoDB, DynamoDB, Redis, Cassandra

### Infraestrutura Cloud
- Providers: AWS, Azure, Google Cloud, Digital Ocean, Hostinger VPS
- Serviços AWS: EC2, ECS, Lambda, S3, RDS, CloudFront, Load Balancer, ElastiCache

---

## 3. O que a IA precisa avaliar (nível de detalhe esperado)

Não é suficiente dizer "troque X por Y". A IA precisa **justificar com números e cenários**, no nível de detalhe destes exemplos:

- **Adequação da escolha**: "Django para uma API de 3 endpoints é como atirar com bazuca em formiga — o overhead de ORM, admin panel e app structure não se paga aqui. FastAPI ou Flask resolveriam com menos complexidade operacional."
- **Capacidade**: "Flask + PostgreSQL numa única instância EC2 t3.medium aguenta aproximadamente X requisições/segundo em cenário de leitura simples, mas degrada rapidamente acima de Y usuários simultâneos por causa de [gargalo específico: conexões do Postgres, GIL do Python, etc]."
- **Necessidade de componentes**: precisa de load balancer? Nesse volume de tráfego, sim/não, e por quê.
- **Escolha de storage**: EC2 vs Lambda vs S3 fazem sentido pra esse caso? Em qual ponto de escala isso muda?
- **Escalabilidade**: é horizontal ou vertical? Onde está o teto?
- **Segurança**: exposição de serviços, autenticação/autorização, SQL Injection, XSS, CSRF, rate limiting, secrets expostos, permissões IAM.
- **Nota final justificada**: ex. "Arquitetura: 8.5/10 — boa escolha de stack, banco adequado ao modelo de dados, mas risco de gargalo no backend sob carga."

### Importante: transparência sobre a natureza da estimativa
Toda métrica quantitativa (RPS, custo mensal, usuários suportados) que a IA gerar deve deixar claro que é uma **estimativa heurística baseada em benchmarks públicos e ordens de grandeza conhecidas do mercado**, não um número medido. Isso deve aparecer no output (ex: um badge "estimativa" ao lado do número), para não passar falsa precisão ao usuário.

---

## 4. Simulação de crescimento

Para qualquer arquitetura montada, a IA deve simular 3 cenários e, para cada um, apontar problemas e mudanças necessárias:

| Cenário | Perfil |
|---|---|
| Pequeno | ~1 mil usuários, baixo orçamento, tráfego esporádico |
| Médio | ~100 mil usuários, tráfego constante, precisa de alta disponibilidade |
| Grande | 1 milhão+ usuários, multi-região, alta escala |

---

## 5. Motor de IA — roteamento via OmniRoute

O sistema deve usar o **OmniRoute** (https://github.com/diegosouzapw/OmniRoute) como gateway de modelos — é um AI gateway self-hosted, MIT license, que expõe um endpoint único OpenAI-compatible (`http://localhost:20128/v1`) e roteia automaticamente entre 290+ provedores/modelos (incluindo camadas gratuitas), com fallback automático por quota/custo/latência.

**Importante para o Cursor entender antes de implementar:** o OmniRoute não vem com "agentes especializados em arquitetura" prontos — ele é a infraestrutura de roteamento entre modelos. A especialização (Software Architect, DBA, Security Auditor) é responsabilidade da nossa aplicação, via **system prompts próprios por tipo de análise**, chamando o endpoint do OmniRoute com o modelo/estratégia de roteamento adequada (ex: `auto/coding` para geração de arquitetura, um modelo de raciocínio mais forte para a análise consolidada).

Arquitetura de agentes sugerida:
- **Agente de Arquitetura** (System Design, Cloud, DevOps)
- **Agente de Banco de Dados** (modelagem, otimização, escolha de engine)
- **Agente de Código** (review de padrões de backend/frontend)
- **Agente de Segurança** (audit de superfícies de ataque)
- **Agente Consolidador** — recebe os outputs dos agentes acima e gera o relatório final único (nota, pontos fortes, riscos, sugestões)

Cada agente deve responder em **formato estruturado (JSON)** definido por nós, não texto livre — isso é o que permite renderizar badges, scores e alertas na UI do node correspondente, em vez de só um bloco de texto solto.

---

## 6. Alimentação da IA com dados reais (pesquisa)

Antes de começar a construir a lógica de avaliação, o ideal é que você (Cursor, em modo Plan) faça pesquisas para alimentar as heurísticas de decisão com informações reais de mercado — benchmarks de throughput por stack, faixas de preço atualizadas de EC2/RDS/Lambda/S3, limites conhecidos de frameworks (ex: conexões simultâneas do Postgres, limites de concorrência do Flask sync vs FastAPI async) — para que as respostas da IA não sejam apenas "achismo" do modelo, mas baseadas em dados reais coletados na fase de design.

Isso deve alimentar tanto:
1. A base de conhecimento/prompt inicial dos agentes (o que eles "sabem" de cara).
2. A lógica de avaliação em si — quando o usuário estiver usando o produto depois de pronto, e a IA for avaliar o design system dele.

---

## 7. Revisão humana (dev sênior)

O fluxo de aprovação da arquitetura muda dependendo de quem está usando:
- Se o usuário for um **dev sênior**, a análise da IA é suficiente — não precisa de aprovação extra.
- Se for **outro perfil** (júnior, PM, stakeholder não-técnico), deve existir um checkpoint de revisão por um dev sênior antes de a arquitetura ser considerada "aprovada" — pode ser um simples campo de review/comentário/aprovação dentro do próprio fluxo, não precisa ser complexo.

---

## 8. Recursos adicionais

- **Comparador de arquiteturas**: permitir montar duas arquiteturas lado a lado (ex: React+Django+PostgreSQL+EC2 vs Next.js+FastAPI+Aurora+Lambda) e comparar custo, performance, escalabilidade, complexidade e segurança.
- **Explicação educativa**: a IA nunca só recomenda — ela explica por que a escolha é melhor, o que evita, e em quais cenários a escolha antiga seria mais adequada.
- **Reanálise automática**: toda vez que o usuário editar o grafo (adicionar/remover/trocar um node), a arquitetura deve ser reavaliada.

---

## 9. Como planejar a construção

Separar o desenvolvimento em etapas/fases — isso deve ser planejado junto com o Cursor no modo Plan antes de começar a codar, não definido rigidamente aqui. Como ponto de partida para essa conversa de planejamento, faz sentido a ordem natural ser: canvas visual funcional → nodes estáticos sem IA → integração com OmniRoute e primeiro agente (arquitetura) → agentes adicionais → simulação de crescimento → comparador → revisão humana.

# Especificação de Produto — Sistema Open Source de Branding & Design System com IA

> Documento de referência completo. Cobre visão, arquitetura, regras de decisão, base de conhecimento e experiência do usuário. Para ser depois separado em MVP vs versão final.

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
- Devs/indie hackers que quer algo rápido, consistente, e que já saia em formato de código.
- Pequenas agências que querem acelerar a etapa inicial de proposta de marca para clientes.

### 1.4 Princípios norteadores
1. **Nada de decisão aleatória.** Toda escolha (cor, fonte, contraste) precisa ter uma justificativa rastreável — regra técnica ou raciocínio da IA, nunca "porque sim".
2. **Determinístico sempre que possível, IA só quando necessário.** Tudo que pode ser calculado com regra/matemática não deve depender de IA (mais rápido, mais barato, mais confiável).
3. **Educar, não só entregar.** O usuário leigo deve sair entendendo *por que* aquilo funciona, não só recebendo um arquivo.
4. **Local-first e privado.** Nenhum dado do usuário sai da máquina dele, exceto as chamadas que ele mesmo autoriza para a API de IA que configurou.
5. **Sem custo de host embutido no core.** O núcleo do produto não depende de infraestrutura paga do mantenedor — quem roda local, paga (ou não) só a própria API de IA.
6. **Saída utilizável em código, não só visual.** O resultado final tem que sair também como dado estruturado (tokens), não só como página bonita.

---

## 2. Jornada do Usuário (fluxo completo)

```
1. Onboarding
   └─ Configura API de IA (chave, provedor, modelo)
   └─ Escolhe modo: "Simples" (recomendado para leigos) ou "Avançado"

2. Briefing do negócio
   └─ Nome do negócio / produto
   └─ Descrição curta do que faz
   └─ Setor/nicho (ex: fintech, pet shop, infoproduto, SaaS B2B, restaurante...)
   └─ Tom de voz desejado (ex: sério/confiável, divertido/descontraído, luxuoso, minimalista...)
   └─ (opcional) Referências/concorrentes que a pessoa gosta

3. Tipografia
   └─ Sistema sugere 2-3 pares de fontes (título + texto) com justificativa
   └─ Usuário escolhe ou pede outra sugestão
   └─ Validação automática de legibilidade (tamanho mínimo, contraste, etc.)

4. Paleta de cores
   └─ Usuário escolhe: (a) uma paleta pronta de exemplo, (b) monta a própria, ou (c) deixa a IA sugerir do zero
   └─ IA avalia se a paleta escolhida combina com o negócio/tom de voz
   └─ Sistema calcula contraste (WCAG) automaticamente e sinaliza problemas
   └─ Se houver problema, IA sugere ajuste ou paleta alternativa
   └─ Sistema gera automaticamente a versão DARK a partir da versão LIGHT (e vice-versa)
   └─ Preview ao vivo em componentes reais (botão, card, texto)

5. Logo
   └─ Upload da logo em PNG
   └─ Sistema detecta se é "simples" (cor sólida, poucas cores, ícone/tipográfica) e vetoriza para SVG
   └─ Se detectar complexidade alta (gradientes, fotografia, muitos detalhes), avisa o usuário que o resultado pode não ficar perfeito e permite ajuste manual
   └─ Geração automática de variações: logo original, logo monocromática (clara), logo monocromática (escura), logo sobre fundo claro, logo sobre fundo escuro, versão só-ícone (se aplicável)

6. Geração do Design System / KVS
   └─ Sistema monta página navegável com:
       - Paleta (light/dark) com códigos (HEX/RGB/HSL) e uso recomendado de cada cor
       - Tipografia (escala de tamanhos, pesos, exemplos de título/subtítulo/parágrafo)
       - Logo e variações
       - Blocos de UI: título, título+subtítulo, bloco imagem+texto, cards, formulário, navbar/sidebar, footer
       - Regras de espaçamento (grid/spacing scale)
   └─ Cada elemento tem um "porquê" explicado ao lado (tooltip/expansível)

7. Exportação
   └─ Página HTML navegável (style guide)
   └─ Design tokens em JSON
   └─ Variáveis CSS
   └─ Config pronta para Tailwind (opcional)
```

---

## 3. Arquitetura de Decisão: o que é regra fixa vs o que é julgamento de IA

Esse é o ponto mais importante do produto. Separar isso corretamente define confiabilidade, custo e velocidade.

### 3.1 Deve ser código determinístico (SEM IA, sem custo de token)
| Item | Como calcular |
|---|---|
| Contraste entre cor de texto e fundo | Fórmula de luminância relativa (WCAG), retorna ratio numérico |
| Validação AA/AAA | Comparar ratio calculado com limites fixos (ver seção 6.3) |
| Simulação de daltonismo | Transformação de matriz de cor (protanopia, deuteranopia, tritanopia) |
| Geração da versão dark a partir da light | Ajuste de luminância + leve ajuste de saturação (não é só "inverter") |
| Escala tipográfica (tamanhos, line-height) | Escala modular (ex: razão 1.25, 1.333, 1.5...) |
| Escala de espaçamento (spacing) | Progressão numérica fixa (ex: 4px, 8px, 16px, 24px, 32px...) |
| Geração de variações de logo (cor/fundo) | Manipulação direta dos atributos de cor no SVG |
| Verificação de tamanho mínimo de fonte para leitura | Regra fixa (ex: nunca abaixo de 12px para corpo de texto) |

**Ferramentas/bibliotecas de referência (open source, rodam local):**
- Contraste e manipulação de cor: `culori`, `chroma.js`, `wcag-contrast`, `colorjs.io`
- Vetorização PNG → SVG: `potrace` (bom para logos de 1-2 cores), `vtracer` (Rust, multi-cor, geralmente resultado melhor que potrace para logos com poucas cores sólidas)
- Manipulação de SVG: `svgo` (otimização), manipulação direta via DOM/regex para recolorir

### 3.2 Deve ser julgamento de IA (aqui sim vale gastar token)
| Item | Por que precisa de IA |
|---|---|
| "Essa paleta combina com esse tipo de negócio?" | Depende de contexto, percepção, associação cultural — não é cálculo |
| "Essa combinação de fontes passa o tom de voz certo?" | Julgamento estético/contextual |
| Sugestão de paleta nova do zero, baseada na descrição do negócio | Precisa interpretar linguagem natural e cruzar com psicologia das cores |
| Nome/justificativa de cada cor da paleta (ex: "Azul Confiança", "Verde Crescimento") | Trabalho criativo/comunicação |
| Explicações em linguagem simples para o usuário leigo | Precisa adaptar tom e nível de explicação |
| Sugestão de nomes de blocos/textos de exemplo no design system | Geração de conteúdo |

**Regra prática:** se a resposta pode ser obtida com uma fórmula ou uma tabela de consulta, não é trabalho para a IA. Se a resposta depende de interpretar contexto/linguagem/associação subjetiva, é trabalho para a IA — mas sempre **validado depois por uma checagem determinística** (ex: a IA sugere uma paleta, mas o contraste dela é sempre recalculado e validado por código, nunca "confiado" cegamente na IA).

---

## 4. Hub de Conhecimento / Base de Regras (a "fonte da verdade" da IA)

### 4.1 Por que isso existe
Sem uma base de regras fixa, a IA fica livre para "inventar" critérios diferentes a cada geração, ser inconsistente entre usuários, ou perder tempo/token "raciocinando do zero" sobre coisas já bem estabelecidas (ex: regras de contraste já existem, não precisam ser decididas a cada vez).

### 4.2 Estrutura sugerida (categorias do hub)
```
/knowledge-base
  /color
    - psicologia-das-cores.md        (o que cada cor tende a comunicar, por contexto/cultura)
    - contraste-e-acessibilidade.md  (regras WCAG, tabela de ratios mínimos)
    - harmonia-de-cores.md           (complementar, análoga, triádica, monocromática — quando usar cada uma)
    - nunca-faca.md                  (lista de erros comuns de cor)
  /typography
    - pareamento-de-fontes.md        (quais combinações funcionam e por quê)
    - hierarquia-e-escala.md         (como estruturar tamanhos)
    - legibilidade.md                (regras de tamanho mínimo, espaçamento, line-height)
    - nunca-faca.md
  /ui-patterns
    - cards.md
    - formularios.md
    - navbar-sidebar.md
    - footer.md
    - botoes-e-estados.md
    - nunca-faca.md
  /brand-voice
    - tom-por-setor.md                (ex: fintech tende a sóbrio, infantil tende a lúdico)
```

### 4.3 Formato de cada entrada de regra
Para facilitar tanto a recuperação (RAG) quanto a auditoria, cada regra deve seguir um formato estruturado, por exemplo (em JSON ou frontmatter):

```yaml
id: color-001
categoria: contraste
regra: "Texto normal sobre fundo deve ter contraste mínimo de 4.5:1 (WCAG AA)"
severidade: obrigatorio        # obrigatorio | recomendado
explicacao_simples: "Isso garante que praticamente qualquer pessoa consiga ler o texto, inclusive quem tem baixa visão."
como_verificar: "codigo"       # codigo | ia
```

Isso permite dois usos diferentes:
- Regras `como_verificar: codigo` viram checagens automáticas no pipeline (nunca dependem da IA "lembrar" delas).
- Regras `como_verificar: ia` viram contexto injetado no prompt, só quando relevante para aquela etapa.

### 4.4 Lista inicial de "nunca faça" (ponto de partida, expandir depois)

**Cores:**
- Nunca usar preto puro (#000000) sobre branco puro (#FFFFFF) como padrão de texto — o contraste é excessivo e cansa a leitura em telas; preferir tons quase-pretos (ex: #111827).
- Nunca depender só da cor para transmitir significado (ex: erro só em vermelho sem ícone/texto) — problema de acessibilidade para daltônicos.
- Nunca usar mais de 1 cor de destaque (accent) dominante além da cor primária e neutra, sob risco de poluição visual.
- Nunca aprovar uma paleta sem testar contraste em ambos os modos (light e dark) — thresholds mudam entre os dois.

**Tipografia:**
- Nunca usar fonte decorativa/script para corpo de texto (só para elementos pontuais, como um destaque).
- Nunca usar corpo de texto abaixo de 14-16px em telas (12px no mínimo absoluto, e só em casos excepcionais).
- Nunca combinar mais de 2 famílias tipográficas num mesmo sistema (título + texto), salvo exceção justificada.
- Nunca usar fonte genérica do sistema como escolha "final" de marca (ex: Arial puro) quando o objetivo é ter identidade própria — genérica demais, não diferencia a marca.

**UI/Design System:**
- Nunca criar um botão sem estado de hover/focus/disabled definido.
- Nunca esconder foco de teclado (`outline: none` sem substituto) — quebra acessibilidade.
- Nunca usar espaçamento arbitrário fora da escala definida (gera inconsistência visual).

### 4.5 Fonte dessas regras
Boa parte disso já existe documentado publicamente e pode servir de base para popular o hub (sempre reescrevendo com suas próprias palavras, nunca copiando literalmente):
- WCAG 2.1/2.2 (W3C) — regras de contraste e acessibilidade.
- Guias de design system públicos e open source (ex: Material Design, Human Interface Guidelines, Carbon Design System, Polaris) — como referência de estrutura de blocos de UI, não para copiar conteúdo.
- Estudos de psicologia das cores aplicada a marca (existem muitos, vale cruzar mais de uma fonte e ficar só com os consensos, evitando afirmações "místicas" sem base).

---

## 5. Estratégia de Uso de IA e Otimização de Tokens

### 5.1 RAG (Retrieval-Augmented Generation) local
Em vez de colar o hub de conhecimento inteiro em todo prompt:
1. O hub fica indexado localmente (pode ser embeddings simples com um modelo local de embedding, ou até busca por palavra-chave/categoria se quiser começar simples sem embeddings).
2. Cada etapa do fluxo (cor, tipografia, UI) só recupera os trechos da categoria correspondente.
3. Só entra no prompt o que é relevante para aquela decisão específica.

### 5.2 Separação por etapa (mais simples de implementar no início, antes de montar RAG completo)
Em vez de um único "super prompt" com tudo:
- Prompt da etapa de cor: só recebe as regras de cor + o briefing do negócio.
- Prompt da etapa de tipografia: só recebe regras de tipografia + briefing.
- Prompt da etapa de blocos de UI: só recebe padrões de UI relevantes ao bloco sendo gerado.

### 5.3 Cache e reuso
- Se o usuário já validou uma paleta, não precisa re-perguntar à IA sobre ela de novo a cada etapa seguinte — reaproveitar o resultado já gerado.
- Validações determinísticas (contraste, etc.) rodam sempre em código, nunca via IA, mesmo que o resultado "pareça" uma pergunta para a IA responder.

### 5.4 Modelo em camadas (opcional, para quem configurar múltiplas chaves)
- Tarefas simples/mecânicas (ex: gerar nome de variável de cor, pequenas justificativas) podem usar um modelo mais barato/rápido.
- Tarefas de julgamento mais complexo (avaliar fit de paleta com o negócio) reservam o modelo mais robusto.
Isso é opcional e fica a critério do usuário configurar, já que o sistema é BYOK (bring your own key).

---

## 6. Módulo de Cores (detalhado)

### 6.1 Fontes de entrada de paleta
- Paletas de exemplo curadas (várias por "vibe": minimalista, vibrante, corporativo, pastel, escuro/premium, etc.)
- Paleta customizada pelo próprio usuário (color picker)
- Geração do zero pela IA, a partir do briefing

### 6.2 Avaliação de fit com o negócio (IA)
A IA recebe: briefing do negócio + paleta escolhida + regras de psicologia das cores (via RAG) → retorna:
- Aprovação ou reprovação com justificativa em linguagem simples
- Se reprovar, sugestão de ajuste pontual (ex: trocar só a cor de destaque) ou paleta alternativa completa

### 6.3 Tabela de contraste WCAG (referência para o motor de checagem)
| Nível | Texto normal | Texto grande (≥18px bold ou ≥24px regular) |
|---|---|---|
| AA (mínimo recomendado) | 4.5:1 | 3:1 |
| AAA (ideal) | 7:1 | 4.5:1 |

### 6.4 Geração automática light/dark
Não é uma inversão simples de cores. O processo correto:
1. Manter a matiz (hue) de cada cor da paleta.
2. Ajustar luminosidade/luminância para o novo contexto (cores muito claras no modo light viram versões escurecidas no dark, e vice-versa).
3. Reduzir levemente a saturação de cores muito vibrantes no modo dark (evita "vibração" incômoda em fundo escuro).
4. Recalcular contraste em cada combinação final e validar contra a tabela da seção 6.3.
5. Se alguma combinação falhar, ajustar automaticamente (ex: escurecer/clarear até passar) e sinalizar a mudança ao usuário.

---

## 7. Módulo de Tipografia (detalhado)

### 7.1 Processo
1. IA sugere 2-3 pares de fontes (título + corpo) com base no tom de voz do briefing.
2. Cada sugestão vem com justificativa curta (ex: "fonte serifada transmite tradição/confiança, combina com o tom sério que você descreveu").
3. Sistema calcula automaticamente escala de tamanhos (modular scale) a partir de um tamanho-base.
4. Sistema valida legibilidade mínima (tamanho, contraste do texto com o fundo já definido na etapa de cor).

### 7.2 Fontes devem ser open source / de uso livre
Para manter o projeto 100% funcional sem custo de licença, priorizar fontes open source (ex: catálogo do Google Fonts, que é majoritariamente licença livre) — evita problema legal para quem for usar a marca gerada comercialmente.

---

## 8. Módulo de Logo (PNG → SVG)

### 8.1 Classificação automática de complexidade
Antes de tentar vetorizar, o sistema analisa a imagem (número de cores dominantes, presença de gradiente, nível de detalhe) e classifica em:
- **Simples** (cor sólida, poucas cores, formas geométricas/ícone, tipografia limpa) → vetorização automática com alta confiança.
- **Complexa** (gradiente, textura, fotografia, muitos detalhes finos) → vetorização automática com aviso de "resultado pode precisar de ajuste manual", ou sugestão de o usuário redesenhar/simplificar antes.

### 8.2 Pipeline técnico sugerido
1. Pré-processamento: remover fundo (se aplicável), reduzir ruído, quantizar cores (reduzir para uma paleta discreta de cores dominantes).
2. Vetorização: `potrace` (mono/poucas cores) ou `vtracer` (multi-cor).
3. Pós-processamento: otimizar o SVG gerado com `svgo` (remove pontos redundantes, reduz tamanho de arquivo).
4. Validação visual: gerar um preview lado a lado (PNG original vs SVG gerado) para o usuário confirmar visualmente antes de seguir.

### 8.3 Geração de variações
A partir do SVG validado, gerar automaticamente (manipulação direta de cor no SVG, sem IA):
- Versão original colorida
- Versão monocromática clara (para fundo escuro)
- Versão monocromática escura (para fundo claro)
- Versão só-ícone (se o sistema identificar que a logo tem um símbolo separável do texto)
- Aplicação sobre cartão claro e cartão escuro (preview)

---

## 9. Módulo de Geração do Design System / KVS

### 9.1 Blocos obrigatórios (conforme especificado)
- Título (H1) isolado
- Título + subtítulo
- Bloco imagem + texto
- Cards (padrão e variações: com imagem, só texto, com ação)
- Formulário (inputs, labels, estados de erro/foco/disabled)
- Navbar / Sidebar
- Footer

### 9.2 Cada bloco deve conter
- Preview visual renderizado com a paleta/tipografia escolhidas
- Código do bloco (HTML/CSS ou componente, dependendo do formato de exportação escolhido)
- Explicação de uso ("quando usar este bloco", "o que evitar")

### 9.3 Estrutura da página final
Página navegável (estilo style guide/KVS), com seções:
1. Visão geral da marca (nome, tom de voz, resumo)
2. Paleta (light + dark, com código de cada cor e uso recomendado)
3. Tipografia (escala completa, exemplos aplicados)
4. Logo e variações
5. Componentes/blocos de UI
6. Regras de espaçamento/grid
7. Diretrizes de acessibilidade específicas dessa marca (ex: "essa combinação X só deve ser usada para texto grande, não para corpo de texto")

---

## 10. Experiência para Usuários Leigos

### 10.1 Modo Simples vs Modo Avançado
- **Simples:** o usuário só escolhe entre opções curadas em cada etapa (ex: 3 paletas prontas, 3 pares de fonte), sistema decide os detalhes técnicos.
- **Avançado:** usuário pode ajustar HSL manualmente, trocar fontes livremente, sobrescrever sugestões da IA — mas ainda passa pelas validações determinísticas (contraste, etc.), que nunca podem ser puladas.

### 10.2 Explicações em cada decisão
Todo elemento gerado (cor, fonte, bloco) deve ter uma explicação curta acessível (tooltip ou texto expansível) respondendo:
- O que é isso
- Por que foi escolhido/sugerido
- O que aconteceria se fosse diferente (ex: "se essa cor fosse mais escura, o contraste cairia abaixo do mínimo recomendado")

### 10.3 Indicadores visuais simples ("farol")
Em vez de mostrar só números técnicos (ex: "contraste 4.5:1"), usar indicador visual:
- 🟢 Aprovado / dentro do padrão recomendado
- 🟡 Aceitável, mas com ressalva
- 🔴 Reprovado, ajuste necessário

### 10.4 Preview ao vivo
Sempre que possível, mostrar o resultado aplicado em um componente real (botão, card, texto de parágrafo) em vez de só mostrar a cor/fonte isolada — leigo não visualiza abstração, precisa ver o resultado aplicado.

---

## 11. Exportação e Integração

### 11.1 Formatos de saída
- Página HTML navegável (style guide/KVS) — para visualização e compartilhamento.
- Design tokens em JSON (formato aberto, ex: seguindo convenção próxima ao [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)) — para uso em qualquer ferramenta que leia tokens.
- Variáveis CSS (`:root { --color-primary: ...; }`).
- Config pronta para Tailwind (`tailwind.config.js` com as cores/fontes já mapeadas), como conveniência para quem usa esse framework.
- Arquivos SVG da logo e variações, prontos para uso.

### 11.2 Importação/continuidade
Permitir que o usuário exporte o "estado" do projeto (briefing + decisões tomadas) em um arquivo próprio (ex: JSON de projeto), para poder reabrir e continuar editando depois sem perder o histórico de decisões.

---

## 12. Lista de Features (não priorizada — para você separar MVP x versão final depois)

- Onboarding com configuração de API (múltiplos provedores)
- Briefing guiado do negócio
- Sugestão de tipografia com justificativa
- Escolha de paleta (pronta, customizada ou gerada)
- Avaliação de fit da paleta com o negócio (IA)
- Geração automática light/dark
- Motor de validação de contraste (WCAG AA/AAA)
- Simulação de daltonismo
- Upload e vetorização de logo (PNG → SVG)
- Classificação automática de complexidade da logo
- Geração de variações de logo (cor/fundo/ícone)
- Geração de blocos de UI (título, subtítulo, imagem+texto, cards, form, navbar/sidebar, footer)
- Página de design system navegável
- Modo simples vs avançado
- Explicações/tooltips em cada decisão
- Indicadores visuais tipo farol
- Preview ao vivo em componentes reais
- Exportação em HTML, JSON (tokens), CSS vars, Tailwind config
- Salvar/reabrir estado do projeto
- Hub de conhecimento estruturado (RAG) com regras de cor, tipografia, UI e lista de "nunca faça"
- Sistema de cache/reuso para evitar rechamadas desnecessárias de IA
- (Futuro) Versão hospedada para quem não quer configurar localmente
- (Futuro) Curadoria comunitária de paletas/fontes/exemplos, com contribuições da comunidade open source

---

## 13. Riscos e Pontos de Atenção Técnica

- **Vetorização de logos complexas** é o ponto de maior incerteza técnica do projeto — resultado automático confiável majoritariamente para logos simples (conforme já esperado e assumido no escopo).
- **Geração de dark mode automática** precisa de testes visuais reais, não só matemática de contraste — cores "tecnicamente corretas" podem ainda parecer estranhas visualmente; vale ter revisão manual/curadoria nos primeiros ciclos.
- **Confiabilidade da IA em seguir as regras do hub:** mesmo com RAG bem feito, sempre validar a saída da IA com as checagens determinísticas depois — nunca confiar cegamente que a IA "leu e seguiu" a regra.
- **Diversidade de qualidade entre provedores de IA (BYOK):** como o usuário escolhe a própria API, a qualidade da avaliação de fit de paleta/tom pode variar bastante dependendo do modelo escolhido — vale ter prompts robustos o suficiente para funcionar razoavelmente bem mesmo em modelos mais simples.

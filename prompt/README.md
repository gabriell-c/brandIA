# Prompt Hub — Estrutura de Documentos

Este diretório contém a estrutura de pastas e arquivos que compõem o **motor de conhecimento** do **OmniRoute Design System**.

## Objetivo

Criar uma biblioteca de regras, exemplos e guias que a IA consultará **de forma seletiva** (RAG) antes de tomar decisões em cada etapa do processo.

---

## Estrutura de Pastas e Arquivos

```
prompt/
├── README.md                          # Este arquivo
├── estrutura-completa.md              # Lista completa com checkboxes
├── como-usar.md                       # Guia para criar documentos
│
├── paleta-de-cores/                   # Contexto: etapa de cores
│   ├── introducao.md
│   ├── teoria-das-cores.md
│   ├── psicologia-das-cores.md
│   │   ├── fintech.md
│   │   ├── saude.md
│   │   ├── educacao.md
│   │   ├── ecommerce.md
│   │   ├── tech.md
│   │   └── luxo.md
│   ├── contraste-e-acessibilidade.md
│   │   ├── wcag-aa.md
│   │   ├── wcag-aaa.md
│   │   └── calculo-contraste.md
│   ├── combinacoes.md
│   ├── dark-mode.md
│   ├── light-mode.md
│   ├── paletas-exemplos.md
│   ├── cultural-context.md
│   ├── acessibilidade-daltonismo.md
│   ├── gradiente.md
│   ├── tokens-de-cor.md
│   └── validacao.md
│
├── tipografia/                        # Contexto: etapa de fontes
│   ├── introducao.md
│   ├── familias-de-fontes.md
│   ├── metricas-tipograficas.md
│   ├── escalas-tipograficas.md
│   ├── font-pairing.md
│   ├── fontes-google.md
│   ├── web-safe-fonts.md
│   ├── licencas-de-fontes.md
│   ├── renderizacao-tipografica.md
│   ├── kerning-tracking-leading.md
│   ├── Legibilidade-e-acessibilidade.md
│   │   ├── tamanho-minimo.md
│   │   ├── line-height.md
│   │   └── peso-da-fonte.md
│   ├── tipografia-por-nicho.md
│   │   ├── fintech.md
│   │   ├── saude.md
│   │   ├── educacao.md
│   │   ├── ecommerce.md
│   │   ├── tech.md
│   │   └── luxo.md
│   └── validacao.md
│
├── ui/                               # Contexto: geração de componentes
│   ├── introducao.md
│   ├── componentes/
│   │   ├── botao.md
│   │   ├── input.md
│   │   ├── card.md
│   │   ├── navbar.md
│   │   ├── sidebar.md
│   │   ├── modal.md
│   │   ├── form.md
│   │   ├── table.md
│   │   ├── dropdown.md
│   │   ├── tabs.md
│   │   ├── tooltip.md
│   │   ├── checkbox-radio.md
│   │   ├── skeleton.md
│   │   ├── empty-state.md
│   │   ├── error-state.md
│   │   ├── toast.md
│   │   ├── pagination.md
│   │   └── search.md
│   ├── espacamento.md
│   ├── cores-e-ui.md
│   ├── estados.md
│   ├── responsividade.md
│   ├── acessibilidade-ui.md
│   ├── iconografia.md
│   └── validacao.md
│
├── ux/                               # Contexto: análise de experiência
│   ├── introducao.md
│   ├── jornada-do-usuario.md
│   ├── acessibilidade.md
│   ├── microinteracoes.md
│   ├── hierarquia-visual.md
│   ├── affordance.md
│   ├── feedback-e-resposta.md
│   ├── heuristics.md
│   ├── cognitive-load.md
│   ├── user-research.md
│   ├── usability-testing.md
│   ├── persona.md
│   ├── user-flow.md
│   └── validacao.md
│
├── branding/                         # Contexto: identidade da marca
│   ├── introducao.md
│   ├── identidade-visual.md
│   ├── tom-de-voz.md
│   ├── nome-da-marca.md
│   ├── logotipo.md
│   ├── brand-guidelines.md
│   ├── brand-voice-examples.md
│   ├── brand-messaging.md
│   ├── logo-rules.md
│   └── validacao.md
│
├── design-system/                    # Contexto: exportação e tokens
│   ├── introducao.md
│   ├── tokens.md
│   ├── tokens-naming.md
│   ├── tokens-hierarchy.md
│   ├── documentacao.md
│   ├── consistencia.md
│   ├── component-documentation.md
│   ├── versioning.md
│   ├── contribution-guide.md
│   └── validacao.md
│
└── agentes-ia/                       # Contexto: configuração dos agentes
    ├── prompt-engineering.md
    ├── system-prompts.md
    ├── json-schema.md
    ├── fallbacks.md
    ├── evaluation-metrics.md
    ├── iteration-process.md
    ├── human-review.md
    └── cost-optimization.md
```

---

## Total de Documentos: 98

| Categoria | Documentos |
|-----------|-----------|
| Paleta de Cores | 22 |
| Tipografia | 22 |
| UI | 26 |
| UX | 13 |
| Branding | 10 |
| Design System | 10 |
| Agentes IA | 8 |

---

## Como Usar

1. Abra `estrutura-completa.md` para ver a lista completa
2. Cada arquivo está vazio — você preencherá com conteúdo
3. Siga o formato em `como-usar.md`
4. Marque [x] quando terminar cada documento
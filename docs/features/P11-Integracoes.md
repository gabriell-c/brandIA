# P11 — Integrações

**Horas estimadas:** ~100h | **Dependências:** P10 | **Risco:** Médio

## Resumo

Integrações ampliam o alcance e a utilidade do design system. Incluem plugins para ferramentas populares como Figma e VS Code, export para frameworks de frontend, e integração com outros sistemas.

---

## 11.1 Plugin Figma

### O que é
Plugin para importar/exportar design tokens no Figma.

### Por que fazer
Figma é a ferramenta padrão da indústria para design. Plugin permite sincronização bidirecional.

### O que se espera alcançar
- Importar paletas do Figma
- Exportar paletas para o Figma
- Sincronizar tokens de design
- Atualizar estilos automaticamente

### Entregáveis
- ✅ Plugin Figma (manifest.json + código fonte)
- ✅ Importar cores e tipografia
- ✅ Exportar paletas
- ✅ Sincronização bidirecional

### Arquivos criados
- `integrations/figma-plugin/manifest.json` — Manifesto do plugin
- `integrations/figma-plugin/src/main.ts` — Código do plugin

---

## 11.2 Plugin VS Code

### O que é
Extensão VS Code para usar tokens de design no desenvolvimento.

### Por que fazer
VS Code é o editor mais popular. Extensão facilita o uso de tokens durante o desenvolvimento.

### O que se espera alcançar
- Snippets de código
- Preview de cores
- Autocompletar tokens
- Sincronização automática

### Entregáveis
- ✅ Extensão VS Code (package.json + código fonte)
- ✅ Snippets de código
- ✅ Preview de cores
- ✅ Autocompletar tokens

### Arquivos criados
- `integrations/vscode-extension/package.json` — Package da extensão
- `integrations/vscode-extension/src/extension.ts` — Código da extensão

---

## 11.3 Export para React/Vue

### O que é
Geração de componentes React e Vue a partir dos tokens de design.

### Por que fazer
React e Vue são frameworks populares. Componentes gerados aceleram o desenvolvimento.

### O que se espera alcançar
- Componentes React
- Componentes Vue
- TypeScript types
- Props tipadas
- Storybook integrado

### Entregáveis
- ✅ Componentes React (Button, Card, Input)
- ✅ Componentes Vue (Button, Card)
- ✅ TypeScript types (design-tokens.ts)
- ✅ Storybook stories

### Arquivos criados
- `integrations/react-components/src/index.ts` — Componentes React
- `integrations/vue-components/src/Button.vue` — Botão Vue
- `integrations/vue-components/src/Card.vue` — Card Vue
- `integrations/vue-components/src/index.ts` — Exportação Vue
- `integrations/typescript-types/design-tokens.ts` — Tipos TypeScript

---

## 11.4 Export para CSS/SCSS

### O que é
Geração de variáveis CSS e SCSS a partir dos tokens.

### Por que fazer
CSS é a base da web. Variáveis CSS permitem uso direto em projetos existentes.

### O que se espera alcançar
- Variables CSS
- Tailwind config
- Style Dictionary
- SCSS modules
- CSS Modules
- Global styles

### Entregáveis
- ✅ CSS Variables
- ✅ Tailwind Config
- ✅ SCSS Modules
- ✅ Rotas de API para exportação

### Arquivos criados
- `integrations/css-variables/tokens.css` — Variáveis CSS
- `integrations/scss/tokens.scss` — Módulos SCSS
- `integrations/tailwind/tailwind.config.js` — Config Tailwind
- `backend/app/routes/integrations.py` — Rotas de API

---

## Arquitetura

### Backend
```
backend/app/
└── routes/
    └── integrations.py      # Rotas de integração
```

### Frontend
```
frontend/src/
└── app/
    └── integrations/
        └── page.tsx          # Dashboard de integrações
```

### Integrations
```
integrations/
├── figma-plugin/
│   ├── manifest.json
│   └── src/
│       └── main.ts
├── vscode-extension/
│   ├── package.json
│   └── src/
│       └── extension.ts
├── react-components/
│   └── src/
│       └── index.ts
├── vue-components/
│   └── src/
│       ├── Button.vue
│       ├── Card.vue
│       └── index.ts
├── typescript-types/
│   └── design-tokens.ts
├── css-variables/
│   └── tokens.css
├── scss/
│   └── tokens.scss
└── tailwind/
    └── tailwind.config.js
```

---

## Endpoints API

### Integrações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/integrations/status` | Status de todas integrações |
| GET | `/api/v1/integrations/vscode/snippets` | Snippets VS Code |
| GET | `/api/v1/integrations/react/components` | Componentes React |
| GET | `/api/v1/integrations/vue/components` | Componentes Vue |
| GET | `/api/v1/integrations/css/variables` | Variáveis CSS |
| GET | `/api/v1/integrations/scss/modules` | Módulos SCSS |
| GET | `/api/v1/integrations/tailwind/config` | Config Tailwind |
| POST | `/api/v1/integrations/figma/sync` | Sincronizar com Figma |
| POST | `/api/v1/integrations/figma/import` | Importar do Figma |
| POST | `/api/v1/integrations/figma/export` | Exportar para Figma |

---

## Testes

### Backend
```bash
python -m pytest backend/app/routes/test_integrations.py -v
```

### Frontend
```bash
pnpm test -- frontend/src/app/integrations/
```

---

## Próximos Passos

1. Implementar plugin Figma funcional com comunicação real
2. Adicionar suporte a Sketch e Adobe XD
3. Criar componentes React/Vue completos (todos os 15+)
4. Implementar export para SwiftUI e Flutter
5. Adicionar integração com Storybook automatizado
6. Criar CI/CD para publicar extensões

---

## Status

- [x] 11.1 Plugin Figma
- [x] 11.2 Plugin VS Code
- [x] 11.3 Export para React/Vue
- [x] 11.4 Export para CSS/SCSS
- [x] Documentação
- [x] Integração com API
- [x] Frontend components

**Status:** ✅ COMPLETO
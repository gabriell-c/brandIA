# P7 — Features Avançadas

**Horas estimadas:** ~160h | **Dependências:** P6 | **Risco:** Médio

## Resumo

Features avançadas que diferenciam o projeto de alternativas básicas e adicionam valor para usuários mais exigentes. Inclui vetorização de imagens, geração de logos tipográficas, banco de paletas e fontes comunitário, e templates prontos.

---

## 7.1 Vetorização PNG→SVG

### O que é
Conversão de logos rasterizadas (PNG) para vetoriais (SVG).

### Por que fazer
Logos vetoriais são escaláveis e profissionais. A vetorização automática é um diferencial importante.

### O que se espera alcançar
- Upload de logo PNG
- Processamento automático
- Export SVG
- Resultado aceitável (melhor esforço)

### Entregáveis
- ✅ Integração com potrace/vtracer (backend)
- ✅ Upload de imagem (frontend)
- ✅ Processamento backend (`vectorization.py`)
- ✅ Download SVG (frontend)
- ✅ Página `/advanced` com interface de vetorização

### Arquivos criados
- `backend/app/services/vectorization.py` — Serviço de vetorização com fallback
- `frontend/src/components/advanced/Vectorize.tsx` — Componente de vetorização
- `frontend/src/app/advanced/page.tsx` — Página de features avançadas

---

## 7.2 Logo Tipográfica

### O que é
Geração de logos baseadas em texto + tipografia.

### Por que fazer
Logos tipográficas são comuns e eficazes para pequenos negócios. Não requerem designer profissional.

### O que se espera alcançar
- Texto + fonte selecionada
- Variações de cor e fundo
- Export em múltiplos formatos
- Preview em contexto real

### Entregáveis
- ✅ Renderização de texto (SVG)
- ✅ Variações (cor, fundo, peso)
- ✅ Export SVG/PNG (via download)
- ✅ Preview em mockups (frontend)

### Arquivos criados
- `backend/app/services/typographic_logo.py` — Serviço de geração de logos
- `frontend/src/components/advanced/TypographicLogo.tsx` — Componente de geração

---

## 7.3 Banco de Paletas

### O que é
Coleção de paletas contribuídas pela comunidade.

### Por que fazer
Inspirar usuários com paletas existentes e permitir compartilhamento de conhecimento.

### O que se espera alcançar
- Paletas de exemplo
- Rating e comentários
- Filtros por cor/segmento
- Contribuição da comunidade

### Entregáveis
- ✅ CRUD de paletas (CRUD completo)
- ✅ Sistema de ratings (votação 1-5 estrelas)
- ✅ Filtros avançados (por categoria, tags)
- ✅ Interface de navegação (frontend)

### Arquivos criados
- `backend/app/services/palette_db.py` — Banco de dados de paletas
- `backend/app/routes/advanced.py` — Endpoints API
- `frontend/src/components/advanced/PaletteViewer.tsx` — Componente visualizador

---

## 7.4 Banco de Fontes

### O que é
Coleção de combinações de fontes testadas e aprovadas.

### Por que fazer
Font pairing é difícil para não-designers. Banco de combinações testadas economiza tempo.

### O que se espera alcançar
- Combinações pré-testadas
- Preview ao vivo
- Rating da comunidade
- Filtros por estilo

### Entregáveis
- ✅ Font pairing sugerido (heading + body + mono)
- ✅ Preview interativo (componentes com fontes)
- ✅ Sistema de ratings (votação 1-5 estrelas)
- ✅ Filtros por estilo (modern, classic, tech, etc.)

### Arquivos criados
- `backend/app/services/font_db.py` — Banco de dados de fontes
- `frontend/src/components/advanced/FontViewer.tsx` — Componente visualizador

---

## 7.5 Templates

### O que é
Designs prontos para segmentos comuns (blog, portfolio, e-commerce).

### Por que fazer
Usuários podem começar rapidamente com templates em vez de começar do zero.

### O que se espera alcançar
- Templates para segmentos comuns
- Customização via UI
- Exportação completa
- Preview em contexto real

### Entregáveis
- ✅ Templates prontos (6 templates inclusos)
- ✅ Customização visual (preview interativo)
- ✅ Exportação completa (JSON, CSS, Tailwind)
- ✅ Preview em mockups (frontend)

### Arquivos criados
- `backend/app/services/templates.py` — Banco de templates
- `backend/app/services/template_exporter.py` — Exportador de templates
- `frontend/src/components/advanced/TemplateViewer.tsx` — Componente visualizador

---

## Arquitetura

### Backend
```
backend/app/
├── services/
│   ├── vectorization.py      # Vetorização PNG→SVG
│   ├── typographic_logo.py   # Geração de logos tipográficas
│   ├── palette_db.py         # Banco de paletas
│   ├── font_db.py            # Banco de fontes
│   ├── templates.py          # Banco de templates
│   └── template_exporter.py  # Exportação de templates
└── routes/
    └── advanced.py           # Endpoints (/api/v1/advanced/*)
```

### Frontend
```
frontend/src/
├── app/
│   └── advanced/
│       └── page.tsx          # Página principal
└── components/
    └── advanced/
        ├── Vectorize.tsx       # Vetorização
        ├── TypographicLogo.tsx # Logo tipográfica
        ├── PaletteViewer.tsx   # Visualizador de paletas
        ├── FontViewer.tsx      # Visualizador de fontes
        ├── TemplateViewer.tsx  # Visualizador de templates
        └── index.ts            # Exportação
```

---

## Endpoints API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/advanced/vectorize` | Vetorizar imagem PNG→SVG |
| POST | `/api/v1/advanced/logo/typographic` | Gerar logo tipográfica |
| GET | `/api/v1/advanced/palettes` | Listar paletas |
| GET | `/api/v1/advanced/palettes/{id}` | Buscar paleta por ID |
| POST | `/api/v1/advanced/palettes` | Criar paleta |
| POST | `/api/v1/advanced/palettes/{id}/vote` | Votar paleta |
| GET | `/api/v1/advanced/fonts` | Listar fontes |
| GET | `/api/v1/advanced/fonts/{id}` | Buscar fonte por ID |
| POST | `/api/v1/advanced/fonts/{id}/vote` | Votar fonte |
| GET | `/api/v1/advanced/templates` | Listar templates |
| GET | `/api/v1/advanced/templates/{id}` | Buscar template por ID |
| GET | `/api/v1/advanced/templates/premium` | Listar templates premium |

---

## Testes

### Backend
```bash
# Testar serviços
python -m pytest backend/app/services/ -v
```

### Frontend
```bash
# Testar componentes
pnpm test -- frontend/src/components/advanced/
```

---

## Próximos Passos

1. Implementar banco de dados real (substituir memória por SQLite/PostgreSQL)
2. Adicionar sistema de comentários nas paletas/fontes
3. Implementar sistema de upload de templates pela comunidade
4. Adicionar integração com Instagram/Pinterest para inspiração
5. Implementar sistema de favoritos (usuário pode salvar templates)

---

## Status

- [x] 7.1 Vetorização PNG→SVG
- [x] 7.2 Logo tipográfica
- [x] 7.3 Banco de paletas
- [x] 7.4 Banco de fontes
- [x] 7.5 Templates
- [x] Documentação
- [x] Integração com API
- [x] Frontend components

**Status:** ✅ COMPLETO
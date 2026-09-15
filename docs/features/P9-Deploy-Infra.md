# P9 — Deploy & Infra

**Horas estimadas:** ~60h | **Dependências:** P8 | **Risco:** Baixo

## Resumo

Deploy transforma um projeto local em produto acessível. Infraestrutura adequada garante disponibilidade e confiabilidade. Inclui versionamento hospedado, monitoramento, backup automático e restore.

---

## 9.1 Versão Hospedada

### O que é
Deploy para a web para usuários que não querem rodar local.

### Por que fazer
Nem todos os usuários querem ou podem rodar o projeto localmente. Uma versão hospedada amplia o alcance.

### O que se espera alcançar
- Frontend na Vercel
- Backend no Railway/Render
- Banco na nuvem (opcional)
- Domínio próprio

### Entregáveis
- ✅ Configuração Vercel (vercel.json)
- ✅ Configuração Railway (railway.toml)
- ✅ Domínio customizado
- ✅ SSL automático
- ✅ Página de deploy status

### Arquivos criados
- `frontend/vercel.json` — Configuração de deploy na Vercel
- `backend/railway.toml` — Configuração de deploy no Railway
- `frontend/src/app/deployment/page.tsx` — Página de status de deploy

---

## 9.2 Monitoramento

### O que é
Sistema de monitoramento de logs, métricas e alertas.

### Por que fazer
Monitoramento permite detectar e resolver problemas rapidamente, garantindo disponibilidade.

### O que se espera alcançar
- Logs centralizados
- Métricas de uso
- Alertas de problemas
- Dashboard de saúde

### Entregáveis
- ✅ Métricas Prometheus (requests, latency, errors)
- ✅ Endpoint de saúde (/health, /monitoring/health)
- ✅ Dashboard de monitoramento
- ✅ Alertas de erros
- ✅ Logging estruturado

### Arquivos criados
- `backend/app/services/monitoring.py` — Serviço de monitoramento
- `backend/app/routes/deployment.py` — Endpoints de deploy/monitoramento
- `frontend/src/components/deployment/MonitoringDashboard.tsx` — Dashboard visual

---

## 9.3 Backup Automático

### O que é
Backup regular do banco de dados.

### Por que fazer
Dados são o ativo mais importante. Backup protege contra perda por falhas técnicas.

### O que se espera alcançar
- Backups semanais
- Armazenamento seguro
- Retenção configurável
- Notificação de falhas

### Entregáveis
- ✅ Script de backup (backup.py)
- ✅ Agendamento configurável
- ✅ Armazenamento local/cloud
- ✅ Validação de integridade
- ✅ Limpeza automática de backups antigos

### Arquivos criados
- `backend/app/services/backup.py` — Serviço de backup
- `backend/scripts/restore.py` — Script de restore
- `frontend/src/components/deployment/BackupInfo.tsx` — Interface de backup

---

## 9.4 Restore Manual

### O que é
Processo documentado para restaurar backups.

### Por que fazer
Backup sem processo de restore é inútil. Documentação clara garante recuperação em caso de desastre.

### O que se espera alcançar
- Documentação passo a passo
- Script de restore
- Validação de integridade
- Tempo de recuperação mensurável

### Entregáveis
- ✅ Documentação completa
- ✅ Script `restore.py`
- ✅ Validação de integridade
- ✅ SLA de recuperação

### Arquivos criados
- `backend/scripts/restore.py` — Script de restore
- `backend/app/routes/deployment.py` — Endpoints de restore

---

## Arquitetura

### Backend
```
backend/app/
├── services/
│   ├── backup.py          # Backup service
│   └── monitoring.py      # Monitoring & metrics
├── routes/
│   └── deployment.py      # Deploy endpoints
└── scripts/
    └── restore.py         # Restore script

backend/
└── railway.toml           # Railway config
```

### Frontend
```
frontend/src/
├── app/
│   └── deployment/
│       └── page.tsx          # Deploy page
└── components/
    └── deployment/
        ├── BackupInfo.tsx       # Backup UI
        └── MonitoringDashboard.tsx # Monitoring UI
```

---

## Endpoints API

### Deploy
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/deployment/deploy/status` | Status de deploy |
| GET | `/api/v1/deployment/deploy/config` | Configuração de deploy |

### Monitoring
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/deployment/monitoring/health` | Health check |
| GET | `/api/v1/deployment/monitoring/metrics` | Prometheus metrics |
| GET | `/api/v1/deployment/monitoring/stats` | Estatísticas |
| GET | `/api/v1/deployment/monitoring/config` | Configuração |

### Backup
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/deployment/backup/list` | Listar backups |
| POST | `/api/v1/deployment/backup/create` | Criar backup |
| POST | `/api/v1/deployment/backup/cleanup` | Limpar backups antigos |
| POST | `/api/v1/deployment/backup/validate/{name}` | Validar backup |
| GET | `/api/v1/deployment/backup/schedule` | Configuração de agendamento |
| GET | `/api/v1/deployment/backup/stats` | Estatísticas de backup |

### Restore
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/deployment/backup/restore/{name}` | Restaurar backup |
| POST | `/api/v1/deployment/backup/restore/latest` | Restaurar mais recente |

---

## Testes

### Backend
```bash
python -m pytest backend/app/services/test_backup.py -v
python -m pytest backend/app/services/test_monitoring.py -v
python scripts/restore.py --list
python scripts/restore.py --validate backup_20240101_020000.sqlite
```

### Frontend
```bash
pnpm test -- frontend/src/components/deployment/
```

---

## Próximos Passos

1. Configurar webhook para notificação de backups
2. Adicionar suporte a backup automático via cron job
3. Implementar backup em nuvem (S3, Google Cloud Storage)
4. Adicionar alertas de falha de backup
5. Criar dashboard de métricas avançado

---

## Status

- [x] 9.1 Versão hospedada
- [x] 9.2 Monitoramento
- [x] 9.3 Backup automático
- [x] 9.4 Restore manual
- [x] Documentação
- [x] Integração com API
- [x] Frontend components

**Status:** ✅ COMPLETO
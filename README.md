# EVVA Painel Web/Mobile

Painel gerencial responsivo para a proprietária acompanhar a loja **EVVA** remotamente.

---

## Características

- ✅ **Dashboard** com métricas em tempo real
- ✅ **Autenticação** via Supabase Auth
- ✅ **Responsivo** para celular, tablet e desktop
- ✅ **PWA Ready** (pode ser instalado como app)
- ✅ **Identidade visual** EVVA (branco, preto, dourado)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Roteamento | React Router v6 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Build | Vite |

---

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com credenciais do Supabase

# 3. Rodar em desenvolvimento
npm run dev
# Acessar: http://localhost:5174

# 4. Build de produção
npm run build
npm run preview
```

---

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_STORE_ID=evva-loja-001
```

**Importante:** Usar a mesma `VITE_STORE_ID` do aplicativo desktop.

---

## Estrutura

```
evva-painel/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, BottomNav, AppLayout
│   │   └── ui/              # Button, Card, Input, Badge, Spinner
│   ├── pages/               # Login, Dashboard, Sales, Stock, Reports
│   ├── services/            # Integração Supabase
│   ├── lib/                 # Supabase client, auth
│   ├── utils/               # currency, date, cn
│   ├── router/              # React Router config
│   ├── index.css            # Tailwind + custom styles
│   └── main.tsx             # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Funcionalidades

### Dashboard
- Vendas de hoje
- Faturamento de hoje
- Total de vendas (30 dias)
- Ticket médio
- Produtos mais vendidos
- Atualização manual

### Autenticação
- Login com email/senha (Supabase Auth)
- Proteção de rotas
- Logout

### Responsividade
- **Mobile:** Navegação inferior (bottom nav)
- **Desktop:** Header completo com ações
- **Tablet:** Layout adaptativo

---

## Deploy

### Vercel (recomendado)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Upload da pasta dist/
```

### Configurar variáveis de ambiente no serviço de hospedagem.

---

## Segurança

### Row Level Security (RLS)

O Supabase deve ter políticas RLS configuradas:

```sql
-- Apenas proprietária autenticada pode ler dados da loja
CREATE POLICY "Proprietária pode ler vendas"
ON sales FOR SELECT
TO authenticated
USING (store_id = current_setting('app.store_id'));
```

### Não expor service_role key

- Usar apenas `anon key` no frontend
- Todas as queries filtradas por `store_id`
- Autenticação obrigatória

---

## Melhorias Futuras

- [ ] Gráficos de vendas (Recharts)
- [ ] Filtros de período avançados
- [ ] Notificações push
- [ ] Estoque baixo em destaque
- [ ] Exportar relatórios PDF
- [ ] PWA manifest para instalação
- [ ] Modo offline com cache

---

## Suporte a Navegadores

- Chrome/Edge ≥ 90
- Safari ≥ 14
- Firefox ≥ 88
- Mobile Safari (iOS ≥ 14)
- Chrome Android (≥ 90)

---

## Licença

Desenvolvido pela **LGTec** para **EVVA**.

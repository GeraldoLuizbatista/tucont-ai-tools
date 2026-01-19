# 🚀 TUCONT AI TOOLS - GUIA COMPLETO DE DEPLOY

## 📋 PRÉ-REQUISITOS

- Node.js 18+ instalado
- Conta no GitHub
- Conta na Vercel (gratuita)
- Conta no Supabase (gratuita)

---

## 🏁 PASSO 1: CONFIGURAR BANCO DE DADOS (Supabase)

### 1.1 Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Crie uma conta (se não tiver)
3. Clique em "New Project"
4. Preencha:
   - Nome: `tucont-ai-tools`
   - Password do banco: Anote essa senha!
   - Região: South America (São Paulo)
5. Aguarde 2-3 minutos para provisionar

### 1.2 Obter Connection String

1. No painel do Supabase, vá em **Settings** (engrenagem) → **Database**
2. Em "Connection string", copie a **URI** (formato: `postgresql://...`)
3. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou
4. Salve essa string, você vai usar no .env

---

## 🏁 PASSO 2: CLONAR E CONFIGURAR PROJETO

### 2.1 No Terminal/CMD

```bash
# Entre no diretório do projeto que você já tem
cd /Users/Geraldo/tucont-ai-tools

# Instalar dependências novas
npm install @prisma/client prisma next-auth bcryptjs rss-parser cheerio date-fns react-hook-form react-hot-toast swr

# Criar arquivo .env
cp .env.example .env
```

### 2.2 Editar arquivo .env

Abra o arquivo `.env` e preencha:

```env
# Cole a Connection String do Supabase aqui
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres"

# Gere uma chave secreta aleatória (use o comando abaixo ou gere online)
# No Mac/Linux: openssl rand -base64 32
NEXTAUTH_SECRET="SUA-CHAVE-SECRETA-ALEATORIA-AQUI"

NEXTAUTH_URL="http://localhost:3000"

# Opcional (para resumos de notícias com GPT-4)
OPENAI_API_KEY="sk-..." # Deixe vazio por enquanto
```

---

## 🏁 PASSO 3: CONFIGURAR PRISMA E BANCO

```bash
# Gerar cliente do Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular banco com dados iniciais (usuário admin + exemplos)
node prisma/seed.js
```

### Credenciais do Admin:
- **Email**: `admin@iuptec.com.br`
- **Senha**: `admin123`
- **⚠️ IMPORTANTE**: Trocar depois do primeiro login!

---

## 🏁 PASSO 4: TESTAR LOCALMENTE

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse:
- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

✅ **Teste tudo:**
- Login no admin
- Adicionar uma ferramenta
- Verificar se aparece no site
- Clicar em uma ferramenta (testar tracking)

---

## 🏁 PASSO 5: DEPLOY NA VERCEL

### 5.1 Preparar Repositório GitHub

```bash
# Inicializar Git (se ainda não tiver)
git init
git add .
git commit -m "Initial commit - Tucont AI Tools"

# Criar repositório no GitHub (via web)
# Depois conectar:
git remote add origin https://github.com/SEU-USUARIO/tucont-ai-tools.git
git branch -M main
git push -u origin main
```

### 5.2 Deploy na Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `tucont-ai-tools`
5. Configure as **Environment Variables**:

```
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=https://SEU-DOMINIO.vercel.app
```

6. Clique em **Deploy**
7. Aguarde 2-3 minutos

### 5.3 Configurar Domínio Personalizado

1. Na Vercel, vá em **Settings** → **Domains**
2. Adicione: `tools.iuptec.com.br`
3. Siga as instruções para configurar DNS:
   - Tipo: CNAME
   - Nome: tools
   - Valor: cname.vercel-dns.com

---

## 🏁 PASSO 6: CONFIGURAR PROGRAMAS DE AFILIADOS

### Ferramentas com Bons Programas:

1. **OpenAI** - Sem programa oficial, use indireto
2. **Jasper.ai** - https://www.jasper.ai/affiliates
3. **Copy.ai** - https://www.copy.ai/affiliate
4. **Notion** - https://www.notion.so/affiliates
5. **Canva** - https://www.canva.com/affiliates

### Como Aplicar:

1. Acesse cada link de programa de afiliados
2. Preencha cadastro
3. Aguarde aprovação (1-3 dias)
4. Copie seu link de afiliado
5. No admin, edite a ferramenta e cole no campo "Link de Afiliado"

---

## 🏁 PASSO 7: CONFIGURAR CAPTURA DE LEADS

### Opção 1: Email Direto (Simples)

No arquivo `pages/api/leads.js`, adicione envio de email:

```javascript
// Instalar: npm install nodemailer
const nodemailer = require('nodemailer')

// Configurar SMTP (Gmail, Outlook, etc)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contato@iuptec.com.br',
    pass: 'sua-senha-de-app' // Gerar no Gmail
  }
})

// Após criar lead no banco:
await transporter.sendMail({
  from: 'tucont@iuptec.com.br',
  to: 'comercial@iuptec.com.br',
  subject: `Novo Lead: ${lead.name}`,
  html: `
    <h2>Novo Lead Capturado!</h2>
    <p><strong>Nome:</strong> ${lead.name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    <p><strong>Empresa:</strong> ${lead.company}</p>
    <p><strong>Interesse:</strong> ${lead.interest}</p>
  `
})
```

### Opção 2: Zapier/Make (Recomendado)

1. Criar Zap no Zapier:
   - Trigger: Webhook (POST)
   - Action: Enviar email / Adicionar no CRM / Notificar Slack
2. Copiar URL do webhook
3. Adicionar no `.env`: `IUPTEC_WEBHOOK_URL="https://hooks.zapier.com/..."`
4. No código, fazer POST para esse webhook após criar lead

---

## 🏁 PASSO 8: AGREGADOR DE NOTÍCIAS (Automático)

### 8.1 Criar Página de Notícias

Arquivo: `pages/news.js`

```javascript
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function News() {
  const { data: news = [] } = useSWR('/api/news', fetcher)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold gradient-text mb-8">Notícias de IA</h1>
      <div className="grid gap-6">
        {news.map(item => (
          <div key={item.id} className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-400 mb-4">{item.summary}</p>
            <a href={item.url} target="_blank" className="text-primary-cyan">
              Ler mais →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 8.2 API de Notícias

Arquivo: `pages/api/news.js`

```javascript
import prisma from '@/lib/prisma'
import Parser from 'rss-parser'

const parser = new Parser()

const RSS_FEEDS = [
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
]

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const news = await prisma.newsItem.findMany({
      where: { active: true },
      orderBy: { publishedAt: 'desc' },
      take: 20
    })
    return res.json(news)
  }

  // Cron job para atualizar (chamar diariamente)
  if (req.method === 'POST') {
    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl)
      
      for (const item of feed.items.slice(0, 5)) {
        await prisma.newsItem.upsert({
          where: { url: item.link },
          update: {},
          create: {
            title: item.title,
            summary: item.contentSnippet?.slice(0, 300) || '',
            url: item.link,
            source: feed.title,
            publishedAt: new Date(item.pubDate)
          }
        })
      }
    }
    return res.json({ success: true })
  }
}
```

### 8.3 Configurar Cron Job

Na Vercel, use **Vercel Cron Jobs**:

Arquivo: `vercel.json`

```json
{
  "crons": [{
    "path": "/api/news",
    "schedule": "0 8 * * *"
  }]
}
```

---

## 📊 PASSO 9: MÉTRICAS E ANALYTICS

### Google Analytics

1. Criar propriedade no GA4
2. Copiar ID (G-XXXXXXXXXX)
3. Adicionar no `pages/_app.js`:

```javascript
import Script from 'next/script'

// Adicionar dentro do return:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## ✅ CHECKLIST FINAL

- [ ] Banco configurado no Supabase
- [ ] Projeto rodando local
- [ ] Admin funcional (pode adicionar/editar ferramentas)
- [ ] Deploy na Vercel funcionando
- [ ] Domínio personalizado configurado
- [ ] Tracking de cliques funcionando
- [ ] Modal de leads aparecendo
- [ ] Primeiros programas de afiliados configurados
- [ ] Analytics instalado

---

## 🎯 PRÓXIMOS PASSOS (SEMANAS 1-4)

### Semana 1:
- Adicionar 50+ ferramentas manualmente
- Cadastrar em 5-10 programas de afiliados
- Configurar integração de leads com email/Zapier

### Semana 2:
- Implementar agregador de notícias
- Criar primeira newsletter
- SEO: títulos, meta descriptions, sitemap

### Semana 3:
- Conteúdo: escrever 1 artigo (com ajuda de IA)
- Começar a divulgar (LinkedIn, grupos, etc)
- Monitorar primeiros leads

### Semana 4:
- Análise de métricas
- Otimização de conversão
- Adicionar mais ferramentas

---

## 🆘 SUPORTE

**Problemas com:**
- Banco de dados → Supabase Docs
- Deploy → Vercel Docs
- Código → [Documentação do projeto]

**Contato:**
- Email: contato@iuptec.com.br
- GitHub Issues: [link do repo]

---

## 🎉 PARABÉNS!

Seu catálogo de ferramentas de IA está no ar! 🚀

Foco agora:
1. Adicionar MUITAS ferramentas (meta: 100+)
2. Conseguir tráfego (SEO, redes sociais)
3. Converter leads para Iuptec
4. Ganhar com afiliados

**Sucesso! 💪**

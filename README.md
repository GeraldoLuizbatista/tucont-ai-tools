# 🚀 Tucont AI Tools

> Catálogo curado das melhores ferramentas de Inteligência Artificial

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![License](https://img.shields.io/badge/license-MIT-green)

## 📖 Sobre

Tucont AI Tools é um catálogo completo e atualizado das melhores ferramentas de IA do mercado, desenvolvido pela **Iuptec** para:

✅ Gerar leads qualificados  
✅ Estabelecer autoridade no nicho de IA  
✅ Monetizar com programas de afiliados  
✅ Automatizar curadoria de conteúdo  

## ✨ Funcionalidades

### Para Usuários:
- 🔍 Busca avançada por nome e descrição
- 📁 Filtros por categoria (13 categorias)
- ⭐ Destaque para ferramentas populares
- 🎯 Modal de captura de leads para consultoria
- 📰 Agregador automático de notícias de IA

### Para Administradores:
- 🛠️ Painel admin completo
- ➕ CRUD de ferramentas e categorias
- 📊 Dashboard com estatísticas
- 📧 Gerenciamento de leads capturados
- 📈 Tracking de cliques (afiliados)
- 🔐 Autenticação segura

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **Autenticação**: NextAuth.js
- **Deploy**: Vercel
- **Estilo**: Dark mode + Glassmorphism

## 🚀 Instalação Rápida

```bash
# Clonar projeto
git clone https://github.com/iuptec/tucont-ai-tools.git
cd tucont-ai-tools

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Setup banco de dados
npx prisma generate
npx prisma db push
node prisma/seed.js

# Iniciar desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

**Admin**: http://localhost:3000/admin/login
- Email: `admin@iuptec.com.br`
- Senha: `admin123`

## 📚 Documentação

- [Guia Completo de Deploy](./DEPLOY.md)
- [Estrutura do Projeto](#estrutura)
- [API Reference](#api)

## 📂 Estrutura

```
tucont-ai-tools/
├── pages/
│   ├── index.js          # Página principal
│   ├── admin/
│   │   ├── index.js      # Dashboard admin
│   │   ├── login.js      # Login
│   │   ├── tools.js      # Gerenciar ferramentas
│   │   └── leads.js      # Leads capturados
│   └── api/
│       ├── tools.js      # CRUD ferramentas
│       ├── categories.js # CRUD categorias
│       ├── leads.js      # Captura de leads
│       ├── track-click.js# Tracking de cliques
│       └── auth/[...nextauth].js
├── components/
│   └── LeadCaptureModal.js
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── seed.js           # Dados iniciais
├── lib/
│   └── prisma.js         # Cliente Prisma
└── styles/
    └── globals.css       # Estilos globais
```

## 🎨 Design System

### Cores
- **Fundo**: `#0A0F14` (Dark mode)
- **Laranja**: `#FDB913` (CTAs e destaques)
- **Ciano**: `#2DD4BF` (Links e interações)

### Componentes
- Glass cards com backdrop blur
- Gradientes suaves
- Animações de hover
- Bordas animadas

## 📈 Roadmap

- [x] Catálogo de ferramentas
- [x] Painel admin
- [x] Sistema de leads
- [x] Tracking de afiliados
- [ ] Agregador de notícias
- [ ] Newsletter automática
- [ ] Sistema de votação
- [ ] Comparador de ferramentas
- [ ] API pública

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro.

## 📄 Licença

MIT © 2026 Iuptec

## 👥 Equipe

Desenvolvido com ❤️ pela **Iuptec**  
https://iuptec.com.br

---

**🎯 Meta: 100+ ferramentas | 📊 Status: Em crescimento | 🚀 v3.0.0**

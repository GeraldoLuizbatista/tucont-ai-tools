const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@iuptec.com.br' },
    update: {},
    create: {
      email: 'admin@iuptec.com.br',
      password: hashedPassword,
      name: 'Admin Iuptec',
      role: 'admin'
    }
  })
  console.log('✅ Usuário admin criado:', user.email)

  // Criar categorias
  const categories = [
    { name: 'Infraestrutura', slug: 'infraestrutura', icon: '🏗️', order: 1 },
    { name: 'Assistentes', slug: 'assistentes', icon: '🤖', order: 2 },
    { name: 'Agentes', slug: 'agentes', icon: '🕵️', order: 3 },
    { name: 'Imagens', slug: 'imagens', icon: '🎨', order: 4 },
    { name: 'Áudio', slug: 'audio', icon: '🔊', order: 5 },
    { name: 'Vídeo', slug: 'video', icon: '🎬', order: 6 },
    { name: 'Código', slug: 'codigo', icon: '💻', order: 7 },
    { name: 'Apresentações', slug: 'apresentacoes', icon: '📊', order: 8 },
    { name: 'Produtividade', slug: 'produtividade', icon: '⚡', order: 9 },
    { name: 'Prompts', slug: 'prompts', icon: '💬', order: 10 },
    { name: 'Marketing', slug: 'marketing', icon: '📢', order: 11 },
    { name: 'Dados & Análise', slug: 'dados', icon: '📈', order: 12 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
  }
  console.log('✅ Categorias criadas')

  // Criar ferramentas de exemplo
  const infraCat = await prisma.category.findUnique({ where: { slug: 'infraestrutura' } })
  const assistCat = await prisma.category.findUnique({ where: { slug: 'assistentes' } })
  const imagensCat = await prisma.category.findUnique({ where: { slug: 'imagens' } })
  const codigoCat = await prisma.category.findUnique({ where: { slug: 'codigo' } })

  const tools = [
    {
      name: 'OpenAI API',
      slug: 'openai-api',
      description: 'API da OpenAI com GPT-4, DALL-E e mais',
      logo: '🔷',
      link: 'https://platform.openai.com',
      affiliateLink: 'https://platform.openai.com',
      categoryId: infraCat.id,
      subcategory: 'APIs',
      featured: true
    },
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'Assistente conversacional da OpenAI',
      logo: '🤖',
      link: 'https://chat.openai.com',
      affiliateLink: 'https://chat.openai.com',
      categoryId: assistCat.id,
      subcategory: 'Texto',
      featured: true
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'Geração de imagens de alta qualidade',
      logo: '🎨',
      link: 'https://midjourney.com',
      affiliateLink: 'https://midjourney.com',
      categoryId: imagensCat.id,
      subcategory: 'Geração',
      featured: true
    },
    {
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'Par programming com IA',
      logo: '💻',
      link: 'https://github.com/features/copilot',
      affiliateLink: 'https://github.com/features/copilot',
      categoryId: codigoCat.id,
      subcategory: 'Assistente',
      featured: true
    }
  ]

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool
    })
  }
  console.log('✅ Ferramentas de exemplo criadas')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

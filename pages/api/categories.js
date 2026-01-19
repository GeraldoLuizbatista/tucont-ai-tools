import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  // GET - Listar categorias (público)
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { tools: true }
          }
        },
        orderBy: { order: 'asc' }
      })

      return res.status(200).json(categories)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar categorias' })
    }
  }

  // POST - Criar categoria (protegido)
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    try {
      const { name, icon, order } = req.body

      const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const category = await prisma.category.create({
        data: { name, slug, icon, order: order || 0 }
      })

      return res.status(201).json(category)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar categoria' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

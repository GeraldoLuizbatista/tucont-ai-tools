import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  // GET - Listar ferramentas (público)
  if (req.method === 'GET') {
    try {
      const { category, featured, search } = req.query
      
      const where = {
        active: true,
        ...(category && category !== 'all' && { category: { slug: category } }),
        ...(featured === 'true' && { featured: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      }

      const tools = await prisma.tool.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { clicks: true }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      })

      return res.status(200).json(tools)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar ferramentas' })
    }
  }

  // POST - Criar ferramenta (protegido)
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    try {
      const { name, description, logo, link, affiliateLink, categoryId, subcategory, featured } = req.body

      // Gerar slug
      const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const tool = await prisma.tool.create({
        data: {
          name,
          slug,
          description,
          logo,
          link,
          affiliateLink: affiliateLink || link,
          categoryId,
          subcategory,
          featured: featured || false
        }
      })

      return res.status(201).json(tool)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao criar ferramenta' })
    }
  }

  // PUT - Atualizar ferramenta (protegido)
  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    try {
      const { id, ...data } = req.body

      const tool = await prisma.tool.update({
        where: { id },
        data
      })

      return res.status(200).json(tool)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar ferramenta' })
    }
  }

  // DELETE - Deletar ferramenta (protegido)
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    try {
      const { id } = req.query

      await prisma.tool.delete({
        where: { id }
      })

      return res.status(200).json({ message: 'Ferramenta deletada' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar ferramenta' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

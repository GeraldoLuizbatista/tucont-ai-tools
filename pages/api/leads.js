import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, company, phone, interest, message, source } = req.body

      // Validação básica
      if (!name || !email || !interest) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' })
      }

      // Criar lead
      const lead = await prisma.lead.create({
        data: {
          name,
          email,
          company,
          phone,
          interest,
          message,
          source: source || 'unknown'
        }
      })

      // TODO: Enviar email para Iuptec
      // TODO: Integrar com webhook/Zapier se configurado

      return res.status(201).json({ 
        success: true,
        message: 'Lead capturado com sucesso!' 
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao capturar lead' })
    }
  }

  // GET - Listar leads (admin apenas)
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    try {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(leads)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar leads' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

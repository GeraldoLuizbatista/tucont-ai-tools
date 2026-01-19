import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { toolId } = req.body
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const userAgent = req.headers['user-agent']

      // Registrar clique
      await prisma.click.create({
        data: {
          toolId,
          ip,
          userAgent
        }
      })

      // Buscar link de afiliado
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
        select: { affiliateLink: true }
      })

      return res.status(200).json({ 
        success: true,
        redirectUrl: tool?.affiliateLink 
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao registrar clique' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

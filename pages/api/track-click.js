import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { toolId } = req.body
      
      // Buscar o link da ferramenta no banco de dados
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
        select: { link: true }  // Busca APENAS o campo 'link'
      })

      if (!tool) {
        return res.status(404).json({ error: 'Ferramenta não encontrada' })
      }

      // Registrar o clique (opcional - pode remover se não quiser)
      await prisma.click.create({
        data: {
          toolId,
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      })

      // Retornar o link para redirecionamento
      return res.status(200).json({ 
        success: true,
        redirectUrl: tool.link  // Usa o link normal da ferramenta
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao registrar clique' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
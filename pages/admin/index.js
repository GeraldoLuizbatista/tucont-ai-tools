import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data: tools = [] } = useSWR('/api/tools', fetcher)
  const { data: categories = [] } = useSWR('/api/categories', fetcher)
  const { data: leads = [] } = useSWR('/api/leads', fetcher)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalClicks = tools.reduce((acc, tool) => acc + (tool._count?.clicks || 0), 0)
  const newLeadsToday = leads.filter(lead => {
    const today = new Date().toDateString()
    return new Date(lead.createdAt).toDateString() === today
  }).length

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard Admin</h1>
            <p className="text-gray-400">Bem-vindo, {session.user.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <button className="glass-btn px-6 py-3 rounded-xl font-semibold">
                Ver Site
              </button>
            </Link>
            <button 
              onClick={() => router.push('/api/auth/signout')}
              className="bg-red-500/20 text-red-400 px-6 py-3 rounded-xl font-semibold border border-red-500/30 hover:bg-red-500/30"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="text-4xl mb-2">🛠️</div>
            <h3 className="text-3xl font-bold text-primary-cyan mb-1">{tools.length}</h3>
            <p className="text-gray-400">Ferramentas</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="text-4xl mb-2">📁</div>
            <h3 className="text-3xl font-bold text-primary-orange mb-1">{categories.length}</h3>
            <p className="text-gray-400">Categorias</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-3xl font-bold text-primary-cyan mb-1">{leads.length}</h3>
            <p className="text-gray-400">Leads Totais</p>
            {newLeadsToday > 0 && (
              <p className="text-xs text-primary-orange mt-1">+{newLeadsToday} hoje</p>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="text-4xl mb-2">🖱️</div>
            <h3 className="text-3xl font-bold text-primary-orange mb-1">{totalClicks}</h3>
            <p className="text-gray-400">Cliques Totais</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/tools">
              <button className="w-full glass-btn p-6 rounded-xl hover:scale-105 transition text-left">
                <div className="text-3xl mb-2">🛠️</div>
                <h3 className="font-bold text-lg mb-1">Gerenciar Ferramentas</h3>
                <p className="text-sm text-gray-400">Adicionar, editar ou remover</p>
              </button>
            </Link>

            <Link href="/admin/leads">
              <button className="w-full glass-btn p-6 rounded-xl hover:scale-105 transition text-left">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-bold text-lg mb-1">Ver Leads</h3>
                <p className="text-sm text-gray-400">Contatos capturados</p>
              </button>
            </Link>

            <Link href="/admin/categories">
              <button className="w-full glass-btn p-6 rounded-xl hover:scale-105 transition text-left">
                <div className="text-3xl mb-2">📁</div>
                <h3 className="font-bold text-lg mb-1">Categorias</h3>
                <p className="text-sm text-gray-400">Organizar ferramentas</p>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Últimos Leads</h2>
            <Link href="/admin/leads">
              <button className="text-primary-cyan hover:text-primary-orange transition text-sm">
                Ver todos →
              </button>
            </Link>
          </div>
          
          {leads.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum lead capturado ainda</p>
          ) : (
            <div className="space-y-4">
              {leads.slice(0, 5).map(lead => (
                <div key={lead.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{lead.name}</h3>
                    <p className="text-sm text-gray-400">{lead.email}</p>
                    {lead.company && (
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-primary-cyan/20 text-primary-cyan px-3 py-1 rounded-full border border-primary-cyan/30">
                      {lead.interest}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

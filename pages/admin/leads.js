import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminLeads() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { data: leads = [] } = useSWR('/api/leads', fetcher)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>
  if (!session) return null

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-text">Leads ({leads.length})</h1>
          <Link href="/admin"><button className="glass-btn px-6 py-3 rounded-xl">← Dashboard</button></Link>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl">
            <div className="text-8xl mb-6">📧</div>
            <h3 className="text-2xl font-bold mb-2">Nenhum lead ainda</h3>
            <p className="text-gray-400">Os leads aparecerão aqui</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map(l => (
              <div key={l.id} className="glass-card rounded-2xl p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{l.name}</h3>
                    <p className="text-gray-400">{l.email}</p>
                    {l.company && <p className="text-sm text-gray-500">🏢 {l.company}</p>}
                    {l.phone && <p className="text-sm text-gray-500">📞 {l.phone}</p>}
                  </div>
                  <div className="text-right">
                    <span className="bg-primary-cyan/20 text-primary-cyan px-3 py-1 rounded-full text-xs">{l.interest}</span>
                    <p className="text-xs text-gray-500 mt-2">{new Date(l.createdAt).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-gray-600">Via: {l.source}</p>
                  </div>
                </div>
                {l.message && (
                  <div className="p-4 glass-card rounded-xl">
                    <p className="text-sm text-gray-300">{l.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

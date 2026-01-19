import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminCategories() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  
  const { data: categories = [], mutate } = useSWR('/api/categories', fetcher)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Categoria criada!')
        mutate()
        reset()
        setShowForm(false)
      } else {
        toast.error('Erro ao criar categoria')
      }
    } catch (error) {
      toast.error('Erro ao criar categoria')
    }
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>
  if (!session) return null

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-center" />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gerenciar Categorias</h1>
            <p className="text-gray-400">Total: {categories.length} categorias</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin">
              <button className="glass-btn px-6 py-3 rounded-xl">← Dashboard</button>
            </Link>
            <button
              onClick={() => { setShowForm(!showForm); reset(); }}
              className="bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-6 py-3 rounded-xl font-bold"
            >
              {showForm ? 'Cancelar' : '+ Nova Categoria'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Nova Categoria</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register('name', { required: true })} placeholder="Nome da categoria" className="w-full glass-card px-4 py-3 rounded-xl text-white" />
              <input {...register('icon', { required: true })} placeholder="Ícone (emoji)" className="w-full glass-card px-4 py-3 rounded-xl text-white" />
              <input {...register('order')} type="number" placeholder="Ordem (opcional)" className="w-full glass-card px-4 py-3 rounded-xl text-white" />
              <button type="submit" className="w-full bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg py-4 rounded-xl font-bold">
                Criar Categoria
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{cat.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <p className="text-sm text-gray-400">{cat._count?.tools || 0} ferramentas</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

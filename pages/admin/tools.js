import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminTools() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingTool, setEditingTool] = useState(null)
  
  const { data: tools = [], mutate } = useSWR('/api/tools', fetcher)
  const { data: categories = [] } = useSWR('/api/categories', fetcher)
  const { register, handleSubmit, reset, setValue } = useForm()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (editingTool) {
      Object.keys(editingTool).forEach(key => setValue(key, editingTool[key]))
    }
  }, [editingTool, setValue])

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/tools', {
        method: editingTool ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTool ? { ...data, id: editingTool.id } : data)
      })
      if (response.ok) {
        toast.success(editingTool ? 'Atualizado!' : 'Criado!')
        mutate()
        reset()
        setShowForm(false)
        setEditingTool(null)
      }
    } catch (error) {
      toast.error('Erro')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deletar?')) return
    try {
      await fetch(`/api/tools?id=${id}`, { method: 'DELETE' })
      toast.success('Deletado!')
      mutate()
    } catch (error) {
      toast.error('Erro')
    }
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>
  if (!session) return null

  return (
    <div className="min-h-screen p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-text">Ferramentas ({tools.length})</h1>
          <div className="flex gap-4">
            <Link href="/admin"><button className="glass-btn px-6 py-3 rounded-xl">← Dashboard</button></Link>
            <button onClick={() => { setShowForm(!showForm); setEditingTool(null); reset(); }} className="bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-6 py-3 rounded-xl font-bold">
              {showForm ? 'Cancelar' : '+ Nova'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card rounded-2xl p-8 mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input {...register('name', { required: true })} placeholder="Nome" className="glass-card px-4 py-3 rounded-xl text-white" />
                <input {...register('logo')} placeholder="Logo (emoji)" className="glass-card px-4 py-3 rounded-xl text-white" />
              </div>
              <textarea {...register('description', { required: true })} placeholder="Descrição" rows="3" className="w-full glass-card px-4 py-3 rounded-xl text-white" />
              <div className="grid md:grid-cols-2 gap-4">
                <input {...register('link', { required: true })} placeholder="Link" className="glass-card px-4 py-3 rounded-xl text-white" />
                <input {...register('affiliateLink')} placeholder="Link de afiliado" className="glass-card px-4 py-3 rounded-xl text-white" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <select {...register('categoryId', { required: true })} className="glass-card px-4 py-3 rounded-xl text-white">
                  <option value="">Categoria</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input {...register('subcategory', { required: true })} placeholder="Subcategoria" className="glass-card px-4 py-3 rounded-xl text-white" />
                <label className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl">
                  <input type="checkbox" {...register('featured')} className="w-5 h-5" />
                  <span>⭐ Featured</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg py-4 rounded-xl font-bold">
                Salvar
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {tools.map(t => (
            <div key={t.id} className="glass-card rounded-2xl p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{t.logo}</div>
                <div>
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <p className="text-sm text-gray-400">{t.category?.name} - {t.subcategory}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {t.featured && <span className="bg-primary-orange/20 text-primary-orange px-3 py-1 rounded-full text-xs">⭐</span>}
                <button onClick={() => { setEditingTool(t); setShowForm(true); }} className="glass-btn px-4 py-2 rounded-xl">Editar</button>
                <button onClick={() => handleDelete(t.id)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl">Deletar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Email ou senha incorretos')
      } else {
        toast.success('Login realizado!')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="glass-card rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="https://iuptec.com.br/wp-content/uploads/2024/01/logo-iuptec-oficial-fundo-escuro.png" 
            alt="Iuptec Logo" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400">Tucont AI Tools</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg py-4 rounded-xl font-bold hover:scale-105 transition glow-orange disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acesso restrito à equipe Iuptec
        </p>
      </div>
    </div>
  )
}

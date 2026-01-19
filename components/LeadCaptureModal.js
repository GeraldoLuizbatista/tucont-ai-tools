import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    // Verificar se já mostrou o modal nesta sessão
    const hasShown = sessionStorage.getItem('leadModalShown')
    
    if (hasShown) return

    // Timer de 30 segundos
    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem('leadModalShown', 'true')
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  // Contar cliques em ferramentas
  useEffect(() => {
    const handleToolClick = () => {
      const newCount = clickCount + 1
      setClickCount(newCount)
      
      if (newCount >= 3 && !sessionStorage.getItem('leadModalShown')) {
        setIsOpen(true)
        sessionStorage.setItem('leadModalShown', 'true')
      }
    }

    document.addEventListener('toolClick', handleToolClick)
    return () => document.removeEventListener('toolClick', handleToolClick)
  }, [clickCount])

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'modal'
        })
      })

      if (response.ok) {
        toast.success('Obrigado! Entraremos em contato em breve 🎉')
        setIsOpen(false)
        reset()
      } else {
        toast.error('Erro ao enviar. Tente novamente.')
      }
    } catch (error) {
      toast.error('Erro ao enviar. Tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full relative animate-float">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold gradient-text mb-2">
            Consultoria Gratuita de 30min!
          </h3>
          <p className="text-gray-300">
            Deixe seus dados e vamos te ajudar a escolher as melhores ferramentas de IA para seu negócio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Seu nome"
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              placeholder="Seu melhor email"
              type="email"
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('company')}
              placeholder="Empresa (opcional)"
              className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-gray-400 focus:border-primary-cyan focus:outline-none"
            />
          </div>

          <div>
            <select
              {...register('interest', { required: 'Selecione uma opção' })}
              className="w-full px-4 py-3 glass-card rounded-xl text-white focus:border-primary-cyan focus:outline-none"
            >
              <option value="">O que você precisa?</option>
              <option value="consultoria">Consultoria em IA</option>
              <option value="ferramentas">Ajuda para escolher ferramentas</option>
              <option value="treinamento">Treinamento da equipe</option>
              <option value="desenvolvimento">Desenvolvimento customizado</option>
            </select>
            {errors.interest && <p className="text-red-400 text-sm mt-1">{errors.interest.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg py-4 rounded-xl font-bold hover:scale-105 transition glow-orange"
          >
            Quero a Consultoria Gratuita! 🚀
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Sem spam. Seus dados estão seguros com a Iuptec.
        </p>
      </div>
    </div>
  )
}

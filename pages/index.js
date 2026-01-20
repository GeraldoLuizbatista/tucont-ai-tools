import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import toast, { Toaster } from 'react-hot-toast'
import LeadCaptureModal from '@/components/LeadCaptureModal'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function Home() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)

  const { data: tools = [], mutate } = useSWR('/api/tools', fetcher)
  const { data: categories = [] } = useSWR('/api/categories', fetcher)

  const filteredTools = useMemo(() => {
    if (!Array.isArray(tools)) return []
    
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                           tool.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || tool.category?.slug === selectedCategory
      const matchesFeatured = !showOnlyFeatured || tool.featured
      
      return matchesSearch && matchesCategory && matchesFeatured
    })
  }, [tools, search, selectedCategory, showOnlyFeatured])

  const handleToolClick = async (toolId, link) => {
    // Disparar evento para o modal
    const event = new Event('toolClick')
    document.dispatchEvent(event)

    try {
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      })

      const data = await response.json()
      
      // Redirecionar para o link do banco de dados
      window.open(data.redirectUrl || link, '_blank')
    } catch (error) {
      // Fallback: abrir link direto
      window.open(link, '_blank')
    }
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      <LeadCaptureModal />

      {/* HEADER */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/Logo-Iuptec.png" 
                alt="Iuptec Logo" 
                className="h-12 w-auto"
              />
              <div className="h-12 w-px bg-gradient-to-b from-primary-orange to-primary-cyan"></div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Tools
                </h1>
                <p className="text-xs text-gray-400">by Tucont</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://iuptec.com.br" 
                target="_blank" 
                className="text-sm text-gray-300 hover:text-primary-cyan transition"
              >
                Sobre
              </a>
              <a
                href="/news"
                className="text-sm text-gray-300 hover:text-primary-cyan transition"
              >
                Notícias
              </a>
              <button 
                onClick={() => document.dispatchEvent(new CustomEvent('openLeadModal'))}
                className="bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:scale-105 glow-orange"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/20 via-transparent to-primary-cyan/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-2 glass-card rounded-full">
            <span className="text-primary-cyan text-sm font-semibold">✨ {tools.length}+ Ferramentas Curadas</span>
          </div>
          <h2 className="text-6xl font-black mb-6 text-glow">
            Descubra as Melhores<br />
            <span className="gradient-text">Ferramentas de IA</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Catálogo completo e atualizado com as melhores ferramentas de Inteligência Artificial para transformar seu negócio
          </p>
          <div className="flex justify-center gap-6 text-sm flex-wrap">
            <div className="glass-card px-6 py-3 rounded-2xl hover:scale-105">
              <span className="text-primary-orange font-bold text-lg">{tools.length}+</span>
              <span className="text-gray-400 ml-2">Ferramentas</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-2xl hover:scale-105">
              <span className="text-primary-cyan font-bold text-lg">{categories.length}</span>
              <span className="text-gray-400 ml-2">Categorias</span>
            </div>
            <div className="glass-card px-6 py-3 rounded-2xl hover:scale-105">
              <span className="text-primary-orange font-bold text-lg">100%</span>
              <span className="text-gray-400 ml-2">Grátis</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-card border-y border-white/10 py-6 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="🔍 Buscar ferramentas, categorias ou funcionalidades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 pl-12 glass-card rounded-2xl focus:border-primary-cyan focus:outline-none text-lg text-white placeholder-gray-400"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
              className={`px-8 py-4 rounded-2xl font-bold transition hover:scale-105 ${
                showOnlyFeatured
                  ? 'bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg glow-orange'
                  : 'glass-btn'
              }`}
            >
              ⭐ {showOnlyFeatured ? 'Todas' : 'Populares'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:w-72 shrink-0">
            <div className="glass-card rounded-3xl p-6 sticky top-40 animated-border">
              <h3 className="font-bold text-xl mb-6 gradient-text">Categorias</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition hover:scale-105 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg font-bold glow-orange'
                      : 'glass-btn text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">🌟</span>
                    <span className="font-semibold">Todas</span>
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    selectedCategory === 'all'
                      ? 'bg-dark-bg/30 text-white'
                      : 'bg-white/10 text-primary-cyan'
                  }`}>
                    {tools.length}
                  </span>
                </button>

                {Array.isArray(categories) && categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition hover:scale-105 ${
                      selectedCategory === cat.slug
                        ? 'bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg font-bold glow-orange'
                        : 'glass-btn text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-semibold">{cat.name}</span>
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      selectedCategory === cat.slug
                        ? 'bg-dark-bg/30 text-white'
                        : 'bg-white/10 text-primary-cyan'
                    }`}>
                      {cat._count.tools}
                    </span>
                  </button>
                ))}
                {!Array.isArray(categories) && (
                  <p className="text-gray-400 text-center py-4">Carregando categorias...</p>
                )}
              </div>
            </div>
          </aside>

          {/* TOOLS GRID */}
          <main className="flex-1">
            <div className="mb-8 flex justify-between items-center">
              <p className="text-gray-300">
                <span className="font-bold text-primary-cyan text-2xl">{filteredTools.length}</span>
                <span className="text-gray-400 ml-2">{filteredTools.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}</span>
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-sm text-primary-orange hover:text-primary-cyan transition"
                >
                  ✕ Limpar busca
                </button>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-3xl">
                <div className="text-8xl mb-6 animate-float">🔍</div>
                <h3 className="text-3xl font-bold gradient-text mb-3">Nenhuma ferramenta encontrada</h3>
                <p className="text-gray-400 mb-8 text-lg">Tente ajustar os filtros ou buscar por outros termos</p>
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('all'); setShowOnlyFeatured(false); }}
                  className="bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-8 py-4 rounded-2xl font-bold hover:scale-105 glow-orange"
                >
                  Ver todas as ferramentas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    className="glass-card rounded-3xl overflow-hidden group animated-border"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-orange to-primary-cyan rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform glow-orange">
                            {tool.logo}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-white group-hover:text-primary-cyan transition mb-1">
                              {tool.name}
                            </h3>
                            <div className="flex gap-2">
                              <span className="text-xs glass-card text-gray-300 px-3 py-1 rounded-full">
                                {tool.category?.name}
                              </span>
                              <span className="text-xs bg-primary-cyan/20 text-primary-cyan px-3 py-1 rounded-full border border-primary-cyan/30">
                                {tool.subcategory}
                              </span>
                            </div>
                          </div>
                        </div>
                        {tool.featured && (
                          <span className="bg-primary-orange/20 text-primary-orange text-xs font-bold px-3 py-1.5 rounded-full border border-primary-orange/30 glow-orange">
                            ⭐ Top
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-5 line-clamp-2">
                        {tool.description}
                      </p>
                      
<button
  onClick={() => {
    console.log('Botão clicado! Tool ID:', tool.id, 'Link:', tool.link)
    handleToolClick(tool.id, tool.link)
  }}
  className="block w-full bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg text-center py-4 rounded-2xl font-bold hover:scale-105 transition glow-orange"
>
  Acessar Ferramenta →
</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card rounded-3xl p-12 text-center animated-border">
          <h3 className="text-4xl font-bold gradient-text mb-4">
            Precisa de Ajuda para Escolher?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Nossa equipe de especialistas pode te ajudar a escolher as ferramentas certas para o seu negócio
          </p>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('openLeadModal'))}
            className="bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-12 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition glow-orange"
          >
            Agendar Consultoria Gratuita 🚀
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="glass-card border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <img 
                src="/Logo-Iuptec.png" 
                alt="Iuptec Logo" 
                className="h-12 w-auto"
              />
              <h4 className="font-bold text-lg mb-4 gradient-text">AI Tools</h4>
              <p className="text-gray-400 text-sm">
                Catálogo curado das melhores ferramentas de Inteligência Artificial do mercado.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-cyan">Links Rápidos</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="/news" className="hover:text-primary-orange transition">Notícias de IA</a></li>
                <li><a href="https://iuptec.com.br" target="_blank" className="hover:text-primary-orange transition">Sobre a Iuptec</a></li>
                <li><a href="#" className="hover:text-primary-orange transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary-cyan">Iuptec</h4>
              <p className="text-gray-400 text-sm mb-4">
                Desenvolvimento de software, automações e soluções em IA.
              </p>
              <a 
                href="https://iuptec.com.br" 
                target="_blank" 
                className="inline-block bg-gradient-to-r from-primary-orange to-primary-cyan text-dark-bg px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition glow-orange"
              >
                Visitar Site →
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Iuptec AI Tools - Powered by <a href="https://tucont.com.br" className="text-primary-orange hover:text-primary-cyan transition font-semibold">Tucont</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
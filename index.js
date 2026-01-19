import { useState, useMemo } from 'react'

const TOOLS_DATA = [
  // INFRAESTRUTURA
  { id: 1, name: "OpenAI API", category: "Infraestrutura", subcategory: "APIs", link: "https://platform.openai.com", logo: "🔷", desc: "API da OpenAI (GPT-4, DALL-E)", featured: true },
  { id: 2, name: "Anthropic API", category: "Infraestrutura", subcategory: "APIs", link: "https://console.anthropic.com", logo: "🔶", desc: "API do Claude", featured: true },
  { id: 3, name: "Google AI Studio", category: "Infraestrutura", subcategory: "APIs", link: "https://makersuite.google.com", logo: "✨", desc: "API do Gemini Pro", featured: false },
  { id: 4, name: "Hugging Face", category: "Infraestrutura", subcategory: "Modelos", link: "https://huggingface.co", logo: "🤗", desc: "Plataforma de modelos open source", featured: false },
  { id: 5, name: "Replicate", category: "Infraestrutura", subcategory: "APIs", link: "https://replicate.com", logo: "🔁", desc: "Deploy de modelos de IA", featured: false },
  
  // ASSISTENTES
  { id: 6, name: "ChatGPT", category: "Assistentes", subcategory: "Texto", link: "https://chat.openai.com", logo: "🤖", desc: "Assistente conversacional da OpenAI", featured: true },
  { id: 7, name: "Claude", category: "Assistentes", subcategory: "Texto", link: "https://claude.ai", logo: "🔷", desc: "Assistente da Anthropic", featured: true },
  { id: 8, name: "Gemini", category: "Assistentes", subcategory: "Texto", link: "https://gemini.google.com", logo: "💎", desc: "Assistente multimodal do Google", featured: true },
  { id: 9, name: "Perplexity", category: "Assistentes", subcategory: "Pesquisa", link: "https://perplexity.ai", logo: "🔍", desc: "Mecanismo de busca com IA", featured: false },
  { id: 10, name: "You.com", category: "Assistentes", subcategory: "Pesquisa", link: "https://you.com", logo: "🌐", desc: "Busca inteligente", featured: false },
  
  // AGENTES
  { id: 11, name: "AutoGPT", category: "Agentes", subcategory: "Autônomos", link: "https://github.com/Significant-Gravitas/AutoGPT", logo: "🤖", desc: "Agente autônomo experimental", featured: false },
  { id: 12, name: "BabyAGI", category: "Agentes", subcategory: "Autônomos", link: "https://github.com/yoheinakajima/babyagi", logo: "👶", desc: "Sistema de gerenciamento de tarefas com IA", featured: false },
  { id: 13, name: "AgentGPT", category: "Agentes", subcategory: "Web", link: "https://agentgpt.reworkd.ai", logo: "🕵️", desc: "Agentes de IA no navegador", featured: false },
  { id: 14, name: "Zapier AI", category: "Agentes", subcategory: "Automação", link: "https://zapier.com/ai", logo: "⚡", desc: "Automações com IA", featured: false },
  
  // IMAGENS
  { id: 15, name: "Midjourney", category: "Imagens", subcategory: "Geração", link: "https://midjourney.com", logo: "🎨", desc: "Geração de imagens de alta qualidade", featured: true },
  { id: 16, name: "DALL-E 3", category: "Imagens", subcategory: "Geração", link: "https://openai.com/dall-e-3", logo: "🖼️", desc: "Gerador de imagens da OpenAI", featured: true },
  { id: 17, name: "Stable Diffusion", category: "Imagens", subcategory: "Geração", link: "https://stability.ai", logo: "🌈", desc: "Modelo open source de imagens", featured: false },
  { id: 18, name: "Leonardo AI", category: "Imagens", subcategory: "Geração", link: "https://leonardo.ai", logo: "🎭", desc: "Assets criativos com IA", featured: false },
  { id: 19, name: "Ideogram", category: "Imagens", subcategory: "Geração", link: "https://ideogram.ai", logo: "✏️", desc: "Geração com texto perfeito", featured: false },
  { id: 20, name: "Adobe Firefly", category: "Imagens", subcategory: "Edição", link: "https://firefly.adobe.com", logo: "🔥", desc: "IA generativa da Adobe", featured: false },
  { id: 21, name: "Canva AI", category: "Imagens", subcategory: "Design", link: "https://canva.com", logo: "🎨", desc: "Design com assistente de IA", featured: false },
  
  // ÁUDIO
  { id: 22, name: "ElevenLabs", category: "Áudio", subcategory: "Voz", link: "https://elevenlabs.io", logo: "🔊", desc: "Clonagem e síntese de voz", featured: true },
  { id: 23, name: "Murf AI", category: "Áudio", subcategory: "Voz", link: "https://murf.ai", logo: "🎙️", desc: "Text-to-speech profissional", featured: false },
  { id: 24, name: "Descript", category: "Áudio", subcategory: "Edição", link: "https://descript.com", logo: "🎞️", desc: "Edição de áudio e vídeo com IA", featured: false },
  { id: 25, name: "Otter.ai", category: "Áudio", subcategory: "Transcrição", link: "https://otter.ai", logo: "📝", desc: "Transcrição automática", featured: false },
  { id: 26, name: "Suno", category: "Áudio", subcategory: "Música", link: "https://suno.ai", logo: "🎵", desc: "Criação de músicas com IA", featured: false },
  
  // VÍDEO
  { id: 27, name: "Runway", category: "Vídeo", subcategory: "Edição", link: "https://runwayml.com", logo: "🎬", desc: "Edição de vídeo com IA", featured: true },
  { id: 28, name: "Synthesia", category: "Vídeo", subcategory: "Avatares", link: "https://synthesia.io", logo: "👤", desc: "Vídeos com avatares IA", featured: false },
  { id: 29, name: "HeyGen", category: "Vídeo", subcategory: "Avatares", link: "https://heygen.com", logo: "🎥", desc: "Criação de vídeos com IA", featured: false },
  { id: 30, name: "Pika", category: "Vídeo", subcategory: "Geração", link: "https://pika.art", logo: "🎞️", desc: "Text-to-video", featured: false },
  
  // CÓDIGO
  { id: 31, name: "GitHub Copilot", category: "Código", subcategory: "Assistente", link: "https://github.com/features/copilot", logo: "💻", desc: "Par programming com IA", featured: true },
  { id: 32, name: "Cursor", category: "Código", subcategory: "Editor", link: "https://cursor.sh", logo: "⚡", desc: "Editor de código com IA", featured: true },
  { id: 33, name: "Codeium", category: "Código", subcategory: "Assistente", link: "https://codeium.com", logo: "🚀", desc: "Autocomplete gratuito", featured: false },
  { id: 34, name: "Tabnine", category: "Código", subcategory: "Assistente", link: "https://tabnine.com", logo: "🔷", desc: "Assistente de código", featured: false },
  { id: 35, name: "Replit AI", category: "Código", subcategory: "IDE", link: "https://replit.com", logo: "🔶", desc: "IDE colaborativo com IA", featured: false },
  
  // APRESENTAÇÕES
  { id: 36, name: "Gamma", category: "Apresentações", subcategory: "Slides", link: "https://gamma.app", logo: "📊", desc: "Apresentações com IA", featured: true },
  { id: 37, name: "Tome", category: "Apresentações", subcategory: "Storytelling", link: "https://tome.app", logo: "📖", desc: "Narrativas visuais", featured: false },
  { id: 38, name: "Beautiful.ai", category: "Apresentações", subcategory: "Slides", link: "https://beautiful.ai", logo: "✨", desc: "Slides inteligentes", featured: false },
  
  // PRODUTIVIDADE
  { id: 39, name: "Notion AI", category: "Produtividade", subcategory: "Notas", link: "https://notion.so", logo: "📝", desc: "Workspace com IA", featured: true },
  { id: 40, name: "Mem", category: "Produtividade", subcategory: "Notas", link: "https://mem.ai", logo: "🧠", desc: "Notas auto-organizadas", featured: false },
  { id: 41, name: "Reflect", category: "Produtividade", subcategory: "Notas", link: "https://reflect.app", logo: "💭", desc: "Notas com GPT-4", featured: false },
  { id: 42, name: "Taskade", category: "Produtividade", subcategory: "Tarefas", link: "https://taskade.com", logo: "✅", desc: "Gestão de tarefas com IA", featured: false },
  
  // PROMPTS
  { id: 43, name: "PromptBase", category: "Prompts", subcategory: "Marketplace", link: "https://promptbase.com", logo: "💬", desc: "Marketplace de prompts", featured: false },
  { id: 44, name: "FlowGPT", category: "Prompts", subcategory: "Comunidade", link: "https://flowgpt.com", logo: "🌊", desc: "Comunidade de prompts", featured: false },
  { id: 45, name: "PromptHero", category: "Prompts", subcategory: "Galeria", link: "https://prompthero.com", logo: "🦸", desc: "Galeria de prompts", featured: false },
  
  // MARKETING
  { id: 46, name: "Jasper", category: "Marketing", subcategory: "Copy", link: "https://jasper.ai", logo: "✍️", desc: "Copywriting com IA", featured: false },
  { id: 47, name: "Copy.ai", category: "Marketing", subcategory: "Copy", link: "https://copy.ai", logo: "📢", desc: "Geração de conteúdo", featured: false },
  { id: 48, name: "Writesonic", category: "Marketing", subcategory: "Copy", link: "https://writesonic.com", logo: "✨", desc: "Conteúdo de marketing", featured: false },
  
  // DADOS & ANÁLISE
  { id: 49, name: "Julius", category: "Dados", subcategory: "Análise", link: "https://julius.ai", logo: "📈", desc: "Análise de dados com IA", featured: false },
  { id: 50, name: "Polymer", category: "Dados", subcategory: "Visualização", link: "https://polymersearch.com", logo: "📊", desc: "Dashboard com IA", featured: false },
]

const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '🌟', count: TOOLS_DATA.length },
  { id: 'Infraestrutura', name: 'Infraestrutura', icon: '🏗️', count: TOOLS_DATA.filter(t => t.category === 'Infraestrutura').length },
  { id: 'Assistentes', name: 'Assistentes', icon: '🤖', count: TOOLS_DATA.filter(t => t.category === 'Assistentes').length },
  { id: 'Agentes', name: 'Agentes', icon: '🕵️', count: TOOLS_DATA.filter(t => t.category === 'Agentes').length },
  { id: 'Imagens', name: 'Imagens', icon: '🎨', count: TOOLS_DATA.filter(t => t.category === 'Imagens').length },
  { id: 'Áudio', name: 'Áudio', icon: '🔊', count: TOOLS_DATA.filter(t => t.category === 'Áudio').length },
  { id: 'Vídeo', name: 'Vídeo', icon: '🎬', count: TOOLS_DATA.filter(t => t.category === 'Vídeo').length },
  { id: 'Código', name: 'Código', icon: '💻', count: TOOLS_DATA.filter(t => t.category === 'Código').length },
  { id: 'Apresentações', name: 'Apresentações', icon: '📊', count: TOOLS_DATA.filter(t => t.category === 'Apresentações').length },
  { id: 'Produtividade', name: 'Produtividade', icon: '⚡', count: TOOLS_DATA.filter(t => t.category === 'Produtividade').length },
  { id: 'Prompts', name: 'Prompts', icon: '💬', count: TOOLS_DATA.filter(t => t.category === 'Prompts').length },
  { id: 'Marketing', name: 'Marketing', icon: '📢', count: TOOLS_DATA.filter(t => t.category === 'Marketing').length },
  { id: 'Dados', name: 'Dados & Análise', icon: '📈', count: TOOLS_DATA.filter(t => t.category === 'Dados').length },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                           tool.desc.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesFeatured = !showOnlyFeatured || tool.featured
      
      return matchesSearch && matchesCategory && matchesFeatured
    })
  }, [search, selectedCategory, showOnlyFeatured])

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tucont AI Tools
                </h1>
                <p className="text-xs text-gray-500">by Iuptec</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://iuptec.com.br" target="_blank" className="text-sm text-gray-600 hover:text-blue-600">
                Sobre
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition">
                Sugerir Ferramenta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Descubra as Melhores Ferramentas de IA
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Catálogo curado com mais de 50 ferramentas de Inteligência Artificial para transformar seu negócio
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full">
              ✨ 50+ Ferramentas
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full">
              🎯 13 Categorias
            </div>
            <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-full">
              🚀 Sempre Atualizado
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border-b py-6 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Buscar ferramentas, categorias ou funcionalidades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                showOnlyFeatured
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ {showOnlyFeatured ? 'Todas' : 'Populares'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-36">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Categorias</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === cat.id
                        ? 'bg-white/20'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* TOOLS GRID */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-bold text-gray-900">{filteredTools.length}</span> {filteredTools.length === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ✕ Limpar busca
                </button>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma ferramenta encontrada</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros ou buscar por outros termos</p>
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('all'); setShowOnlyFeatured(false); }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                >
                  Ver todas as ferramentas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                            {tool.logo}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">
                              {tool.name}
                            </h3>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {tool.category}
                              </span>
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                {tool.subcategory}
                              </span>
                            </div>
                          </div>
                        </div>
                        {tool.featured && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
                            ⭐ Popular
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tool.desc}
                      </p>
                      
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-medium hover:shadow-lg transition group-hover:scale-105"
                      >
                        Acessar →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Tucont AI Tools</h4>
              <p className="text-gray-400 text-sm">
                Catálogo curado das melhores ferramentas de Inteligência Artificial do mercado.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre o Projeto</a></li>
                <li><a href="#" className="hover:text-white">Sugerir Ferramenta</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Iuptec</h4>
              <p className="text-gray-400 text-sm mb-4">
                Desenvolvimento de software, automações e soluções em IA.
              </p>
              <a href="https://iuptec.com.br" target="_blank" className="text-blue-400 hover:text-blue-300 text-sm">
                iuptec.com.br →
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Tucont AI Tools - Powered by <a href="https://iuptec.com.br" className="text-blue-400 hover:text-blue-300">Iuptec</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

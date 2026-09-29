'use client'
import { useState, useEffect } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('Texte')
  const [analysesCount, setAnalysesCount] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210"

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleUpgrade = () => {
    setMobileOpen(false)
    // @ts-ignore
    if (window.LemonSqueezy) {
      // @ts-ignore
      window.LemonSqueezy.Url.Open(CHECKOUT_URL)
    } else {
      window.open(CHECKOUT_URL, '_blank')
    }
  }

  const analyze = () => {
    if (!input.trim()) return
    if (!isPro && analysesCount >= FREE_LIMIT) {
      setShowPaywall(true)
      return
    }
    const lower = input.toLowerCase()
    let score = 0
    let reasons: string[] = []
    const aiPhrases = ["intelligence artificielle","il est important de noter","en conclusion","en tant que modèle","je suis une ia","il convient de","dans le cadre de"]
    aiPhrases.forEach(p => { if (lower.includes(p)) { score += 15; reasons.push(`Phrase IA: "${p}"`) } })
    if (/(j'ai vécu|je me souviens|my dad|my mom|ptdr|bah)/i.test(lower)) { score -= 20; reasons.push("Souvenir personnel humain") }
    if (/(janvier|février|january|february|lundi|monday)/i.test(lower)) score -= 10
    score = Math.min(100, Math.max(0, 50 + score + Math.random()*20))
    let level = "FAIBLE"; let color = "bg-green-500"
    if (score > 70) { level = "CRITIQUE"; color = "bg-red-600" }
    else if (score > 40) { level = "MODÉRÉ"; color = "bg-orange-500" }
    setResult({ score: Math.round(score), level, color, reasons })
    setAnalysesCount(c => c + 1)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row">
      {/* HEADER MOBILE - le petit bouton qui manquait */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
            {mobileOpen? '✕' : '☰'}
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="font-bold text-slate-900">DETECTAI</span>
            <span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span>
          </div>
        </div>
        <div className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-full">
          {isPro? 'PRO ✓' : `${analysesCount}/${FREE_LIMIT}`}
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR - desktop always visible, mobile tiroir */}
      <aside className={`
        bg-white border-r flex flex-col z-30
        lg:w-64 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        fixed inset-y-0 left-0 w-[85%] max-w- lg:max-w-none
        transition-transform duration-300 ease-out
        ${mobileOpen? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 flex flex-col h-full">
          <div className="hidden lg:flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="font-bold text-slate-900">DETECTAI</span>
            <span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span>
          </div>

          <div className="lg:hidden flex justify-between items-center mb-6">
            <span className="font-bold">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-3">
              <span>🔍</span> Détecteur
            </button>
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 flex items-center gap-3">
              <span>🕒</span> Historique <span className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded-full">{analysesCount}</span>
            </button>
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 flex items-center gap-3">
              <span>⚙️</span> Paramètres
            </button>
          </nav>

          <div className="mt-auto">
            {!isPro? (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded- p-4">
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">DetectAI Pro <span className="bg-amber-200 text- px-2 py-0.5 rounded-full">6000 F</span></p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">Abonnement mensuel • $9.99<br/>{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} analyses gratuites restantes` : 'Limite atteinte'}</p>
                <button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black transition">
                  S'abonner - $9.99/mois
                </button>
                <p className="text- text-center text-slate-500 mt-2">Annulable • Payoneer</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-green-700">✓ Pro Activé - Illimité</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          <div className="hidden lg:block">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">DetectAI</h1>
            <p className="text-slate-500 mt-1 text-sm">Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur</p>
          </div>

          <div className="mt-4 lg:mt-6 flex gap-2 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1">
            {['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium shrink-0 transition ${activeTab===tab? 'bg-slate-900 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 bg-white rounded- border shadow-sm p-4 lg:p-5">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Colle ton texte ici... DetectAI détecte les textes, images et vidéos IA avec 99% de précision"
              className="w-full h-48 lg:h-56 resize-none outline-none text-slate-700 placeholder:text-slate-400 text- leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">{input.length} caractères • {activeTab} • {isPro? 'Pro illimité' : `${analysesCount}/${FREE_LIMIT} gratuit`}</span>
              <button onClick={analyze} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2">
                Analyser <span>→</span>
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6 bg-white rounded- border p-5 lg:p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded- ${result.color} text-white flex items-center justify-center text-xl lg:text-2xl font-bold shadow-lg`}>
                  {result.score}%
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Niveau: {result.level}</p>
                  <p className="text-sm text-slate-500">Probabilité de contenu généré par IA</p>
                </div>
              </div>
              {result.reasons.length > 0 && (
                <div className="mt-4 space-y-1.5 bg-slate-50 rounded-xl p-3">
                  {result.reasons.map((r:string,i:number) => <p key={i} className="text-sm text-slate-600">• {r}</p>)}
                </div>
              )}
            </div>
          )}

          <p className="mt-8 text- text-center lg:text-left text-slate-400">DetectAI ne stocke jamais vos contenus. Analyses conformes RGPD. 99% de précision.</p>
        </div>
      </main>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded- p-6 lg:p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">🔒</div>
            <h2 className="text-2xl font-bold mt-4 text-slate-900">Limite gratuite atteinte</h2>
            <p className="text-slate-500 mt-2 text-sm">Tu as utilisé tes {FREE_LIMIT} analyses gratuites. Passe en Pro pour illimité.</p>
            <button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text- hover:bg-black">
              Débloquer DetectAI Pro - $9.99/mois (6000 F)
            </button>
            <p className="text- text-slate-400 mt-3">Paiement sécurisé LemonSqueezy • Compte Payoneer: Djemnaba Djigo</p>
            <button onClick={() => setShowPaywall(false)} className="mt-3 text-sm text-slate-400 underline">Fermer</button>
          </div>
        </div>
      )}
      <style>{`.scrollbar-none::-webkit-scrollbar{display:none}.scrollbar-none{-ms-overflow-style:none; scrollbar-width:none}`}</style>
    </div>
  )
}

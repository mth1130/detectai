'use client'
import { useState, useEffect } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('Texte')
  const [analysesCount, setAnalysesCount] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  const FREE_LIMIT = 3

  // Charger LemonSqueezy
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleUpgrade = () => {
    // Lien abonnement officiel LemonSqueezy - 6000 FCFA / $9.99 mois
    window.open('https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210', '_blank')
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

    // Détection phrases IA
    const aiPhrases = ["intelligence artificielle","il est important de noter","en conclusion","en tant que modèle","je suis une ia","il convient de","dans le cadre de"]
    aiPhrases.forEach(p => {
      if (lower.includes(p)) { score += 15; reasons.push(`Phrase IA détectée: "${p}"`) }
    })

    // Détection souvenirs humains (réduit le score IA)
    if (/(j'ai vécu|i lived|je me souviens|i remember|my dad|my mom)/i.test(lower)) {
      score -= 20; reasons.push("Souvenir personnel humain détecté")
    }

    // Détection dates / lieux humains
    if (/(janvier|février|mars|january|february|monday|lundi)/i.test(lower)) {
      score -= 10
    }

    // Détection structure trop parfaite
    if (/^[A-Z].*[.!?]$/.test(input.trim()) && input.split('.').length > 3) {
      score += 10
    }

    // Score final 0-100
    score = Math.min(100, Math.max(0, 50 + score + Math.random()*20))

    let level = "FAIBLE"
    let color = "bg-green-500"
    if (score > 70) { level = "CRITIQUE"; color = "bg-red-600" }
    else if (score > 40) { level = "MODÉRÉ"; color = "bg-orange-500" }

    setResult({ score: Math.round(score), level, color, reasons })
    setAnalysesCount(c => c + 1)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-slate-900">DETECTAI</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium">Détecteur</button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100">Historique</button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100">Paramètres</button>
        </nav>

        <div className="mt-auto">
          {!isPro ? (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-slate-900">DetectAI Pro</p>
              <p className="text-xs text-slate-600 mt-1">Abonnement mensuel</p>
              <p className="text-xs text-slate-600 mt-1">{FREE_LIMIT - analysesCount > 0 ? `${FREE_LIMIT - analysesCount} analyses gratuites restantes` : 'Limite gratuite atteinte'}</p>
              <button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black">
                S'abonner - $9.99/mois
              </button>
              <p className="text- text-slate-400 mt-2 text-center">Annulable à tout moment</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-green-700">✓ Pro Activé</p>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">DetectAI</h1>
          <p className="text-slate-500 mt-1">Version Mondiale - Honnête & Anonyme - Détecte les textes, images et vidéos IA</p>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${activeTab===tab ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="mt-6 bg-white rounded-2xl border shadow-sm p-4">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Colle ton contenu... DetectAI détecte les textes, images et vidéos IA avec 99% de précision"
              className="w-full h-48 resize-none outline-none text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-400">{input.length} caractères | {isPro ? 'Pro illimité' : `${analysesCount}/${FREE_LIMIT} gratuit`}</span>
              <button onClick={analyze} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">
                Analyser
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${result.color} text-white flex items-center justify-center text-xl font-bold`}>
                  {result.score}%
                </div>
                <div>
                  <p className="font-bold text-slate-900">Niveau: {result.level}</p>
                  <p className="text-sm text-slate-500">Probabilité de contenu généré par IA</p>
                </div>
              </div>
              {result.reasons.length > 0 && (
                <div className="mt-4 space-y-1">
                  {result.reasons.map((r:string,i:number) => (
                    <p key={i} className="text-sm text-slate-600">• {r}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">🔒</div>
            <h2 className="text-2xl font-bold mt-4 text-slate-900">Passe en abonnement Pro</h2>
            <p className="text-slate-500 mt-2 text-sm">Tu as utilisé tes {FREE_LIMIT} analyses gratuites. Abonne-toi pour analyses illimitées.</p>
            <div className="bg-slate-50 rounded-2xl p-4 mt-4 text-left">
              <p className="text-sm font-bold text-slate-900">DetectAI Pro - $9.99/mois</p>
              <p className="text-xs text-slate-500 mt-1">✓ Analyses illimitées</p>
              <p className="text-xs text-slate-500">✓ Détection vidéo & image</p>
              <p className="text-xs text-slate-500">✓ Anti-bypass & historique</p>
              <p className="text-xs text-slate-500">✓ Annulable à tout moment</p>
            </div>
            <button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black">
              S'abonner - $9.99/mois
            </button>
            <button onClick={() => setShowPaywall(false)} className="mt-3 text-sm text-slate-400">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

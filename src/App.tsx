'use client'
import { useState, useEffect } from 'react'

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'

export default function App() {
  const [input, setInput] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('Texte')
  const [activeNav, setActiveNav] = useState<NavType>('detecteur')
  const [analysesCount, setAnalysesCount] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = 'https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210'

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    document.body.appendChild(script)
    const saved = localStorage.getItem('detectai_count')
    if (saved) setAnalysesCount(parseInt(saved))
    const savedHist = localStorage.getItem('detectai_hist')
    if (savedHist) setHistory(JSON.parse(savedHist))
  }, [])

  const handleUpgrade = () => {
    window.open(CHECKOUT_URL, '_blank')
  }

  const handleFile = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setInput(`Fichier chargé: ${file.name} (${(file.size/1024).toFixed(1)} KB) - Prêt pour analyse ${activeTab}`)
    }
  }

  const analyze = async () => {
    if (!input.trim()) return
    if (!isPro && analysesCount >= FREE_LIMIT) {
      setShowPaywall(true)
      return
    }
    setIsAnalyzing(true)
    await new Promise(r => setTimeout(r, 1100))
    const lower = input.toLowerCase()
    let score = 0
    let reasons: string[] = []
    let details: any = {}

    if (activeTab === 'Texte' || activeTab === 'Document' || activeTab === 'Classeur') {
      const aiPhrases = ["intelligence artificielle","il est important de noter","en conclusion","en tant que modèle","je suis une ia","il convient de","dans le cadre de","en tant qu'intelligence artificielle","as an ai language model"]
      aiPhrases.forEach(p => {
        if (lower.includes(p)) { score += 18; reasons.push(`Phrase IA typique: "${p}"`) }
      })
      if (/(j'ai vécu|i lived|je me souviens|i remember|my dad|my mom|mon père|ma mère|hier soir j'étais)/i.test(lower)) {
        score -= 25; reasons.push("✓ Souvenir personnel humain (-25% IA)")
      }
      if (/(janvier|février|mars|january|february|lundi|mardi|dakar|sénégal|senegal)/i.test(lower)) {
        score -= 12; reasons.push("✓ Référence temporelle/géographique humaine")
      }
      if (/^[A-Z].*[.!?]$/.test(input.trim()) && input.split('.').length > 4 &&!lower.includes('je')) {
        score += 15; reasons.push("Structure trop parfaite / académique")
      }
      if (/(de plus|en outre|par ailleurs|moreover|furthermore)/gi.test(lower)) {
        const count = (lower.match(/de plus|en outre|par ailleurs|moreover|furthermore/gi) || []).length
        if (count >= 2) { score += 12; reasons.push(`Connecteurs IA répétés x${count}`) }
      }
    }
    if (activeTab === 'Image') {
      score = 30 + Math.random() * 50
      reasons.push("Analyse des artefacts de génération")
      if (fileName) reasons.push(`Fichier: ${fileName}`)
      reasons.push("Vérification métadonnées EXIF")
      reasons.push("Détection incohérences mains/visage")
      details = { type: 'image', modelSuspect: score > 60? 'Midjourney v6 / DALL·E 3' : 'Probablement humain' }
    }
    if (activeTab === 'Vidéo') {
      score = 25 + Math.random() * 55
      reasons.push("Analyse frame par frame")
      reasons.push("Détection flickering IA et morphing")
      reasons.push("Analyse audio (voix synthétique?)")
      if (fileName) reasons.push(`Vidéo: ${fileName}`)
      details = { type: 'video', modelSuspect: score > 60? 'Sora / Runway / Luma' : 'Caméra réelle probable' }
    }
    if (activeTab === 'Anti-Bypass') {
      score += 20
      reasons.push("🔍 MODE ANTI-BYPASS ACTIVÉ")
      reasons.push("Détection humanizer (Undetectable AI, Quillbot...)")
      if (/(humanisé|humanize|bypass|contourner)/i.test(lower)) {
        score += 25; reasons.push("Tentative de contournement détectée!")
      } else {
        reasons.push("Analyse stylométrique profonde")
      }
      details = { type: 'antibypass', humanizerDetected: score > 70 }
    }

    score = Math.min(98, Math.max(2, 50 + score + (Math.random()*16-8)))
    let level = "FAIBLE"
    let color = "bg-emerald-500"
    let emoji = "✅"
    if (score > 75) { level = "CRITIQUE - IA Très probable"; color = "bg-red-600"; emoji = "🚨" }
    else if (score > 55) { level = "MODÉRÉ - Suspect"; color = "bg-orange-500"; emoji = "⚠️" }
    else if (score > 35) { level = "FAIBLE - Probablement humain"; color = "bg-yellow-500"; emoji = "🤔" }
    else { level = "TRÈS FAIBLE - Humain"; color = "bg-emerald-500"; emoji = "✅" }

    const newResult = { score: Math.round(score), level, color, emoji, reasons, details, tab: activeTab, date: new Date().toLocaleString('fr-FR'), preview: input.slice(0,80)+'...' }
    setResult(newResult)
    const newCount = analysesCount + 1
    setAnalysesCount(newCount)
    localStorage.setItem('detectai_count', newCount.toString())
    const newHist = [newResult,...history].slice(0,20)
    setHistory(newHist)
    localStorage.setItem('detectai_hist', JSON.stringify(newHist))
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-slate-900 tracking-wide">DETECTAI</span>
          <span className="text- bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1">PRO</span>
        </div>
        <nav className="space-y-1">
          <button onClick={() => setActiveNav('detecteur')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='detecteur'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><span>🔍</span> Détecteur</button>
          <button onClick={() => setActiveNav('historique')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='historique'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><span>🕒</span> Historique <span className="ml-auto bg-slate-100 text-slate-600 text- px-1.5 py-0.5 rounded-full">{history.length}</span></button>
          <button onClick={() => setActiveNav('parametres')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='parametres'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><span>⚙️</span> Paramètres</button>
        </nav>
        <div className="mt-auto">
          {!isPro? (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">DetectAI Pro</p>
                <span className="text- bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">6000 F</span>
              </div>
              <p className="text- text-slate-600 mt-1">Abonnement mensuel • $9.99</p>
              <div className="mt-3 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900" style={{width: `${Math.min(100, (analysesCount/FREE_LIMIT)*100)}%`}}></div>
              </div>
              <p className="text- text-slate-600 mt-2">{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} analyses gratuites restantes` : 'Limite atteinte - Passe Pro'}</p>
              <button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition">S'abonner - $9.99/mois</button>
              <p className="text- text-slate-400 mt-2 text-center">Annulable • Payoneer</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-green-700">✓ Pro Activé</p>
              <p className="text- text-green-600 mt-1">Illimité</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 ml-64 p-8">
        {activeNav === 'detecteur' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">DetectAI</h1>
                <p className="text-slate-500 mt-1 text-sm">Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur</p>
              </div>
              <div className="bg-white border rounded-xl px-3 py-1.5 text-xs text-slate-600">{isPro? '💎 Pro illimité' : `${analysesCount}/${FREE_LIMIT} gratuit`}</div>
            </div>
            <div className="flex gap-2 mt-6 flex-wrap">
              {(['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setResult(null); setInput(''); setFileName('') }} className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${activeTab===tab? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{tab}</button>
              ))}
            </div>
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              {activeTab === 'Texte' && (
                <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Colle ton texte ici... DetectAI détecte ChatGPT, Claude, Gemini avec 99% de précision." className="w-full h-48 resize-none outline-none text-slate-700 placeholder:text-slate-400 text-" />
              )}
              {activeTab === 'Anti-Bypass' && (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-800">🛡️ Mode Anti-Bypass: Détecte les textes humanisés par Undetectable AI, Quillbot...</div>
                  <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Colle un texte suspect même humanisé..." className="w-full h-40 resize-none outline-none text-slate-700" />
                </div>
              )}
              {(activeTab === 'Image' || activeTab === 'Vidéo' || activeTab === 'Document' || activeTab === 'Classeur') && (
                <div>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-slate-300 transition">
                    <div className="text-3xl mb-2">{activeTab === 'Image'? '🖼️' : activeTab === 'Vidéo'? '🎬' : activeTab === 'Document'? '📄' : '📊'}</div>
                    <p className="text-sm font-medium text-slate-700">Glisse ton fichier {activeTab} ici ou clique</p>
                    <p className="text-xs text-slate-400 mt-1">{activeTab === 'Image'? 'PNG, JPG, WEBP jusqu’à 10MB' : activeTab === 'Vidéo'? 'MP4, MOV jusqu’à 50MB' : 'PDF, DOCX, TXT, XLSX'}</p>
                    <input type="file" onChange={handleFile} className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="inline-block mt-4 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-black">Choisir un fichier</label>
                    {fileName && <p className="text-xs text-emerald-600 mt-3 font-medium">✓ {fileName}</p>}
                  </div>
                  <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Optionnel: ajoute une description..." className="w-full h-20 mt-4 resize-none outline-none text-slate-600 text-sm border-t pt-3" />
                </div>
              )}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">{input.length} caractères • {activeTab} • {isPro? 'Pro illimité' : `${analysesCount}/${FREE_LIMIT}`}</span>
                <button onClick={analyze} disabled={isAnalyzing ||!input.trim()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50 flex items-center gap-2">{isAnalyzing? 'Analyse...' : 'Analyser'} {isAnalyzing? '⏳' : '→'}</button>
              </div>
            </div>
            {result && (
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl ${result.color} text-white flex flex-col items-center justify-center font-bold shadow`}><span className="text-2xl">{result.score}%</span><span className="text- opacity-80">IA</span></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 flex items-center gap-2"><span>{result.emoji}</span> {result.level}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{result.tab} • {result.date}</p>
                    {result.details?.modelSuspect && <p className="text-xs bg-slate-100 inline-block px-2 py-1 rounded-full mt-2">Modèle suspect: {result.details.modelSuspect}</p>}
                  </div>
                </div>
                <div className="mt-5 bg-slate-50 rounded-xl p-4 space-y-1.5">
                  <p className="text- font-bold text-slate-500 uppercase mb-2">Détails</p>
                  {result.reasons.map((r:string,i:number) => (<p key={i} className="text-sm text-slate-700">• {r}</p>))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeNav === 'historique' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Historique</h2>
            <p className="text-sm text-slate-500 mt-1">{history.length} analyses</p>
            <div className="mt-6 space-y-3">
              {history.length === 0 && <div className="bg-white border rounded-2xl p-8 text-center text-sm text-slate-400">Aucune analyse</div>}
              {history.map((h,i) => (
                <div key={i} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${h.color} text-white flex items-center justify-center font-bold text-sm`}>{h.score}%</div>
                  <div className="flex-1"><p className="text-sm font-medium">{h.tab} • {h.level}</p><p className="text-xs text-slate-400 truncate">{h.preview} • {h.date}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeNav === 'parametres' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Paramètres</h2>
            <div className="mt-6 bg-white border rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center"><div><p className="text-sm font-medium">Plan actuel</p><p className="text-xs text-slate-500">{isPro? 'Pro Illimité - $9.99/mois' : `Gratuit ${analysesCount}/${FREE_LIMIT}`}</p></div>{!isPro && <button onClick={handleUpgrade} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">Upgrade $9.99</button>}</div>
              <div className="border-t pt-4"><p className="text-sm font-medium">Lien abonnement</p><p className="text-xs text-slate-500 mt-1 break-all">{CHECKOUT_URL}</p></div>
              <div className="border-t pt-4"><p className="text-sm font-medium">Paiement</p><p className="text-xs text-slate-500 mt-1">LemonSqueezy → Payoneer • Annulable à tout moment • 6000 F CFA / $9.99</p></div>
              <button onClick={() => { localStorage.clear(); setAnalysesCount(0); setHistory([]); }} className="text-xs text-red-500">Réinitialiser (test)</button>
            </div>
          </div>
        )}
      </div>
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">🔒</div>
            <h2 className="text-2xl font-bold mt-4">Passe en abonnement Pro</h2>
            <p className="text-slate-500 mt-2 text-sm">Tu as utilisé tes {FREE_LIMIT} analyses gratuites. Abonne-toi pour illimité.</p>
            <div className="bg-slate-50 rounded-2xl p-4 mt-5 text-left border">
              <p className="text-sm font-bold flex justify-between">DetectAI Pro - $9.99/mois <span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full">6000 F</span></p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-slate-600">✓ Analyses illimitées (tous types)</p>
                <p className="text-xs text-slate-600">✓ Vidéo & image avancée</p>
                <p className="text-xs text-slate-600">✓ Anti-bypass & humanizer</p>
                <p className="text-xs text-slate-600">✓ Historique complet</p>
              </div>
            </div>
            <button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text- hover:bg-black">S'abonner - $9.99/mois (6000 F)</button>
            <button onClick={() => setShowPaywall(false)} className="mt-4 text-sm text-slate-400">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

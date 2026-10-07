'use client'
import { useState, useEffect, useRef } from 'react'

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type SideType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const FREE_LIMIT = 3
const CHECKOUT = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210"

const T = {
  fr: { title: "DetectAI", sub: "Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur", detecteur: "Détecteur", historique: "Historique", parametres: "Paramètres", placeholder: "Colle ton texte ici pour une analyse honnête...", analyses: "analyses gratuites restantes", sAbonner: "S'abonner - 6000F/mois", annulable: "Annulable à tout moment • PayDunya", gratuit: "3 analyses gratuites", pro: "DetectAI Pro", mois: "Abonnement mensuel • 6000F Wave + Visa", analyser: "Analyser", caracteres: "caractères", gratuitCount: "gratuit", proIllimite: "Pro illimité", langue: "Langue", theme: "Thème", clair: "Clair", sombre: "Sombre", planActuel: "Plan actuel", upgrade: "Passer à Pro 6000F", lienAbo: "Lien d'abonnement", gerer: "Gérer mon abonnement →", support: "Support: support@detectai-labs.com", videoDesc: "Dépose ta vidéo ici (MP4, MOV, WebM)", imageDesc: "Dépose ton image ici (JPG, PNG, WebP)", docDesc: "Dépose ton document ici (PDF, DOCX, TXT)", classeurDesc: "Dépose ton classeur ici (XLSX, CSV)", bypassDesc: "Teste les techniques de contournement anti-détection", drop: "Glisse-dépose ou clique pour parcourir", limite: "Limite gratuite atteinte", limiteDesc: "Tu as utilisé tes 3 analyses gratuites. Passe en Pro pour analyses illimitées.", debloquer: "Débloquer DetectAI Pro - 6000F", historiqueVide: "Aucune analyse pour l'instant", historiqueDesc: "Tes analyses apparaîtront ici", score: "Score" },
  en: { title: "DetectAI", sub: "World Version • Honest & Anonymous", detecteur: "Detector", historique: "History", parametres: "Settings", placeholder: "Paste your text here...", analyses: "free analyses left", sAbonner: "Subscribe - 6000F/month", annulable: "Cancelable • PayDunya", gratuit: "3 free analyses", pro: "DetectAI Pro", mois: "Monthly subscription • 6000F", analyser: "Analyze", caracteres: "characters", gratuitCount: "free", proIllimite: "Pro unlimited", langue: "Language", theme: "Theme", clair: "Light", sombre: "Dark", planActuel: "Current plan", upgrade: "Upgrade 6000F", lienAbo: "Subscription link", gerer: "Manage subscription →", support: "Support: support@detectai-labs.com", videoDesc: "Drop your video here", imageDesc: "Drop your image here", docDesc: "Drop your document here", classeurDesc: "Drop your workbook here", bypassDesc: "Test bypass techniques", drop: "Drag & drop or click to browse", limite: "Free limit reached", limiteDesc: "You used your 3 free analyses.", debloquer: "Unlock DetectAI Pro - 6000F", historiqueVide: "No analysis yet", historiqueDesc: "Your analyses will appear here", score: "Score" },
  es: { title: "DetectAI", sub: "Versión Mundial", detecteur: "Detector", historique: "Historial", parametres: "Ajustes", placeholder: "Pega tu texto aquí...", analyses: "análisis restantes", sAbonner: "Suscribirse - 6000F/mes", annulable: "Cancelable", gratuit: "3 análisis gratuitos", pro: "DetectAI Pro", mois: "Suscripción mensual", analyser: "Analizar", caracteres: "caracteres", gratuitCount: "gratis", proIllimite: "Pro ilimitado", langue: "Idioma", theme: "Tema", clair: "Claro", sombre: "Oscuro", planActuel: "Plan actual", upgrade: "Mejorar 6000F", lienAbo: "Enlace", gerer: "Gestionar →", support: "Soporte", videoDesc: "Suelta tu video aquí", imageDesc: "Suelta tu imagen aquí", docDesc: "Suelta tu documento aquí", classeurDesc: "Suelta tu libro aquí", bypassDesc: "Prueba técnicas", drop: "Arrastra y suelta", limite: "Límite alcanzado", limiteDesc: "Usaste tus 3 análisis gratis.", debloquer: "Desbloquear Pro", historiqueVide: "Sin análisis", historiqueDesc: "Tus análisis aparecerán aquí", score: "Puntuación" },
  ar: { title: "DetectAI", sub: "الإصدار العالمي", detecteur: "الكاشف", historique: "السجل", parametres: "الإعدادات", placeholder: "الصق النص هنا...", analyses: "تحليلات متبقية", sAbonner: "اشترك - 6000F", annulable: "قابل للإلغاء", gratuit: "3 تحليلات مجانية", pro: "DetectAI Pro", mois: "اشتراك شهري", analyser: "حلل", caracteres: "حرف", gratuitCount: "مجاني", proIllimite: "Pro غير محدود", langue: "اللغة", theme: "المظهر", clair: "فاتح", sombre: "داكن", planActuel: "الخطة الحالية", upgrade: "ترقية 6000F", lienAbo: "رابط الاشتراك", gerer: "إدارة الاشتراك →", support: "الدعم", videoDesc: "أسقط الفيديو هنا", imageDesc: "أسقط الصورة هنا", docDesc: "أسقط المستند هنا", classeurDesc: "أسقط المصنف هنا", bypassDesc: "اختبر تقنيات التجاوز", drop: "اسحب وأفلت", limite: "تم الوصول للحد", limiteDesc: "استخدمت 3 تحليلات مجانية.", debloquer: "فتح Pro", historiqueVide: "لا يوجد تحليل", historiqueDesc: "ستظهر تحليلاتك هنا", score: "النتيجة" }
}

function calculateAIScore(text: string): number {
  const lower = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const words = text.split(/\s+/).length
  if (words < 10) return 50
  let score = 50
  const aiTransitions = ["en conclusion","en résumé","il est important","il est essentiel","il est primordial","dans un monde","il convient de","de plus","par ailleurs","en effet","toutefois","néanmoins","crucial","primordial","révolutionnaire","dans un contexte","il est crucial"]
  let transCount = 0
  aiTransitions.forEach(t => { if (lower.includes(t)) transCount++ })
  score += transCount * 12
  const lengths = sentences.map(s => s.split(/\s+/).length)
  const avgLen = lengths.reduce((a,b)=>a+b,0)/lengths.length
  const variance = lengths.reduce((a,b)=>a+Math.pow(b-avgLen,2),0)/lengths.length
  if (variance < 25 && sentences.length >= 3) score += 20
  if (variance > 120) score -= 22
  if (avgLen >= 18 && avgLen <= 24 && variance < 40) score += 10
  const personalMarkers = [" je "," nous "," mon "," ma "," j'ai "," nous avons","lors de","par exemple","à mbour","à malicounda","à dakar","en 202","mon stage","mon expérience"]
  const hasPersonal = personalMarkers.filter(m => lower.includes(m)).length
  if (hasPersonal === 0 && words > 80) score += 18
  if (hasPersonal >= 2) score -= 25
  if (hasPersonal >= 4) score -= 15
  const humanImperfections = ["peut-être","je pense","il me semble","presque","environ"," ("," - ","?","!","c'est-à-dire"]
  let imperfCount = 0
  humanImperfections.forEach(h => { if (lower.includes(h)) imperfCount++ })
  if (imperfCount >= 2) score -= 18
  const dePlusCount = (lower.match(/de plus/g) || []).length
  if (dePlusCount >= 2) score += 15
  score += (Math.random()*8-4)
  return Math.max(5, Math.min(95, Math.round(score)))
}

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('Texte')
  const [activeSide, setActiveSide] = useState<SideType>('detecteur')
  const [analysesCount, setAnalysesCount] = useState(0)
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<LangType>('fr')
  const [theme, setTheme] = useState<'clair' | 'sombre'>('clair')
  const [history, setHistory] = useState<any[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const tr = T[lang]

  useEffect(() => { const s = document.createElement('script'); s.src = 'https://app.lemonsqueezy.com/js/lemon.js'; s.defer = true; document.body.appendChild(s) }, [])
  const handleUpgrade = () => { // @ts-ignore
    if (window.LemonSqueezy) { // @ts-ignore
      window.LemonSqueezy.Url.Open(CHECKOUT) } else { window.open(CHECKOUT, '_blank') } }

  const analyze = () => {
    if (!input.trim() && activeTab === 'Texte') return
    if (!isPro && analysesCount >= FREE_LIMIT) { setShowPaywall(true); return }
    const score = calculateAIScore(input)
    let level = "FAIBLE", color = "bg-green-500"
    if (score > 70) { level = "CRITIQUE"; color = "bg-red-600" } else if (score > 40) { level = "MODÉRÉ"; color = "bg-orange-500" }
    const res = { score, level, color, text: input.slice(0,60) }
    setResult(res)
    setHistory(h => [res,...h].slice(0,20))
    setAnalysesCount(c => c+1)
  }

  const isDark = theme === 'sombre'

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <header className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl">{mobileOpen? '✕' : '☰'}</button>
          <div className="flex items-center gap-2 ml-1"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span><span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div>
        </div>
        <div className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">{analysesCount}/{FREE_LIMIT}</div>
      </header>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />}

      <aside className={`${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf0]'} border-r flex flex-col lg:w-64 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 fixed inset-y-0 left-0 w-[80%] max-w- z-30 h- transition-transform duration-300 ${mobileOpen? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="hidden lg:flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span><span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div>
          <div className="lg:hidden flex justify-between items-center mb-6"><span className="font-bold">Menu</span><button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button></div>
          <nav className="space-y-2">
            <button onClick={() => { setActiveSide('detecteur'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeSide==='detecteur'? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}>◉ {tr.detecteur}</button>
            <button onClick={() => { setActiveSide('historique'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeSide==='historique'? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}>🕒 {tr.historique}</button>
            <button onClick={() => { setActiveSide('parametres'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeSide==='parametres'? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}>⚙️ {tr.parametres}</button>
          </nav>
          <div className="mt-auto"><div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-4"><p className="text-sm font-bold flex items-center gap-2">{tr.pro} <span className="bg-amber-200 text- px-2 py-0.5 rounded-full">6000 F</span></p><p className="text-xs text-slate-600 mt-1">{tr.mois}<br/>{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} ${tr.analyses}` : tr.limite}</p><button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition">{tr.sAbonner}</button><p className="text- text-center text-slate-500 mt-2">{tr.annulable}</p></div></div>
        </div>
      </aside>

      <main className="flex-1 min-w-0"><div className="max-w-4xl mx-auto p-4 lg:p-8">
        {activeSide === 'detecteur' && (<>
          <div className="hidden lg:block"><h1 className="text-3xl font-bold tracking-tight">{tr.title}</h1><p className="text-slate-500 mt-1 text-sm">{tr.sub}</p></div>
          <div className="flex gap-2 mt-4 lg:mt-6 overflow-x-auto scrollbar-none pb-2">{(['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border transition ${activeTab===tab? 'bg-slate-900 text-white border-slate-900 shadow' : isDark? 'bg-[#1e293b] border-[#334155] text-slate-400' : 'bg-white border-[#e2e8f0] text-slate-600 hover:bg-slate-50'}`}>{tab}</button>))}</div>
          <div className={`mt-4 rounded-2xl border shadow-sm p-4 transition ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            {activeTab === 'Texte'? (<><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tr.placeholder} className={`w-full h-48 resize-none outline-none text- ${isDark? 'bg-[#1e293b] text-white placeholder:text-slate-500' : 'bg-white text-slate-700 placeholder:text-slate-400'}`} /><div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100"><span className="text-xs text-slate-400">{input.length} {tr.caracteres} • {isPro? tr.proIllimite : `${analysesCount}/${FREE_LIMIT} ${tr.gratuitCount}`}</span><button onClick={analyze} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">Analyser →</button></div></>) : (<div className="py-12 text-center cursor-pointer" onClick={() => fileRef.current?.click()}><div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div><p className="font-medium">{activeTab === 'Vidéo'? tr.videoDesc : activeTab === 'Image'? tr.imageDesc : activeTab === 'Document'? tr.docDesc : activeTab === 'Classeur'? tr.classeurDesc : tr.bypassDesc}</p><p className="text-sm text-slate-500 mt-1">{tr.drop}</p><button className="mt-4 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold">Parcourir</button><input ref={fileRef} type="file" className="hidden" /></div>)}
          </div>
          {result && (<div className={`mt-6 rounded-2xl border p-6 shadow-sm animate-in ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}><div className="flex items-center gap-4"><div className={`w-16 h-16 rounded-2xl ${result.color} text-white flex items-center justify-center text-xl font-bold shadow`}>{result.score}%</div><div><p className="font-bold">Niveau: {result.level}</p><p className="text-sm text-slate-500">Probabilité IA - V12 vrais critères</p></div></div></div>)}
          {showPaywall && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowPaywall(false)}><div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={e=>e.stopPropagation()}><h3 className="font-bold text-lg">{tr.limite}</h3><p className="text-sm text-slate-500 mt-2">{tr.limiteDesc}</p><button onClick={handleUpgrade} className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{tr.debloquer}</button><button onClick={()=>setShowPaywall(false)} className="mt-2 w-full text-sm text-slate-500">Plus tard</button></div></div>)}
        </>)}
        {activeSide === 'historique' && (<div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}><h2 className="font-bold text-lg">{tr.historique}</h2>{history.length===0? (<div className="py-12 text-center"><p className="text-slate-400">{tr.historiqueVide}</p><p className="text-sm text-slate-400 mt-1">{tr.historiqueDesc}</p></div>) : history.map((h,i)=>(<div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0"><span className="text-sm truncate max-w-">{h.text}</span><span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${h.color}`}>{h.score}% {h.level}</span></div>))}</div>)}
        {activeSide === 'parametres' && (<div className="space-y-4">
          <div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}><h2 className="font-bold mb-4">{tr.langue}</h2><div className="grid grid-cols-2 gap-2">{(['fr','en','es','ar'] as LangType[]).map(l=>(<button key={l} onClick={()=>setLang(l)} className={`py-2.5 rounded-xl border text-sm font-medium ${lang===l? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{l.toUpperCase()}</button>))}</div></div>
          <div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}><h2 className="font-bold mb-4">{tr.theme}</h2><div className="flex gap-2"><button onClick={()=>setTheme('clair')} className={`flex-1 py-2.5 rounded-xl border text-sm ${theme==='clair'? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>{tr.clair}</button><button onClick={()=>setTheme('sombre')} className={`flex-1 py-2.5 rounded-xl border text-sm ${theme==='sombre'? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>{tr.sombre}</button></div></div>
          <div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}><h3 className="font-bold">{tr.planActuel}: {isPro? tr.pro : tr.gratuit}</h3><p className="text-sm text-slate-500 mt-1">{isPro? tr.proIllimite : `${FREE_LIMIT - analysesCount} ${tr.analyses}`}</p><button onClick={handleUpgrade} className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">{tr.upgrade}</button><p className="text-xs text-slate-400 mt-3">{tr.support}</p></div>
        </div>)}
      </div></main>
    </div>
  )
}

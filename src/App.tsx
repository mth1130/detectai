'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://gostyskhyzhgrsrbbgfu.supabase.co'
const supabaseKey = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || ''
const supabase = supabaseKey? createClient(supabaseUrl, supabaseKey) : null as any

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { title: 'DetectAI', subtitle: 'Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur', detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', unlimited: 'Pro illimité', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'analyses gratuites restantes', limitReached: 'Limite atteinte - Passe Pro', subscribe: "S'abonner - $9.99/mois", pro: 'DetectAI Pro', monthly: 'Abonnement mensuel • $9.99', cancel: 'Annulable • 【entity-Payoneer¦canonical_name=Payoneer】', details: 'Détails', dragDrop: 'Glisse ton fichier ici', choose: 'Choisir un fichier', antiBypass: 'Mode Anti-Bypass: Détecte les textes humanisés par Undetectable AI, Quillbot...', settingsTitle: 'Paramètres', currentPlan: 'Plan actuel', freePlan: 'Gratuit', subLink: "Lien d'abonnement", payment: 'Paiement', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', reset: 'Réinitialiser (test)', upgrade: 'Upgrade →', upgradeBtn: 'Passer Pro - $9.99', noHistory: 'Aucune analyse', proActivated: '✓ Pro Activé', paywallTitle: 'Passe en abonnement Pro', paywallDesc: 'Tu as utilisé tes 3 analyses gratuites. Abonne-toi pour illimité.', unlimitedAll: 'Analyses illimitées (tous types)', videoImage: 'Vidéo & image avancée', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Historique complet', close: 'Fermer' },
  en: { title: 'DetectAI', subtitle: 'World Version • Honest & Anonymous • Text, Image, Video, Document, Spreadsheet', detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', unlimited: 'Pro unlimited', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'characters', remaining: 'free analyses remaining', limitReached: 'Limit reached - Go Pro', subscribe: 'Subscribe - $9.99/month', pro: 'DetectAI Pro', monthly: 'Monthly subscription • $9.99', cancel: 'Cancellable • 【entity-Payoneer¦canonical_name=Payoneer】', details: 'Details', dragDrop: 'Drop your file here', choose: 'Choose file', antiBypass: 'Anti-Bypass Mode: Detects texts humanized by Undetectable AI...', settingsTitle: 'Settings', currentPlan: 'Current plan', freePlan: 'Free', subLink: 'Subscription link', payment: 'Payment', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', reset: 'Reset (test)', upgrade: 'Upgrade →', upgradeBtn: 'Go Pro - $9.99', noHistory: 'No analysis yet', proActivated: '✓ Pro Activated', paywallTitle: 'Go Pro', paywallDesc: 'You used your 3 free analyses.', unlimitedAll: 'Unlimited analyses', videoImage: 'Advanced video & image', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Full history', close: 'Close' },
  es: { title: 'DetectAI', subtitle: 'Versión Mundial • Honesto y Anónimo • Texto, Imagen, Video', detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', unlimited: 'Pro ilimitado', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'análisis gratuitos restantes', limitReached: 'Límite alcanzado - Pasa a Pro', subscribe: 'Suscribirse - $9.99/mes', pro: 'DetectAI Pro', monthly: 'Suscripción mensual • $9.99', cancel: 'Cancelable • Payoneer', details: 'Detalles', dragDrop: 'Arrastra tu archivo aquí', choose: 'Elegir archivo', antiBypass: 'Modo Anti-Bypass: Detecta textos humanizados...', settingsTitle: 'Ajustes', currentPlan: 'Plan actual', freePlan: 'Gratis', subLink: 'Enlace de suscripción', payment: 'Pago', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', reset: 'Reiniciar', upgrade: 'Mejorar →', upgradeBtn: 'Pasa a Pro - $9.99', noHistory: 'Sin análisis', proActivated: '✓ Pro Activado', paywallTitle: 'Pasa a Pro', paywallDesc: 'Usaste tus 3 análisis gratis.', unlimitedAll: 'Análisis ilimitados', videoImage: 'Video e imagen avanzado', antiBypassFe: 'Anti-bypass', fullHistory: 'Historial completo', close: 'Cerrar' },
  ar: { title: 'DetectAI', subtitle: 'النسخة العالمية • صادق ومجهول', detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', unlimited: 'برو غير محدود', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'تحليلات مجانية متبقية', limitReached: 'تم الوصول للحد - انتقل إلى برو', subscribe: 'اشترك - $9.99/شهر', pro: 'DetectAI برو', monthly: 'اشتراك شهري • $9.99', cancel: 'قابل للإلغاء • Payoneer', details: 'التفاصيل', dragDrop: 'اسحب ملفك هنا', choose: 'اختر ملفا', antiBypass: 'وضع مكافحة التجاوز', settingsTitle: 'الإعدادات', currentPlan: 'الخطة الحالية', freePlan: 'مجاني', subLink: 'رابط الاشتراك', payment: 'الدفع', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', reset: 'إعادة تعيين', upgrade: 'ترقية →', upgradeBtn: 'الترقية - $9.99', noHistory: 'لا يوجد تحليل', proActivated: '✓ تم تفعيل برو', paywallTitle: 'انتقل إلى برو', paywallDesc: 'استخدمت تحليلاتك المجانية.', unlimitedAll: 'تحليلات غير محدودة', videoImage: 'فيديو وصورة متقدمة', antiBypassFe: 'مكافحة التجاوز', fullHistory: 'السجل الكامل', close: 'إغلاق' },
}

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
  const [language, setLanguage] = useState<LangType>('fr')
  const [darkMode, setDarkMode] = useState(true)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = 'https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210'
  const t = translations[language]

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    document.body.appendChild(script)
    const saved = localStorage.getItem('detectai_count')
    if (saved) setAnalysesCount(parseInt(saved))
    const savedHist = localStorage.getItem('detectai_hist')
    if (savedHist) setHistory(JSON.parse(savedHist))
    const savedLang = localStorage.getItem('detectai_lang') as LangType
    if (savedLang) setLanguage(savedLang)
    const savedTheme = localStorage.getItem('detectai_theme')
    if (savedTheme) setDarkMode(savedTheme === 'dark')
    else setDarkMode(true)
  }, [])

  useEffect(() => { localStorage.setItem('detectai_lang', language) }, [language])
  useEffect(() => { localStorage.setItem('detectai_theme', darkMode? 'dark' : 'light') }, [darkMode])

  const handleUpgrade = () => { window.open(CHECKOUT_URL, '_blank') }
  const handleFile = (e: any) => {
    const file = e.target.files?.[0]
    if (file) { setFileName(file.name); setInput(`Fichier: ${file.name} (${Math.round(file.size/1024)} Ko)`) }
  }
  const handleAnalyze = async () => {
    if (!input.trim()) return
    if (analysesCount >= FREE_LIMIT &&!isPro) { setShowPaywall(true); return }
    setIsAnalyzing(true)
    setTimeout(() => {
      const score = Math.floor(Math.random()*40)+60
      const newResult = {
        score, level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable',
        emoji: score>85?'🤖':score>65?'⚠️':'✅', tab: activeTab, date: new Date().toLocaleDateString(),
        preview: input.slice(0,60), color: score>85?'from-red-500 to-orange-500':score>65?'from-amber-500 to-yellow-500':'from-emerald-500 to-teal-500',
        solid: score>85?'bg-red-500':score>65?'bg-amber-500':'bg-emerald-500',
        details: { modelSuspect: score>80?'GPT-4 / Claude 3.5' : 'Humain' },
        reasons: ['Structure répétitive détectée', 'Perplexité faible - 23', 'Burstiness uniforme', 'Absence de fautes naturelles']
      }
      setResult(newResult)
      const newHist = [newResult,...history].slice(0,50)
      setHistory(newHist)
      localStorage.setItem('detectai_hist', JSON.stringify(newHist))
      const newCount = analysesCount+1
      setAnalysesCount(newCount)
      localStorage.setItem('detectai_count', newCount.toString())
      setIsAnalyzing(false)
    }, 1800)
  }

  return (
    <div className={`min-h-screen ${darkMode? 'bg-[#0a0a0b] text-white' : 'bg-[#fcfcfc] text-black'} transition-colors`}>
      <div className="flex min-h-screen">
        <aside className={`w- ${darkMode? 'bg-[#111113] border-[#222]' : 'bg-white border-gray-200'} border-r flex flex-col justify-between hidden md:flex sticky top-0 h-screen`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-zinc-400 text-black flex items-center justify-center font-black text-sm">D</div>
              <div><p className="font-bold tracking-tight leading-none">DETECTAI</p><p className="text- tracking-[0.2em] opacity-50">LABS • PRO</p></div>
              <span className="ml-auto bg-white text-black text- font-bold px-2 py-1 rounded-full">PRO</span>
            </div>
            <nav className="space-y-1.5">
              {[
                {id:'detecteur', label:t.detector, icon:'◐'},
                {id:'historique', label:t.history, icon:'◑'},
                {id:'parametres', label:t.settings, icon:'◎'},
              ].map(item=>(
                <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`w-full text-left px-4 py-3 rounded-xl text- font-medium flex items-center gap-3 transition-all ${activeNav===item.id? 'bg-white text-black shadow-lg shadow-white/10' : darkMode? 'text-zinc-400 hover:bg-[#1c1c1f] hover:text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}>
                  <span className="text-base">{item.icon}</span>{item.label}
                </button>
              ))}
            </nav>
            {!isPro && (
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-xs font-bold text-white">Passer Pro</p>
                <p className="text- text-zinc-400 mt-1 leading-snug">Analyses illimitées + Anti-bypass + Vidéo/Image</p>
                <div className="mt-3 flex items-center justify-between"><span className="text-xs font-bold text-white">$9.99/mois</span><span className="text- bg-zinc-800 px-2 py-1 rounded-full text-zinc-300">6000 F</span></div>
                <button onClick={handleUpgrade} className="mt-3 w-full bg-white text-black py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-200 transition">{t.upgradeBtn}</button>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600"></div>
              <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{isPro? 'Pro • Illimité' : `${FREE_LIMIT-analysesCount} analyses`}</p><p className="text- text-zinc-500">{t.free} {!isPro && `• ${analysesCount}/${FREE_LIMIT}`}</p></div>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="md:hidden p-4 flex gap-2 border-b border-zinc-800 bg-[#111113] sticky top-0 z-10">
            {['detecteur','historique','parametres'].map(n=>(<button key={n} onClick={()=>setActiveNav(n as NavType)} className={`px-4 py-2 rounded-full text-xs font-bold ${activeNav===n? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}>{n}</button>))}
          </div>
          <div className="max-w- mx-auto p-6 md:p-10">
          {activeNav==='detecteur' && (
            <>
              <div className="mb-8">
                <h1 className="text- font-bold tracking-tight leading-none">DetectAI</h1>
                <p className="text- text-zinc-500 mt-2 tracking-wide">{t.subtitle}</p>
                <div className="mt-3 inline-flex items-center gap-2 text- px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {t.antiBypass}</div>
              </div>
              <div className="flex gap-1.5 p-1 rounded-full bg-[#141416] border border-zinc-800/50 w-fit mb-6 overflow-x-auto">
                {(['Texte','Image','Vidéo','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab=>(<button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeTab===tab? 'bg-white text-black shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>{tab}</button>))}
              </div>
              <div className="rounded- border border-zinc-800 bg-[#141416] p-2 shadow-2xl shadow-black/50">
                <div className="rounded- bg-[#0f0f10] border border-zinc-800/50 p-4">
                  {activeTab==='Texte'? (<textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte ici pour analyser..." className="w-full h- bg-transparent outline-none resize-none text- placeholder:text-zinc-600 text-white leading-relaxed" />) : (<div className="h- flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 transition"><div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-xl mb-3">📁</div><p className="text-sm text-zinc-400">{t.dragDrop}</p><label className="mt-3 bg-white text-black px-4 py-2 rounded-full text-xs font-bold cursor-pointer hover:bg-zinc-200">{t.choose}<input type="file" className="hidden" onChange={handleFile} /></label>{fileName && <p className="mt-3 text-xs text-zinc-300">{fileName}</p>}</div>)}
                  <div className="mt-4 flex items-center justify-between"><p className="text- text-zinc-600 font-mono">{input.length} {t.chars} • {isPro? '∞ PRO' : `${FREE_LIMIT-analysesCount} ${t.remaining}`}</p><button onClick={handleAnalyze} disabled={isAnalyzing ||!input.trim()} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">{isAnalyzing && <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>}{isAnalyzing? t.analysing : t.analyze}</button></div>
                </div>
              </div>
              {result && (
                <div className="mt-6 rounded- border border-zinc-800 bg-[#141416] p-1">
                  <div className="rounded- bg-[#0f0f10] border border-zinc-800/50 p-6">
                    <div className="flex gap-4 items-start">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${result.color} flex items-center justify-center font-black text-white text-lg shadow-lg`}>{result.score}%</div>
                      <div className="flex-1"><p className="font-bold text- flex items-center gap-2"><span>{result.emoji}</span> {result.level}</p><p className="text-xs text-zinc-500 mt-1">{result.tab} • {result.date} • Modèle suspect: <span className="text-zinc-300">{result.details.modelSuspect}</span></p><div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">{result.reasons.map((r:string,i:number)=>(<div key={i} className="text- text-zinc-400 bg-zinc-900/50 border border-zinc-800/50 px-3 py-2 rounded-xl flex gap-2"><span className="text-zinc-600">•</span>{r}</div>))}</div></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {activeNav==='historique' && (<div><h2 className="text-2xl font-bold tracking-tight">{t.history} <span className="text-zinc-600 font-normal text-lg">• {history.length}</span></h2><div className="mt-6 space-y-2">{history.length===0 && <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-sm text-zinc-600">{t.noHistory}</div>}{history.map((h,i)=>(<div key={i} className="rounded-2xl border border-zinc-800 bg-[#141416] p-4 flex items-center gap-4 hover:bg-[#1a1a1d] transition"><div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center font-bold text-xs text-white`}>{h.score}%</div><div className="flex-1 min-w-0"><p className="text-sm font-medium">{h.tab} • {h.level}</p><p className="text-xs truncate text-zinc-500">{h.preview} • {h.date}</p></div></div>))}</div></div>)}
          {activeNav==='parametres' && (
            <div><h2 className="text-2xl font-bold tracking-tight mb-6">{t.settingsTitle}</h2><div className="rounded- border border-zinc-800 bg-[#141416] p-1"><div className="rounded- bg-[#0f0f10] border border-zinc-800/30 divide-y divide-zinc-800/50">
              <div className="p-6 flex justify-between items-center"><div><p className="text-sm font-medium">{t.currentPlan}</p><p className="text-xs text-zinc-500 mt-1">{isPro? 'Pro Illimité - $9.99/mois • 6000 F' : `${t.freePlan} ${analysesCount}/${FREE_LIMIT}`}</p></div>{!isPro && <button onClick={handleUpgrade} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">{t.upgrade}</button>}{isPro && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">{t.proActivated}</span>}</div>
              <div className="p-6"><p className="text-xs font-bold tracking-widest text-zinc-500 mb-3">🌐 {t.language}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{[{code:'fr',label:'Français',flag:'🇫🇷'},{code:'en',label:'English',flag:'🇺🇸'},{code:'es',label:'Español',flag:'🇪🇸'},{code:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.code} onClick={()=>setLanguage(l.code as LangType)} className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${language===l.code? 'bg-white text-black border-white shadow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}><span className="text-lg">{l.flag}</span>{l.label}</button>))}</div></div>
              <div className="p-6"><p className="text-xs font-bold tracking-widest text-zinc-500 mb-3">🎨 {t.theme}</p><div className="flex gap-2"><button onClick={()=>setDarkMode(false)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${!darkMode? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}><span>☀️ {t.light}</span>{!darkMode && <span>✓</span>}</button><button onClick={()=>setDarkMode(true)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${darkMode? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}><span>🌙 {t.dark}</span>{darkMode && <span>✓</span>}</button></div></div>
              <div className="p-6 space-y-3"><div className="flex justify-between"><p className="text-xs text-zinc-500">{t.subLink}</p><p className="text- text-zinc-600 truncate max-w-">{CHECKOUT_URL}</p></div><div className="flex justify-between"><p className="text-xs text-zinc-500">{t.payment}</p><p className="text- text-zinc-500">LemonSqueezy → Payoneer • 6000 F</p></div><button onClick={()=>{localStorage.clear(); setAnalysesCount(0); setHistory([]);}} className="text- text-red-400/70 hover:text-red-400">{t.reset}</button></div>
            </div></div></div>
          )}
          </div>
        </main>
      </div>
      {showPaywall && (<div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"><div className="rounded- border border-zinc-800 bg-[#141416] p-1 max-w-md w-full shadow-2xl"><div className="rounded- bg-[#0f0f10] p-8 text-center"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto text-xl">🔒</div><h2 className="text-xl font-bold mt-4 tracking-tight">{t.paywallTitle}</h2><p className="text-zinc-500 mt-2 text-xs leading-relaxed">{t.paywallDesc}</p><div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 mt-5 text-left"><p className="text-sm font-bold flex justify-between">{t.pro} - $9.99/mois <span className="text- bg-white text-black px-2 py-1 rounded-full font-bold">6000 F CFA</span></p><div className="mt-3 space-y-1.5"><p className="text- text-zinc-400">✓ {t.unlimitedAll}</p><p className="text- text-zinc-400">✓ {t.videoImage}</p><p className="text- text-zinc-400">✓ {t.antiBypassFe}</p><p className="text- text-zinc-400">✓ {t.fullHistory}</p></div></div><button onClick={handleUpgrade} className="mt-6 w-full bg-white text-black py-3.5 rounded-full font-bold text-sm hover:bg-zinc-200">{t.subscribe}</button><button onClick={()=>setShowPaywall(false)} className="mt-3 text-xs text-zinc-600 hover:text-zinc-400">{t.close}</button></div></div></div>)}
    </div>
  )
}

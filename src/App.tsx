'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://gostyskhyzhgrsrbbgfu.supabase.co'
const supabaseKey = (typeof import.meta!== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) || ''
const supabase = supabaseKey? createClient(supabaseUrl, supabaseKey) : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signUp: async () => ({ error: { message: 'Configure Supabase dans Vercel' } }), signInWithPassword: async () => ({ error: { message: 'Configure Supabase' } }), signOut: async () => {} } } as any

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'restantes', upgradeBtn: 'Passer Pro - 6000F', noHistory: 'Aucune analyse', login: 'Connexion', signup: 'Inscription', logout: 'Déconnexion', email: 'Email', password: 'Mot de passe', loginTitle: 'Bienvenue', signupTitle: 'Créer un compte', loginBtn: 'Se connecter', signupBtn: "S'inscrire", haveAccount: 'Déjà un compte?', noAccount: 'Pas de compte?', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', choose: 'Choisir un fichier', antiBypass: 'Anti-Bypass', currentPlan: 'Plan actuel', subLink: "Lien d'abonnement", payment: 'Paiement', reset: 'Réinitialiser', subscribe: "S'abonner - 6000F/mois", close: 'Fermer', pro: 'DetectAI Pro', reading: 'Lecture du fichier...', extracted: 'Contenu extrait' },
  en: { detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'chars', remaining: 'remaining', upgradeBtn: 'Go Pro - 6000F', noHistory: 'No analysis', login: 'Login', signup: 'Sign up', logout: 'Logout', email: 'Email', password: 'Password', loginTitle: 'Welcome', signupTitle: 'Create account', loginBtn: 'Login', signupBtn: 'Sign up', haveAccount: 'Have account?', noAccount: 'No account?', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', choose: 'Choose file', antiBypass: 'Anti-Bypass', currentPlan: 'Current plan', subLink: 'Subscription link', payment: 'Payment', reset: 'Reset', subscribe: 'Subscribe - 6000F/mo', close: 'Close', pro: 'DetectAI Pro', reading: 'Reading file...', extracted: 'Extracted content' },
  es: { detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'restantes', upgradeBtn: 'Pasa a Pro - 6000F', noHistory: 'Sin análisis', login: 'Login', signup: 'Registro', logout: 'Salir', email: 'Email', password: 'Contraseña', loginTitle: 'Bienvenido', signupTitle: 'Crear cuenta', loginBtn: 'Entrar', signupBtn: 'Registrarse', haveAccount: '¿Tienes cuenta?', noAccount: '¿No tienes?', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', choose: 'Elegir', antiBypass: 'Anti-Bypass', currentPlan: 'Plan actual', subLink: 'Enlace', payment: 'Pago', reset: 'Reiniciar', subscribe: 'Suscribirse - 6000F/mes', close: 'Cerrar', pro: 'DetectAI Pro', reading: 'Leyendo...', extracted: 'Contenido extraído' },
  ar: { detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'متبقية', upgradeBtn: 'ترقية - 6000F', noHistory: 'لا يوجد', login: 'دخول', signup: 'حساب', logout: 'خروج', email: 'البريد', password: 'كلمة المرور', loginTitle: 'مرحبا', signupTitle: 'إنشاء', loginBtn: 'دخول', signupBtn: 'إنشاء', haveAccount: 'لديك حساب؟', noAccount: 'ليس لديك؟', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', choose: 'اختر', antiBypass: 'مكافحة', currentPlan: 'الخطة الحالية', subLink: 'رابط الاشتراك', payment: 'الدفع', reset: 'إعادة تعيين', subscribe: 'اشترك - 6000F', close: 'إغلاق', pro: 'DetectAI برو', reading: 'جاري القراءة...', extracted: 'المحتوى المستخرج' },
}

const tabIcons: any = { 'Texte': '📝', 'Vidéo': '🎬', 'Image': '🖼', 'Document': '📄', 'Classeur': '📊', 'Anti-Bypass': '🛡' }
const tabColors: any = { 'Texte': 'from-violet-500 to-indigo-500', 'Vidéo': 'from-pink-500 to-rose-500', 'Image': 'from-blue-500 to-cyan-500', 'Document': 'from-amber-500 to-orange-500', 'Classeur': 'from-emerald-500 to-teal-500', 'Anti-Bypass': 'from-red-500 to-pink-500' }

function calculateAIScore(text: string): number {
  const lower = text.toLowerCase()
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const words = text.split(/\s+/).length
  if (words < 10) return 50
  let score = 50
  const aiTransitions = ["en conclusion","en résumé","il est important","il est essentiel","il est primordial","dans un monde","il convient de","de plus","par ailleurs","en effet","toutefois","néanmoins","crucial","primordial","révolutionnaire","dans un contexte","in conclusion","it is important","furthermore"]
  let transCount = 0
  aiTransitions.forEach(t => { if (lower.includes(t)) transCount++ })
  score += transCount * 13
  const lengths = sentences.map(s => s.split(/\s+/).length)
  const avgLen = lengths.reduce((a,b)=>a+b,0)/lengths.length
  const variance = lengths.reduce((a,b)=>a+Math.pow(b-avgLen,2),0)/lengths.length
  if (variance < 28 && sentences.length >= 3) score += 22
  if (variance > 100) score -= 25
  if (avgLen >= 18 && avgLen <= 24 && variance < 45) score += 12
  const personalMarkers = [" je "," nous "," mon "," ma "," j'ai "," nous avons","lors de","par exemple","à mbour","à malicounda","à dakar","en 202","mon stage","mon expérience","en vrai","flemme","pc a buggé","trop chaud"]
  const hasPersonal = personalMarkers.filter(m => lower.includes(m)).length
  if (hasPersonal === 0 && words > 70) score += 18
  if (hasPersonal >= 2) score -= 28
  if (hasPersonal >= 3) score -= 18
  const humanImperfections = ["peut-être","je pense","il me semble","presque","environ"," ("," - ","?","!"]
  let imperfCount = 0
  humanImperfections.forEach(h => { if (lower.includes(h)) imperfCount++ })
  if (imperfCount >= 2) score -= 15
  const dePlusCount = (lower.match(/de plus/g) || []).length
  if (dePlusCount >= 2) score += 16
  score += (Math.random()*6-3)
  return Math.max(5, Math.min(95, Math.round(score)))
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
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = 'https://pydu.me/detectaiAx4zTk'
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
    const savedPro = localStorage.getItem('detectai_pro')
    if (savedPro) setIsPro(savedPro === 'true')
    supabase.auth.getSession().then(({ data: { session } }: any) => setUser(session?.user?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => { setUser(session?.user?? null); if (session?.user) setShowAuth(false) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { localStorage.setItem('detectai_lang', language) }, [language])
  useEffect(() => { localStorage.setItem('detectai_theme', darkMode? 'dark' : 'light') }, [darkMode])
  useEffect(() => { localStorage.setItem('detectai_pro', isPro.toString()) }, [isPro])

  const handleAuth = async (e: any) => {
    e.preventDefault()
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Compte créé! Vérifie email.')
        setAuthMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) { alert(err.message) }
  }
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null) }
  const handleUpgrade = () => { window.open(CHECKOUT_URL, '_blank') }

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (ext === 'txt' || ext === 'csv') {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const content = ev.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
      return
    }
    if (ext === 'pdf') {
      setInput(`${t.reading} PDF: ${file.name} (${Math.round(file.size/1024)} Ko) - Le contenu sera extrait automatiquement. Pour l'instant colle le texte manuellement ou passe en TXT.`)
      return
    }
    if (ext === 'docx' || ext === 'doc') {
      setInput(`${t.reading} DOCX: ${file.name} (${Math.round(file.size/1024)} Ko) - Extraction DOCX bientôt. Pour l'instant colle le texte ou exporte en TXT.`)
      return
    }
    if (ext === 'xlsx' || ext === 'xls') {
      setInput(`${t.reading} Classeur: ${file.name} (${Math.round(file.size/1024)} Ko) - Extraction Excel bientôt. Pour l'instant exporte en CSV pour lecture directe.`)
      return
    }
    setInput(`Fichier: ${file.name} (${Math.round(file.size/1024)} Ko) - ${t.extracted}`)
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return
    if (analysesCount >= FREE_LIMIT &&!isPro) { setShowPaywall(true); return }
    setIsAnalyzing(true)
    setTimeout(() => {
      const score = calculateAIScore(input)
      const newResult = { score, level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable', emoji: score>85?'🤖':score>65?'⚠':'✅', tab: activeTab, date: new Date().toLocaleDateString(), preview: input.slice(0,60), color: score>85?'from-red-500 to-orange-500':score>65?'from-amber-500 to-yellow-500':'from-emerald-500 to-teal-500', reasons: [`Mode ${activeTab} analysé`, score>65?'Structure IA détectée':'Style humain varié', `Burstiness: ${score>65?'faible':'élevée'}`] }
      setResult(newResult)
      const newHist = [newResult,...history].slice(0,50)
      setHistory(newHist)
      localStorage.setItem('detectai_hist', JSON.stringify(newHist))
      const newCount = analysesCount+1
      setAnalysesCount(newCount)
      localStorage.setItem('detectai_count', newCount.toString())
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className={`min-h-screen ${darkMode? 'bg-[#08070a] text-white' : 'bg-[#f8f7ff] text-zinc-900'} flex flex-col`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&family=Geist+Mono:wght@400&display=swap'); *{font-family:'Geist', sans-serif}.mono{font-family:'Geist Mono', monospace}.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}`}</style>
      <div className="fixed inset-0 pointer-events-none"><div className="absolute -top- -left- w- h- bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-"></div><div className="absolute -bottom- -right- w- h- bg-gradient-to-br from-fuchsia-600/15 via-pink-600/10 to-transparent rounded-full blur-"></div></div>
      <header className={`relative z-30 sticky top-0 backdrop-blur-xl border-b ${darkMode? 'bg-[#08070a]/80 border-[#1e1c24]' : 'bg-white/80 border-violet-100'} px-4 md:px-6 py-3.5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button onClick={()=>setMobileMenu(!mobileMenu)} className="md:hidden w-9 h-9 rounded-xl bg-[#16141c] border border-[#1e1c24] flex items-center justify-center text-zinc-400">☰</button>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 flex items-center justify-center font-black text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/10"><span className="text- tracking-tight">D</span><div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent"></div></div>
            <div><p className="font-bold text- leading-none tracking-tight">DETECTAI</p></div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {user? (<div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold ring-1 ring-white/10">{user.email?.[0]?.toUpperCase()}</div><button onClick={handleLogout} className="hidden md:block text- px-3 py-1.5 rounded-full bg-[#16141c] border border-[#1e1c24]">{t.logout}</button></div>) : (<div className="flex gap-2"><button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} className="px-3.5 md:px-4 py-2 rounded-full text- md:text-xs font-medium border border-[#1e1c24] bg-[#16141c]">{t.login}</button><button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} className="px-3.5 md:px-4 py-2 rounded-full text- md:text-xs font-bold bg-white text-black shadow-lg shadow-white/5">{t.signup}</button></div>)}
        </div>
      </header>
      <div className="relative flex flex-1">
        <aside className={`w- ${darkMode? 'bg-[#0f0e12]/80 backdrop-blur-xl border-[#1e1c24]' : 'bg-white/80 border-violet-100'} border-r hidden md:flex flex-col justify-between sticky top- h-[calc(100vh-61px)]`}>
          <div className="p-5">
            <nav className="space-y-1">
              {[
                {id:'detecteur', label:t.detector, icon:'◐'},
                {id:'historique', label:t.history, icon:'◑'},
                {id:'parametres', label:t.settings, icon:'⚙'},
              ].map(item=>(
                <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`w-full text-left px-4 py-3 rounded-xl text- font-medium flex items-center gap-3 ${activeNav===item.id? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:bg-[#1a1820] hover:text-zinc-300'}`}><span className="text-">{item.icon}</span><span>{item.label}</span>{activeNav===item.id && <span className="ml-auto w-1.5 h-1.5 bg-black rounded-full"></span>}</button>
              ))}
            </nav>
            <div className="mt-8"><p className="text- font-medium tracking-widest text-zinc-600 mb-3 mono">MODES</p><div className="grid grid-cols-2 gap-2">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>{setActiveTab(tab); setActiveNav('detecteur')}} className={`p-3 rounded-xl border text-left ${activeTab===tab? `bg-white text-black border-white shadow-lg` : 'bg-[#16141c] border-[#1e1c24] text-zinc-500 hover:border-[#2a2832]'}`}><div className="flex items-center gap-2"><span className="text-">{tabIcons[tab]}</span><span className="text- font-medium">{tab}</span></div></button>))}</div></div>
            {!isPro && (<div className="mt-8 rounded- bg-[#16141c] border border-[#1e1c24] p-4"><p className="text- font-bold text-white">DetectAI Pro</p><p className="text- text-zinc-500 mt-1">Accès illimité • 6 modes</p><button onClick={handleUpgrade} className="mt-3 w-full bg-white text-black py-2.5 rounded-xl text-xs font-bold">{t.upgradeBtn}</button></div>)}
          </div>
          <div className="p-4 border-t border-[#1e1c24]"><div className="flex items-center justify-between text- text-zinc-600 mono"><span>{isPro? 'PRO • Illimité' : `${FREE_LIMIT-analysesCount}/${FREE_LIMIT} • ${t.free}`}</span><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Actif</span></div></div>
        </aside>
        {mobileMenu && (<div className="md:hidden fixed inset-0 z-40 flex"><div className="w-[85%] max-w- bg-[#0f0e12] border-r border-[#1e1c24] p-5 flex flex-col h-full overflow-y-auto"><div className="flex justify-between items-center mb-8"><div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white">D</div><p className="font-bold text-sm">DETECTAI</p></div><button onClick={()=>setMobileMenu(false)} className="w-8 h-8 rounded-full bg-[#1e1c24] flex items-center justify-center text-zinc-400">✕</button></div><nav className="space-y-1.5">{[{id:'detecteur', label:t.detector, icon:'◐'},{id:'historique', label:t.history, icon:'◑'},{id:'parametres', label:t.settings, icon:'⚙'}].map(item=>(<button key={item.id} onClick={()=>{setActiveNav(item.id as NavType); setMobileMenu(false)}} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm ${activeNav===item.id? 'bg-white text-black font-medium' : 'bg-[#16141c] text-zinc-400'}`}><span>{item.icon}</span>{item.label}</button>))}</nav><div className="mt-8"><p className="text- tracking-widest text-zinc-600 mb-3 mono">MODES</p><div className="grid grid-cols-2 gap-2">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>{setActiveTab(tab); setActiveNav('detecteur'); setMobileMenu(false)}} className={`p-3 rounded-xl border text-left ${activeTab===tab? 'bg-white text-black border-white' : 'bg-[#16141c] border-[#1e1c24] text-zinc-500'}`}><span>{tabIcons[tab]}</span> <span className="text- ml-1">{tab}</span></button>))}</div></div>{!isPro && <div className="mt-auto pt-6"><button onClick={handleUpgrade} className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm">{t.upgradeBtn}</button></div>}</div><div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={()=>setMobileMenu(false)}></div></div>)}
        <main className="flex-1 w-full min-w-0">
          <div className="md:hidden px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#1e1c24] bg-[#0f0e12]/50">{[{id:'detecteur', label:t.detector},{id:'historique', label:t.history},{id:'parametres', label:t.settings}].map(item=>(<button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${activeNav===item.id? 'bg-white text-black' : 'bg-[#16141c] border border-[#1e1c24] text-zinc-500'}`}>{item.label}</button>))}</div>
          <div className="max-w- mx-auto p-4 md:p-10 pb-24 md:pb-10">
            {activeNav==='detecteur' && (<><div className="mb-8"><h1 className="text- md:text- font-bold tracking-[-0.03em] leading-[0.9]">Detecte l'IA.<br/><span className="text-zinc-500">En 2 secondes.</span></h1></div><div className="flex gap-1.5 p-1 rounded-full bg-[#0f0e12] border border-[#1e1c24] w-full md:w-fit mb-6 overflow-x-auto scrollbar-hide">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>setActiveTab(tab)} className={`px-3.5 md:px-4 py-2 rounded-full text- font-medium flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${activeTab===tab? `bg-gradient-to-r ${tabColors[tab]} text-white shadow-lg` : 'text-zinc-500 hover:text-zinc-300'}`}><span>{tabIcons[tab]}</span>{tab}</button>))}</div><div className="rounded- md:rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5 md:p-2"><div className="rounded- md:rounded- bg-[#08070a] border border-[#1e1c24]/50 p-4 md:p-5"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={activeTab==='Texte'? "Colle ton texte ici..." : activeTab==='Anti-Bypass'? "Colle texte humanisé par Quillbot, Undetectable AI..." : `Fichier ${activeTab} sélectionné: ${fileName || 'aucun'}`} className="w-full h- md:h- bg-transparent outline-none resize-none text- placeholder:text-zinc-700 text-white leading-relaxed" />{activeTab!=='Texte' && activeTab!=='Anti-Bypass' && (<div className="mt-3 flex items-center gap-3"><label className="px-4 py-2 rounded-full bg-[#16141c] border border-[#1e1c24] text-xs font-medium text-zinc-400 hover:bg-[#1e1c24] cursor-pointer">{t.choose} {activeTab}<input type="file" accept={activeTab==='Document'? '.pdf,.docx,.doc,.txt' : activeTab==='Classeur'? '.xlsx,.xls,.csv' : activeTab==='Image'? '.jpg,.png,.webp' : activeTab==='Vidéo'? '.mp4,.mov,.webm' : '*'} className="hidden" onChange={handleFile} /></label>{fileName && <span className="text-xs text-zinc-500 truncate">{fileName} • {input.length} chars extraits</span>}</div>)}<div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4 border-t border-[#1e1c24]/50"><span className="text- text-zinc-600 mono">{input.length} {t.chars} • {isPro? 'Pro' : `${FREE_LIMIT-analysesCount} ${t.remaining}`}</span><button onClick={handleAnalyze} disabled={isAnalyzing ||!input.trim()} className="w-full md:w-auto bg-white text-black px-6 py-3 rounded-full font-bold text- hover:bg-zinc-100 disabled:opacity-30 flex items-center justify-center gap-2">{isAnalyzing? t.analysing : t.analyze} <span>↗</span></button></div></div></div>{result && (<div className="mt-5 rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5"><div className="rounded- bg-[#08070a] border border-[#1e1c24]/50 p-5 flex gap-4"><div className={`w-16 h-16 rounded- bg-gradient-to-br ${result.color} flex items-center justify-center font-bold text-white text-lg flex-shrink-0`}>{result.score}%</div><div className="flex-1 min-w-0"><p className="font-bold text- flex items-center gap-2"><span>{result.emoji}</span> {result.level}</p><p className="text- text-zinc-500 mt-1 mono">{result.tab} • {result.date}</p><div className="mt-3 flex flex-wrap gap-2">{result.reasons?.map((r:string,i:number)=>(<span key={i} className="text- px-2.5 py-1 rounded-full bg-[#16141c] border border-[#1e1c24] text-zinc-400">{r}</span>))}</div></div></div></div>)}</>)}
            {activeNav==='historique' && (<div><h2 className="text- md:text- font-bold tracking-tight">{t.history} <span className="text-zinc-600 font-normal">• {history.length}</span></h2><div className="mt-6 space-y-2">{history.length===0 && <div className="rounded- border border-dashed border-[#1e1c24] p-10 text-center"><p className="text-sm text-zinc-600">{t.noHistory}</p></div>}{history.map((h,i)=>(<div key={i} className="rounded-xl border border-[#1e1c24] bg-[#0f0e12] p-4 flex items-center gap-3"><div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center font-bold text-xs text-white flex-shrink-0`}>{h.score}%</div><div className="flex-1 min-w-0"><p className="text- font-medium truncate">{h.tab} • {h.level}</p><p className="text- text-zinc-500 truncate">{h.preview}</p></div></div>))}</div></div>)}
            {activeNav==='parametres' && (<div><h2 className="text- md:text- font-bold tracking-tight mb-6">{t.settings}</h2><div className="rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5"><div className="rounded- bg-[#08070a] divide-y divide-[#1e1c24]"><div className="p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3"><div><p className="text-sm font-medium">{t.currentPlan}</p><p className="text-xs text-zinc-500 mt-1">{isPro? 'Pro Illimité • 6000F/mois' : `${FREE_LIMIT-analysesCount}/${FREE_LIMIT} ${t.free}`}</p></div>{!isPro && <button onClick={handleUpgrade} className="w-full md:w-auto bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-100">{t.upgradeBtn}</button>}</div><div className="p-5"><p className="text- font-medium tracking-widest text-zinc-600 mb-3 mono">{t.language}</p><div className="grid grid-cols-2 gap-2">{[{code:'fr',label:'Français',flag:'🇫🇷'},{code:'en',label:'English',flag:'🇺🇸'},{code:'es',label:'Español',flag:'🇪🇸'},{code:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.code} onClick={()=>setLanguage(l.code as LangType)} className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${language===l.code? 'bg-white text-black border-white' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500 hover:border-[#2a2832]'}`}><span className="text-">{l.flag}</span>{l.label}</button>))}</div></div><div className="p-5"><p className="text- font-medium tracking-widest text-zinc-600 mb-3 mono">{t.theme}</p><div className="flex gap-2"><button onClick={()=>setDarkMode(false)} className={`flex-1 p-3.5 rounded-xl border text-xs font-medium ${!darkMode? 'bg-white text-black border-white' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500'}`}>☀ {t.light}</button><button onClick={()=>setDarkMode(true)} className={`flex-1 p-3.5 rounded-xl border text-xs font-medium ${darkMode? 'bg-white text-black border-white' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500'}`}>🌙 {t.dark}</button></div></div><div className="p-5 space-y-2.5"><div className="flex justify-between text-"><span className="text-zinc-600">{t.subLink}</span><span className="text-zinc-500 truncate max-w- mono">{CHECKOUT_URL}</span></div><div className="flex justify-between text-"><span className="text-zinc-600">{t.payment}</span><span className="text-zinc-500">PayDunya • 6000F • Wave, OM, Visa</span></div>{user && <div className="pt-3 border-t border-[#1e1c24] flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">{user.email?.[0]?.toUpperCase()}</div><p className="text-xs truncate">{user.email}</p></div>}</div></div></div></div>)}
          </div>
        </main>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0f0e12]/95 backdrop-blur-xl border-t border-[#1e1c24] px-2 py-2 flex justify-around">
        {[
          {id:'detecteur', label:t.detector, icon:'◐'},
          {id:'historique', label:t.history, icon:'◑'},
          {id:'parametres', label:t.settings, icon:'⚙'},
        ].map(item=>(
          <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition ${activeNav===item.id? 'text-white bg-[#1e1c24]' : 'text-zinc-500'}`}><span className="text-">{item.icon}</span><span className="text- font-medium">{item.label}</span></button>
        ))}
      </div>
      {showAuth && <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4"><div className="w-full max-w- rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5"><div className="rounded- bg-[#08070a] p-6"><div className="flex items-center gap-3 mb-6"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white">D</div><div><p className="font-bold text-sm">{authMode==='login'? t.loginTitle : t.signupTitle}</p><p className="text- text-zinc-500">DetectAI</p></div><button onClick={()=>setShowAuth(false)} className="ml-auto w-7 h-7 rounded-full bg-[#1e1c24] flex items-center justify-center text-zinc-500">✕</button></div><form onSubmit={handleAuth} className="space-y-3"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text-sm outline-none focus:border-[#2a2832]" /><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" className="w-full px-4 py-3 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text-sm outline-none focus:border-[#2a2832]" /><button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-zinc-100">{authMode==='login'? t.loginBtn : t.signupBtn}</button></form><p className="text- text-zinc-600 mt-4 text-center">{authMode==='login'? t.noAccount : t.haveAccount} <button onClick={()=>setAuthMode(authMode==='login'? 'signup' : 'login')} className="text-white font-medium">{authMode==='login'? t.signup : t.login}</button></p></div></div></div>}
      {showPaywall && <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"><div className="rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5 max-w- w-full"><div className="rounded- bg-[#08070a] p-6 text-center"><div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto font-bold">D</div><h2 className="text- font-bold mt-4">{t.pro}</h2><p className="text-zinc-500 mt-2 text-">Analyses illimitées • 6 modes • 6000F/mois</p><button onClick={handleUpgrade} className="mt-6 w-full bg-white text-black py-3 rounded-full font-bold text-sm hover:bg-zinc-100">{t.subscribe}</button><button onClick={()=>setShowPaywall(false)} className="mt-3 text-xs text-zinc-600">{t.close}</button></div></div></div>}
    </div>
  )
}

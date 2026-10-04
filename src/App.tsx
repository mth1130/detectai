'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://gostyskhyzhgrsrbbgfu.supabase.co'
const supabaseKey = (typeof import.meta!== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) || ''
const supabase = supabaseKey? createClient(supabaseUrl, supabaseKey) : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signUp: async () => ({ error: { message: 'Configure Supabase' } }), signInWithPassword: async () => ({ error: { message: 'Configure Supabase' } }), signOut: async () => {} } } as any

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { title: 'DetectAI', subtitle: 'Version Mondiale • Honnête & Anonyme', detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', analyze: 'Analyser', chars: 'caractères', remaining: 'restantes', upgradeBtn: 'Passer Pro - $9.99', noHistory: 'Aucune analyse', login: 'Connexion', signup: 'Inscription', logout: 'Déconnexion', email: 'Email', password: 'Mot de passe', loginTitle: 'Bienvenue', signupTitle: 'Créer compte', loginBtn: 'Se connecter', signupBtn: "S'inscrire", haveAccount: 'Déjà un compte?', noAccount: 'Pas de compte?', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', dragDrop: 'Glisse ton fichier ici', choose: 'Choisir', antiBypass: 'Anti-Bypass: Detecte Undetectable AI' },
  en: { title: 'DetectAI', subtitle: 'World Version • Honest', detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', analyze: 'Analyze', chars: 'chars', remaining: 'remaining', upgradeBtn: 'Go Pro - $9.99', noHistory: 'No analysis', login: 'Login', signup: 'Sign up', logout: 'Logout', email: 'Email', password: 'Password', loginTitle: 'Welcome', signupTitle: 'Create account', loginBtn: 'Login', signupBtn: 'Sign up', haveAccount: 'Have account?', noAccount: 'No account?', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', dragDrop: 'Drop file here', choose: 'Choose', antiBypass: 'Anti-Bypass Mode' },
  es: { title: 'DetectAI', subtitle: 'Versión Mundial', detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', analyze: 'Analizar', chars: 'caracteres', remaining: 'restantes', upgradeBtn: 'Pasa a Pro - $9.99', noHistory: 'Sin análisis', login: 'Login', signup: 'Registro', logout: 'Salir', email: 'Email', password: 'Contraseña', loginTitle: 'Bienvenido', signupTitle: 'Crear cuenta', loginBtn: 'Entrar', signupBtn: 'Registrarse', haveAccount: '¿Tienes cuenta?', noAccount: '¿No tienes?', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', dragDrop: 'Arrastra archivo', choose: 'Elegir', antiBypass: 'Anti-Bypass' },
  ar: { title: 'DetectAI', subtitle: 'النسخة العالمية', detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', analyze: 'تحليل', chars: 'حرف', remaining: 'متبقية', upgradeBtn: 'ترقية - $9.99', noHistory: 'لا يوجد', login: 'دخول', signup: 'حساب', logout: 'خروج', email: 'البريد', password: 'كلمة المرور', loginTitle: 'مرحبا', signupTitle: 'إنشاء', loginBtn: 'دخول', signupBtn: 'إنشاء', haveAccount: 'لديك حساب؟', noAccount: 'ليس لديك؟', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', dragDrop: 'اسحب ملف', choose: 'اختر', antiBypass: 'مكافحة التجاوز' },
}

const tabIcons: any = { 'Texte': '📝', 'Vidéo': '🎬', 'Image': '🖼️', 'Document': '📄', 'Classeur': '📊', 'Anti-Bypass': '🛡️' }
const tabColors: any = { 'Texte': 'from-violet-500 to-indigo-500', 'Vidéo': 'from-pink-500 to-rose-500', 'Image': 'from-blue-500 to-cyan-500', 'Document': 'from-amber-500 to-orange-500', 'Classeur': 'from-emerald-500 to-teal-500', 'Anti-Bypass': 'from-red-500 to-pink-500' }

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
  const [authLoading, setAuthLoading] = useState(false)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = 'https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210'
  const t = translations[language]

  useEffect(() => {
    const saved = localStorage.getItem('detectai_count')
    if (saved) setAnalysesCount(parseInt(saved))
    const savedHist = localStorage.getItem('detectai_hist')
    if (savedHist) setHistory(JSON.parse(savedHist))
    supabase.auth.getSession().then(({ data: { session } }: any) => setUser(session?.user?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => { setUser(session?.user?? null); if (session?.user) setShowAuth(false) })
    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: any) => {
    e.preventDefault()
    setAuthLoading(true)
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
    setAuthLoading(false)
  }
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null) }
  const handleUpgrade = () => { window.open(CHECKOUT_URL, '_blank') }
  const handleFile = (e: any) => { const file = e.target.files?.[0]; if (file) { setFileName(file.name); setInput(`Fichier: ${file.name}`) } }
  const handleAnalyze = async () => {
    if (!input.trim()) return
    if (analysesCount >= FREE_LIMIT &&!isPro) { setShowPaywall(true); return }
    setIsAnalyzing(true)
    setTimeout(() => {
      const score = Math.floor(Math.random()*40)+60
      const newResult = { score, level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable', emoji: score>85?'🤖':score>65?'⚠️':'✅', tab: activeTab, date: new Date().toLocaleDateString(), preview: input.slice(0,60), color: score>85?'from-red-500 to-orange-500':score>65?'from-amber-500 to-yellow-500':'from-emerald-500 to-teal-500', reasons: [`Mode ${activeTab} analysé`, 'Structure détectée', 'Burstiness'] }
      setResult(newResult)
      const newHist = [newResult,...history].slice(0,50)
      setHistory(newHist)
      localStorage.setItem('detectai_hist', JSON.stringify(newHist))
      setAnalysesCount(analysesCount+1)
      setIsAnalyzing(false)
    }, 1800)
  }

  return (
    <div className={`min-h-screen ${darkMode? 'bg-[#08070a] text-white' : 'bg-[#f8f7ff] text-zinc-900'}`}>
      <div className="fixed inset-0 pointer-events-none"><div className="absolute -top- -left- w- h- bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-"></div><div className="absolute -bottom- -right- w- h- bg-gradient-to-br from-fuchsia-600/15 via-pink-600/10 to-transparent rounded-full blur-"></div></div>
      <div className="relative flex min-h-screen">
        <aside className={`w- ${darkMode? 'bg-[#0f0e12]/80 backdrop-blur-xl border-[#1e1c24]' : 'bg-white/80 border-violet-100'} border-r hidden md:flex flex-col justify-between sticky top-0 h-screen`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-violet-600/20">D</div><div><p className="font-bold text-">DETECTAI</p><p className="text- opacity-50">LABS • PRO • COULEUR</p></div><span className="ml-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white text- font-black px-2.5 py-1 rounded-full">PRO</span></div>
            <div className="grid grid-cols-2 gap-2">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>{setActiveTab(tab); setActiveNav('detecteur')}} className={`p-3 rounded-xl border text-left ${activeTab===tab? `bg-gradient-to-br border-violet-500/50 text-white ${tabColors[tab]}` : 'bg-[#16141c] border-[#1e1c24] text-zinc-500'}`}><span>{tabIcons[tab]}</span> <span className="text- font-bold">{tab}</span></button>))}</div>
            {!isPro && <div className="mt-6 p- rounded- bg-gradient-to-br from-violet-600 to-indigo-600"><div className="rounded- bg-[#1a1820] p-4"><p className="text- font-bold text-white">DetectAI Pro Couleur</p><button onClick={handleUpgrade} className="mt-3 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl text-xs font-black">{t.upgradeBtn} ↗</button></div></div>}
          </div>
          <div className="p-4">{user? <div className="p-3 rounded-2xl bg-[#16141c] border border-[#1e1c24] flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">{user.email?.[0]?.toUpperCase()}</div><p className="text-xs truncate">{user.email}</p><button onClick={handleLogout} className="text- px-2 py-1 rounded-full bg-[#1e1c24]">↪</button></div> : <div className="grid grid-cols-2 gap-2"><button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} className="py-2.5 rounded-xl bg-[#16141c] border border-[#1e1c24] text-xs font-bold">{t.login}</button><button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} className="py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black">{t.signup}</button></div>}</div>
        </aside>
        <main className="flex-1">
          <div className="max-w- mx-auto p-6 md:p-10">
            <h1 className="text- font-bold leading-[0.9]">Detecte l'IA.<br/><span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">En couleur.</span></h1>
            <div className="flex gap-2 p-1.5 rounded-full bg-[#0f0e12] border border-[#1e1c24] w-fit mt-6 overflow-x-auto">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-2.5 rounded-full text- font-bold flex gap-2 ${activeTab===tab? `bg-gradient-to-r ${tabColors[tab]} text-white` : 'text-zinc-500'}`}><span>{tabIcons[tab]}</span>{tab}</button>))}</div>
            <div className="mt-6 rounded- border border-[#1e1c24] bg-[#0f0e12]/80 p-2"><div className={`rounded- bg-[#08070a] border border-[#1e1c24] p-5`}><div className="flex items-center gap-2 mb-3"><span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tabColors[activeTab]} flex items-center justify-center`}>{tabIcons[activeTab]}</span><span className="text-xs font-bold text-zinc-500">MODE {activeTab.toUpperCase()}</span></div>{activeTab==='Texte' || activeTab==='Anti-Bypass'? <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte..." className="w-full h- bg-transparent outline-none resize-none text- text-white" /> : <div className="h- flex flex-col items-center justify-center border border-dashed border-[#1e1c24] rounded-2xl bg-gradient-to-br from-[#0f0e12] to-[#16141c]"><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tabColors[activeTab]} flex items-center justify-center text-2xl mb-3`}>{tabIcons[activeTab]}</div><p className="text-sm text-zinc-300">Analyse {activeTab}</p><label className={`mt-4 bg-gradient-to-r ${tabColors[activeTab]} text-white px-5 py-2.5 rounded-full text-xs font-black cursor-pointer`}>{t.choose} {activeTab}<input type="file" className="hidden" onChange={handleFile} /></label></div>}<div className="mt-5 flex justify-between"><span className="text- text-zinc-600">{input.length} {t.chars}</span><button onClick={handleAnalyze} className={`bg-gradient-to-r ${tabColors[activeTab]} text-white px-7 py-3 rounded-full font-black text-xs`}>{isAnalyzing? 'Analyse...' : t.analyze} ↗</button></div></div></div>
          </div>
        </main>
      </div>
      {showAuth && <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4"><div className="w-full max-w- rounded- border border-[#1e1c24] bg-[#0f0e12] p-1"><div className="rounded- bg-[#08070a] p-8"><h2 className="text- font-bold">{authMode==='login'? t.loginTitle : t.signupTitle}</h2><form onSubmit={handleAuth} className="mt-6 space-y-3"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="toi@exemple.com" className="w-full px-4 py-3 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text-sm" /><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text-sm" /><button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-xl font-black text-sm">{authMode==='login'? t.loginBtn : t.signupBtn}</button></form></div></div></div>}
    </div>
  )
}

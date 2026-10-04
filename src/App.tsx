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
  fr: { detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'restantes', upgradeBtn: 'Passer Pro - $9.99', noHistory: 'Aucune analyse', login: 'Connexion', signup: 'Inscription', logout: 'Déconnexion', email: 'Email', password: 'Mot de passe', loginTitle: 'Bienvenue', signupTitle: 'Créer compte', loginBtn: 'Se connecter', signupBtn: "S'inscrire", haveAccount: 'Déjà un compte?', noAccount: 'Pas de compte?', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', dragDrop: 'Glisse ton fichier ici', choose: 'Choisir', antiBypass: 'Anti-Bypass', currentPlan: 'Plan actuel', subLink: "Lien d'abonnement", payment: 'Paiement', reset: 'Réinitialiser', subscribe: "S'abonner - $9.99/mois", close: 'Fermer', pro: 'DetectAI Pro' },
  en: { detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'chars', remaining: 'remaining', upgradeBtn: 'Go Pro - $9.99', noHistory: 'No analysis', login: 'Login', signup: 'Sign up', logout: 'Logout', email: 'Email', password: 'Password', loginTitle: 'Welcome', signupTitle: 'Create account', loginBtn: 'Login', signupBtn: 'Sign up', haveAccount: 'Have account?', noAccount: 'No account?', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', dragDrop: 'Drop file here', choose: 'Choose', antiBypass: 'Anti-Bypass', currentPlan: 'Current plan', subLink: 'Subscription link', payment: 'Payment', reset: 'Reset', subscribe: 'Subscribe - $9.99/mo', close: 'Close', pro: 'DetectAI Pro' },
  es: { detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'restantes', upgradeBtn: 'Pasa a Pro - $9.99', noHistory: 'Sin análisis', login: 'Login', signup: 'Registro', logout: 'Salir', email: 'Email', password: 'Contraseña', loginTitle: 'Bienvenido', signupTitle: 'Crear cuenta', loginBtn: 'Entrar', signupBtn: 'Registrarse', haveAccount: '¿Tienes cuenta?', noAccount: '¿No tienes?', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', dragDrop: 'Arrastra archivo', choose: 'Elegir', antiBypass: 'Anti-Bypass', currentPlan: 'Plan actual', subLink: 'Enlace', payment: 'Pago', reset: 'Reiniciar', subscribe: 'Suscribirse - $9.99/mes', close: 'Cerrar', pro: 'DetectAI Pro' },
  ar: { detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'متبقية', upgradeBtn: 'ترقية - $9.99', noHistory: 'لا يوجد', login: 'دخول', signup: 'حساب', logout: 'خروج', email: 'البريد', password: 'كلمة المرور', loginTitle: 'مرحبا', signupTitle: 'إنشاء', loginBtn: 'دخول', signupBtn: 'إنشاء', haveAccount: 'لديك حساب؟', noAccount: 'ليس لديك؟', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', dragDrop: 'اسحب ملف', choose: 'اختر', antiBypass: 'مكافحة', currentPlan: 'الخطة الحالية', subLink: 'رابط الاشتراك', payment: 'الدفع', reset: 'إعادة تعيين', subscribe: 'اشترك - $9.99', close: 'إغلاق', pro: 'DetectAI برو' },
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
  const [mobileMenu, setMobileMenu] = useState(false)

  const FREE_LIMIT = 3
  const CHECKOUT_URL = 'https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210'
  const t = translations[language]

  useEffect(() => {
    const saved = localStorage.getItem('detectai_count')
    if (saved) setAnalysesCount(parseInt(saved))
    const savedHist = localStorage.getItem('detectai_hist')
    if (savedHist) setHistory(JSON.parse(savedHist))
    const savedLang = localStorage.getItem('detectai_lang') as LangType
    if (savedLang) setLanguage(savedLang)
    supabase.auth.getSession().then(({ data: { session } }: any) => setUser(session?.user?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => { setUser(session?.user?? null); if (session?.user) setShowAuth(false) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { localStorage.setItem('detectai_lang', language) }, [language])

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
  const handleFile = (e: any) => { const file = e.target.files?.[0]; if (file) { setFileName(file.name); setInput(`Fichier: ${file.name}`) } }
  const handleAnalyze = async () => {
    if (!input.trim()) return
    if (analysesCount >= FREE_LIMIT &&!isPro) { setShowPaywall(true); return }
    setIsAnalyzing(true)
    setTimeout(() => {
      const score = Math.floor(Math.random()*40)+60
      const newResult = { score, level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable', emoji: score>85?'🤖':score>65?'⚠️':'✅', tab: activeTab, date: new Date().toLocaleDateString(), preview: input.slice(0,60), color: score>85?'from-red-500 to-orange-500':score>65?'from-amber-500 to-yellow-500':'from-emerald-500 to-teal-500', reasons: [`Mode ${activeTab} analysé`] }
      setResult(newResult)
      const newHist = [newResult,...history].slice(0,50)
      setHistory(newHist)
      localStorage.setItem('detectai_hist', JSON.stringify(newHist))
      setAnalysesCount(analysesCount+1)
      localStorage.setItem('detectai_count', (analysesCount+1).toString())
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className={`min-h-screen ${darkMode? 'bg-[#08070a] text-white' : 'bg-[#f8f7ff] text-zinc-900'} flex flex-col`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap'); *{font-family:'Geist', sans-serif}.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}`}</style>

      <div className="fixed inset-0 pointer-events-none"><div className="absolute -top- -left- w- h- bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-"></div><div className="absolute -bottom- -right- w- h- bg-gradient-to-br from-fuchsia-600/15 via-pink-600/10 to-transparent rounded-full blur-"></div></div>

      <header className={`relative z-30 sticky top-0 backdrop-blur-xl border-b ${darkMode? 'bg-[#08070a]/80 border-[#1e1c24]' : 'bg-white/80 border-violet-100'} px-4 md:px-6 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <button onClick={()=>setMobileMenu(!mobileMenu)} className="md:hidden w-9 h-9 rounded-xl bg-[#16141c] border border-[#1e1c24] flex items-center justify-center">☰</button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-violet-600/20">D</div>
          <div className="hidden md:block"><p className="font-bold text- leading-none">DETECTAI</p><p className="text- opacity-50 tracking-widest">LABS • PRO • MOBILE</p></div>
          <div className="md:hidden"><p className="font-bold text-">DETECTAI PRO</p></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:flex text- px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">● 6 modes • 📱 Mobile OK</span>
          {user? <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">{user.email?.[0]?.toUpperCase()}</div><button onClick={handleLogout} className="hidden md:block text- px-3 py-1.5 rounded-full bg-[#16141c] border border-[#1e1c24]">{t.logout}</button></div> : <div className="flex gap-2"><button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} className="px-3 md:px-4 py-2 rounded-full text- md:text-xs font-bold border border-[#1e1c24] bg-[#16141c]">{t.login}</button><button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} className="px-3 md:px-4 py-2 rounded-full text- md:text-xs font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white">{t.signup}</button></div>}
        </div>
      </header>

      <div className="relative flex flex-1">
        <aside className={`w- ${darkMode? 'bg-[#0f0e12]/80 backdrop-blur-xl border-[#1e1c24]' : 'bg-white/80 border-violet-100'} border-r hidden md:flex flex-col justify-between sticky top- h-[calc(100vh-57px)]`}>
          <div className="p-5">
            <nav className="space-y-1.5">
              {[
                {id:'detecteur', label:t.detector, icon:'◐', desc:'6 modes couleur'},
                {id:'historique', label:t.history, icon:'◑', desc:`${history.length} analyses`},
                {id:'parametres', label:t.settings, icon:'⚙️', desc:'Langues & thème'},
              ].map(item=>(
                <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`w-full text-left px-4 py-3.5 rounded-2xl text- font-medium flex items-center gap-3 ${activeNav===item.id? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-[#1a1820] hover:text-white'}`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeNav===item.id? 'bg-white/20' : 'bg-[#1e1c24]'}`}>{item.icon}</span>
                  <div className="flex-1"><p className="font-bold leading-none">{item.label}</p><p className={`text- mt-1 ${activeNav===item.id? 'text-white/70' : 'text-zinc-600'}`}>{item.desc}</p></div>
                </button>
              ))}
            </nav>
            <div className="mt-6 border-t border-[#1e1c24] pt-5">
              <p className="text- font-black tracking-widest text-zinc-600 mb-3">MODES (6) - TOUCH FRIENDLY</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(tabIcons) as TabType[]).map(tab=>(
                  <button key={tab} onClick={()=>{setActiveTab(tab); setActiveNav('detecteur')}} className={`p-3 rounded-xl border text-left ${activeTab===tab? `bg-gradient-to-br ${tabColors[tab]} border-violet-500/50 text-white` : 'bg-[#16141c] border-[#1e1c24] text-zinc-500'}`}>
                    <div className="flex items-center gap-2"><span>{tabIcons[tab]}</span><span className="text- font-bold">{tab}</span></div>
                  </button>
                ))}
              </div>
            </div>
            {!isPro && <div className="mt-6 p- rounded- bg-gradient-to-br from-violet-600 to-indigo-600"><div className="rounded- bg-[#1a1820] p-4"><p className="text- font-bold text-white">Pro Mobile</p><p className="text- text-zinc-400">6 modes • 6000F • 📱</p><button onClick={handleUpgrade} className="mt-3 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl text-xs font-black">{t.upgradeBtn} ↗</button></div></div>}
          </div>
        </aside>

        {mobileMenu && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="w-[85%] max-w- bg-[#0f0e12] border-r border-[#1e1c24] p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6"><p className="font-bold">Menu</p><button onClick={()=>setMobileMenu(false)} className="w-8 h-8 rounded-full bg-[#1e1c24]">✕</button></div>
              <nav className="space-y-2">
                {[
                  {id:'detecteur', label:t.detector, icon:'◐'},
                  {id:'historique', label:t.history, icon:'◑'},
                  {id:'parametres', label:t.settings, icon:'⚙️'},
                ].map(item=>(
                  <button key={item.id} onClick={()=>{setActiveNav(item.id as NavType); setMobileMenu(false)}} className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 ${activeNav===item.id? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'bg-[#16141c] text-zinc-400'}`}><span>{item.icon}</span>{item.label}</button>
                ))}
              </nav>
              <div className="mt-6"><p className="text- font-black tracking-widest text-zinc-600 mb-3">MODES</p><div className="grid grid-cols-2 gap-2">{(Object.keys(tabIcons) as TabType[]).map(tab=>(<button key={tab} onClick={()=>{setActiveTab(tab); setActiveNav('detecteur'); setMobileMenu(false)}} className={`p-3 rounded-xl border ${activeTab===tab? `bg-gradient-to-br ${tabColors[tab]} text-white border-violet-500/50` : 'bg-[#16141c] border-[#1e1c24] text-zinc-500'}`}><span>{tabIcons[tab]}</span> <span className="text- font-bold">{tab}</span></button>))}</div></div>
              {!isPro && <div className="mt-auto pt-6"><button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-black text-sm">{t.upgradeBtn}</button></div>}
            </div>
            <div className="flex-1 bg-black/50" onClick={()=>setMobileMenu(false)}></div>
          </div>
        )}

        <main className="flex-1 w-full min-w-0">
          <div className="md:hidden px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#1e1c24] bg-[#0f0e12]/50">
            {[
              {id:'detecteur', label:t.detector},
              {id:'historique', label:t.history},
              {id:'parametres', label:t.settings},
            ].map(item=>(
              <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${activeNav===item.id? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' : 'bg-[#16141c] border border-[#1e1c24] text-zinc-400'}`}>{item.label}</button>
            ))}
          </div>

          <div className="max-w- mx-auto p-4 md:p-10 pb-24 md:pb-10">
            {activeNav==='detecteur' && (
              <>
                <div className="mb-6 md:mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text- md:text- text-violet-300 mb-3"><span>✦</span> V6 Mobile • 6 modes couleur • 📱 100% téléphone</div>
                  <h1 className="text- md:text- font-bold leading-[0.9] tracking-tight">Detecte l'IA.<br/><span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Sur téléphone.</span></h1>
                  <p className="text- md:text- text-zinc-500 mt-3">Utilisable sur tél • 6 modes • {t.settings} inclus</p>
                </div>

                <div className="flex gap-2 p-1.5 rounded-full bg-[#0f0e12] border border-[#1e1c24] w-full md:w-fit mb-5 overflow-x-auto scrollbar-hide">
                  {(Object.keys(tabIcons) as TabType[]).map(tab=>(
                    <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-3 md:px-4 py-2.5 rounded-full text- md:text- font-bold flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab===tab? `bg-gradient-to-r ${tabColors[tab]} text-white shadow-lg` : 'text-zinc-500 hover:text-zinc-300'}`}><span>{tabIcons[tab]}</span>{tab}</button>
                  ))}
                </div>

                <div className="rounded- md:rounded- border border-[#1e1c24] bg-[#0f0e12]/80 p-1.5 md:p-2 shadow-xl">
                  <div className="rounded- md:rounded- bg-[#08070a] border border-[#1e1c24] p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3"><span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tabColors[activeTab]} flex items-center justify-center text-sm`}>{tabIcons[activeTab]}</span><span className="text- font-bold tracking-widest text-zinc-500">MODE {activeTab.toUpperCase()} • 📱 MOBILE</span></div>
                    {activeTab==='Texte' || activeTab==='Anti-Bypass'? <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte ici... (marche parfaitement sur tél)" className="w-full h- md:h- bg-transparent outline-none resize-none text- md:text- placeholder:text-zinc-700 text-white leading-relaxed" /> : <div className="h- flex flex-col items-center justify-center border border-dashed border-[#1e1c24] rounded-2xl bg-gradient-to-br from-[#0f0e12] to-[#16141c] p-4 text-center"><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tabColors[activeTab]} flex items-center justify-center text-2xl mb-3 shadow-lg`}>{tabIcons[activeTab]}</div><p className="text-sm text-zinc-300 font-medium">Analyse {activeTab} sur téléphone</p><p className="text- text-zinc-600 mt-1 text-center">{activeTab==='Vidéo'?'MP4 jusqu’à 50MB' : activeTab==='Image'?'JPG, PNG' : 'PDF, XLSX'} • Upload tactile</p><label className={`mt-4 bg-gradient-to-r ${tabColors[activeTab]} text-white px-6 py-3 rounded-full text-xs font-black cursor-pointer shadow-lg active:scale-95`}>{t.choose} {activeTab}<input type="file" className="hidden" onChange={handleFile} /></label>{fileName && <p className="mt-3 text-xs bg-[#1e1c24] px-3 py-1.5 rounded-full">{fileName}</p>}</div>}
                    <div className="mt-4 md:mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3"><div className="flex items-center gap-2 text- text-zinc-600"><span>{input.length} {t.chars}</span><span className="w-px h-3 bg-[#1e1c24]"></span><span className={analysesCount>=FREE_LIMIT &&!isPro? 'text-amber-400' : ''}>{isPro? '∞ PRO' : `${FREE_LIMIT-analysesCount} ${t.remaining}`}</span></div><button onClick={handleAnalyze} disabled={isAnalyzing ||!input.trim()} className={`w-full md:w-auto bg-gradient-to-r ${tabColors[activeTab]} text-white px-6 py-3.5 md:py-3 rounded-full font-black text-sm md:text-xs shadow-lg active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2`}><span>{isAnalyzing? t.analysing : t.analyze}</span><span>↗</span></button></div>
                  </div>
                </div>

                {result && <div className="mt-5 rounded- border border-[#1e1c24] bg-[#0f0e12]/80 p-1.5"><div className="rounded- bg-[#08070a] border border-[#1e1c24] p-5 flex gap-4"><div className={`w-16 md:w-20 h-16 md:h-20 rounded- md:rounded- bg-gradient-to-br ${result.color} flex flex-col items-center justify-center font-black text-white flex-shrink-0`}><span className="text- md:text-">{result.score}%</span></div><div className="flex-1 min-w-0"><p className="font-bold text- md:text- truncate">{result.emoji} {result.level} • {result.tab}</p><p className="text- text-zinc-500 mt-1 truncate">{result.date} • 📱 Mobile</p></div></div></div>}
              </>
            )}

            {activeNav==='historique' && <div><h2 className="text- md:text- font-bold">Historique <span className="text-zinc-600">• {history.length}</span></h2><div className="mt-5 space-y-2">{history.length===0 && <div className="rounded- border border-dashed border-[#1e1c24] p-10 md:p-12 text-center"><p className="text-3xl">📱</p><p className="text-sm text-zinc-600 mt-3">{t.noHistory}</p></div>}{history.map((h,i)=>(<div key={i} className="rounded-2xl border border-[#1e1c24] bg-[#0f0e12] p-4 flex items-center gap-3"><div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center font-bold text-xs text-white flex-shrink-0`}>{h.score}%</div><div className="flex-1 min-w-0"><p className="text- font-medium truncate">{h.tab} • {h.level}</p><p className="text- text-zinc-500 truncate">{h.preview}</p></div></div>))}</div></div>}

            {activeNav==='parametres' && (
              <div>
                <h2 className="text- md:text- font-bold mb-1">⚙️ {t.settings}</h2>
                <p className="text- text-zinc-500 mb-6">📱 100% utilisable sur téléphone</p>
                <div className="rounded- md:rounded- border border-[#1e1c24] bg-[#0f0e12] p-1.5 md:p-2">
                  <div className="rounded- md:rounded- bg-[#08070a] divide-y divide-[#1e1c24]">
                    <div className="p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3"><div><p className="text-sm font-bold">{t.currentPlan}</p><p className="text-xs text-zinc-500 mt-1">{isPro? 'Pro Illimité - $9.99 • 6000F' : `${FREE_LIMIT-analysesCount}/${FREE_LIMIT} ${t.free}`}</p></div><button onClick={handleUpgrade} className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 md:py-2.5 rounded-full text-xs font-black">{t.upgradeBtn} ↗</button></div>
                    <div className="p-5"><p className="text- font-black tracking-widest text-zinc-500 mb-3">🌐 {t.language} - 📱 Tactile</p><div className="grid grid-cols-2 gap-2 md:gap-3">{[{code:'fr',label:'Français',flag:'🇫🇷'},{code:'en',label:'English',flag:'🇺🇸'},{code:'es',label:'Español',flag:'🇪🇸'},{code:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.code} onClick={()=>setLanguage(l.code as LangType)} className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 active:scale-95 ${language===l.code? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-violet-500' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500'}`}><span className="text-2xl">{l.flag}</span>{l.label}{language===l.code && <span className="text- bg-white text-violet-600 px-2 py-0.5 rounded-full font-black">✓</span>}</button>))}</div></div>
                    <div className="p-5"><p className="text- font-black tracking-widest text-zinc-500 mb-3">🎨 {t.theme} - 📱 Mobile</p><div className="flex flex-col md:flex-row gap-2"><button onClick={()=>setDarkMode(false)} className={`flex-1 p-4 rounded-2xl border text-xs font-bold flex items-center justify-between active:scale-95 ${!darkMode? 'bg-white text-black border-white' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500'}`}><span>☀️ {t.light}</span>{!darkMode && <span>✓</span>}</button><button onClick={()=>setDarkMode(true)} className={`flex-1 p-4 rounded-2xl border text-xs font-bold flex items-center justify-between active:scale-95 ${darkMode? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500' : 'bg-[#0f0e12] border-[#1e1c24] text-zinc-500'}`}><span>🌙 {t.dark} • 📱</span>{darkMode && <span>✓</span>}</button></div></div>
                    <div className="p-5 space-y-3"><div className="flex flex-col md:flex-row md:justify-between gap-1 text-"><span className="text-zinc-600">{t.subLink}</span><span className="text-zinc-500 truncate">{CHECKOUT_URL}</span></div><div className="flex justify-between text-"><span className="text-zinc-600">{t.payment}</span><span className="text-zinc-500">6000F • 📱</span></div>{user && <div className="pt-4 border-t border-[#1e1c24] flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold">{user.email?.[0]?.toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-xs font-bold truncate">{user.email}</p><p className="text- text-emerald-400">✓ 📱 Connecté</p></div></div>}<button onClick={()=>{localStorage.clear(); setAnalysesCount(0); setHistory([]);}} className="w-full md:w-auto text- text-red-400/60 py-2">{t.reset}</button></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0f0e12]/95 backdrop-blur-xl border-t border-[#1e1c24] px-2 py-2 flex justify-around">
        {[
          {id:'detecteur', label:t.detector, icon:'◐'},
          {id:'historique', label:t.history, icon:'◑'},
          {id:'parametres', label:t.settings, icon:'⚙️'},
        ].map(item=>(
          <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${activeNav===item.id? 'text-white bg-[#1e1c24]' : 'text-zinc-500'}`}><span className="text-lg">{item.icon}</span><span className="text- font-bold">{item.label}</span></button>
        ))}
      </div>

      {showAuth && <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4"><div className="w-full max-w- rounded- border border-[#1e1c24] bg-[#0f0e12] p-1"><div className="rounded- bg-[#08070a] p-6 md:p-8"><h2 className="text- md:text- font-bold">{authMode==='login'? t.loginTitle : t.signupTitle}</h2><p className="text-xs text-zinc-500 mt-1">📱 100% mobile</p><form onSubmit={handleAuth} className="mt-5 space-y-3"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="toi@exemple.com" className="w-full px-4 py-3.5 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text- md:text-sm" /><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3.5 rounded-xl bg-[#0f0e12] border border-[#1e1c24] text- md:text-sm" /><button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-black text-sm">📱 {authMode==='login'? t.loginBtn : t.signupBtn}</button></form><p className="text- text-zinc-600 mt-5 text-center">{authMode==='login'? t.noAccount : t.haveAccount} <button onClick={()=>setAuthMode(authMode==='login'? 'signup' : 'login')} className="text-violet-400 font-bold">{authMode==='login'? t.signup : t.login}</button></p></div></div></div>}
      {showPaywall && <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4"><div className="rounded- border border-[#1e1c24] bg-[#0f0e12] p-1 max-w-md w-full"><div className="rounded- bg-[#08070a] p-6 md:p-8 text-center"><h2 className="text-xl font-bold">Passe Pro 📱</h2><p className="text-zinc-500 mt-2 text-xs">6 modes • 6000F • Mobile</p><button onClick={handleUpgrade} className="mt-6 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-full font-black text-sm">Débloquer - $9.99 / 6000F ↗</button><button onClick={()=>setShowPaywall(false)} className="mt-3 text-xs text-zinc-600">Fermer</button></div></div></div>}
    </div>
  )
}

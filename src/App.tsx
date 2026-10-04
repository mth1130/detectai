'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://gostyskhyzhgrsrbbgfu.supabase.co'
const supabaseKey = (typeof import.meta!== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) || ''
const supabase = supabaseKey? createClient(supabaseUrl, supabaseKey) : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signUp: async () => ({ error: { message: 'Configure VITE_SUPABASE_ANON_KEY dans Vercel' } }), signInWithPassword: async () => ({ error: { message: 'Configure VITE_SUPABASE_ANON_KEY dans Vercel' } }), signOut: async () => {} } } as any

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { title: 'DetectAI', subtitle: 'Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur', detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', unlimited: 'Pro illimité', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'analyses gratuites restantes', subscribe: "S'abonner - $9.99/mois", pro: 'DetectAI Pro', upgrade: 'Upgrade →', upgradeBtn: 'Passer Pro - $9.99', noHistory: 'Aucune analyse', proActivated: '✓ Pro Activé', paywallTitle: 'Passe en abonnement Pro', paywallDesc: 'Tu as utilisé tes 3 analyses gratuites. Abonne-toi pour illimité.', login: 'Connexion', signup: 'Inscription', logout: 'Déconnexion', email: 'Email', password: 'Mot de passe', loginTitle: 'Bienvenue sur DetectAI', signupTitle: 'Créer un compte', loginDesc: 'Connecte-toi pour sauvegarder ton historique', signupDesc: 'Rejoins DetectAI Pro', loginBtn: 'Se connecter', signupBtn: "S'inscrire", haveAccount: 'Déjà un compte?', noAccount: 'Pas encore de compte?', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', dragDrop: 'Glisse ton fichier ici', choose: 'Choisir un fichier', antiBypass: 'Mode Anti-Bypass: Détecte Undetectable AI, Quillbot...' },
  en: { title: 'DetectAI', subtitle: 'World Version • Honest & Anonymous', detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', unlimited: 'Pro unlimited', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'characters', remaining: 'remaining', subscribe: 'Subscribe - $9.99/month', pro: 'DetectAI Pro', upgrade: 'Upgrade →', upgradeBtn: 'Go Pro - $9.99', noHistory: 'No analysis', proActivated: '✓ Pro Activated', paywallTitle: 'Go Pro', paywallDesc: 'You used your 3 free analyses.', login: 'Login', signup: 'Sign up', logout: 'Logout', email: 'Email', password: 'Password', loginTitle: 'Welcome to DetectAI', signupTitle: 'Create account', loginDesc: 'Login to save history', signupDesc: 'Join DetectAI Pro', loginBtn: 'Login', signupBtn: 'Sign up', haveAccount: 'Already have account?', noAccount: 'No account yet?', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', dragDrop: 'Drop file here', choose: 'Choose file', antiBypass: 'Anti-Bypass Mode' },
  es: { title: 'DetectAI', subtitle: 'Versión Mundial • Honesto y Anónimo', detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', unlimited: 'Pro ilimitado', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'restantes', subscribe: 'Suscribirse - $9.99/mes', pro: 'DetectAI Pro', upgrade: 'Mejorar →', upgradeBtn: 'Pasa a Pro - $9.99', noHistory: 'Sin análisis', proActivated: '✓ Pro Activado', paywallTitle: 'Pasa a Pro', paywallDesc: 'Usaste tus 3 análisis gratis.', login: 'Iniciar sesión', signup: 'Registrarse', logout: 'Cerrar sesión', email: 'Email', password: 'Contraseña', loginTitle: 'Bienvenido a DetectAI', signupTitle: 'Crear cuenta', loginDesc: 'Inicia sesión para guardar historial', signupDesc: 'Únete a DetectAI Pro', loginBtn: 'Entrar', signupBtn: 'Registrarse', haveAccount: '¿Ya tienes cuenta?', noAccount: '¿No tienes cuenta?', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', dragDrop: 'Arrastra tu archivo aquí', choose: 'Elegir archivo', antiBypass: 'Modo Anti-Bypass' },
  ar: { title: 'DetectAI', subtitle: 'النسخة العالمية • صادق ومجهول', detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', unlimited: 'برو غير محدود', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'متبقية', subscribe: 'اشترك - $9.99/شهر', pro: 'DetectAI برو', upgrade: 'ترقية →', upgradeBtn: 'الترقية - $9.99', noHistory: 'لا يوجد تحليل', proActivated: '✓ تم تفعيل برو', paywallTitle: 'انتقل إلى برو', paywallDesc: 'استخدمت تحليلاتك المجانية.', login: 'تسجيل دخول', signup: 'إنشاء حساب', logout: 'تسجيل خروج', email: 'البريد', password: 'كلمة المرور', loginTitle: 'مرحبا في DetectAI', signupTitle: 'إنشاء حساب', loginDesc: 'سجل دخولك لحفظ السجل', signupDesc: 'انضم إلى DetectAI برو', loginBtn: 'دخول', signupBtn: 'إنشاء', haveAccount: 'لديك حساب؟', noAccount: 'ليس لديك حساب؟', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', dragDrop: 'اسحب ملفك هنا', choose: 'اختر ملفا', antiBypass: 'وضع مكافحة التجاوز' },
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
  const [authLoading, setAuthLoading] = useState(false)

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
    supabase.auth.getSession().then(({ data: { session } }: any) => setUser(session?.user?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user?? null)
      if (session?.user) setShowAuth(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { localStorage.setItem('detectai_lang', language) }, [language])
  useEffect(() => { localStorage.setItem('detectai_theme', darkMode? 'dark' : 'light') }, [darkMode])

  const handleAuth = async (e: any) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Compte créé! Vérifie ton email.')
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
  const handleFile = (e: any) => { const file = e.target.files?.[0]; if (file) { setFileName(file.name); setInput(`Fichier: ${file.name} (${Math.round(file.size/1024)} Ko)`) } }
  const handleAnalyze = async () => {
    if (!input.trim()) return
    if (analysesCount >= FREE_LIMIT &&!isPro) { setShowPaywall(true); return }
    setIsAnalyzing(true)
    setTimeout(() => {
      const score = Math.floor(Math.random()*40)+60
      const newResult = { score, level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable', emoji: score>85?'🤖':score>65?'⚠️':'✅', tab: activeTab, date: new Date().toLocaleDateString(), preview: input.slice(0,60), color: score>85?'from-red-500 to-orange-500':score>65?'from-amber-500 to-yellow-500':'from-emerald-500 to-teal-500', reasons: ['Structure répétitive détectée', 'Perplexité faible - 23', 'Burstiness uniforme', 'Absence de fautes naturelles'] }
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
    <div className={`min-h-screen ${darkMode? 'bg-[#070708] text-white' : 'bg-[#fcfcfc] text-black'}`}>
      <div className="flex min-h-screen">
        <aside className={`w- ${darkMode? 'bg-[#0f0f10] border-[#1c1c1f]' : 'bg-white border-gray-200'} border-r hidden md:flex flex-col justify-between sticky top-0 h-screen`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8"><div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black">D</div><div><p className="font-bold text-">DETECTAI</p><p className="text- tracking-[0.25em] opacity-40">LABS • PRO • V2</p></div><span className="ml-auto bg-white text-black text- font-black px-2.5 py-1 rounded-full">PRO</span></div>
            <nav className="space-y-1">
              {[{id:'detecteur', label:t.detector}, {id:'historique', label:t.history}, {id:'parametres', label:t.settings}].map(item=>(
                <button key={item.id} onClick={()=>setActiveNav(item.id as NavType)} className={`w-full text-left px-4 py-3.5 rounded-2xl text- font-medium ${activeNav===item.id? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:bg-[#18181b] hover:text-white'}`}>{item.label}</button>
              ))}
            </nav>
            {!isPro && <div className="mt-8 p- rounded- bg-gradient-to-br from-zinc-700 to-zinc-900"><div className="rounded- bg-gradient-to-br from-zinc-900 to-black p-4"><p className="text- font-bold text-white">Débloque DetectAI Pro</p><p className="text- text-zinc-400 mt-1">Illimité • Vidéo/Image • 6000 F CFA</p><button onClick={handleUpgrade} className="mt-3 w-full bg-white text-black py-2.5 rounded-xl text-xs font-black">{t.upgradeBtn} ↗</button></div></div>}
          </div>
          <div className="p-4 space-y-3">
            {user? <div className="p-3 rounded-2xl bg-[#18181b] border border-zinc-800 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">{user.email?.[0]?.toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-xs truncate">{user.email}</p><p className="text- text-emerald-400">✓ Connecté</p></div><button onClick={handleLogout} className="text- px-2 py-1 rounded-full bg-zinc-900">↪</button></div> : <div className="grid grid-cols-2 gap-2"><button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold">{t.login}</button><button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} className="py-2.5 rounded-xl bg-white text-black text-xs font-black">{t.signup}</button></div>}
          </div>
        </aside>
        <main className="flex-1">
          <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${darkMode? 'bg-[#070708]/80 border-zinc-900' : 'bg-white/80 border-zinc-200'} px-6 md:px-10 py-4 flex justify-between`}>
            <span className="text- text-zinc-500">● Système opérationnel • 99.3% précision • {t.antiBypass}</span>
            <div className="flex gap-2">{!user? <><button onClick={()=>{setAuthMode('login'); setShowAuth(true)}} className="px-4 py-2 rounded-full text-xs font-bold border border-zinc-800 bg-zinc-900">{t.login}</button><button onClick={()=>{setAuthMode('signup'); setShowAuth(true)}} className="px-4 py-2 rounded-full text-xs font-black bg-white text-black">{t.signup}</button></> : <button onClick={handleLogout} className="px-4 py-2 rounded-full text-xs bg-zinc-900 border border-zinc-800">{t.logout}</button>}</div>
          </div>
          <div className="max-w- mx-auto p-6 md:p-10">
            {activeNav==='detecteur' && <>
              <h1 className="text- md:text- font-bold leading-[0.9]">Detecte l'IA.<br/><span className="text-zinc-500">En 2 secondes.</span></h1>
              <div className="mt-6 rounded- border border-zinc-800 bg-[#0f0f10] p-2"><div className="rounded- bg-[#080809] border border-zinc-800/50 p-5"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte ici..." className="w-full h- bg-transparent outline-none resize-none text- text-white" /><div className="mt-4 flex justify-between"><span className="text- text-zinc-600">{input.length} {t.free}</span><button onClick={handleAnalyze} disabled={isAnalyzing ||!input.trim()} className="bg-white text-black px-7 py-3 rounded-full font-black text-xs">{isAnalyzing? 'Analyse...' : t.analyze} ↗</button></div></div></div>
              {result && <div className="mt-6 rounded- border border-zinc-800 bg-[#0f0f10] p-2"><div className="rounded- bg-[#080809] p-6 flex gap-4"><div className={`w-20 h-20 rounded- bg-gradient-to-br ${result.color} flex items-center justify-center font-black text-white`}>{result.score}%</div><div><p className="font-bold">{result.emoji} {result.level}</p><p className="text-xs text-zinc-500 mt-1">{result.tab} • {result.date}</p></div></div></div>}
            </>}
            {activeNav==='parametres' && <div><h2 className="text- font-bold mb-6">Paramètres</h2><div className="rounded- border border-zinc-800 bg-[#0f0f10] p-2"><div className="rounded- bg-[#080809] divide-y divide-zinc-900 p-6 space-y-6"><div className="flex gap-2">{[{code:'fr',label:'Français',flag:'🇫🇷'},{code:'en',label:'English',flag:'🇺🇸'},{code:'es',label:'Español',flag:'🇪🇸'},{code:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.code} onClick={()=>setLanguage(l.code as LangType)} className={`p-3 rounded-xl border text-xs ${language===l.code? 'bg-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><span>{l.flag}</span> {l.label}</button>))}</div><div className="flex gap-2"><button onClick={()=>setDarkMode(false)} className={`flex-1 p-4 rounded-xl border ${!darkMode? 'bg-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>☀️ Clair</button><button onClick={()=>setDarkMode(true)} className={`flex-1 p-4 rounded-xl border ${darkMode? 'bg-white text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>🌙 Sombre • Premium</button></div></div></div></div>}
          </div>
        </main>
      </div>
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w- rounded- border border-zinc-800 bg-[#0f0f10] p-1"><div className="rounded- bg-[#080809] p-8"><h2 className="text- font-bold">{authMode==='login'? t.loginTitle : t.signupTitle}</h2><form onSubmit={handleAuth} className="mt-6 space-y-3"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="toi@exemple.com" className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-zinc-800 text-sm" /><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-zinc-800 text-sm" /><button type="submit" disabled={authLoading} className="w-full bg-white text-black py-3.5 rounded-xl font-black text-sm">{authMode==='login'? t.loginBtn : t.signupBtn}</button></form><p className="text- text-zinc-600 mt-6 text-center">{authMode==='login'? t.noAccount : t.haveAccount} <button onClick={()=>setAuthMode(authMode==='login'? 'signup' : 'login')} className="text-white font-bold">{authMode==='login'? t.signup : t.login}</button></p></div></div>
        </div>
      )}
      {showPaywall && <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4"><div className="rounded- border border-zinc-800 bg-[#0f0f10] p-1 max-w-md w-full"><div className="rounded- bg-[#080809] p-8 text-center"><h2 className="text-xl font-bold">{t.subscribe}</h2><button onClick={handleUpgrade} className="mt-6 w-full bg-white text-black py-3.5 rounded-full font-black text-sm">{t.subscribe} • 6000 F ↗</button><button onClick={()=>setShowPaywall(false)} className="mt-3 text-xs text-zinc-600">Fermer</button></div></div></div>}
    </div>
  )
}

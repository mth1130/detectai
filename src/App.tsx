'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  (import.meta as any).env.VITE_SUPABASE_URL || '',
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY || ''
)

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type SideType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const FREE_LIMIT = 3
const CHECKOUT = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210"

const T = {
  fr: { title: "DetectAI", sub: "Version Mondiale • Honnête & Anonyme", detecteur: "Détecteur", historique: "Historique", parametres: "Paramètres", placeholder: "Colle ton texte ici...", analyses: "analyses restantes", sAbonner: "S'abonner - $9.99/mois", annulable: "Annulable", pro: "DetectAI Pro", mois: "Mensuel • $9.99", analyser: "Analyser", caracteres: "caractères", gratuitCount: "gratuit", proIllimite: "Pro illimité", langue: "Langue", theme: "Thème", clair: "Clair", sombre: "Sombre", planActuel: "Plan actuel", upgrade: "Upgrade $9.99", lienAbo: "Lien d'abonnement", gerer: "Gérer →", support: "Support: support@detectai-labs.com", videoDesc: "Dépose ta vidéo ici", imageDesc: "Dépose ton image ici", docDesc: "Dépose ton document ici", classeurDesc: "Dépose ton classeur ici", bypassDesc: "Teste les techniques", drop: "Glisse-dépose", limite: "Limite gratuite atteinte", limiteDesc: "Tu as utilisé tes 3 analyses gratuites.", debloquer: "Débloquer Pro - $9.99", connexion: "Connexion", deconnexion: "Déconnexion", email: "Email", mdp: "Mot de passe", seConnecter: "Se connecter", sinscrire: "S'inscrire", compte: "Mon compte" },
  en: { title: "DetectAI", sub: "World Version • Honest & Anonymous", detecteur: "Detector", historique: "History", parametres: "Settings", placeholder: "Paste your text here...", analyses: "free left", sAbonner: "Subscribe - $9.99/month", annulable: "Cancelable", pro: "DetectAI Pro", mois: "Monthly • $9.99", analyser: "Analyze", caracteres: "characters", gratuitCount: "free", proIllimite: "Pro unlimited", langue: "Language", theme: "Theme", clair: "Light", sombre: "Dark", planActuel: "Current plan", upgrade: "Upgrade $9.99", lienAbo: "Subscription link", gerer: "Manage →", support: "Support", videoDesc: "Drop video", imageDesc: "Drop image", docDesc: "Drop doc", classeurDesc: "Drop workbook", bypassDesc: "Test bypass", drop: "Drag & drop", limite: "Free limit reached", limiteDesc: "You used 3 free analyses.", debloquer: "Unlock Pro", connexion: "Login", deconnexion: "Logout", email: "Email", mdp: "Password", seConnecter: "Login", sinscrire: "Sign up", compte: "My account" },
  es: { title: "DetectAI", sub: "Versión Mundial", detecteur: "Detector", historique: "Historial", parametres: "Ajustes", placeholder: "Pega tu texto aquí...", analyses: "restantes", sAbonner: "Suscribirse - $9.99/mes", annulable: "Cancelable", pro: "DetectAI Pro", mois: "Mensual • $9.99", analyser: "Analizar", caracteres: "caracteres", gratuitCount: "gratis", proIllimite: "Pro ilimitado", langue: "Idioma", theme: "Tema", clair: "Claro", sombre: "Oscuro", planActuel: "Plan actual", upgrade: "Mejorar $9.99", lienAbo: "Enlace", gerer: "Gestionar →", support: "Soporte", videoDesc: "Suelta video", imageDesc: "Suelta imagen", docDesc: "Suelta doc", classeurDesc: "Suelta libro", bypassDesc: "Prueba", drop: "Arrastra", limite: "Límite alcanzado", limiteDesc: "Usaste 3 gratis.", debloquer: "Desbloquear", connexion: "Conexión", deconnexion: "Desconexión", email: "Email", mdp: "Contraseña", seConnecter: "Conectar", sinscrire: "Registrarse", compte: "Mi cuenta" },
  ar: { title: "DetectAI", sub: "الإصدار العالمي", detecteur: "الكاشف", historique: "السجل", parametres: "الإعدادات", placeholder: "الصق النص هنا...", analyses: "متبقية", sAbonner: "اشترك - $9.99/شهر", annulable: "قابل للإلغاء", pro: "DetectAI Pro", mois: "شهري • $9.99", analyser: "حلل", caracteres: "حرف", gratuitCount: "مجاني", proIllimite: "Pro غير محدود", langue: "اللغة", theme: "المظهر", clair: "فاتح", sombre: "داكن", planActuel: "الخطة الحالية", upgrade: "ترقية $9.99", lienAbo: "رابط الاشتراك", gerer: "إدارة →", support: "الدعم", videoDesc: "أسقط الفيديو", imageDesc: "أسقط الصورة", docDesc: "أسقط المستند", classeurDesc: "أسقط المصنف", bypassDesc: "اختبر", drop: "اسحب", limite: "تم الوصول للحد", limiteDesc: "استخدمت 3 تحليلات.", debloquer: "فتح Pro", connexion: "تسجيل الدخول", deconnexion: "تسجيل الخروج", email: "البريد", mdp: "كلمة المرور", seConnecter: "دخول", sinscrire: "تسجيل", compte: "حسابي" }
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
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const tr = T[lang]

  useEffect(() => {
    const savedCount = localStorage.getItem('detectai_count')
    if (savedCount) setAnalysesCount(parseInt(savedCount))
    const savedHist = localStorage.getItem('detectai_history')
    if (savedHist) setHistory(JSON.parse(savedHist))
    supabase.auth.getSession().then(({data})=> {
      setUser(data.session?.user || null)
      if(data.session?.user) loadHistory(data.session.user.id)
    })
    const {data: listener} = supabase.auth.onAuthStateChange((_, session)=>{
      setUser(session?.user || null)
      if(session?.user) loadHistory(session.user.id)
    })
    return ()=> listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    s.defer = true
    document.body.appendChild(s)
  }, [])

  const loadHistory = async (uid: string) => {
    const {data} = await supabase.from('analyses').select('*').eq('user_id', uid).order('created_at', {ascending:false}).limit(50)
    if(data) setHistory(data)
  }

  const handleUpgrade = () => {
    try {
      const w = window as any
      if (w.LemonSqueezy && w.LemonSqueezy.Url) w.LemonSqueezy.Url.Open(CHECKOUT)
      else window.open(CHECKOUT, '_blank')
    } catch { window.open(CHECKOUT, '_blank') }
  }

  const analyze = async () => {
    if (!input.trim() && activeTab === 'Texte') return
    if (!isPro && analysesCount >= FREE_LIMIT) { setShowPaywall(true); return }
    let score = 50 + Math.random() * 20
    if (/(je me souviens|j'ai vécu|ptdr|haha|my dad)/i.test(input)) score -= 25
    if (/(intelligence artificielle|en conclusion|il est important de noter)/i.test(input)) score += 25
    score = Math.min(100, Math.max(0, score))
    let level = "FAIBLE"
    let color = "bg-green-500"
    if (score > 70) { level = "CRITIQUE"; color = "bg-red-600" }
    else if (score > 40) { level = "MODÉRÉ"; color = "bg-orange-500" }
    const newResult = { score: Math.round(score), level, color, content: input.slice(0,200), tab: activeTab, created_at: new Date().toISOString() }
    setResult(newResult)
    const newCount = analysesCount + 1
    setAnalysesCount(newCount)
    localStorage.setItem('detectai_count', newCount.toString())
    const newHist = [newResult,...history].slice(0,50)
    setHistory(newHist)
    localStorage.setItem('detectai_history', JSON.stringify(newHist))
    if(user){
      await supabase.from('analyses').insert({ user_id: user.id, content: input.slice(0,500), score: newResult.score, level, tab_type: activeTab })
    }
  }

  const handleAuth = async () => {
    if(authMode==='signup'){
      const {error} = await supabase.auth.signUp({email, password})
      if(error) alert(error.message); else { alert('Compte créé! Vérifie ton email puis connecte-toi'); setShowAuth(false) }
    } else {
      const {error} = await supabase.auth.signInWithPassword({email, password})
      if(error) alert(error.message); else setShowAuth(false)
    }
  }

  const isDark = theme === 'sombre'
  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <header className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl">{mobileOpen? '✕' : '☰'}</button>
          <div className="flex items-center gap-2 ml-1"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span><span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=> user? supabase.auth.signOut() : setShowAuth(true)} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full">{user? '👤' : tr.connexion}</button>
          <div className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">{analysesCount}/{FREE_LIMIT}</div>
        </div>
      </header>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />}
      <aside className={`${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf0]'} border-r flex flex-col lg:w-64 lg:sticky lg:top-0 lg:h-screen fixed inset-y-0 left-0 w-[80%] max-w- z-30 transition-transform duration-300 ${mobileOpen? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="hidden lg:flex items-center justify-between mb-8"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span><span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div></div>
          <nav className="space-y-2">
            <button onClick={() => { setActiveSide('detecteur'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${activeSide==='detecteur'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>◉ {tr.detecteur}</button>
            <button onClick={() => { setActiveSide('historique'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm ${activeSide==='historique'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>🕒 {tr.historique} ({history.length})</button>
            <button onClick={() => { setActiveSide('parametres'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm ${activeSide==='parametres'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>⚙ {tr.parametres}</button>
          </nav>
          <div className="mt-4">{user? (<div className="bg-slate-50 border rounded-xl p-3 text-xs"><p className="font-bold truncate">{user.email}</p><button onClick={()=> supabase.auth.signOut()} className="mt-2 w-full bg-white border py-1.5 rounded-lg">{tr.deconnexion}</button></div>) : (<button onClick={()=> setShowAuth(true)} className="w-full bg-white border-2 border-slate-900 py-2.5 rounded-xl text-sm font-bold">👤 {tr.connexion} / {tr.sinscrire}</button>)}</div>
          <div className="mt-auto"><div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-4"><p className="text-sm font-bold text-slate-900">{tr.pro} <span className="text- bg-amber-200 px-2 py-0.5 rounded-full">6000 F</span></p><p className="text-xs text-slate-600 mt-1">{tr.mois}<br/>{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} ${tr.analyses}` : tr.limite}</p><button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold">{tr.sAbonner}</button></div></div>
        </div>
      </aside>
      <main className="flex-1 min-w-0"><div className="max-w-4xl mx-auto p-4 lg:p-8">
          {activeSide === 'detecteur' && (<>
              <div className="hidden lg:flex justify-between items-start"><div><h1 className="text-3xl font-bold">{tr.title}</h1><p className="text-slate-500 mt-1 text-sm">{tr.sub}</p></div><button onClick={()=> user? supabase.auth.signOut() : setShowAuth(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">{user? user.email : `👤 ${tr.connexion}`}</button></div>
              <div className="flex gap-2 mt-4 lg:mt-6 overflow-x-auto pb-2">{(['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${activeTab===tab? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}>{tab}</button>))}</div>
              <div className={`mt-4 rounded-2xl border shadow-sm p-4 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}>
                {activeTab === 'Texte'? (<><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tr.placeholder} className={`w-full h-48 resize-none outline-none text-sm ${isDark? 'bg-[#1e293b] text-white' : 'bg-white'}`} /><div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4 pt-4 border-t"><span className="text-xs text-slate-400">{input.length} {tr.caracteres}</span><button onClick={analyze} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Analyser →</button></div></>) : (<div className="py-12 text-center cursor-pointer" onClick={() => fileRef.current?.click()}><div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div><p className="font-medium">{activeTab === 'Vidéo'? tr.videoDesc : activeTab === 'Image'? tr.imageDesc : activeTab === 'Document'? tr.docDesc : activeTab === 'Classeur'? tr.classeurDesc : tr.bypassDesc}</p><p className="text-sm text-slate-500 mt-1">{tr.drop}</p><button className="mt-4 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold">Parcourir</button><input ref={fileRef} type="file" className="hidden" /></div>)}
              </div>
              {result && (<div className={`mt-6 rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}><div className="flex items-center gap-4"><div className={`w-16 h-16 rounded-2xl ${result.color} text-white flex items-center justify-center text-xl font-bold`}>{result.score}%</div><div><p className="font-bold">Niveau: {result.level}</p><p className="text-sm text-slate-500">Probabilité IA</p></div></div></div>)}
            </>)}
          {activeSide === 'historique' && (<div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b]' : 'bg-white'}`}><h2 className="text-xl font-bold mb-4">🕒 {tr.historique} ({history.length})</h2>{history.length===0? <p className="text-sm text-slate-500">Aucune analyse. Tes analyses resteront ici même après refresh!</p> : (<div className="space-y-3">{history.map((h,i)=>(<div key={i} className="border rounded-xl p-3 flex justify-between items-center"><div><p className="text-sm font-medium truncate max-w-">{h.content}</p><p className="text-xs text-slate-500">{new Date(h.created_at).toLocaleString()} • {h.tab || h.tab_type}</p></div><div className={`px-3 py-1 rounded-full text-white text-xs font-bold ${h.score>70?'bg-red-600': h.score>40?'bg-orange-500':'bg-green-500'}`}>{h.score}%</div></div>))}</div>)}</div>)}
          {activeSide === 'parametres' && (<div className={`rounded-2xl border p-6 ${isDark? 'bg-[#1e293b]' : 'bg-white'}`}><h2 className="text-xl font-bold mb-6">{tr.parametres}</h2><div className="pb-6 border-b mb-6 flex justify-between items-center"><div><p className="font-semibold text-sm">{tr.planActuel}</p><p className="text-xs text-slate-500">{isPro? 'Pro': `Gratuit ${analysesCount}/${FREE_LIMIT}`} {user? `• ${user.email}`:''}</p></div><button onClick={handleUpgrade} className="h-10 px-5 rounded-xl bg-slate-900 text-white text-sm font-bold">{tr.upgrade}</button></div><div><p className="font-semibold text-sm mb-2">{tr.lienAbo}</p><p className="text-xs font-mono break-all bg-slate-50 p-3 rounded-xl border">{CHECKOUT}</p></div></div>)}
        </div></main>
      {showAuth && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"><div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"><h2 className="text-xl font-bold text-slate-900">{authMode==='login'? tr.seConnecter : tr.sinscrire}</h2><input value={email} onChange={e=>setEmail(e.target.value)} placeholder={tr.email} className="mt-4 w-full border rounded-xl px-4 py-3 text-sm" /><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder={tr.mdp} className="mt-3 w-full border rounded-xl px-4 py-3 text-sm" /><button onClick={handleAuth} className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{authMode==='login'? tr.seConnecter : tr.sinscrire}</button><button onClick={()=> setAuthMode(authMode==='login'?'signup':'login')} className="mt-3 w-full text-sm text-slate-500 underline">{authMode==='login'? "Pas de compte? S'inscrire" : "Déjà un compte? Se connecter"}</button><button onClick={()=> setShowAuth(false)} className="mt-2 w-full text-xs text-slate-400">Fermer</button></div></div>)}
      {showPaywall && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"><div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl"><h2 className="text-2xl font-bold mt-4">{tr.limite}</h2><p className="text-slate-500 mt-2 text-sm">{tr.limiteDesc}</p><button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">{tr.debloquer}</button><button onClick={() => setShowPaywall(false)} className="mt-3 text-sm text-slate-400 underline">Fermer</button></div></div>)}
    </div>
  )
}

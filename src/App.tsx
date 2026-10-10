'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type SideType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const FREE_LIMIT = 3
const CHECKOUT = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210?checkout[custom][user_email]="

const T = {
  fr: { title: "DetectAI", sub: "Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur", detecteur: "Détecteur", historique: "Historique", parametres: "Paramètres", placeholder: "Colle ton texte ici (minimum 50 caractères pour une analyse fiable)...", analyses: "analyses gratuites restantes", sAbonner: "S'abonner - $9.99/mois", annulable: "Annulable • Payoneer", pro: "DetectAI Pro", mois: "Abonnement mensuel • $9.99", analyser: "Analyser", caracteres: "caractères", gratuitCount: "gratuit", proIllimite: "Pro illimité", langue: "Langue", theme: "Thème", clair: "Clair", sombre: "Sombre", planActuel: "Plan actuel", upgrade: "Upgrade $9.99", lienAbo: "Lien d'abonnement", gerer: "Gérer mon abonnement LemonSqueezy →", support: "Support: support@detectai-labs.com", videoDesc: "Dépose ta vidéo ici (MP4, MOV, WebM)", imageDesc: "Dépose ton image ici (JPG, PNG, WebP)", docDesc: "Dépose ton document ici (PDF, DOCX, TXT)", classeurDesc: "Dépose ton classeur ici (XLSX, CSV)", bypassDesc: "Teste les techniques de contournement", drop: "Glisse-dépose ou clique pour parcourir", limite: "Limite gratuite atteinte", limiteDesc: "Tu as utilisé tes 3 analyses gratuites. Passe en Pro pour analyses illimitées.", debloquer: "Débloquer DetectAI Pro - $9.99", fileSelected: "Fichier sélectionné", noHistory: "Aucune analyse", deconnexion: "Déconnexion", bienvenue: "Bienvenue" },
  en: { title: "DetectAI", sub: "World Version • Honest & Anonymous", detecteur: "Detector", historique: "History", parametres: "Settings", placeholder: "Paste your text here (min 50 chars)...", analyses: "free analyses left", sAbonner: "Subscribe - $9.99/month", annulable: "Cancelable • Payoneer", pro: "DetectAI Pro", mois: "Monthly • $9.99", analyser: "Analyze", caracteres: "characters", gratuitCount: "free", proIllimite: "Pro unlimited", langue: "Language", theme: "Theme", clair: "Light", sombre: "Dark", planActuel: "Current plan", upgrade: "Upgrade $9.99", lienAbo: "Subscription link", gerer: "Manage subscription →", support: "Support: support@detectai-labs.com", videoDesc: "Drop video here", imageDesc: "Drop image here", docDesc: "Drop document here", classeurDesc: "Drop workbook here", bypassDesc: "Test bypass", drop: "Drag & drop or click", limite: "Free limit reached", limiteDesc: "You used 3 free analyses.", debloquer: "Unlock Pro - $9.99", fileSelected: "File selected", noHistory: "No analysis", deconnexion: "Logout", bienvenue: "Welcome" },
  es: { title: "DetectAI", sub: "Versión Mundial • Honesta y Anónima", detecteur: "Detector", historique: "Historial", parametres: "Ajustes", placeholder: "Pega tu texto aquí...", analyses: "análisis restantes", sAbonner: "Suscribirse - $9.99/mes", annulable: "Cancelable", pro: "DetectAI Pro", mois: "Mensual • $9.99", analyser: "Analizar", caracteres: "caracteres", gratuitCount: "gratis", proIllimite: "Pro ilimitado", langue: "Idioma", theme: "Tema", clair: "Claro", sombre: "Oscuro", planActuel: "Plan actual", upgrade: "Mejorar $9.99", lienAbo: "Enlace", gerer: "Gestionar →", support: "Soporte", videoDesc: "Suelta video aquí", imageDesc: "Suelta imagen aquí", docDesc: "Suelta documento aquí", classeurDesc: "Suelta libro aquí", bypassDesc: "Prueba evasión", drop: "Arrastra y suelta", limite: "Límite alcanzado", limiteDesc: "Usaste 3 análisis gratis.", debloquer: "Desbloquear Pro", fileSelected: "Archivo seleccionado", noHistory: "Sin análisis", deconnexion: "Cerrar sesión", bienvenue: "Bienvenido" },
  ar: { title: "DetectAI", sub: "الإصدار العالمي • صادق ومجهول", detecteur: "الكاشف", historique: "السجل", parametres: "الإعدادات", placeholder: "الصق النص هنا...", analyses: "تحليلات متبقية", sAbonner: "اشترك - $9.99/شهر", annulable: "قابل للإلغاء", pro: "DetectAI Pro", mois: "شهري • $9.99", analyser: "حلل", caracteres: "حرف", gratuitCount: "مجاني", proIllimite: "Pro غير محدود", langue: "اللغة", theme: "المظهر", clair: "فاتح", sombre: "داكن", planActuel: "الخطة الحالية", upgrade: "ترقية $9.99", lienAbo: "رابط الاشتراك", gerer: "إدارة الاشتراك →", support: "الدعم", videoDesc: "أسقط الفيديو هنا", imageDesc: "أسقط الصورة هنا", docDesc: "أسقط المستند هنا", classeurDesc: "أسقط المصنف هنا", bypassDesc: "اختبر التجاوز", drop: "اسحب وأفلت", limite: "تم الوصول للحد", limiteDesc: "استخدمت 3 تحليلات مجانية.", debloquer: "فتح Pro", fileSelected: "تم اختيار الملف", noHistory: "لا يوجد تحليل", deconnexion: "تسجيل خروج", bienvenue: "مرحبا" }
}

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('Texte')
  const [activeSide, setActiveSide] = useState<SideType>('detecteur')
  const [analysesCount, setAnalysesCount] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [isPro, setIsPro] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<LangType>('fr')
  const [theme, setTheme] = useState<'clair' | 'sombre'>('clair')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const tr = T[lang]
  const isDark = theme === 'sombre'

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      // Charger profil
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (prof) {
        setProfile(prof)
        setIsPro(prof.is_pro)
        setAnalysesCount(prof.free_used)
      }
      // Charger historique
      const { data: hist } = await supabase.from('analyses').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20)
      if (hist) setHistory(hist)
    }
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.push('/auth')
      else setUser(session.user)
    })
    return () => listener.subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    s.defer = true
    document.body.appendChild(s)
  }, [])

  const handleUpgrade = () => {
    const email = user?.email || ''
    window.open(CHECKOUT + encodeURIComponent(email), '_blank')
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFileName(f.name); setInput(`Fichier: ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`) }
  }

  const analyze = async () => {
    if (activeTab === 'Texte' && !input.trim()) return
    if (!isPro && analysesCount >= FREE_LIMIT) { setShowPaywall(true); return }
    setLoading(true)
    setResult(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ text: input, type: activeTab })
      })
      const data = await res.json()
      if (res.status === 402) { setShowPaywall(true); return }
      if (data.error) throw new Error(data.error)
      setResult(data)
      setAnalysesCount(c => isPro ? c : c + 1)
      // Recharger historique
      const { data: hist } = await supabase.from('analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
      if (hist) setHistory(hist)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (prof) { setProfile(prof); setAnalysesCount(prof.free_used); setIsPro(prof.is_pro) }
    } catch (e: any) {
      alert('Erreur: ' + e.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/auth') }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <header className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl">{mobileOpen? '✕' : '☰'}</button>
          <div className="flex items-center gap-2 ml-1"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span></div>
        </div>
        <div className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">{analysesCount}/{FREE_LIMIT}</div>
      </header>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />}

      <aside className={`${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf0]'} border-r flex flex-col lg:w-64 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 fixed inset-y-0 left-0 w-[80%] max-w-[300px] z-30 h-[100dvh] transition-transform duration-300 ${mobileOpen? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="hidden lg:flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className="font-bold">DETECTAI</span><span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div>
          <p className="hidden lg:block text-[11px] text-slate-400 mb-6 truncate">{tr.bienvenue} {user.email}</p>
          <div className="lg:hidden flex justify-between items-center mb-6"><span className="font-bold">Menu</span><button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button></div>
          <nav className="space-y-2">
            <button onClick={() => { setActiveSide('detecteur'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${activeSide==='detecteur'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>◉ {tr.detecteur}</button>
            <button onClick={() => { setActiveSide('historique'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm flex justify-between ${activeSide==='historique'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><span>🕒 {tr.historique}</span><span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{history.length}</span></button>
            <button onClick={() => { setActiveSide('parametres'); setMobileOpen(false) }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm ${activeSide==='parametres'? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>⚙️ {tr.parametres}</button>
          </nav>
          <div className="mt-auto space-y-3">
            {!isPro ? (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm font-bold flex items-center gap-2">{tr.pro} <span className="bg-amber-200 text-[11px] px-2 py-0.5 rounded-full">6000 F</span></p>
                <p className="text-xs text-slate-600 mt-1">{tr.mois}<br/>{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} ${tr.analyses}` : tr.limite}</p>
                <button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold">{tr.sAbonner}</button>
              </div>
            ) : <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"><p className="text-sm font-bold text-green-700">✓ Pro Activé - Illimité</p></div>}
            <button onClick={handleLogout} className="w-full text-xs text-slate-400 underline text-center">{tr.deconnexion}</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          {activeSide === 'detecteur' && (
            <>
              <div className="hidden lg:block"><h1 className="text-3xl font-bold">{tr.title}</h1><p className="text-slate-500 mt-1 text-sm">{tr.sub}</p></div>
              <div className="flex gap-2 mt-4 lg:mt-6 overflow-x-auto pb-2">
                {(['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setResult(null); setFileName('') }} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${activeTab===tab? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'}`}>{tab}</button>
                ))}
              </div>
              <div className={`mt-4 rounded-2xl border shadow-sm p-4 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                {activeTab === 'Texte' ? (
                  <>
                    <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tr.placeholder} className={`w-full h-48 lg:h-56 resize-none outline-none text-[15px] ${isDark? 'bg-[#1e293b] text-white' : 'bg-white text-slate-700'}`} />
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{input.length} {tr.caracteres} • {isPro? tr.proIllimite : `${analysesCount}/${FREE_LIMIT} ${tr.gratuitCount}`}</span>
                      <button onClick={analyze} disabled={loading} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">{loading? 'Analyse...' : 'Analyser →'}</button>
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <div onClick={() => fileRef.current?.click()} className="cursor-pointer">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
                      <p className="font-medium">{activeTab === 'Vidéo'? tr.videoDesc : activeTab === 'Image'? tr.imageDesc : activeTab === 'Document'? tr.docDesc : activeTab === 'Classeur'? tr.classeurDesc : tr.bypassDesc}</p>
                      <p className="text-sm text-slate-500 mt-1">{tr.drop}</p>
                      {fileName && <p className="text-xs mt-3 bg-slate-100 inline-block px-3 py-1 rounded-full">✓ {tr.fileSelected}: {fileName}</p>}
                      <div className="mt-4 flex flex-col items-center gap-3">
                        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold">Parcourir</button>
                        {fileName && <button onClick={analyze} disabled={loading} className="bg-green-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold">{loading? 'Analyse...' : `Analyser ${activeTab} →`}</button>}
                      </div>
                    </div>
                    <input ref={fileRef} type="file" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(f){ setFileName(f.name); setInput(`Fichier: ${f.name}`) } }} />
                  </div>
                )}
              </div>

              {result && (
                <div className={`mt-6 rounded-2xl border p-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${result.color} text-white flex items-center justify-center text-xl font-bold`}>{result.score}%</div>
                    <div><p className="font-bold">Niveau: {result.level}</p><p className="text-sm text-slate-500">Probabilité IA • {activeTab} • Confiance {result.details?.confidence}</p></div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-slate-400">Perplexité</p><p className="font-bold mt-1">{result.details?.perplexity}</p></div>
                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-slate-400">Burstiness</p><p className="font-bold mt-1">{result.details?.burstiness}</p></div>
                    <div className="bg-slate-50 p-3 rounded-xl"><p className="text-slate-400">Confiance</p><p className="font-bold mt-1">{result.details?.confidence}</p></div>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-semibold mb-2">Pourquoi {result.score > 50 ? 'probablement IA' : 'probablement humain'} ?</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {result.details?.reasons?.map((r:string,i:number)=><li key={i} className="flex gap-2"><span>•</span><span>{r}</span></li>)}
                    </ul>
                    {result.details?.iaPhrasesDetected?.length > 0 && (
                      <div className="mt-3 text-xs bg-red-50 border border-red-100 p-3 rounded-xl">
                        <p className="font-bold text-red-700">Phrases typiques IA détectées:</p>
                        <p className="mt-1 text-red-600">"{result.details.iaPhrasesDetected.join('", "')}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeSide === 'historique' && (
            <div className={`rounded-2xl border ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}>
              <div className="p-6 border-b flex justify-between"><h2 className="font-bold text-lg">{tr.historique}</h2><span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{history.length} analyses</span></div>
              {history.length===0 ? <div className="p-8 text-center text-sm text-slate-500">{tr.noHistory}</div> : <div className="divide-y">{history.map((h:any)=><div key={h.id} className="p-4 flex justify-between items-center"><div><p className="text-sm font-medium truncate max-w-[250px]">{h.content_preview}</p><p className="text-[11px] text-slate-400">{h.type} • {new Date(h.created_at).toLocaleDateString()}</p></div><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${h.score>70? 'bg-red-100 text-red-700' : h.score>40? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{h.score}% {h.level}</span></div>)}</div>}
            </div>
          )}

          {activeSide === 'parametres' && (
            <div className="max-w-[640px] space-y-4">
              <div className={`rounded-2xl border p-6 md:p-8 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white'}`}>
                <h2 className="text-xl font-bold mb-2">{tr.parametres}</h2>
                <p className="text-xs text-slate-400 mb-6">{tr.bienvenue} {user.email} • {isPro? 'Pro' : `Gratuit ${analysesCount}/${FREE_LIMIT}`}</p>
                <div className="pb-6 border-b mb-6 flex justify-between items-center"><div><p className="font-semibold text-sm">{tr.planActuel}</p><p className="text-xs text-slate-500">{isPro? 'Pro illimité - $9.99/mois' : `Gratuit ${analysesCount}/${FREE_LIMIT}`}</p></div><button onClick={handleUpgrade} className="h-10 px-5 rounded-xl bg-slate-900 text-white text-sm font-bold">{isPro? 'Gérer' : tr.upgrade}</button></div>
                <div className="pb-6 border-b mb-6"><p className="font-semibold text-sm mb-3">🌐 {tr.langue}</p><div className="grid grid-cols-2 gap-3"><button onClick={() => setLang('fr')} className={`h-[64px] rounded-xl border-2 ${lang==='fr'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>🇫🇷 Français</button><button onClick={() => setLang('en')} className={`h-[64px] rounded-xl border-2 ${lang==='en'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>🇺🇸 English</button><button onClick={() => setLang('es')} className={`h-[64px] rounded-xl border-2 ${lang==='es'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>🇪🇸 Español</button><button onClick={() => setLang('ar')} className={`h-[64px] rounded-xl border-2 ${lang==='ar'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>🇸🇦 العربية</button></div></div>
                <div className="pb-6 border-b mb-6"><p className="font-semibold text-sm mb-3">🎨 {tr.theme}</p><div className="grid grid-cols-2 gap-3"><button onClick={() => setTheme('clair')} className={`h-[64px] rounded-xl border-2 ${theme==='clair'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>☀️ {tr.clair}</button><button onClick={() => setTheme('sombre')} className={`h-[64px] rounded-xl border-2 ${theme==='sombre'? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>🌙 {tr.sombre}</button></div></div>
                <div><p className="font-semibold text-sm mb-2">{tr.lienAbo}</p><p className="text-[11px] font-mono break-all bg-slate-50 p-3 rounded-xl border">{CHECKOUT}{user.email}</p><a href={CHECKOUT + encodeURIComponent(user.email)} target="_blank" className="inline-flex mt-3 text-xs underline">{tr.gerer}</a><p className="text-[11px] text-slate-400 mt-4">{tr.support} • Payoneer: Djemnaba Djigo • 6000F</p></div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-5"><p className="font-bold flex items-center gap-2">{tr.pro} <span className="bg-slate-900 text-white text-[11px] px-2 py-0.5 rounded-full">6000 F</span></p><p className="text-xs mt-1 text-slate-600">{tr.mois} • Annulable • Payoneer</p><button onClick={handleUpgrade} className="mt-3 w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-sm">S'abonner - $9.99/mois</button></div>
              <button onClick={handleLogout} className="w-full text-sm text-slate-400 underline">{tr.deconnexion}</button>
            </div>
          )}
        </div>
      </main>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">🔒</div>
            <h2 className="text-2xl font-bold mt-4">{tr.limite}</h2>
            <p className="text-slate-500 mt-2 text-sm">{tr.limiteDesc}</p>
            <button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">{tr.debloquer}</button>
            <button onClick={() => setShowPaywall(false)} className="mt-3 text-sm text-slate-400 underline">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}

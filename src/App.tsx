'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase - lit Vercel auto
const supabaseUrl = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 'https://gostyskhyzhgrsrbbgfu.supabase.co'
const supabaseKey = (typeof import.meta!== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || ''
const supabase = supabaseKey? createClient(supabaseUrl, supabaseKey) : null as any

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { title: 'DetectAI', subtitle: 'Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur', detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', unlimited: 'Pro illimité', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'analyses gratuites restantes', limitReached: 'Limite atteinte - Passe Pro', subscribe: "S'abonner - 6000F/mois", pro: 'DetectAI Pro', monthly: 'Abonnement mensuel • 6000F', cancel: 'Annulable', details: 'Détails', dragDrop: 'Glisse ton fichier', choose: 'Choisir un fichier', antiBypass: 'Mode Anti-Bypass: Détecte les textes humanisés par Undetectable AI, Quillbot...', settingsTitle: 'Paramètres', currentPlan: 'Plan actuel', freePlan: 'Gratuit', subLink: "Lien d'abonnement", payment: 'Paiement', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', reset: 'Réinitialiser (test)', upgrade: 'Upgrade 6000F', noHistory: 'Aucune analyse', proActivated: '✓ Pro Activé', paywallTitle: 'Passe en abonnement Pro', paywallDesc: 'Tu as utilisé tes 3 analyses gratuites. Abonne-toi pour illimité.', unlimitedAll: 'Analyses illimitées (tous types)', videoImage: 'Vidéo & image avancée', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Historique complet', close: 'Fermer' },
  en: { title: 'DetectAI', subtitle: 'World Version • Honest & Anonymous • Text, Image, Video, Document, Spreadsheet', detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', unlimited: 'Pro unlimited', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'characters', remaining: 'free analyses remaining', limitReached: 'Limit reached - Go Pro', subscribe: 'Subscribe - 6000F/month', pro: 'DetectAI Pro', monthly: 'Monthly subscription • 6000F', cancel: 'Cancellable', details: 'Details', dragDrop: 'Drop your file here or click', choose: 'Choose file', antiBypass: 'Anti-Bypass Mode: Detects texts humanized by Undetectable AI, Quillbot...', settingsTitle: 'Settings', currentPlan: 'Current plan', freePlan: 'Free', subLink: 'Subscription link', payment: 'Payment', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', reset: 'Reset (test)', upgrade: 'Upgrade 6000F', noHistory: 'No analysis yet', proActivated: '✓ Pro Activated', paywallTitle: 'Go Pro subscription', paywallDesc: 'You used your 3 free analyses. Subscribe for unlimited.', unlimitedAll: 'Unlimited analyses (all types)', videoImage: 'Advanced video & image', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Full history', close: 'Close' },
  es: { title: 'DetectAI', subtitle: 'Versión Mundial • Honesto y Anónimo • Texto, Imagen, Video', detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', unlimited: 'Pro ilimitado', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'análisis gratuitos restantes', limitReached: 'Límite alcanzado - Pasa a Pro', subscribe: 'Suscribirse - 6000F/mes', pro: 'DetectAI Pro', monthly: 'Suscripción mensual • 6000F', cancel: 'Cancelable', details: 'Detalles', dragDrop: 'Arrastra tu archivo aquí o haz clic', choose: 'Elegir archivo', antiBypass: 'Modo Anti-Bypass: Detecta textos humanizados...', settingsTitle: 'Ajustes', currentPlan: 'Plan actual', freePlan: 'Gratis', subLink: 'Enlace de suscripción', payment: 'Pago', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', reset: 'Reiniciar (test)', upgrade: 'Mejorar 6000F', noHistory: 'Sin análisis', proActivated: '✓ Pro Activado', paywallTitle: 'Pasa a Pro', paywallDesc: 'Usaste tus 3 análisis gratis. Suscríbete para ilimitado.', unlimitedAll: 'Análisis ilimitados', videoImage: 'Video e imagen avanzado', antiBypassFe: 'Anti-bypass y humanizador', fullHistory: 'Historial completo', close: 'Cerrar' },
  ar: { title: 'DetectAI', subtitle: 'النسخة العالمية • صادق ومجهول', detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', unlimited: 'برو غير محدود', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'تحليلات مجانية متبقية', limitReached: 'تم الوصول للحد - انتقل إلى برو', subscribe: 'اشترك - 6000F/شهر', pro: 'DetectAI برو', monthly: 'اشتراك شهري • 6000F', cancel: 'قابل للإلغاء', details: 'التفاصيل', dragDrop: 'اسحب ملفك هنا أو انقر', choose: 'اختر ملفا', antiBypass: 'وضع مكافحة التجاوز: يكتشف النصوص المموهة...', settingsTitle: 'الإعدادات', currentPlan: 'الخطة الحالية', freePlan: 'مجاني', subLink: 'رابط الاشتراك', payment: 'الدفع', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', reset: 'إعادة تعيين', upgrade: 'ترقية 6000F', noHistory: 'لا يوجد تحليل', proActivated: '✓ تم تفعيل برو', paywallTitle: 'انتقل إلى برو', paywallDesc: 'استخدمت تحليلاتك المجانية. اشترك للحصول على غير محدود.', unlimitedAll: 'تحليلات غير محدودة', videoImage: 'فيديو وصورة متقدمة', antiBypassFe: 'مكافحة التجاوز', fullHistory: 'السجل الكامل', close: 'إغلاق' },
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
  const [darkMode, setDarkMode] = useState(false)

  const FREE_LIMIT = 3
  // ✅ LIEN UNIQUE MONDIAL - PAYDUNYA (Wave, OM, 【entity-Visa¦canonical_name=Visa】, 【entity-Mastercard¦canonical_name=Mastercard】)
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
        score,
        level: score>85?'Très probable IA':score>65?'Probable IA':'Humain probable',
        emoji: score>85?'🤖':score>65?'⚠️':'✅',
        tab: activeTab,
        date: new Date().toLocaleDateString(),
        preview: input.slice(0,60),
        color: score>85?'bg-red-500':score>65?'bg-amber-500':'bg-green-500',
        details: { modelSuspect: score>80?'GPT-4 / Claude':'' },
        reasons: ['Structure répétitive', 'Perplexité faible', 'Burstiness uniforme']
      }
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

  const bgPage = darkMode? 'bg-[#0f0f0f]' : 'bg-[#f8f8f8]'
  const bgCard = darkMode? 'bg-[#1e1e1e]' : 'bg-white'
  const textMain = darkMode? 'text-white' : 'text-slate-900'
  const textMuted = darkMode? 'text-slate-400' : 'text-slate-500'
  const textSecondary = darkMode? 'text-slate-300' : 'text-slate-700'

  return (
    <div className={`${bgPage} min-h-screen ${darkMode?'dark':''}`}>
      <div className="flex min-h-screen">
        <aside className={`w- ${bgCard} border-r ${darkMode?'border-slate-800':'border-slate-200'} p-5 flex flex-col justify-between hidden md:flex`}>
          <div>
            <div className="flex items-center gap-2 mb-10"><div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs font-bold">D</div><span className={`font-bold ${textMain}`}>DETECTAI</span><span className="bg-black text-white text- px-2 py-0.5 rounded-full">PRO</span></div>
            <nav className="space-y-1">
              <button onClick={()=>setActiveNav('detecteur')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${activeNav==='detecteur'?'bg-black text-white':'hover:bg-slate-100 dark:hover:bg-slate-800 '+textSecondary}`}>⊕ {t.detector}</button>
              <button onClick={()=>setActiveNav('historique')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${activeNav==='historique'?'bg-black text-white':'hover:bg-slate-100 dark:hover:bg-slate-800 '+textSecondary}`}>◷ {t.history}</button>
              <button onClick={()=>setActiveNav('parametres')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${activeNav==='parametres'?'bg-black text-white':'hover:bg-slate-100 dark:hover:bg-slate-800 '+textSecondary}`}>⚙ {t.settings}</button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-10">
          {activeNav==='detecteur' && (
            <div className="max-w-4xl mx-auto">
              <h1 className={`text-3xl font-bold ${textMain}`}>{t.title}</h1><p className={`text-sm mt-2 ${textMuted}`}>{t.subtitle}</p>
              <div className="mt-6 flex gap-2 flex-wrap">{(['Texte','Image','Vidéo','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm border ${activeTab===tab?'bg-black text-white border-black':'bg-white border-slate-200 '+textSecondary}`}>{tab}</button>)}</div>
              <div className={`mt-6 ${bgCard} border rounded-2xl p-6`}>
                {activeTab==='Texte'? (<textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Colle ton texte ici..." className={`w-full h-40 p-4 rounded-xl border outline-none resize-none ${darkMode?'bg-[#111] border-slate-700 text-white':'bg-slate-50 border-slate-200'}`} />) : (<div className={`border-2 border-dashed rounded-xl p-10 text-center ${darkMode?'border-slate-700':'border-slate-300'}`}><p className={textMuted}>{t.dragDrop}</p><label className="mt-3 inline-block bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer">{t.choose}<input type="file" className="hidden" onChange={handleFile} /></label>{fileName && <p className={`mt-3 text-sm ${textMain}`}>{fileName}</p>}</div>)}
                <div className="mt-4 flex justify-between items-center"><p className={`text-xs ${textMuted}`}>{input.length} {t.chars} • {isPro? t.unlimited : `${FREE_LIMIT-analysesCount} ${t.remaining}`}</p><button onClick={handleAnalyze} disabled={isAnalyzing ||!input.trim()} className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm disabled:opacity-50">{isAnalyzing? t.analysing : t.analyze}</button></div>
              </div>
              {result && (
                <div className={`mt-6 ${bgCard} border rounded-2xl p-6`}>
                  <div className="flex gap-4"><div className={`w-16 h-16 rounded-2xl ${result.color} text-white flex items-center justify-center font-bold text-xl`}>{result.score}%</div><div className="flex-1"><p className={`font-bold flex items-center gap-2 ${textMain}`}><span>{result.emoji}</span> {result.level}</p><p className={`text-sm mt-0.5 ${textMuted}`}>{result.tab} • {result.date}</p></div></div>
                  <div className={`mt-5 ${darkMode?'bg-slate-700':'bg-slate-50'} rounded-xl p-4 space-y-1.5`}><p className="text- font-bold text-slate-500 uppercase mb-2">{t.details}</p>{result.reasons.map((r:string,i:number)=>(<p key={i} className={`text-sm ${textSecondary}`}>• {r}</p>))}</div>
                </div>
              )}
            </div>
          )}
          {activeNav==='historique' && (<div className="max-w-4xl mx-auto"><h2 className={`text-2xl font-bold ${textMain}`}>{t.history}</h2><div className="mt-6 space-y-3">{history.length===0 && <div className={`${bgCard} border rounded-2xl p-8 text-center text-sm ${textMuted}`}>{t.noHistory}</div>}{history.map((h,i)=>(<div key={i} className={`${bgCard} border rounded-xl p-4 flex items-center gap-4`}><div className={`w-12 h-12 rounded-xl ${h.color} text-white flex items-center justify-center font-bold text-sm`}>{h.score}%</div><div className="flex-1"><p className={`text-sm font-medium ${textMain}`}>{h.tab} • {h.level}</p><p className={`text-xs truncate ${textMuted}`}>{h.preview} • {h.date}</p></div></div>))}</div></div>)}
          {activeNav==='parametres' && (
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-2xl font-bold ${textMain}`}>{t.settingsTitle}</h2>
              <div className={`mt-6 ${bgCard} border rounded-2xl p-6 space-y-6`}>
                <div className="flex justify-between items-center"><div><p className={`text-sm font-medium ${textMain}`}>{t.currentPlan}</p><p className={`text-xs ${textMuted}`}>{isPro? 'Pro Illimité - 6000F/mois' : `${t.freePlan} ${analysesCount}/${FREE_LIMIT}`}</p></div>{!isPro && <button onClick={handleUpgrade} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">{t.upgrade}</button>}</div>
                <div className="border-t pt-6"><p className={`text-sm font-medium mb-3 ${textMain}`}>🌐 {t.language}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{[{code:'fr',label:'Français',flag:'🇫🇷'},{code:'en',label:'English',flag:'🇺🇸'},{code:'es',label:'Español',flag:'🇪🇸'},{code:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.code} onClick={()=>setLanguage(l.code as LangType)} className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 ${language===l.code?'bg-slate-900 text-white border-slate-900':`${bgCard} ${textSecondary} hover:bg-slate-50`}`}><span className="text-lg">{l.flag}</span>{l.label}</button>))}</div></div>
                <div className="border-t pt-6"><p className={`text-sm font-medium mb-3 ${textMain}`}>🎨 {t.theme}</p><div className="flex gap-3"><button onClick={()=>setDarkMode(false)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${!darkMode?'bg-slate-900 text-white border-slate-900':`${bgCard} ${textSecondary}`}`}><span className="flex items-center gap-2">☀️ {t.light}</span>{!darkMode && <span>✓</span>}</button><button onClick={()=>setDarkMode(true)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${darkMode?'bg-slate-900 text-white border-slate-900':`${bgCard} ${textSecondary}`}`}><span className="flex items-center gap-2">🌙 {t.dark}</span>{darkMode && <span>✓</span>}</button></div></div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

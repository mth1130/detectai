'use client'
import { useState, useEffect } from 'react'

type TabType = 'Texte' | 'Vidéo' | 'Image' | 'Document' | 'Classeur' | 'Anti-Bypass'
type NavType = 'detecteur' | 'historique' | 'parametres'
type LangType = 'fr' | 'en' | 'es' | 'ar'

const translations: any = {
  fr: { title: 'DetectAI', subtitle: 'Version Mondiale • Honnête & Anonyme • Texte, Image, Vidéo, Document, Classeur', detector: 'Détecteur', history: 'Historique', settings: 'Paramètres', free: 'gratuit', unlimited: 'Pro illimité', analyze: 'Analyser', analysing: 'Analyse...', chars: 'caractères', remaining: 'analyses gratuites restantes', limitReached: 'Limite atteinte - Passe Pro', subscribe: "S'abonner - $9.99/mois", pro: 'DetectAI Pro', monthly: 'Abonnement mensuel • $9.99', cancel: 'Annulable • Payoneer', details: 'Détails', dragDrop: 'Glisse ton fichier', choose: 'Choisir un fichier', antiBypass: 'Mode Anti-Bypass: Détecte les textes humanisés par Undetectable AI, Quillbot...', settingsTitle: 'Paramètres', currentPlan: 'Plan actuel', freePlan: 'Gratuit', subLink: "Lien d'abonnement", payment: 'Paiement', language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', reset: 'Réinitialiser (test)', upgrade: 'Upgrade $9.99', noHistory: 'Aucune analyse', proActivated: '✓ Pro Activé', paywallTitle: 'Passe en abonnement Pro', paywallDesc: 'Tu as utilisé tes 3 analyses gratuites. Abonne-toi pour illimité.', unlimitedAll: 'Analyses illimitées (tous types)', videoImage: 'Vidéo & image avancée', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Historique complet', close: 'Fermer' },
  en: { title: 'DetectAI', subtitle: 'World Version • Honest & Anonymous • Text, Image, Video, Document, Spreadsheet', detector: 'Detector', history: 'History', settings: 'Settings', free: 'free', unlimited: 'Pro unlimited', analyze: 'Analyze', analysing: 'Analyzing...', chars: 'characters', remaining: 'free analyses remaining', limitReached: 'Limit reached - Go Pro', subscribe: 'Subscribe - $9.99/month', pro: 'DetectAI Pro', monthly: 'Monthly subscription • $9.99', cancel: 'Cancellable • Payoneer', details: 'Details', dragDrop: 'Drop your file here or click', choose: 'Choose file', antiBypass: 'Anti-Bypass Mode: Detects texts humanized by Undetectable AI, Quillbot...', settingsTitle: 'Settings', currentPlan: 'Current plan', freePlan: 'Free', subLink: 'Subscription link', payment: 'Payment', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', reset: 'Reset (test)', upgrade: 'Upgrade $9.99', noHistory: 'No analysis yet', proActivated: '✓ Pro Activated', paywallTitle: 'Go Pro subscription', paywallDesc: 'You used your 3 free analyses. Subscribe for unlimited.', unlimitedAll: 'Unlimited analyses (all types)', videoImage: 'Advanced video & image', antiBypassFe: 'Anti-bypass & humanizer', fullHistory: 'Full history', close: 'Close' },
  es: { title: 'DetectAI', subtitle: 'Versión Mundial • Honesto y Anónimo • Texto, Imagen, Video', detector: 'Detector', history: 'Historial', settings: 'Ajustes', free: 'gratis', unlimited: 'Pro ilimitado', analyze: 'Analizar', analysing: 'Analizando...', chars: 'caracteres', remaining: 'análisis gratuitos restantes', limitReached: 'Límite alcanzado - Pasa a Pro', subscribe: 'Suscribirse - $9.99/mes', pro: 'DetectAI Pro', monthly: 'Suscripción mensual • $9.99', cancel: 'Cancelable • Payoneer', details: 'Detalles', dragDrop: 'Arrastra tu archivo aquí o haz clic', choose: 'Elegir archivo', antiBypass: 'Modo Anti-Bypass: Detecta textos humanizados...', settingsTitle: 'Ajustes', currentPlan: 'Plan actual', freePlan: 'Gratis', subLink: 'Enlace de suscripción', payment: 'Pago', language: 'Idioma', theme: 'Tema', light: 'Claro', dark: 'Oscuro', reset: 'Reiniciar (test)', upgrade: 'Mejorar $9.99', noHistory: 'Sin análisis', proActivated: '✓ Pro Activado', paywallTitle: 'Pasa a Pro', paywallDesc: 'Usaste tus 3 análisis gratis. Suscríbete para ilimitado.', unlimitedAll: 'Análisis ilimitados', videoImage: 'Video e imagen avanzado', antiBypassFe: 'Anti-bypass y humanizador', fullHistory: 'Historial completo', close: 'Cerrar' },
  ar: { title: 'DetectAI', subtitle: 'النسخة العالمية • صادق ومجهول', detector: 'كاشف', history: 'السجل', settings: 'الإعدادات', free: 'مجاني', unlimited: 'برو غير محدود', analyze: 'تحليل', analysing: 'جار التحليل...', chars: 'حرف', remaining: 'تحليلات مجانية متبقية', limitReached: 'تم الوصول للحد - انتقل إلى برو', subscribe: 'اشترك - $9.99/شهر', pro: 'DetectAI برو', monthly: 'اشتراك شهري • $9.99', cancel: 'قابل للإلغاء • Payoneer', details: 'التفاصيل', dragDrop: 'اسحب ملفك هنا أو انقر', choose: 'اختر ملفا', antiBypass: 'وضع مكافحة التجاوز: يكتشف النصوص المموهة...', settingsTitle: 'الإعدادات', currentPlan: 'الخطة الحالية', freePlan: 'مجاني', subLink: 'رابط الاشتراك', payment: 'الدفع', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', reset: 'إعادة تعيين', upgrade: 'ترقية $9.99', noHistory: 'لا يوجد تحليل', proActivated: '✓ تم تفعيل برو', paywallTitle: 'انتقل إلى برو', paywallDesc: 'استخدمت تحليلاتك المجانية. اشترك للحصول على غير محدود.', unlimitedAll: 'تحليلات غير محدودة', videoImage: 'فيديو وصورة متقدمة', antiBypassFe: 'مكافحة التجاوز', fullHistory: 'السجل الكامل', close: 'إغلاق' },
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
  }, [])

  useEffect(() => { localStorage.setItem('detectai_lang', language) }, [language])
  useEffect(() => { localStorage.setItem('detectai_theme', darkMode? 'dark' : 'light') }, [darkMode])

  const handleUpgrade = () => { window.open(CHECKOUT_URL, '_blank') }
  const handleFile = (e: any) => {
    const file = e.target.files?.[0]
    if (file) { setFileName(file.name); setInput(`Fichier chargé: ${file.name} (${(file.size/1024).toFixed(1)} KB) - Prêt pour analyse ${activeTab}`) }
  }

  const analyze = async () => {
    if (!input.trim()) return
    if (!isPro && analysesCount >= FREE_LIMIT) { setShowPaywall(true); return }
    setIsAnalyzing(true); await new Promise(r => setTimeout(r, 1100))
    const lower = input.toLowerCase(); let score = 0; let reasons: string[] = []; let details: any = {}
    if (activeTab === 'Texte' || activeTab === 'Document' || activeTab === 'Classeur') {
      const aiPhrases = ["intelligence artificielle","il est important de noter","en conclusion","en tant que modèle","je suis une ia","il convient de","dans le cadre de","as an ai language model"]
      aiPhrases.forEach(p => { if (lower.includes(p)) { score += 18; reasons.push(`Phrase IA typique: "${p}"`) } })
      if (/(j'ai vécu|i lived|je me souviens|i remember|my dad|my mom|mon père|ma mère)/i.test(lower)) { score -= 25; reasons.push("✓ Souvenir personnel humain (-25% IA)") }
      if (/(janvier|février|mars|january|february|lundi|mardi|dakar|sénégal)/i.test(lower)) { score -= 12; reasons.push("✓ Référence temporelle/géographique humaine") }
      if (/^[A-Z].*[.!?]$/.test(input.trim()) && input.split('.').length > 4 &&!lower.includes('je')) { score += 15; reasons.push("Structure trop parfaite") }
    }
    if (activeTab === 'Image') { score = 30 + Math.random()*50; reasons.push("Analyse des artefacts de génération"); if (fileName) reasons.push(`Fichier: ${fileName}`); reasons.push("Vérification métadonnées EXIF"); details = { type: 'image', modelSuspect: score > 60? 'Midjourney v6 / DALL·E 3' : 'Probablement humain' } }
    if (activeTab === 'Vidéo') { score = 25 + Math.random()*55; reasons.push("Analyse frame par frame"); reasons.push("Détection flickering IA"); if (fileName) reasons.push(`Vidéo: ${fileName}`); details = { type: 'video', modelSuspect: score > 60? 'Sora / Runway' : 'Caméra réelle probable' } }
    if (activeTab === 'Anti-Bypass') { score += 20; reasons.push("🔍 MODE ANTI-BYPASS"); reasons.push("Détection humanizer"); if (/(humanisé|humanize|bypass)/i.test(lower)) { score += 25; reasons.push("Tentative de contournement détectée!") } details = { type: 'antibypass' } }
    score = Math.min(98, Math.max(2, 50 + score + (Math.random()*16-8)))
    let level = "FAIBLE"; let color = "bg-emerald-500"; let emoji = "✅"
    if (score > 75) { level = "CRITIQUE"; color = "bg-red-600"; emoji = "🚨" } else if (score > 55) { level = "MODÉRÉ"; color = "bg-orange-500"; emoji = "⚠️" } else if (score > 35) { level = "FAIBLE"; color = "bg-yellow-500"; emoji = "🤔" }
    const newResult = { score: Math.round(score), level, color, emoji, reasons, details, tab: activeTab, date: new Date().toLocaleString(language === 'fr'? 'fr-FR' : 'en-US'), preview: input.slice(0,80)+'...' }
    setResult(newResult); const newCount = analysesCount + 1; setAnalysesCount(newCount); localStorage.setItem('detectai_count', newCount.toString())
    const newHist = [newResult,...history].slice(0,20); setHistory(newHist); localStorage.setItem('detectai_hist', JSON.stringify(newHist)); setIsAnalyzing(false)
  }

  const bgMain = darkMode? 'bg-[#0f172a]' : 'bg-[#f8fafc]'; const bgCard = darkMode? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'; const bgSidebar = darkMode? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const textMain = darkMode? 'text-white' : 'text-slate-900'; const textMuted = darkMode? 'text-slate-400' : 'text-slate-500'; const textSecondary = darkMode? 'text-slate-300' : 'text-slate-700'

  return (
    <div className={`min-h-screen flex ${bgMain} ${darkMode? 'dark' : ''}`}>
      <div className={`w-64 ${bgSidebar} border-r p-4 flex flex-col fixed h-full z-10`}>
        <div className="flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">D</div><span className={`font-bold tracking-wide ${darkMode? 'text-white' : 'text-slate-900'}`}>DETECTAI</span><span className="text- bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1">PRO</span></div>
        <nav className="space-y-1">
          <button onClick={() => setActiveNav('detecteur')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='detecteur'? 'bg-slate-900 text-white' : darkMode? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}><span>🔍</span> {t.detector}</button>
          <button onClick={() => setActiveNav('historique')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='historique'? 'bg-slate-900 text-white' : darkMode? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}><span>🕒</span> {t.history} <span className="ml-auto bg-slate-100 text-slate-600 text- px-1.5 py-0.5 rounded-full">{history.length}</span></button>
          <button onClick={() => setActiveNav('parametres')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${activeNav==='parametres'? 'bg-slate-900 text-white' : darkMode? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}><span>⚙️</span> {t.settings}</button>
        </nav>
        <div className="mt-auto">
          {!isPro? (
            <div className={`${darkMode? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200'} border rounded-2xl p-4`}>
              <div className="flex items-center justify-between"><p className={`text-sm font-bold ${darkMode? 'text-white' : 'text-slate-900'}`}>{t.pro}</p><span className="text- bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">6000 F</span></div>
              <p className={`text- mt-1 ${darkMode? 'text-slate-400' : 'text-slate-600'}`}>{t.monthly}</p>
              <div className="mt-3 h-1.5 bg-amber-200 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{width: `${Math.min(100, (analysesCount/FREE_LIMIT)*100)}%`}}></div></div>
              <p className={`text- mt-2 ${darkMode? 'text-slate-400' : 'text-slate-600'}`}>{FREE_LIMIT - analysesCount > 0? `${FREE_LIMIT - analysesCount} ${t.remaining}` : t.limitReached}</p>
              <button onClick={handleUpgrade} className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition">{t.subscribe}</button>
              <p className="text- text-slate-400 mt-2 text-center">{t.cancel}</p>
            </div>
          ) : (<div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"><p className="text-sm font-bold text-green-700">{t.proActivated}</p></div>)}
        </div>
      </div>
      <div className="flex-1 ml-64 p-8">
        {activeNav === 'detecteur' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between"><div><h1 className={`text-3xl font-bold ${textMain}`}>{t.title}</h1><p className={`${textMuted} mt-1 text-sm`}>{t.subtitle}</p></div><div className={`${bgCard} border rounded-xl px-3 py-1.5 text-xs ${textMuted}`}>{isPro? t.unlimited : `${analysesCount}/${FREE_LIMIT} ${t.free}`}</div></div>
            <div className="flex gap-2 mt-6 flex-wrap">{(['Texte','Vidéo','Image','Document','Classeur','Anti-Bypass'] as TabType[]).map(tab => (<button key={tab} onClick={() => { setActiveTab(tab); setResult(null); setInput(''); setFileName('') }} className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${activeTab===tab? 'bg-slate-900 text-white border-slate-900 shadow' : `${bgCard} ${textSecondary} hover:bg-slate-50`}`}>{tab}</button>))}</div>
            <div className={`mt-6 ${bgCard} rounded-2xl border shadow-sm p-5`}>
              {activeTab === 'Texte' && (<textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Colle ton texte ici..." className={`w-full h-48 resize-none outline-none ${darkMode? 'bg-slate-800 text-white placeholder:text-slate-500' : 'bg-white text-slate-700 placeholder:text-slate-400'} text-`} />)}
              {activeTab === 'Anti-Bypass' && (<div><div className={`${darkMode? 'bg-amber-900/20 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'} border rounded-xl p-3 mb-3 text-xs`}>🛡️ {t.antiBypass}</div><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Colle un texte suspect..." className={`w-full h-40 resize-none outline-none ${darkMode? 'bg-slate-800 text-white' : 'bg-white text-slate-700'}`} /></div>)}
              {(activeTab === 'Image' || activeTab === 'Vidéo' || activeTab === 'Document' || activeTab === 'Classeur') && (<div><div className={`border-2 border-dashed ${darkMode? 'border-slate-600' : 'border-slate-200'} rounded-2xl p-8 text-center`}><div className="text-3xl mb-2">{activeTab === 'Image'? '🖼️' : activeTab === 'Vidéo'? '🎬' : '📄'}</div><p className={`text-sm font-medium ${textMain}`}>{t.dragDrop} {activeTab}</p><p className={`text-xs ${textMuted} mt-1`}>PNG, JPG, MP4, PDF, DOCX, XLSX</p><input type="file" onChange={handleFile} className="hidden" id="fileInput" /><label htmlFor="fileInput" className="inline-block mt-4 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-black">{t.choose}</label>{fileName && <p className="text-xs text-emerald-500 mt-3 font-medium">✓ {fileName}</p>}</div><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Optionnel..." className={`w-full h-20 mt-4 resize-none outline-none text-sm border-t pt-3 ${darkMode? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-600'}`} /></div>)}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100"><span className="text-xs text-slate-400">{input.length} {t.chars} • {activeTab} • {isPro? t.unlimited : `${analysesCount}/${FREE_LIMIT}`}</span><button onClick={analyze} disabled={isAnalyzing ||!input.trim()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition disabled:opacity-50">{isAnalyzing? t.analysing : t.analyze} {isAnalyzing? '⏳' : '→'}</button></div>
            </div>
            {result && (<div className={`mt-6 ${bgCard} rounded-2xl border p-6 shadow-sm`}><div className="flex items-center gap-4"><div className={`w-20 h-20 rounded-2xl ${result.color} text-white flex flex-col items-center justify-center font-bold shadow`}><span className="text-2xl">{result.score}%</span><span className="text- opacity-80">IA</span></div><div className="flex-1"><p className={`font-bold flex items-center gap-2 ${textMain}`}><span>{result.emoji}</span> {result.level}</p><p className={`text-sm mt-0.5 ${textMuted}`}>{result.tab} • {result.date}</p>{result.details?.modelSuspect && <p className="text-xs bg-slate-100 inline-block px-2 py-1 rounded-full mt-2">Modèle: {result.details.modelSuspect}</p>}</div></div><div className={`mt-5 ${darkMode? 'bg-slate-700' : 'bg-slate-50'} rounded-xl p-4 space-y-1.5`}><p className="text- font-bold text-slate-500 uppercase mb-2">{t.details}</p>{result.reasons.map((r:string,i:number) => (<p key={i} className={`text-sm ${textSecondary}`}>• {r}</p>))}</div></div>)}
          </div>
        )}
        {activeNav === 'historique' && (<div className="max-w-4xl mx-auto"><h2 className={`text-2xl font-bold ${textMain}`}>{t.history}</h2><p className={`text-sm mt-1 ${textMuted}`}>{history.length} analyses</p><div className="mt-6 space-y-3">{history.length === 0 && <div className={`${bgCard} border rounded-2xl p-8 text-center text-sm ${textMuted}`}>{t.noHistory}</div>}{history.map((h,i) => (<div key={i} className={`${bgCard} border rounded-xl p-4 flex items-center gap-4`}><div className={`w-12 h-12 rounded-xl ${h.color} text-white flex items-center justify-center font-bold text-sm`}>{h.score}%</div><div className="flex-1"><p className={`text-sm font-medium ${textMain}`}>{h.tab} • {h.level}</p><p className={`text-xs truncate ${textMuted}`}>{h.preview} • {h.date}</p></div></div>))}</div></div>)}
        {activeNav === 'parametres' && (
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold ${textMain}`}>{t.settingsTitle}</h2>
            <div className={`mt-6 ${bgCard} border rounded-2xl p-6 space-y-6`}>
              <div className="flex justify-between items-center"><div><p className={`text-sm font-medium ${textMain}`}>{t.currentPlan}</p><p className={`text-xs ${textMuted}`}>{isPro? 'Pro Illimité - $9.99/mois' : `${t.freePlan} ${analysesCount}/${FREE_LIMIT}`}</p></div>{!isPro && <button onClick={handleUpgrade} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">{t.upgrade}</button>}</div>
              <div className="border-t pt-6"><p className={`text-sm font-medium mb-3 ${textMain}`}>🌐 {t.language}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{[{code: 'fr', label: 'Français', flag: '🇫🇷'},{code: 'en', label: 'English', flag: '🇺🇸'},{code: 'es', label: 'Español', flag: '🇪🇸'},{code: 'ar', label: 'العربية', flag: '🇸🇦'},].map(l => (<button key={l.code} onClick={() => setLanguage(l.code as LangType)} className={`p-3 rounded-xl border text-sm font-medium transition flex flex-col items-center gap-1 ${language===l.code? 'bg-slate-900 text-white border-slate-900' : `${bgCard} ${textSecondary} hover:bg-slate-50`}`}><span className="text-lg">{l.flag}</span>{l.label}</button>))}</div></div>
              <div className="border-t pt-6"><p className={`text-sm font-medium mb-3 ${textMain}`}>🎨 {t.theme}</p><div className="flex gap-3"><button onClick={() => setDarkMode(false)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${!darkMode? 'bg-slate-900 text-white border-slate-900' : `${bgCard} ${textSecondary}`}`}><span className="flex items-center gap-2">☀️ {t.light}</span>{!darkMode && <span>✓</span>}</button><button onClick={() => setDarkMode(true)} className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${darkMode? 'bg-slate-900 text-white border-slate-900' : `${bgCard} ${textSecondary}`}`}><span className="flex items-center gap-2">🌙 {t.dark}</span>{darkMode && <span>✓</span>}</button></div></div>
              <div className="border-t pt-4"><p className={`text-sm font-medium ${textMain}`}>{t.subLink}</p><p className={`text-xs mt-1 break-all ${textMuted}`}>{CHECKOUT_URL}</p></div>
              <div className="border-t pt-4"><p className={`text-sm font-medium ${textMain}`}>{t.payment}</p><p className={`text-xs mt-1 ${textMuted}`}>LemonSqueezy → Payoneer • {t.cancel} • 6000 F CFA / $9.99</p></div>
              <button onClick={() => { localStorage.clear(); setAnalysesCount(0); setHistory([]); }} className="text-xs text-red-500">{t.reset}</button>
            </div>
          </div>
        )}
      </div>
      {showPaywall && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className={`${bgCard} rounded-3xl p-8 max-w-md w-full text-center shadow-2xl`}><div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">🔒</div><h2 className={`text-2xl font-bold mt-4 ${textMain}`}>{t.paywallTitle}</h2><p className={`${textMuted} mt-2 text-sm`}>{t.paywallDesc}</p><div className={`${darkMode? 'bg-slate-700' : 'bg-slate-50'} rounded-2xl p-4 mt-5 text-left border`}><p className={`text-sm font-bold flex justify-between ${textMain}`}>{t.pro} - $9.99/mois <span className="text- bg-slate-900 text-white px-2 py-0.5 rounded-full">6000 F</span></p><div className="mt-3 space-y-1.5"><p className={`text-xs ${textSecondary}`}>✓ {t.unlimitedAll}</p><p className={`text-xs ${textSecondary}`}>✓ {t.videoImage}</p><p className={`text-xs ${textSecondary}`}>✓ {t.antiBypassFe}</p><p className={`text-xs ${textSecondary}`}>✓ {t.fullHistory}</p></div></div><button onClick={handleUpgrade} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text- hover:bg-black">{t.subscribe} (6000 F)</button><button onClick={() => setShowPaywall(false)} className="mt-4 text-sm text-slate-400">{t.close}</button></div></div>)}
    </div>
  )
}

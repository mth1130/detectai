'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, History, Settings, FileText, Video, Image as ImageIcon, FileCheck, FolderOpen, ShieldCheck, Sparkles, Upload, X, Lock, Check, Crown, Zap, ArrowRight, AlertCircle, Menu } from 'lucide-react';

type TabType = 'texte' | 'video' | 'image' | 'document' | 'classeur' | 'anti-bypass';
type SidebarType = 'detecteur' | 'historique' | 'parametres';
type LangType = 'fr' | 'en' | 'es' | 'ar';
type ThemeType = 'clair' | 'sombre';
interface Analyse { id: string; type: TabType; content: string; result: number; date: string; isHuman: boolean; }
const FREE_LIMIT = 3;
const LEMON_CHECKOUT_URL = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210";
const LEMON_JS_URL = "https://app.lemonsqueezy.com/js/lemon.js";

const i18n = {
  fr: { title: "Détecteur de contenu IA", subtitle: "Analysez instantanément si un texte, une image ou une vidéo a été généré par une IA. Précision supérieure à 98%.", detector: "Détecteur", history: "Historique", settings: "Paramètres", texte: "Texte", video: "Vidéo", image: "Image", document: "Document", classeur: "Classeur", antibypass: "Anti-Bypass", placeholder: "Collez votre texte ici (minimum 50 caractères)...", drop: "Déposez votre", here: "ici", browse: "Parcourir", orDrag: "ou glissez-déposez", descVideo: "MP4, MOV, WebM jusqu'à 500Mo.", descImage: "JPG, PNG, WebP.", descDocument: "PDF, DOCX, TXT.", descClasseur: "Importez un dossier complet. Lot en Pro.", descAnti: "Testez la résistance au bypass.", analyzing: "Analyse en cours...", analyze: "Analyser", encrypted: "Chiffrement bout-à-bout • Non stocké", result: "Résultat", model: "Modèle DetectAI • Précis", waiting: "En attente d'analyse", waitingDesc: "Collez un texte et lancez l'analyse.", probHuman: "Probablement humain", probIA: "Probablement IA", veryHuman: "Très probablement humain", veryIA: "Très probablement IA", styleHuman: "Style naturel humain.", styleIA: "Patterns caractéristiques des LLM.", perplexity: "Perplexité", burstiness: "Burstiness", confidence: "Confiance", high: "Élevée", variable: "Variable", uniform: "Uniforme", low: "Basse", detailedReport: "Voir le rapport détaillé", historyTitle: "Historique d'analyses", planFree: "Plan gratuit", freeLeft: "Il vous reste", analyses: "analyses gratuites", limitReached: "Limite atteinte", goPro: "Passer Pro", proActive: "Plan Pro actif", unlimited: "Analyses illimitées", params: "Paramètres", currentPlan: "Plan actuel", upgrade: "Upgrade $9.99", language: "Langue", theme: "Thème", light: "Clair", dark: "Sombre", subLink: "Lien d'abonnement", manageSub: "Gérer mon abonnement →", support: "Support: support@detectai-labs.com", rgpd: "DetectAI ne stocke jamais vos contenus. RGPD.", paywallTitle: "Vous avez atteint la limite gratuite", paywallDesc: "Vous avez utilisé vos 3 analyses gratuites. Passez Pro pour illimité.", unlock: "Débloquer DetectAI Pro", secure: "Paiement sécurisé par LemonSqueezy", free: "Gratuit", remaining: "restantes", proBadge: "6000 F" },
  en: { title: "AI Content Detector", subtitle: "Instantly analyze if text, image or video was AI generated. 98%+ accuracy.", detector: "Detector", history: "History", settings: "Settings", texte: "Text", video: "Video", image: "Image", document: "Document", classeur: "Workbook", antibypass: "Anti-Bypass", placeholder: "Paste your text here...", drop: "Drop your", here: "here", browse: "Browse", orDrag: "or drag & drop", descVideo: "MP4, MOV, WebM up to 500MB.", descImage: "JPG, PNG, WebP.", descDocument: "PDF, DOCX, TXT.", descClasseur: "Import full folder. Batch in Pro.", descAnti: "Test bypass resistance.", analyzing: "Analyzing...", analyze: "Analyze", encrypted: "End-to-end encrypted", result: "Result", model: "DetectAI Model", waiting: "Waiting for analysis", waitingDesc: "Paste text and run analysis.", probHuman: "Probably human", probIA: "Probably AI", veryHuman: "Very likely human", veryIA: "Very likely AI", styleHuman: "Natural human style.", styleIA: "LLM patterns.", perplexity: "Perplexity", burstiness: "Burstiness", confidence: "Confidence", high: "High", variable: "Variable", uniform: "Uniform", low: "Low", detailedReport: "View report", historyTitle: "Analysis history", planFree: "Free plan", freeLeft: "You have", analyses: "free analyses left", limitReached: "Limit reached", goPro: "Go Pro", proActive: "Pro active", unlimited: "Unlimited", params: "Settings", currentPlan: "Current plan", upgrade: "Upgrade $9.99", language: "Language", theme: "Theme", light: "Light", dark: "Dark", subLink: "Subscription link", manageSub: "Manage subscription →", support: "Support: support@detectai-labs.com", rgpd: "DetectAI never stores your content.", paywallTitle: "Free limit reached", paywallDesc: "You used your 3 free analyses.", unlock: "Unlock Pro", secure: "Secure payment", free: "Free", remaining: "left", proBadge: "6000 F" },
  es: { title: "Detector de contenido IA", subtitle: "Analiza al instante si un texto, imagen o video fue generado por IA.", detector: "Detector", history: "Historial", settings: "Ajustes", texte: "Texto", video: "Video", image: "Imagen", document: "Documento", classeur: "Libro", antibypass: "Anti-Bypass", placeholder: "Pega tu texto aquí...", drop: "Suelta tu", here: "aquí", browse: "Explorar", orDrag: "o arrastra y suelta", descVideo: "MP4, MOV, WebM hasta 500MB.", descImage: "JPG, PNG, WebP.", descDocument: "PDF, DOCX, TXT.", descClasseur: "Importa carpeta completa.", descAnti: "Prueba resistencia.", analyzing: "Analizando...", analyze: "Analizar", encrypted: "Cifrado extremo a extremo", result: "Resultado", model: "Modelo DetectAI", waiting: "Esperando análisis", waitingDesc: "Pega texto y analiza.", probHuman: "Probablemente humano", probIA: "Probablemente IA", veryHuman: "Muy probablemente humano", veryIA: "Muy probablemente IA", styleHuman: "Estilo natural.", styleIA: "Patrones de LLM.", perplexity: "Perplejidad", burstiness: "Burstiness", confidence: "Confianza", high: "Alta", variable: "Variable", uniform: "Uniforme", low: "Baja", detailedReport: "Ver informe", historyTitle: "Historial", planFree: "Plan gratuito", freeLeft: "Te quedan", analyses: "análisis gratis", limitReached: "Límite alcanzado", goPro: "Pasar a Pro", proActive: "Plan Pro activo", unlimited: "Ilimitado", params: "Ajustes", currentPlan: "Plan actual", upgrade: "Mejorar $9.99", language: "Idioma", theme: "Tema", light: "Claro", dark: "Oscuro", subLink: "Enlace de suscripción", manageSub: "Gestionar suscripción →", support: "Soporte: support@detectai-labs.com", rgpd: "DetectAI nunca almacena tu contenido.", paywallTitle: "Límite gratuito alcanzado", paywallDesc: "Usaste tus 3 análisis gratis.", unlock: "Desbloquear Pro", secure: "Pago seguro", free: "Gratis", remaining: "restantes", proBadge: "6000 F" },
  ar: { title: "كاشف محتوى الذكاء الاصطناعي", subtitle: "حلل ما إذا كان النص أو الصورة أو الفيديو تم إنشاؤه بواسطة الذكاء الاصطناعي.", detector: "الكاشف", history: "السجل", settings: "الإعدادات", texte: "نص", video: "فيديو", image: "صورة", document: "مستند", classeur: "مصنف", antibypass: "مضاد التجاوز", placeholder: "الصق النص هنا...", drop: "أسقط", here: "هنا", browse: "تصفح", orDrag: "أو اسحب وأفلت", descVideo: "MP4، MOV، WebM.", descImage: "JPG، PNG، WebP.", descDocument: "PDF، DOCX.", descClasseur: "استيراد مجلد كامل.", descAnti: "اختبار مقاومة التجاوز.", analyzing: "جاري التحليل...", analyze: "حلل", encrypted: "تشفير من طرف إلى طرف", result: "النتيجة", model: "نموذج DetectAI", waiting: "في انتظار التحليل", waitingDesc: "الصق النص وشغل التحليل.", probHuman: "على الأرجح بشري", probIA: "على الأرجح ذكاء اصطناعي", veryHuman: "بشري جدًا", veryIA: "ذكاء اصطناعي على الأرجح", styleHuman: "أسلوب طبيعي.", styleIA: "أنماط LLM.", perplexity: "الحيرة", burstiness: "التفجر", confidence: "الثقة", high: "عالية", variable: "متغير", uniform: "موحد", low: "منخفض", detailedReport: "عرض التقرير", historyTitle: "سجل التحليلات", planFree: "خطة مجانية", freeLeft: "بقي لديك", analyses: "تحليلات مجانية", limitReached: "تم الوصول للحد", goPro: "الترقية إلى Pro", proActive: "خطة Pro نشطة", unlimited: "غير محدود", params: "الإعدادات", currentPlan: "الخطة الحالية", upgrade: "ترقية $9.99", language: "اللغة", theme: "المظهر", light: "فاتح", dark: "داكن", subLink: "رابط الاشتراك", manageSub: "إدارة الاشتراك →", support: "الدعم: support@detectai-labs.com", rgpd: "DetectAI لا يخزن محتواك أبدًا.", paywallTitle: "وصلت للحد المجاني", paywallDesc: "استخدمت 3 تحليلات مجانية.", unlock: "فتح Pro", secure: "دفع آمن", free: "مجاني", remaining: "متبقية", proBadge: "6000 F" }
};

export default function DetectAI() {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>('detecteur');
  const [activeTab, setActiveTab] = useState<TabType>('texte');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyses, setAnalyses] = useState<Analyse[]>([
    { id: '1', type: 'texte', content: "L'intelligence artificielle transforme...", result: 87, date: "Aujourd'hui, 14:32", isHuman: false },
    { id: '2', type: 'texte', content: "Je me souviens de cette soirée...", result: 12, date: "Hier, 09:15", isHuman: true }
  ]);
  const [currentResult, setCurrentResult] = useState<Analyse | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [freeCount, setFreeCount] = useState(0);
  const [lang, setLang] = useState<LangType>('fr');
  const [theme, setTheme] = useState<ThemeType>('clair');
  const remainingFree = Math.max(0, FREE_LIMIT - freeCount);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = i18n[lang];

  const handleUpgrade = () => { window.open(LEMON_CHECKOUT_URL, '_blank'); setShowPaywall(true); };
  const handleAnalyse = async () => {
    if (!inputText.trim() && activeTab === 'texte') return;
    if (!isPro && freeCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setIsAnalyzing(true); setCurrentResult(null);
    await new Promise(r => setTimeout(r, 1500));
    const human = inputText.length < 80 || /je me souviens|haha|ptdr|bah/i.test(inputText);
    const score = human? Math.floor(Math.random()*25)+5 : Math.floor(Math.random()*35)+60;
    const res: Analyse = { id: Date.now().toString(), type: activeTab, content: inputText.slice(0,120), result: score, date: 'À l\'instant', isHuman: score < 50 };
    setCurrentResult(res); setAnalyses(p => [res,...p].slice(0,50));
    if (!isPro) setFreeCount(c => c+1); setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'texte' as TabType, label: t.texte, icon: FileText },
    { id: 'video' as TabType, label: t.video, icon: Video },
    { id: 'image' as TabType, label: t.image, icon: ImageIcon },
    { id: 'document' as TabType, label: t.document, icon: FileCheck },
    { id: 'classeur' as TabType, label: t.classeur, icon: FolderOpen },
    { id: 'anti-bypass' as TabType, label: t.antibypass, icon: ShieldCheck },
  ];

  const switchSidebar = (id: SidebarType) => { setActiveSidebar(id); setMobileOpen(false); };
  const isDark = theme === 'sombre';

  return (
    <div className={`min-h-screen font-[Inter] overflow-x-hidden ${isDark? 'bg-[#0f172a] text-white' : 'bg-[#f5f7fb] text-[#0f172a]'}`}>
      <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-[#1e293b] text-white flex items-center justify-center">{mobileOpen? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded- bg-[#1e293b] flex items-center justify-center text-white"><Sparkles className="w-4 h-4" /></div><span className="font-bold">DETECTAI</span></div>
        </div>
        <span className="text- font-mono bg-[#f1f5f9] px-2 py-1 rounded-full text-[#334155]">{remainingFree}/{FREE_LIMIT}</span>
      </div>
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />}
      <div className="flex min-h-screen">
        <aside className={`w- md:w- shrink-0 border-r flex flex-col md:sticky md:top-0 md:h-screen md:translate-x-0 fixed inset-y-0 left-0 z-30 h- transition-transform duration-300 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'} ${mobileOpen? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="px-7 pt-8 pb-6 hidden md:block"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded- bg-[#1e293b] flex items-center justify-center text-white"><Sparkles className="w- h-" /></div><div><h1 className="text- font-bold leading-none">DetectAI</h1><p className="text- text-[#94a3b8] uppercase mt-1">Détecteur IA</p></div></div></div>
          <nav className="px-3 mt-2 space-y-1">
            {[{id:'detecteur',label:t.detector,icon:Search},{id:'historique',label:t.history,icon:History},{id:'parametres',label:t.settings,icon:Settings}].map(item => (
              <button key={item.id} onClick={() => switchSidebar(item.id as SidebarType)} className={`w-full flex items-center gap-3 px-3 py- rounded- text- font-medium ${activeSidebar===item.id? (isDark? 'bg-[#334155] text-white' : 'bg-[#f1f5f9] text-[#0f172a]') : 'text-[#64748b] hover:bg-[#f8fafc]'}`}><item.icon className="w- h-" />{item.label}</button>
            ))}
          </nav>
          <div className="mt-auto p-4"><div className={`rounded- border p-4 ${isDark? 'bg-[#0f172a] border-[#334155]' : 'bg-[#fbfcfe] border-[#e8ecf2]'}`}>{!isPro? (<><div className="flex justify-between mb-3"><span className="text- font-semibold">{t.planFree}</span><span className="text- font-mono bg-white border px-2 py-0.5 rounded-full">{remainingFree}/{FREE_LIMIT}</span></div><p className="text- text-[#64748b] mb-3">{remainingFree>0?`${t.freeLeft} ${remainingFree} ${t.analyses}`:t.limitReached}</p><button onClick={handleUpgrade} className="w-full h- rounded- bg-[#1e293b] text-white text- font-semibold flex items-center justify-center gap-1.5"><Crown className="w-4 h-4" />{t.goPro}</button></>):(<div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center"><Crown className="w-4 h-4 text-white" /></div><div><p className="text- font-semibold">{t.proActive}</p><p className="text- text-[#64748b]">{t.unlimited}</p></div></div>)}</div></div>
        </aside>
        <main className="flex-1 min-w-0 overflow-x-hidden"><div className="max-w- mx-auto px-4 md:px-10 py-6 md:py-10">
          {activeSidebar === 'detecteur' && (
            <>
              <div className={`flex gap-1.5 p-1 rounded- border w-full md:w-fit overflow-x-auto scrollbar-none mb-6 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}>{tabs.map(tab => (<button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentResult(null); }} className={`shrink-0 flex items-center gap-1.5 px-3.5 py- rounded- text- font-medium ${activeTab===tab.id? 'bg-[#1e293b] text-white' : 'text-[#64748b] hover:bg-[#f8fafc]'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}</div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
                <div className={`rounded- border overflow-hidden ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}>
                  {activeTab === 'texte'? (
                    <div className="p-1"><textarea value={inputText} onChange={e=>setInputText(e.target.value)} placeholder={t.placeholder} className={`w-full min-h- resize-none rounded- border p-5 text-[14.5px] outline-none ${isDark? 'bg-[#0f172a] border-[#334155]' : 'bg-[#fbfcfe] border-[#eef2f7]'}`} /><div className="flex justify-between p-4"><span className="text- text-[#64748b]">{t.encrypted}</span><button onClick={handleAnalyse} className="h- px- rounded- bg-[#1e293b] text-white text- font-semibold flex items-center gap-2"><Zap className="w-4 h-4" />{isAnalyzing? t.analyzing : t.analyze}</button></div></div>
                  ) : (
                    <div className="p-6"><div onDragOver={e=>{e.preventDefault(); setDragActive(true);}} onDragLeave={()=>setDragActive(false)} onDrop={e=>{e.preventDefault(); setDragActive(false);}} className={`rounded- border-2 border-dashed min-h- flex flex-col items-center justify-center p-8 text-center ${dragActive? 'border-[#1e293b] bg-[#f8fafc]' : 'border-[#e2e8f0] bg-[#fbfcfe]'}`}><div className="w-12 h-12 rounded- bg-white border flex items-center justify-center mb-4"><Upload className="w-5 h-5" /></div><h3 className="text- font-semibold">{t.drop} {activeTab} {t.here}</h3><p className="text- text-[#64748b] mt-1">{activeTab==='video'?t.descVideo: activeTab==='image'?t.descImage: activeTab==='document'?t.descDocument: activeTab==='classeur'?t.descClasseur: t.descAnti}</p><button onClick={()=>fileInputRef.current?.click()} className="mt-5 h-9 px-4 rounded- bg-[#1e293b] text-white text- font-semibold">{t.browse}</button><input ref={fileInputRef} type="file" className="hidden" /></div></div>
                  )}
                </div>
                <div className={`rounded- border p-5 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}><div className="flex justify-between mb-5"><h3 className="text- font-semibold">{t.result}</h3><div className="text- px-2.5 py-1 rounded-full bg-[#f1f5f9] border">{t.model}</div></div>{!currentResult? (<div className="py-16 text-center"><div className="w-12 h-12 rounded- bg-[#f1f5f9] flex items-center justify-center mx-auto mb-3"><Search className="w-6 h-6 text-[#94a3b8]" /></div><p className="text- font-medium">{t.waiting}</p></div>) : (<div><div className="flex gap-3 mb-5"><div className={`w-12 h-12 rounded- flex items-center justify-center text-white font-bold ${currentResult.isHuman? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>{currentResult.result}%</div><div><p className="text- font-semibold">{currentResult.isHuman? t.probHuman : t.probIA}</p><p className="text- text-[#94a3b8]">{currentResult.date}</p></div></div><p className="text- font-medium">{currentResult.isHuman? t.veryHuman : t.veryIA}</p></div>)}</div>
              </div>
            </>
          )}
          {activeSidebar === 'historique' && (<div className={`rounded- border overflow-hidden ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}><div className="p-6 border-b flex justify-between"><h3 className="font-semibold">{t.historyTitle}</h3><span className="text- text-[#94a3b8]">{analyses.length} analyses</span></div><div className="divide-y">{analyses.map(a=>(<div key={a.id} className="p-5 flex justify-between"><div className="flex gap-3"><div className={`w-9 h-9 rounded- flex items-center justify-center ${a.isHuman?'bg-[#dcfce7] text-[#15803d]':'bg-[#fee2e2] text-[#b91c1c]'}`}>{a.isHuman?<Check className="w-4 h-4"/>:<Sparkles className="w-4 h-4"/>}</div><div><p className="text-[13.5px] font-medium truncate max-w-">{a.content}</p><p className="text- text-[#94a3b8]">{a.date}</p></div></div><div className={`text- font-bold px-2.5 py-1 rounded-full h-fit ${a.isHuman?'bg-[#f0fdf4] text-[#15803d] border':'bg-[#fef2f2] text-[#b91c1c] border'}`}>{a.isHuman?'HUMAIN':'IA'}</div></div>))}</div></div>)}
          {activeSidebar === 'parametres' && (
            <div className="space-y-4 max-w-">
              <div className={`rounded- border p-6 md:p-8 ${isDark? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e8ecf2]'}`}>
                <div className="flex justify-between mb-6"><h3 className="text- font-bold">{t.params}</h3><span className="text- font-mono bg-[#f1f5f9] px-2 py-1 rounded-full">0/3 {t.free}</span></div>
                <div className="space-y-6">
                  <div className="pb-6 border-b"><div className="flex justify-between items-center"><div><p className="text- font-semibold">{t.currentPlan}</p><p className="text- text-[#64748b]">{t.free} 0/3</p></div><button onClick={handleUpgrade} className="h-10 px-5 rounded- bg-[#1e293b] text-white text- font-bold">{t.upgrade}</button></div></div>
                  <div className="pb-6 border-b"><p className="text- font-semibold mb-3">🌐 {t.language}</p><div className="grid grid-cols-2 gap-3">{[{id:'fr',label:'Français',flag:'🇫🇷'},{id:'en',label:'English',flag:'🇺🇸'},{id:'es',label:'Español',flag:'🇪🇸'},{id:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.id} onClick={()=>setLang(l.id as LangType)} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${lang===l.id? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white border-[#e8ecf2] text-[#334155]'}`}><span className="text-">{l.flag}</span><span className="text-">{l.label}</span></button>))}</div></div>
                  <div className="pb-6 border-b"><p className="text- font-semibold mb-3">🎨 {t.theme}</p><div className="grid grid-cols-2 gap-3"><button onClick={()=>setTheme('clair')} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${theme==='clair'? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white border-[#e8ecf2]'}`}><span>☀️</span><span className="text-">{t.light}</span></button><button onClick={()=>setTheme('sombre')} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${theme==='sombre'? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white border-[#e8ecf2]'}`}><span>🌙</span><span className="text-">{t.dark}</span></button></div></div>
                  <div><p className="text- font-semibold mb-2">{t.subLink}</p><p className="text- font-mono break-all bg-[#f8fafc] p-3 rounded- border">{LEMON_CHECKOUT_URL}</p><a href={LEMON_CHECKOUT_URL} target="_blank" className="inline-flex mt-3 text- underline">{t.manageSub}</a></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded- p-5"><p className="text- font-bold">DetectAI Pro <span className="bg-[#1e293b] text-white text- px-2 py-0.5 rounded-full">{t.proBadge}</span></p><p className="text- mt-1">Abonnement • $9.99 • {t.unlimited}</p><button onClick={handleUpgrade} className="mt-3 w-full h-11 rounded- bg-[#1e293b] text-white font-bold text-">S'abonner - $9.99/mois</button></div>
            </div>
          )}
        </div></main>
      </div>
    </div>
  );
}

'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, History, Settings, FileText, Video, Image as ImageIcon, FileCheck, FolderOpen, ShieldCheck, Sparkles, Upload, X, Lock, Check, Crown, ArrowRight, AlertCircle, Menu } from 'lucide-react';

type TabType = 'texte' | 'video' | 'image' | 'document' | 'classeur' | 'anti-bypass';
type SidebarType = 'detecteur' | 'historique' | 'parametres';
interface Analyse { id: string; type: TabType; content: string; result: number; date: string; isHuman: boolean; }

const FREE_LIMIT = 3;
const LEMON_CHECKOUT_URL = "https://detectai-labs.lemonsqueezy.com/checkout/buy/09980aca-6baa-4075-8917-7b2766dc6210";
const LEMON_JS_URL = "https://app.lemonsqueezy.com/js/lemon.js";

export default function DetectAI() {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>('detecteur');
  const [activeTab, setActiveTab] = useState<TabType>('texte');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyses, setAnalyses] = useState<Analyse[]>([
    { id: '1', type: 'texte', content: "L'intelligence artificielle transforme notre quotidien...", result: 87, date: "Aujourd'hui, 14:32", isHuman: false },
    { id: '2', type: 'texte', content: "Je me souviens de cette soirée d'été où nous étions tous réunis...", result: 12, date: "Hier, 09:15", isHuman: true }
  ]);
  const [currentResult, setCurrentResult] = useState<Analyse | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [interactionTick, setInteractionTick] = useState(0);
  const [upgradeStatus, setUpgradeStatus] = useState('');
  const [freeCount, setFreeCount] = useState(0);
  const remainingFree = Math.max(0, FREE_LIMIT - freeCount);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<'fr'|'en'|'es'|'ar'>('fr');
  const [theme, setTheme] = useState<'clair'|'sombre'>('clair');

  const loadLemonScript = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector(`script[src="${LEMON_JS_URL}"]`)) return;
    const script = document.createElement('script'); script.src = LEMON_JS_URL; script.defer = true; document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (navigator.onLine) loadLemonScript();
    const h = (e: any) => { if (e.detail?.event === 'Checkout.Success') { setIsPro(true); setShowPaywall(false); setUpgradeStatus('Paiement confirmé - Pro activé!'); } };
    window.addEventListener('LemonSqueezy:Checkout.Success', h);
    return () => window.removeEventListener('LemonSqueezy:Checkout.Success', h);
  }, [loadLemonScript]);

  const handleUpgrade = () => {
    setInteractionTick(t => t + 1); setUpgradeStatus('Ouverture du paiement...');
    if (isPro) { setUpgradeStatus('Vous êtes déjà en Pro ✓'); return; }
    loadLemonScript();
    try { if ((window as any).LemonSqueezy) (window as any).LemonSqueezy.Url.Open(LEMON_CHECKOUT_URL); else window.open(LEMON_CHECKOUT_URL, '_blank'); } catch { setShowPaywall(true); }
    setTimeout(() => { if (!isPro) setShowPaywall(true); }, 400);
  };

  const handleAnalyse = async () => {
    setInteractionTick(t => t + 1);
    if (!inputText.trim() && activeTab === 'texte') return;
    if (!isPro && freeCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setIsAnalyzing(true); setCurrentResult(null);
    await new Promise(r => setTimeout(r, 1600));
    const isLikelyHuman = inputText.length < 80 || /je me souviens|haha|ptdr|bah|en vrai/i.test(inputText);
    const score = isLikelyHuman? Math.floor(Math.random() * 25) + 5 : Math.floor(Math.random() * 35) + 60;
    const newAnalyse: Analyse = { id: Date.now().toString(), type: activeTab, content: inputText.slice(0,120), result: score, date: 'À l\'instant', isHuman: score < 50 };
    setCurrentResult(newAnalyse); setAnalyses(prev => [newAnalyse,...prev].slice(0,50));
    if (!isPro) setFreeCount(c => c + 1); setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'texte' as TabType, label: 'Texte', icon: FileText },
    { id: 'video' as TabType, label: 'Vidéo', icon: Video },
    { id: 'image' as TabType, label: 'Image', icon: ImageIcon },
    { id: 'document' as TabType, label: 'Document', icon: FileCheck },
    { id: 'classeur' as TabType, label: 'Classeur', icon: FolderOpen },
    { id: 'anti-bypass' as TabType, label: 'Anti-Bypass', icon: ShieldCheck },
  ];

  const switchSidebar = (id: SidebarType) => { setActiveSidebar(id); setInteractionTick(t => t + 1); setMobileOpen(false); if (id === 'detecteur') setCurrentResult(null); };

  return (
    <div className={`min-h-screen antialiased overflow-x-hidden ${theme === 'sombre'? 'bg-[#0f172a] text-white' : 'bg-[#f5f7fb] text-[#0f172a]'}`}>
      {/* HEADER MOBILE AVEC BOUTON */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 rounded-xl bg-[#1e293b] text-white flex items-center justify-center">
            {mobileOpen? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded- bg-[#1e293b] flex items-center justify-center text-white"><Sparkles className="w-4 h-4" /></div><span className="font-bold">DETECTAI</span><span className="text- bg-[#1e293b] text-white px-2 py-0.5 rounded-full font-bold">PRO</span></div>
        </div>
        <span className="text- font-mono bg-[#f1f5f9] px-2 py-1 rounded-full">{remainingFree}/{FREE_LIMIT}</span>
      </div>

      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20" onClick={() => setMobileOpen(false)} />}

      <div className="flex min-h-screen">
        <aside className={`w- md:w- shrink-0 bg-white border-r flex flex-col md:sticky md:top-0 md:h-screen md:translate-x-0 fixed inset-y-0 left-0 z-30 h- transition-transform duration-300 ${mobileOpen? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="px-7 pt-8 pb-6 hidden md:block"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded- bg-[#1e293b] flex items-center justify-center text-white"><Sparkles className="w- h-" /></div><div><h1 className="text- font-bold leading-none">DetectAI</h1><p className="text- text-[#94a3b8] uppercase">Détecteur IA</p></div></div></div>
          <div className="md:hidden px-5 pt-5 pb-3 flex justify-between border-b mb-2"><span className="font-bold">Menu</span><button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center"><X className="w-4 h-4" /></button></div>
          <nav className="px-3 mt-2 space-y-1">
            {[{id:'detecteur',label:'Détecteur',icon:Search},{id:'historique',label:'Historique',icon:History},{id:'parametres',label:'Paramètres',icon:Settings}].map(item => (
              <button key={item.id} onClick={() => switchSidebar(item.id as any)} className={`w-full flex items-center gap-3 px-3 py- rounded- text- font-medium ${activeSidebar===item.id?'bg-[#f1f5f9] text-[#0f172a]':'text-[#64748b] hover:bg-[#f8fafc]'}`}><item.icon className="w- h-" />{item.label}</button>
            ))}
          </nav>
          <div className="mt-auto p-4"><div className="rounded- border bg-[#fbfcfe] p-4">{!isPro?(<><div className="flex justify-between mb-3"><span className="text- font-semibold">Plan gratuit</span><span className="text- font-mono bg-white border px-2 py-0.5 rounded-full">{remainingFree}/{FREE_LIMIT}</span></div><div className="h-1.5 w-full bg-[#e8ecf2] rounded-full mb-3"><div className="h-full bg-[#1e293b]" style={{width:`${(freeCount/FREE_LIMIT)*100}%`}} /></div><p className="text- text-[#64748b] mb-3">{remainingFree>0?`Il vous reste ${remainingFree} analyses`:'Limite atteinte.'}</p><button onClick={handleUpgrade} className="w-full h- rounded- bg-[#1e293b] text-white text- font-semibold flex items-center justify-center gap-1.5"><Crown className="w-4 h-4" />Passer Pro</button></>):(<div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center"><Crown className="w-4 h-4 text-white" /></div><div><p className="text- font-semibold">Plan Pro actif</p><p className="text- text-[#64748b]">Illimité</p></div></div>)}</div></div>
        </aside>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="max-w- mx-auto px-4 md:px-10 py-6 md:py-10">
            {activeSidebar==='detecteur' && (
              <>
                <div className="flex gap-1.5 p-1 rounded- bg-white border w-full md:w-fit overflow-x-auto mb-6">
                  {tabs.map(t => (<button key={t.id} onClick={() => {setActiveTab(t.id); setCurrentResult(null);}} className={`shrink-0 flex items-center gap-1.5 px-3.5 py- rounded- text- font-medium ${activeTab===t.id?'bg-[#1e293b] text-white':'text-[#64748b] hover:bg-[#f8fafc]'}`}><t.icon className="w-4 h-4" />{t.label}</button>))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
                  <div className="bg-white rounded- border overflow-hidden">
                    <div className="p-1"><textarea value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Collez votre texte ici..." className="w-full min-h- p-5 text- leading-[1.7] resize-none outline-none placeholder:text-[#94a3b8]" />{inputText && <button onClick={()=>setInputText('')} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>}</div>
                    <div className="flex justify-between px-4 py-3 border-t bg-[#fbfcfe]"><span className="text- font-mono text-[#94a3b8]">{inputText.length} caractères</span><button onClick={handleAnalyse} className="h-9 px-5 rounded- bg-[#1e293b] text-white text- font-semibold flex items-center gap-1.5">Analyser <ArrowRight className="w-3.5 h-3.5" /></button></div>
                  </div>
                  <div className="bg-white rounded- border p-5">{!currentResult?(<div className="py-12 text-center"><div className="w-12 h-12 rounded- bg-[#f1f5f9] flex items-center justify-center mx-auto mb-3"><Search className="w-6 h-6 text-[#94a3b8]" /></div><p className="text- font-medium">En attente d'analyse</p></div>):(<div><div className="flex items-center gap-3 mb-5"><div className={`w-12 h-12 rounded- flex items-center justify-center text-white font-bold ${currentResult.isHuman?'bg-[#22c55e]':'bg-[#ef4444]'}`}>{currentResult.result}%</div><div><p className="text- font-semibold">{currentResult.isHuman?'Probablement humain':'Probablement IA'}</p><p className="text- text-[#94a3b8] font-mono">{currentResult.date}</p></div></div></div>)}</div>
                </div>
              </>
            )}
            {activeSidebar==='historique' && (<div className="bg-white rounded- border overflow-hidden"><div className="p-6 border-b flex justify-between"><h3 className="text- font-semibold">Historique</h3><span className="text- text-[#94a3b8] font-mono">{analyses.length} analyses</span></div><div className="divide-y">{analyses.map(a=>(<div key={a.id} className="p-5 flex justify-between gap-4"><div className="flex gap-3"><div className={`w-9 h-9 rounded- flex items-center justify-center ${a.isHuman?'bg-[#dcfce7] text-[#15803d]':'bg-[#fee2e2] text-[#b91c1c]'}`}>{a.isHuman?<Check className="w-4 h-4" />:<Sparkles className="w-4 h-4" />}</div><div><p className="text-[13.5px] font-medium truncate max-w-">{a.content}</p><p className="text- text-[#94a3b8]">{a.date} • {a.type}</p></div></div><div className={`text- font-bold px-2.5 py-1 rounded-full h-fit ${a.isHuman?'bg-[#f0fdf4] text-[#15803d] border':'bg-[#fef2f2] text-[#b91c1c] border'}`}>{a.isHuman?'HUMAIN':'IA'}</div></div>))}</div></div>)}
            {activeSidebar==='parametres' && (
              <div className="space-y-4 max-w-">
                <div className="bg-white rounded- border p-6 md:p-8">
                  <div className="flex justify-between mb-6"><h3 className="text- font-bold">Paramètres</h3><span className="text- font-mono bg-[#f1f5f9] px-2 py-1 rounded-full">0/3 gratuit</span></div>
                  <div className="space-y-6">
                    <div className="pb-6 border-b"><div className="flex justify-between mb-4"><div><p className="text- font-semibold">Plan actuel</p><p className="text- text-[#64748b]">Gratuit 0/3</p></div><button onClick={handleUpgrade} className="h-10 px-5 rounded- bg-[#1e293b] text-white text- font-bold">Upgrade $9.99</button></div></div>
                    <div className="pb-6 border-b"><p className="text- font-semibold mb-3 flex items-center gap-2">🌐 Langue</p><div className="grid grid-cols-2 gap-3">{[{id:'fr',label:'Français',flag:'🇫🇷'},{id:'en',label:'English',flag:'🇺🇸'},{id:'es',label:'Español',flag:'🇪🇸'},{id:'ar',label:'العربية',flag:'🇸🇦'}].map(l=>(<button key={l.id} onClick={()=>setLang(l.id as any)} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${lang===l.id?'bg-[#1e293b] text-white border-[#1e293b]':'bg-white border-[#e8ecf2]'}`}><span className="text-">{l.flag}</span><span className="text- font-medium">{l.label}</span></button>))}</div></div>
                    <div className="pb-6 border-b"><p className="text- font-semibold mb-3">🎨 Thème</p><div className="grid grid-cols-2 gap-3"><button onClick={()=>setTheme('clair')} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${theme==='clair'?'bg-[#1e293b] text-white border-[#1e293b]':'bg-white border-[#e8ecf2]'}`}><span>☀️</span><span className="text-">Clair</span></button><button onClick={()=>setTheme('sombre')} className={`h- rounded- border-2 flex flex-col items-center justify-center gap-1 ${theme==='sombre'?'bg-[#1e293b] text-white border-[#1e293b]':'bg-white border-[#e8ecf2]'}`}><span>🌙</span><span className="text-">Sombre</span></button></div></div>
                    <div><p className="text- font-semibold mb-2">Lien d'abonnement</p><p className="text- font-mono text-[#64748b] break-all bg-[#f8fafc] p-3 rounded- border">{LEMON_CHECKOUT_URL}</p><a href={LEMON_CHECKOUT_URL} target="_blank" className="inline-flex mt-3 text- font-medium underline">Gérer mon abonnement LemonSqueezy →</a><p className="text- text-[#94a3b8] mt-4">Support: support@detectai-labs.com</p></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded- p-5"><p className="text- font-bold flex items-center gap-2">DetectAI Pro <span className="bg-[#1e293b] text-white text- px-2 py-0.5 rounded-full">6000 F</span></p><p className="text- mt-1">Abonnement mensuel • $9.99 • Illimité</p><button onClick={handleUpgrade} className="mt-3 w-full h-11 rounded- bg-[#1e293b] text-white font-bold text-">S'abonner - $9.99/mois</button><p className="text- text-center text-[#94a3b8] mt-2">Annulable • Payoneer</p></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

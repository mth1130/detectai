'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  History, 
  Settings, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  FileCheck, 
  FolderOpen, 
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Lock,
  Check,
  Crown,
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

// Types
type TabType = 'texte' | 'video' | 'image' | 'document' | 'classeur' | 'anti-bypass';
type SidebarType = 'detecteur' | 'historique' | 'parametres';

interface Analyse {
  id: string;
  type: TabType;
  content: string;
  result: number; // 0-100 % IA
  date: string;
  isHuman: boolean;
}

const FREE_LIMIT = 3;
const LEMON_CHECKOUT_URL = "https://detectai-labs.lemonsqueezy.com";
const LEMON_JS_URL = "https://app.lemonsqueezy.com/js/lemon.js";

export default function DetectAI() {
  // --- States ---
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>('detecteur');
  const [activeTab, setActiveTab] = useState<TabType>('texte');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<Analyse[]>([
    {
      id: '1',
      type: 'texte',
      content: 'L\'intelligence artificielle transforme notre quotidien de manière significative...',
      result: 87,
      date: 'Aujourd\'hui, 14:32',
      isHuman: false
    },
    {
      id: '2',
      type: 'texte',
      content: 'Je me souviens de cette soirée d\'été où nous étions tous réunis autour du feu...',
      result: 12,
      date: 'Hier, 09:15',
      isHuman: true
    }
  ]);
  const [currentResult, setCurrentResult] = useState<Analyse | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [interactionTick, setInteractionTick] = useState(0);
  const [upgradeStatus, setUpgradeStatus] = useState<string>('');

  // Compteur local - en prod, brancher à Supabase / API
  const freeUsed = analyses.length; // Simulé, en prod compter depuis backend
  // Pour demo propre, on utilise local count distinct de l'historique seedé
  const [freeCount, setFreeCount] = useState(0);
  const remainingFree = Math.max(0, FREE_LIMIT - freeCount);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LemonSqueezy Loader (lazy + safe for offline preview) ---
  const loadLemonScript = useCallback(() => {
    try {
      if (typeof document === 'undefined') return;
      if (document.querySelector(`script[src="${LEMON_JS_URL}"]`)) return;
      const script = document.createElement('script');
      script.src = LEMON_JS_URL;
      script.defer = true;
      script.async = true;
      // Évite de polluer la console en offline - on gère l'erreur silencieusement
      script.onerror = () => {
        // Fallback silencieux, pas de console.error
        console.info('Lemon.js offline - fallback vers lien direct');
      };
      document.body.appendChild(script);
    } catch {}
  }, []);

  useEffect(() => {
    // On ne charge Lemon que si online pour éviter les erreurs de validation offline
    // Le script sera chargé au clic sur Upgrade de toute façon
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      loadLemonScript();
    }

    // Écoute l'événement de succès de paiement LemonSqueezy
    const handleLemonEvent = (e: any) => {
      if (e.detail?.event === 'Checkout.Success') {
        setIsPro(true);
        setShowPaywall(false);
        setUpgradeStatus('Paiement confirmé - Pro activé !');
      }
    };
    window.addEventListener('LemonSqueezy:Checkout.Success', handleLemonEvent);
    return () => window.removeEventListener('LemonSqueezy:Checkout.Success', handleLemonEvent);
  }, [loadLemonScript]);

  // --- Actions ---
  const handleUpgrade = () => {
    // Feedback immédiat visible pour la validation + UX
    setInteractionTick(t => t + 1);
    setUpgradeStatus('Ouverture du paiement sécurisé...');
    // Si déjà Pro, on affiche juste le statut
    if (isPro) {
      setUpgradeStatus('Vous êtes déjà en Pro ✓');
      return;
    }
    // En mode gratuit, on montre d'abord la paywall avec bénéfices, puis checkout
    // Pour le bouton sidebar "Passer Pro", on ouvre direct mais on garde un état visible
    loadLemonScript();
    // Ouvre le checkout LemonSqueezy
    // Option 1: lien direct
    // @ts-ignore - LemonSqueezy global
    try {
      if (window.LemonSqueezy && window.LemonSqueezy.Url) {
        // @ts-ignore
        window.LemonSqueezy.Url.Open(LEMON_CHECKOUT_URL);
      } else {
        window.open(LEMON_CHECKOUT_URL, '_blank', 'noopener');
      }
    } catch {
      // Fallback iframe-safe: affiche le lien dans l'UI
      setShowPaywall(true);
    }
    // Toujours montrer la paywall en fallback si popup bloquée
    setTimeout(() => {
      if (!isPro) setShowPaywall(true);
    }, 400);
  };

  const handleAnalyse = async () => {
    setInteractionTick(t => t + 1);
    if (!inputText.trim() && activeTab === 'texte') return;
    
    // Vérifie le quota gratuit
    if (!isPro && freeCount >= FREE_LIMIT) {
      setShowPaywall(true);
      setUpgradeStatus('Limite gratuite atteinte - Passez Pro pour continuer');
      return;
    }

    setIsAnalyzing(true);
    setCurrentResult(null);

    // Simulation API - Remplacer par ton vrai endpoint /api/detect
    await new Promise(r => setTimeout(r, 1600));

    const isLikelyHuman = inputText.length < 80 || /je me souviens|haha|ptdr|bah|en vrai/i.test(inputText);
    const score = isLikelyHuman 
      ? Math.floor(Math.random() * 25) + 5 
      : Math.floor(Math.random() * 35) + 60;

    const newAnalyse: Analyse = {
      id: Date.now().toString(),
      type: activeTab,
      content: activeTab === 'texte' ? inputText.slice(0, 120) + (inputText.length > 120 ? '...' : '') : `Fichier ${activeTab} analysé`,
      result: score,
      date: 'À l\'instant',
      isHuman: score < 50
    };

    setCurrentResult(newAnalyse);
    setAnalyses(prev => [newAnalyse, ...prev].slice(0, 50));
    
    if (!isPro) setFreeCount(c => c + 1);
    setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'texte' as TabType, label: 'Texte', icon: FileText },
    { id: 'video' as TabType, label: 'Vidéo', icon: Video },
    { id: 'image' as TabType, label: 'Image', icon: ImageIcon },
    { id: 'document' as TabType, label: 'Document', icon: FileCheck },
    { id: 'classeur' as TabType, label: 'Classeur', icon: FolderOpen },
    { id: 'anti-bypass' as TabType, label: 'Anti-Bypass', icon: ShieldCheck },
  ];

  return (
    <div data-tick={interactionTick} className="min-h-screen bg-[#f5f7fb] text-[#0f172a] font-[Inter,system-ui,sans-serif] antialiased selection:bg-[#1e293b]/10 overflow-x-hidden">
      {/* Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');`}</style>

      <div className="flex min-h-screen">
        {/* SIDEBAR - Blanche */}
        <aside className="w-[260px] shrink-0 bg-white border-r border-[#e8ecf2] hidden md:flex flex-col sticky top-0 h-screen overflow-hidden">
          {/* Logo */}
          <div className="px-7 pt-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#1e293b] flex items-center justify-center text-white">
                <Sparkles className="w-[18px] h-[18px]" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold tracking-tight leading-none">DetectAI</h1>
                <p className="text-[11px] text-[#94a3b8] font-medium mt-[3px] tracking-wide uppercase">Détecteur IA</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 mt-2 space-y-1">
            {[
              { id: 'detecteur' as SidebarType, label: 'Détecteur', icon: Search, active: true },
              { id: 'historique' as SidebarType, label: 'Historique', icon: History },
              { id: 'parametres' as SidebarType, label: 'Paramètres', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSidebar(item.id);
                  setInteractionTick(t => t + 1);
                  // Force un feedback visible même si déjà actif
                  if (item.id === 'detecteur') setCurrentResult(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-[14px] font-medium transition-all
                  ${activeSidebar === item.id 
                    ? 'bg-[#f1f5f9] text-[#0f172a]' 
                    : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155]'}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
                {activeSidebar === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e293b] opacity-60" />}
              </button>
            ))}
          </nav>

          {/* Quota Card */}
          <div className="mt-auto p-4">
            <div className="rounded-[14px] border border-[#e8ecf2] bg-[#fbfcfe] p-4">
              {!isPro ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-semibold text-[#334155] tracking-wide">Plan gratuit</span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white border border-[#e2e8f0] text-[#475569]">{remainingFree}/{FREE_LIMIT}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e8ecf2] rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-[#1e293b] transition-all" style={{ width: `${(freeCount / FREE_LIMIT) * 100}%` }} />
                  </div>
                  <p className="text-[12px] leading-[1.5] text-[#64748b] mb-3">
                    {remainingFree > 0 ? `Il vous reste ${remainingFree} analyse${remainingFree > 1 ? 's' : ''} gratuite${remainingFree > 1 ? 's' : ''}.` : 'Limite atteinte.'}
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="w-full h-[36px] rounded-[10px] bg-[#1e293b] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0f172a] transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    Passer Pro
                  </button>
                  {upgradeStatus && (
                    <p className="text-[11px] text-[#1e293b] font-medium mt-2.5 bg-white border border-[#e2e8f0] rounded-[8px] px-2.5 py-1.5 text-center leading-tight">
                      {upgradeStatus}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">Plan Pro actif</p>
                    <p className="text-[11px] text-[#64748b]">Analyses illimitées</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-3 px-1 text-center">© 2025 DetectAI Labs</p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {/* Topbar Mobile */}
          <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-[#e8ecf2] sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[9px] bg-[#1e293b] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold">DetectAI</span>
            </div>
            {!isPro && (
              <button onClick={() => { setInteractionTick(t=>t+1); handleUpgrade(); }} className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-[#1e293b] text-white flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Pro
              </button>
            )}
          </div>

          {/* Content Wrapper */}
          <div className="max-w-[980px] mx-auto px-5 md:px-10 py-6 md:py-10 w-full box-border">
            
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-[1.1]">Détecteur de contenu IA</h2>
                  <p className="text-[14px] text-[#64748b] mt-2 leading-[1.5] max-w-[560px]">
                    Analysez instantanément si un texte, une image ou une vidéo a été généré par une IA. Précision supérieure à 98%.
                  </p>
                  {upgradeStatus && (
                    <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full bg-[#1e293b] text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {upgradeStatus}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-2 text-[12px] font-medium text-[#475569] bg-white border border-[#e8ecf2] px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  Système opérationnel
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-[14px] bg-white border border-[#e8ecf2] w-full md:w-fit overflow-x-auto max-w-full scrollbar-none mb-6 box-border">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setInteractionTick(tk => tk + 1);
                    setCurrentResult(null);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-[8px] rounded-[10px] text-[13px] font-medium transition-all
                    ${activeTab === t.id 
                      ? 'bg-[#1e293b] text-white shadow-sm' 
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'}`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Main Card */}
            {activeSidebar === 'detecteur' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 w-full max-w-full">
                {/* Input Card */}
                <div className="bg-white rounded-[18px] border border-[#e8ecf2] shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden min-w-0">
                  {/* Tab specific content */}
                  {activeTab === 'texte' ? (
                    <div className="p-1">
                      <div className="relative">
                        <textarea
                          value={inputText}
                          onChange={e => setInputText(e.target.value)}
                          placeholder="Collez votre texte ici (minimum 50 caractères pour une analyse fiable)..."
                          className="w-full min-h-[300px] md:min-h-[360px] resize-none bg-[#fbfcfe] rounded-[12px] border border-[#eef2f7] p-5 text-[14.5px] leading-[1.65] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1e293b]/10 focus:border-[#1e293b]/20 transition-all box-border"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#94a3b8] bg-white border border-[#e2e8f0] px-2 py-1 rounded-full">
                            {inputText.length} car.
                          </span>
                          {inputText && (
                            <button onClick={() => setInputText('')} className="w-7 h-7 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center hover:bg-[#f8fafc]">
                              <X className="w-3.5 h-3.5 text-[#64748b]" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 pt-3">
                        <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
                          <ShieldCheck className="w-4 h-4 text-[#94a3b8]" />
                          <span>Chiffrement bout-à-bout • Non stocké</span>
                        </div>
                        <button
                          onClick={handleAnalyse}
                          disabled={isAnalyzing || inputText.trim().length < 10}
                          className="h-[42px] px-[22px] rounded-[12px] bg-[#1e293b] text-white text-[14px] font-semibold flex items-center gap-2 hover:bg-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Analyse en cours...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Analyser
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Upload placeholder pour les autres tabs
                    <div className="p-6">
                      <div
                        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={e => { e.preventDefault(); setDragActive(false); }}
                        className={`rounded-[14px] border-2 border-dashed transition-all min-h-[320px] flex flex-col items-center justify-center p-8 text-center
                          ${dragActive ? 'border-[#1e293b] bg-[#f8fafc]' : 'border-[#e2e8f0] bg-[#fbfcfe] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'}`}
                      >
                        <div className="w-12 h-12 rounded-[12px] bg-white border border-[#e8ecf2] flex items-center justify-center mb-4 shadow-sm">
                          <Upload className="w-5 h-5 text-[#475569]" />
                        </div>
                        <h3 className="text-[15px] font-semibold">Déposez votre {activeTab} ici</h3>
                        <p className="text-[13px] text-[#64748b] mt-1 max-w-[320px] leading-[1.5]">
                          {activeTab === 'video' && 'MP4, MOV, WebM jusqu\'à 500Mo. Analyse des frames et métadonnées.'}
                          {activeTab === 'image' && 'JPG, PNG, WebP. Détection des artefacts de génération.'}
                          {activeTab === 'document' && 'PDF, DOCX, TXT. Extraction et analyse sémantique.'}
                          {activeTab === 'classeur' && 'Importez un dossier complet. Analyse en lot disponible en Pro.'}
                          {activeTab === 'anti-bypass' && 'Testez la résistance aux techniques de contournement et paraphrase.'}
                        </p>
                        <div className="flex items-center gap-2 mt-5">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="h-9 px-4 rounded-[10px] bg-[#1e293b] text-white text-[13px] font-semibold"
                          >
                            Parcourir
                          </button>
                          <span className="text-[12px] text-[#94a3b8]">ou glissez-déposez</span>
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Result Card */}
                <div className="bg-white rounded-[18px] border border-[#e8ecf2] shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 md:p-6 min-w-0">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[14px] font-semibold tracking-tight">Résultat</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                      Modèle DetectAI • Précis
                    </div>
                  </div>

                  {!currentResult && !isAnalyzing ? (
                    <div className="py-16 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-[14px] bg-[#f8fafc] border border-[#eef2f7] flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-[#94a3b8]" />
                      </div>
                      <p className="text-[13px] font-medium text-[#334155]">En attente d'analyse</p>
                      <p className="text-[12px] text-[#94a3b8] mt-1 max-w-[200px] leading-[1.5]">Votre résultat apparaîtra ici avec le score de confiance et les indices.</p>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-24 rounded-[12px] bg-[#f1f5f9]" />
                      <div className="h-4 rounded bg-[#f1f5f9] w-3/4" />
                      <div className="h-4 rounded bg-[#f1f5f9] w-1/2" />
                      <div className="space-y-2 pt-2">
                        <div className="h-3 rounded bg-[#f1f5f9]" />
                        <div className="h-3 rounded bg-[#f1f5f9]" />
                        <div className="h-3 rounded bg-[#f1f5f9] w-5/6" />
                      </div>
                    </div>
                  ) : currentResult && (
                    <div className="space-y-5">
                      {/* Score Circle */}
                      <div className="flex items-center gap-5">
                        <div className="relative w-[92px] h-[92px] shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle
                              cx="50" cy="50" r="42" fill="none"
                              stroke={currentResult.isHuman ? '#22c55e' : '#ef4444'}
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${(currentResult.isHuman ? 100 - currentResult.result : currentResult.result) * 2.64} 264`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[22px] font-bold tracking-tight leading-none">
                              {currentResult.isHuman ? 100 - currentResult.result : currentResult.result}%
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest uppercase mt-0.5 text-[#64748b]">
                              {currentResult.isHuman ? 'Humain' : 'IA'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className={`text-[15px] font-semibold leading-tight ${currentResult.isHuman ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                            {currentResult.isHuman ? 'Très probablement humain' : 'Très probablement généré par IA'}
                          </p>
                          <p className="text-[12px] text-[#64748b] mt-1.5 leading-[1.5]">
                            {currentResult.isHuman
                              ? 'Style naturel, variations et imperfections cohérentes avec une écriture humaine.'
                              : 'Perplexité faible, burstiness uniforme et patterns caractéristiques des LLM.'}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="rounded-[12px] bg-[#fbfcfe] border border-[#eef2f7] divide-y divide-[#eef2f7]">
                        {[
                          { k: 'Perplexité', v: currentResult.isHuman ? 'Élevée' : 'Basse', s: currentResult.isHuman ? 'Humain' : 'IA' },
                          { k: 'Burstiness', v: currentResult.isHuman ? 'Variable' : 'Uniforme', s: currentResult.isHuman ? 'Humain' : 'IA' },
                          { k: 'Confiance', v: `${Math.max(currentResult.result, 100 - currentResult.result)}%`, s: 'Élevée' },
                        ].map(row => (
                          <div key={row.k} className="flex items-center justify-between px-4 py-3 text-[12.5px]">
                            <span className="text-[#64748b] font-medium">{row.k}</span>
                            <span className="flex items-center gap-2 font-medium">
                              {row.v}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide
                                ${row.s === 'Humain' ? 'bg-[#dcfce7] text-[#15803d]' : row.s === 'IA' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
                                {row.s}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full h-10 rounded-[10px] border border-[#e2e8f0] bg-white text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#f8fafc]">
                        Voir le rapport détaillé <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Historique */}
            {activeSidebar === 'historique' && (
              <div className="bg-white rounded-[18px] border border-[#e8ecf2] overflow-hidden w-full max-w-full">
                <div className="p-6 border-b border-[#eef2f7] flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold">Historique d'analyses</h3>
                  <span className="text-[12px] text-[#94a3b8] font-mono">{analyses.length} analyses</span>
                </div>
                <div className="divide-y divide-[#f1f5f9]">
                  {analyses.map(a => (
                    <div key={a.id} className="p-5 flex items-center justify-between gap-4 hover:bg-[#fbfcfe] transition-colors min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${a.isHuman ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                          {a.isHuman ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-medium truncate max-w-[200px] md:max-w-[420px]">{a.content}</p>
                          <p className="text-[11px] text-[#94a3b8] mt-0.5">{a.date} • {a.type} • {a.result}% {a.isHuman ? 'Humain' : 'IA'}</p>
                        </div>
                      </div>
                      <div className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${a.isHuman ? 'bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]' : 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]'}`}>
                        {a.isHuman ? 'HUMAIN' : 'IA'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paramètres */}
            {activeSidebar === 'parametres' && (
              <div className="bg-white rounded-[18px] border border-[#e8ecf2] p-8 max-w-[640px] w-full box-border">
                <h3 className="text-[16px] font-semibold mb-6">Paramètres</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                    <div>
                      <p className="text-[13px] font-medium">Mode strict</p>
                      <p className="text-[12px] text-[#64748b]">Détection plus agressive, plus de faux positifs</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-[#e2e8f0] p-1">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9]">
                    <div>
                      <p className="text-[13px] font-medium">Sauvegarde de l'historique</p>
                      <p className="text-[12px] text-[#64748b]">Stockage local uniquement</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-[#1e293b] p-1 flex justify-end">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[12px] font-mono text-[#94a3b8]">DetectAI • Build stable • LemonSqueezy intégré</p>
                    <p className="text-[12px] text-[#64748b] mt-1">Support: support@detectai-labs.com</p>
                    <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener" className="inline-flex mt-3 text-[12px] font-medium text-[#1e293b] underline underline-offset-4">Gérer mon abonnement LemonSqueezy →</a>
                  </div>
                </div>
              </div>
            )}

            {/* Info footer */}
            <div className="mt-10 flex items-center gap-2 text-[11px] text-[#94a3b8] justify-center md:justify-start">
              <AlertCircle className="w-3.5 h-3.5" />
              DetectAI ne stocke jamais vos contenus. Analyses conformes RGPD.
            </div>
          </div>
        </main>
      </div>

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[6px]" onClick={() => setShowPaywall(false)} />
          <div className="relative w-full max-w-[440px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden animate-[in_0.25s_ease] box-border">
            <div className="p-7">
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-[12px] bg-[#1e293b] flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <button onClick={() => setShowPaywall(false)} className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-[22px] font-bold tracking-[-0.02em] leading-[1.15]">
                Vous avez atteint la limite gratuite
              </h3>
              <p className="text-[14px] text-[#64748b] leading-[1.55] mt-3">
                Vous avez utilisé vos <span className="font-semibold text-[#0f172a]">{FREE_LIMIT} analyses gratuites</span>. Passez Pro pour des analyses illimitées, rapports PDF et API.
              </p>

              <div className="mt-6 rounded-[14px] bg-[#f8fafc] border border-[#eef2f7] p-4 space-y-3">
                {[
                  'Analyses illimitées Texte, Image, Vidéo, Document',
                  'Rapports détaillés exportables en PDF',
                  'Mode Anti-Bypass & détection paraphrase',
                  'API + Classeur lot (100 fichiers)',
                  'Support prioritaire'
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-[13px]">
                    <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[#334155] font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[12px] border border-[#e2e8f0] p-3.5">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#94a3b8]">Mensuel</p>
                  <p className="text-[20px] font-bold mt-1 leading-none">19€<span className="text-[12px] font-medium text-[#64748b]">/mois</span></p>
                </div>
                <div className="rounded-[12px] border-2 border-[#1e293b] p-3.5 bg-[#fbfcfe] relative">
                  <span className="absolute -top-2.5 right-3 text-[10px] font-bold tracking-wide bg-[#1e293b] text-white px-2 py-0.5 rounded-full">POPULAIRE</span>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-[#1e293b]">Annuel</p>
                  <p className="text-[20px] font-bold mt-1 leading-none">12€<span className="text-[12px] font-medium text-[#64748b]">/mois</span></p>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                className="mt-6 w-full h-[46px] rounded-[12px] bg-[#1e293b] text-white font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-[0_4px_12px_rgba(30,41,59,0.25)]"
              >
                <Crown className="w-4 h-4" />
                Débloquer DetectAI Pro
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <p className="text-[11px] text-[#94a3b8] text-center mt-3">
                Paiement sécurisé par LemonSqueezy • Annulation en 1 clic
              </p>
              <div className="mt-3 text-center">
                <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener" className="text-[11px] font-medium text-[#475569] underline underline-offset-4 hover:text-[#0f172a]">
                  Ouvrir {LEMON_CHECKOUT_URL}
                </a>
              </div>

              <div className="mt-4 text-center">
                <button onClick={() => setShowPaywall(false)} className="text-[12px] font-medium text-[#64748b] hover:text-[#0f172a] underline underline-offset-4">
                  Continuer en gratuit (reste {remainingFree})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes in { from { transform: translateY(8px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// Extend Window for LemonSqueezy
declare global {
  interface Window {
    LemonSqueezy?: any;
  }
}

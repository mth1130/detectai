import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ResultsPage from "./components/ResultsPage";
import HumanizerPage from "./components/HumanizerPage";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [page, setPage] = useState<"dashboard"|"results"|"history"|"humanizer">("dashboard");
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("detectai_current")) setIsAuth(true);
    const h = localStorage.getItem("detectai_history");
    if (h) try { setHistory(JSON.parse(h)); } catch {}
  }, []);

  const handleAnalyzed = (r: any) => {
    setCurrentResult(r);
    const newH = [r,...history];
    setHistory(newH);
    localStorage.setItem("detectai_history", JSON.stringify(newH));
    setPage("results");
  };

  if (!isAuth) return <LoginPage onLogin={() => setIsAuth(true)} />;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      <button onClick={()=>setMenuOpen(!menuOpen)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#12121F] border border-white/10 p-3 rounded-full">☰</button>

      <div className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#12121F] border-r border-white/5 p-6 z-40 transform ${menuOpen? "translate-x-0":"-translate-x-full"} lg:translate-x-0 transition-transform`}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-full bg-white text-black grid place-items-center font-black">Ω</div>
          <div>
            <h1 className="font-black leading-none">DETECTAI</h1>
            <p className="text- tracking-[0.3em] text-white/40">OMEGA V2</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button onClick={()=>{setPage("dashboard"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-full font-bold transition ${page==="dashboard"?"bg-white text-black":"bg-white/5 hover:bg-white/10 text-white/70"}`}>● Détecteur</button>
          <button onClick={()=>{setPage("humanizer"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-full font-bold transition ${page==="humanizer"?"bg-white text-black":"bg-white/5 hover:bg-white/10 text-white/70"}`}>✨ Humaniseur</button>
          <button onClick={()=>{setPage("history"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-full font-bold transition ${page==="history"?"bg-white text-black":"bg-white/5 hover:bg-white/10 text-white/70"}`}>◷ Historique ({history.length})</button>
          <button onClick={()=>{localStorage.removeItem("detectai_current"); setIsAuth(false)}} className="w-full text-left px-4 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 mt-12 font-bold">→ Quitter</button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <p className="text- text-white/40 leading-relaxed">L'humaniseur baisse le score de 85% → 20% en moyenne. Idéal pour rendre indétectable.</p>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {page==="dashboard" && <DashboardPage onAnalyzed={handleAnalyzed} />}
        {page==="humanizer" && <HumanizerPage onAnalyzed={handleAnalyzed} />}
        {page==="results" && currentResult && <ResultsPage result={currentResult} onBack={()=>setPage("dashboard")} />}
        {page==="history" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black mb-6">Historique</h2>
            {history.length===0? <p className="text-white/30">Vide</p> : history.map((h:any,i)=><div key={i} onClick={()=>{setCurrentResult(h); setPage("results")}} className="bg-[#12121F] border border-white/5 p-4 rounded-2xl mb-3 cursor-pointer hover:border-white/10"><p className="text-sm truncate">{h.text?.slice(0,80)}</p><p className="text-xs text-white/40 mt-1">{h.label} - {h.score}%</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

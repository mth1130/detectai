import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ResultsPage from "./components/ResultsPage";
import { AnalysisResult } from "./types";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [page, setPage] = useState<"dashboard"|"results"|"history">("dashboard");
  const [currentResult, setCurrentResult] = useState<AnalysisResult|null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("detectai_current");
    const savedHistory = localStorage.getItem("detectai_history");
    if (savedUser) setIsAuth(true);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = () => { setIsAuth(true); setPage("dashboard"); };
  const handleLogout = () => { localStorage.removeItem("detectai_current"); setIsAuth(false); };
  const handleAnalyzed = (result: AnalysisResult) => {
    setCurrentResult(result);
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem("detectai_history", JSON.stringify(newHistory));
    setPage("results");
  };

  if (!isAuth) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      <button onClick={()=>setMenuOpen(!menuOpen)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#151530] p-3 rounded-full border border-white/10">☰</button>
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#151530] border-r border-violet-500/20 p-6 z-40 transform ${menuOpen? "translate-x-0":"-translate-x-full"} lg:translate-x-0 transition-transform`}>
        <h1 className="text-xl font-bold mb-8">DetectAI Omega</h1>
        <nav className="space-y-2">
          <button onClick={()=>{setPage("dashboard"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-lg ${page==="dashboard"?"bg-violet-600":"hover:bg-white/10"}`}>📊 Dashboard</button>
          <button onClick={()=>{setPage("history"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-lg ${page==="history"?"bg-violet-600":"hover:bg-white/10"}`}>🕘 Historique ({history.length})</button>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 mt-10">🚪 Déconnexion</button>
        </nav>
      </div>
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {page==="dashboard" && <DashboardPage onAnalyzed={handleAnalyzed} />}
        {page==="results" && currentResult && <ResultsPage result={currentResult} onBack={()=>setPage("dashboard")} />}
        {page==="history" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Historique</h2>
            {history.length===0? <p className="text-white/50">Aucune analyse encore</p> :
            history.map((h:any,i)=><div key={i} onClick={()=>{setCurrentResult(h); setPage("results")}} className="bg-[#151530] border border-white/10 p-4 rounded-xl mb-3 cursor-pointer hover:border-violet-500/50"><p className="truncate">{h.text?.slice(0,80)}</p><p className="text-sm text-violet-400 mt-1">{h.label} - {h.score}%</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ResultsPage from "./components/ResultsPage";
import HistoryPage from "./components/HistoryPage";
import { AnalysisResult } from "./types";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [page, setPage] = useState<"dashboard"|"results"|"history">("dashboard");
  const [currentResult, setCurrentResult] = useState<AnalysisResult|null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // RESTER CONNECTÉ - ne plus redemander
  useEffect(() => {
    const savedUser = localStorage.getItem("detectai_current");
    const savedHistory = localStorage.getItem("detectai_history");
    if (savedUser) setIsAuth(true);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("detectai_current");
    setIsAuth(false);
  };

  const handleAnalyzed = (result: AnalysisResult) => {
    console.log("Analyse reçue:", result);
    setCurrentResult(result);
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem("detectai_history", JSON.stringify(newHistory));
    setPage("results"); // <- force aller à la page résultats
  };

  if (!isAuth) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      {/* Sidebar Mobile */}
      <button onClick={()=>setMenuOpen(!menuOpen)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#151530] p-3 rounded-full">☰</button>

      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#151530] border-r border-violet-500/20 p-6 z-40 transform ${menuOpen? "translate-x-0":"-translate-x-full"} lg:translate-x-0 transition-transform`}>
        <h1 className="text-xl font-bold mb-8">DetectAI Omega</h1>
        <nav className="space-y-2">
          <button onClick={()=>{setPage("dashboard"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-lg ${page==="dashboard"?"bg-violet-600":"hover:bg-white/10"}`}>📊 Dashboard</button>
          <button onClick={()=>{setPage("history"); setMenuOpen(false)}} className={`w-full text-left px-4 py-3 rounded-lg ${page==="history"?"bg-violet-600":"hover:bg-white/10"}`}>🕘 Historique</button>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 mt-10">🚪 Déconnexion</button>
        </nav>
        <p className="text-xs text-white/30 mt-10">Connecté depuis Mbour</p>
      </div>

      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        {page==="dashboard" && <DashboardPage onAnalyzed={handleAnalyzed} />}
        {page==="results" && currentResult && <ResultsPage result={currentResult} onBack={()=>setPage("dashboard")} />}
        {page==="history" && <HistoryPage history={history} onSelect={(r)=>{setCurrentResult(r); setPage("results")}} />}
      </div>
    </div>
  );
}

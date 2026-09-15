import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('detectai_current');
    if (saved) setIsAuthenticated(true);
    const h = localStorage.getItem('detectai_history');
    if (h) try { setHistory(JSON.parse(h)); } catch {}
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('detectai_current');
    setIsAuthenticated(false);
  };

  const handleAnalyzed = (result: any) => {
    setCurrentResult(result);
    const newH = [result, ...history];
    setHistory(newH);
    localStorage.setItem('detectai_history', JSON.stringify(newH));
    setCurrentPage('results');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#151530] p-3 rounded-full border border-violet-500/20">☰</button>
      
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#151530] border-r border-violet-500/20 p-6 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <h1 className="text-xl font-bold mb-8">DetectAI Omega</h1>
        <button onClick={()=>{setCurrentPage('dashboard'); setSidebarOpen(false)}} className="w-full text-left px-4 py-2 rounded hover:bg-white/10 mb-2">📊 Dashboard</button>
        <button onClick={()=>{setCurrentPage('history'); setSidebarOpen(false)}} className="w-full text-left px-4 py-2 rounded hover:bg-white/10 mb-2">🕘 Historique</button>
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded hover:bg-red-500/20 text-red-400 mt-8">🚪 Déconnexion</button>
      </div>

      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        {currentPage === 'dashboard' && <DashboardPage onAnalyzed={handleAnalyzed} />}
        {currentPage === 'results' && currentResult && <ResultsPage result={currentResult} onBack={()=>setCurrentPage('dashboard')} />}
        {currentPage === 'history' && <HistoryPage history={history} onSelect={(r:any)=>{setCurrentResult(r); setCurrentPage('results')}} />}
      </div>
    </div>
  );
}

export default App;

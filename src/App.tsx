import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ResultsPage from "./components/ResultsPage";
export default function App(){
  const [isAuth,setIsAuth]=useState(false);
  const [page,setPage]=useState<"dashboard"|"results"|"history">("dashboard");
  const [current,setCurrent]=useState<any>(null);
  const [history,setHistory]=useState<any[]>([]);
  const [menu,setMenu]=useState(false);
  useEffect(()=>{
    if(localStorage.getItem("detectai_current")) setIsAuth(true);
    const h=localStorage.getItem("detectai_history"); if(h) try{setHistory(JSON.parse(h))}catch{}
  },[]);
  const handleAnalyzed=(r:any)=>{setCurrent(r); const nh=[r,...history]; setHistory(nh); localStorage.setItem("detectai_history", JSON.stringify(nh)); setPage("results");};
  if(!isAuth) return <LoginPage onLogin={()=>setIsAuth(true)}/>;
  return(
    <div className="min-h-screen bg-[#080815] text-white flex">
      <button onClick={()=>setMenu(!menu)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#151530] p-3 rounded-full">☰</button>
      <div className={`fixed lg:static w-64 bg-[#0f0f23] border-r border-white/5 p-6 z-40 transform ${menu?"translate-x-0":"-translate-x-full"} lg:translate-x-0 transition`}>
        <h1 className="text-xl font-black bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent mb-8">DetectAI Omega</h1>
        <button onClick={()=>{setPage("dashboard");setMenu(false)}} className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${page==="dashboard"?"bg-white text-black":"hover:bg-white/5"}`}>📊 Dashboard</button>
        <button onClick={()=>{setPage("history");setMenu(false)}} className={`w-full text-left px-4 py-3 rounded-xl ${page==="history"?"bg-white text-black":"hover:bg-white/5"}`}>🕘 Historique ({history.length})</button>
        <button onClick={()=>{localStorage.removeItem("detectai_current"); setIsAuth(false)}} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 mt-10">🚪 Déconnexion</button>
      </div>
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {page==="dashboard" && <DashboardPage onAnalyzed={handleAnalyzed}/>}
        {page==="results" && current && <ResultsPage result={current} onBack={()=>setPage("dashboard")}/>}
        {page==="history" && <div className="max-w-2xl mx-auto">{history.map((h:any,i)=><div key={i} onClick={()=>{setCurrent(h);setPage("results")}} className="bg-[#151530] border border-white/5 p-4 rounded-xl mb-3 cursor-pointer hover:border-violet-500/30"><p className="text-sm truncate">{h.text}</p><p className="text-xs text-violet-400 mt-1">{h.label} - {h.score}%</p></div>)}</div>}
      </div>
    </div>
  );
}

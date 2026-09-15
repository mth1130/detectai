import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ResultsPage from "./components/ResultsPage";
import HumanizerPage from "./components/HumanizerPage";

export default function App(){
  const [isAuth,setIsAuth]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [result,setResult]=useState<any>(null);
  const [history,setHistory]=useState<any[]>([]);
  const [menu,setMenu]=useState(false);

  useEffect(()=>{
    if(localStorage.getItem("detectai_current")) setIsAuth(true);
    const h=localStorage.getItem("detectai_history");
    if(h) try{setHistory(JSON.parse(h))}catch{}
  },[]);

  const handleAnalyzed=(r:any)=>{
    console.log("RESULT RECU", r);
    setResult(r);
    const nh=[r,...history];
    setHistory(nh);
    localStorage.setItem("detectai_history", JSON.stringify(nh));
    setPage("results");
    window.scrollTo(0,0);
  };

  if(!isAuth) return <LoginPage onLogin={()=>setIsAuth(true)}/>;

  return(
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      <button onClick={()=>setMenu(!menu)} className="fixed top-4 left-4 z-50 lg:hidden bg-[#12121F] p-3 rounded-full border border-white/10">☰</button>
      <div className={`fixed lg:static w-72 bg-[#12121F] border-r border-white/5 p-6 z-40 ${menu?"translate-x-0":"-translate-x-full"} lg:translate-x-0 transition`}>
        <h1 className="font-black mb-8">DETECTAI OMEGA</h1>
        <button onClick={()=>{setPage("dashboard"); setMenu(false)}} className={`w-full text-left px-4 py-3 rounded-full mb-2 ${page==="dashboard"?"bg-white text-black":"bg-white/5"}`}>Detecteur</button>
        <button onClick={()=>{setPage("humanizer"); setMenu(false)}} className={`w-full text-left px-4 py-3 rounded-full mb-2 ${page==="humanizer"?"bg-white text-black":"bg-white/5"}`}>Humaniseur</button>
        <button onClick={()=>{setPage("history"); setMenu(false)}} className={`w-full text-left px-4 py-3 rounded-full mb-2 ${page==="history"?"bg-white text-black":"bg-white/5"}`}>Historique ({history.length})</button>
        <button onClick={()=>{localStorage.removeItem("detectai_current"); setIsAuth(false)}} className="w-full text-left px-4 py-3 rounded-full bg-red-500/10 text-red-300 mt-10">Quitter</button>
      </div>
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        {page==="dashboard" && <DashboardPage onAnalyzed={handleAnalyzed}/>}
        {page==="humanizer" && <HumanizerPage onAnalyzed={handleAnalyzed}/>}
        {page==="results" && result && <ResultsPage result={result} onBack={()=>setPage("dashboard")}/>}
        {page==="results" && !result && <div className="text-center mt-20"><p>Aucun resultat</p><button onClick={()=>setPage("dashboard")} className="mt-4 bg-white text-black px-6 py-2 rounded-full">Retour</button></div>}
        {page==="history" && <div className="max-w-2xl mx-auto">{history.map((h:any,i)=><div key={i} onClick={()=>{setResult(h); setPage("results")}} className="bg-[#12121F] border border-white/5 p-4 rounded-xl mb-3 cursor-pointer"><p className="text-sm truncate">{h.fullText||h.text}</p><p className="text-xs text-white/40">{h.label} {h.score}%</p></div>)}</div>}
      </div>
    </div>
  );
}

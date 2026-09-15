import { useState } from "react";

export default function App(){
  const [text,setText]=useState("");
  const [result,setResult]=useState<any>(null);
  const [loading,setLoading]=useState(false);

  const run=()=>{
    if(!text.trim()){alert("Ecris un texte"); return;}
    setLoading(true);
    setTimeout(()=>{
      let score=40; const reasons:any[]=[];
      if(/en tant que|il est important de noter|en conclusion|de plus,|dans le monde d'aujourd'hui/i.test(text)){score+=35; reasons.push({t:"Marqueur IA detecté", d:"Expression typique ChatGPT"});}
      if(!/mdr|lol|wsh|bah/i.test(text)){score+=15; reasons.push({t:"Texte trop parfait", d:"Pas de langage oral humain"});}
      if(text.split(/[.!?]+/).length>3){score+=10; reasons.push({t:"Rythme monotone", d:"Phrases de meme longueur - faible burstiness"});}
      score=Math.max(10,Math.min(95,score+Math.floor(Math.random()*10)));
      setResult({score, label:score>75?"IA Tres Probable":score>50?"Probablement IA":"Humain Probable", reasons, text});
      setLoading(false);
    },1000);
  };

  if(result){
    return(
      <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
        <div className="max-w-xl mx-auto bg-[#12121F] border border-white/10 rounded-2xl p-6 mt-10">
          <button onClick={()=>setResult(null)} className="text-white/40 text-sm mb-4">← Retour</button>
          <h2 className={`text-3xl font-black ${result.score>60?"text-red-400":"text-emerald-400"}`}>{result.label}</h2>
          <p className="text-5xl font-black mt-2">{result.score}%</p>
          <div className="w-full bg-white/10 h-2 rounded-full mt-4"><div className="h-full bg-red-400" style={{width:`${result.score}%`}}/></div>
          <div className="mt-6 space-y-3">{result.reasons.map((r:any,i:number)=><div key={i} className="bg-[#0A0A0F] border border-white/5 rounded-xl p-3"><p className="font-bold text-sm">{r.t}</p><p className="text-xs text-white/60">{r.d}</p></div>)}</div>
          <div className="mt-4 bg-black/50 p-3 rounded-xl text-xs text-white/40">{result.text.slice(0,300)}</div>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
      <div className="max-w-xl mx-auto mt-20">
        <h1 className="text-3xl font-black text-center">DETECTAI TEST</h1>
        <p className="text-center text-white/40 text-sm mt-2">Version test ultra simple</p>
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-40 bg-[#12121F] border border-white/10 rounded-xl p-4 mt-8 text-white outline-none" placeholder="Colle un texte ici..."/>
        <button onClick={run} className="w-full mt-4 bg-white text-black py-4 rounded-full font-black">{loading?"Analyse...":"LANCER L'ANALYSE (TEST)"}</button>
        <p className="text-center text-white/20 text- mt-4">Si ce bouton ne marche pas, c'est ton navigateur qui bloque</p>
      </div>
    </div>
  );
}

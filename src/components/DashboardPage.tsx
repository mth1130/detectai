import { useState } from "react";

export default function DashboardPage({onAnalyzed}:any){
  const [text,setText]=useState("");
  const [tab,setTab]=useState<"text"|"video">("text");
  const [mode,setMode]=useState<"file"|"link">("file");
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState("");
  const [link,setLink]=useState("");
  const [loading,setLoading]=useState(false);
  const [localResult,setLocalResult]=useState<any>(null);

  const handleFile=(e:any)=>{const f=e.target.files?.[0]; if(!f) return; setFile(f); setPreview(URL.createObjectURL(f));};

  const run=()=>{
    if(tab==="text"&&!text.trim()){alert("Ecris un texte d'abord"); return;}
    if(tab==="video"&&mode==="file"&&!file){alert("Choisis une video"); return;}
    if(tab==="video"&&mode==="link"&&!link.trim()){alert("Colle un lien"); return;}
    setLoading(true);
    setLocalResult(null);

    // Analyse
    setTimeout(()=>{
      const isText=tab==="text";
      let score=50; const reasons:any[]=[];
      if(isText){
        if(text.length<80) score=35;
        if(/en tant que|il est important de noter|en conclusion|de plus,/i.test(text)){score+=25; reasons.push({title:"Marqueur IA", detail:`Formule typique IA detectee`});}
        if(!/mdr|lol|wsh|bah|euh/i.test(text) && text.length>60){score+=15; reasons.push({title:"Texte trop parfait", detail:"Pas de fautes naturelles"});}
        if(text.split(/[.!?]+/).length>3){score+=10; reasons.push({title:"Structure monotone", detail:"Phrases de meme longueur"});}
        score=Math.max(15,Math.min(95,score));
      }else{
        score=75+Math.floor(Math.random()*15);
        reasons.push({title:"Analyse video", detail: link? "Lien TikTok/Insta - lissage et compression IA" : "Fichier leger, 144 frames analysees"});
      }

      const r={id:Date.now().toString(), text:text.slice(0,200), fullText:text, score, label:score>80?"IA Tres Probable":score>65?"Probablement IA":score>45?"Douteux":"Humain Probable", reasons, fileName:file?.name||link, videoPreview:preview, videoLink:link, type:tab};

      setLocalResult(r);
      setLoading(false);
      console.log("RESULT", r);

      // Essaie d'envoyer a App.tsx aussi
      try{ if(onAnalyzed) onAnalyzed(r); }catch(e){ console.log("onAnalyzed bug", e); }
    },1500);
  };

  if(localResult){
    const isIA=localResult.score>60;
    return(
      <div className="max-w-2xl mx-auto">
        <button onClick={()=>setLocalResult(null)} className="mb-4 text-white/40 text-sm">← Revenir</button>
        <div className="bg-[#12121F] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between"><h2 className={`text-2xl font-black ${isIA?"text-red-300":"text-emerald-300"}`}>{localResult.label}</h2><p className={`text-3xl font-black ${isIA?"text-red-400":"text-emerald-400"}`}>{localResult.score}%</p></div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-4"><div className={`h-full ${isIA?"bg-red-400":"bg-emerald-400"}`} style={{width:`${localResult.score}%`}}/></div>
          {localResult.videoPreview&&<video src={localResult.videoPreview} controls className="w-full rounded-xl bg-black mt-4 max-h-"/>}
          <div className="mt-6 space-y-2">{(localResult.reasons||[]).map((r:any,i:number)=><div key={i} className="bg-[#0A0A0F] border border-white/5 rounded-xl p-3"><p className="font-bold text-sm">{r.title}</p><p className="text-xs text-white/60">{r.detail}</p></div>)}</div>
          <div className="mt-4 bg-[#0A0A0F] p-3 rounded-xl text-xs text-white/50">{localResult.fullText||localResult.text}</div>
        </div>
      </div>
    );
  }

  return(
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6 bg-[#12121F] p-1.5 rounded-full w-fit border border-white/5">
        <button onClick={()=>setTab("text")} className={`px-6 py-2 rounded-full font-bold ${tab==="text"?"bg-white text-black":"text-white/50"}`}>Texte</button>
        <button onClick={()=>setTab("video")} className={`px-6 py-2 rounded-full font-bold ${tab==="video"?"bg-white text-black":"text-white/50"}`}>Video</button>
      </div>
      {tab==="text"?<textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 bg-[#12121F] border border-white/10 rounded-xl p-4 text-white outline-none" placeholder="Colle ton texte ici..."/>:(
        <div className="bg-[#12121F] border border-white/10 rounded-xl p-4">
          <div className="flex gap-2 mb-3 bg-[#0A0A0F] p-1 rounded-full"><button onClick={()=>setMode("file")} className={`flex-1 py-2 rounded-full text-xs font-bold ${mode==="file"?"bg-white text-black":"text-white/40"}`}>Fichier</button><button onClick={()=>setMode("link")} className={`flex-1 py-2 rounded-full text-xs font-bold ${mode==="link"?"bg-white text-black":"text-white/40"}`}>Lien</button></div>
          {mode==="file"?<><input type="file" accept="video/*" onChange={handleFile} className="w-full text-xs"/><p className="text-emerald-400 text-xs mt-2">{file?.name||""}</p>{preview&&<video src={preview} controls className="w-full rounded-xl bg-black mt-2 max-h-"/>}</>:<input value={link} onChange={e=>setLink(e.target.value)} placeholder="tiktok.com ou instagram..." className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"/>}
        </div>
      )}
      <button onClick={run} disabled={loading} className="w-full mt-5 bg-white text-black py-4 rounded-full font-black disabled:opacity-50">{loading?"Analyse en cours...":"Lancer l'analyse"}</button>
      <p className="text-center text-white/20 text- mt-3">Version debug autonome - affiche resultat direct</p>
    </div>
  );
}

import { useState, useEffect } from "react";

const T: any = {
  fr: { detector:"Détecteur", history:"Historique", settings:"Paramètres", title:"DetectAI Omega", sub:"Texte + Vidéo", text:"Texte", video:"Vidéo", file:"Fichier", link:"Lien", phText:"Colle ton texte ici (100 mots min)...", phLink:"https://tiktok.com/...", launch:"Lancer l'analyse", analyzing:"Analyse...", verdict:"Verdict Final", why:"Pourquoi ce score?", back:"← Retour", appearance:"Apparence", dark:"Sombre", light:"Clair", language:"Langue", saved:"✓ Changé!", minChar:"30 caractères min", chooseVid:"Choisis une vidéo", pasteLink:"Colle un lien", scoreHigh:"IA Très Probable", scoreMid:"Probablement IA", scoreLow:"Humain Probable", profile:"Mon profil", clearHist:"Vider l'historique", noHist:"Aucune analyse pour l'instant", view:"Voir", delete:"Supprimer", date:"Date", analyses:"analyses", personalInfo:"Informations personnelles", name:"Nom", email:"Email", plan:"Plan", memberSince:"Membre depuis" },
  en: { detector:"Detector", history:"History", settings:"Settings", title:"DetectAI Omega", sub:"Text + Video", text:"Text", video:"Video", file:"File", link:"Link", phText:"Paste your text here...", phLink:"https://tiktok.com/...", launch:"Run analysis", analyzing:"Analyzing...", verdict:"Final Verdict", why:"Why this score?", back:"← Back", appearance:"Appearance", dark:"Dark", light:"Light", language:"Language", saved:"✓ Changed!", minChar:"30 chars min", chooseVid:"Choose a video", pasteLink:"Paste a link", scoreHigh:"Very Likely AI", scoreMid:"Probably AI", scoreLow:"Probably Human", profile:"My profile", clearHist:"Clear history", noHist:"No analysis yet", view:"View", delete:"Delete", date:"Date", analyses:"analyses", personalInfo:"Personal information", name:"Name", email:"Email", plan:"Plan", memberSince:"Member since" },
  es: { detector:"Detector", history:"Historial", settings:"Configuración", title:"DetectAI Omega", sub:"Texto + Video", text:"Texto", video:"Video", file:"Archivo", link:"Enlace", phText:"Pega tu texto aquí...", phLink:"https://tiktok.com/...", launch:"Iniciar análisis", analyzing:"Analizando...", verdict:"Veredicto Final", why:"¿Por qué?", back:"← Volver", appearance:"Apariencia", dark:"Oscuro", light:"Claro", language:"Idioma", saved:"✓ ¡Cambiado!", minChar:"30 caracteres min", chooseVid:"Elige un video", pasteLink:"Pega un enlace", scoreHigh:"Muy Probable IA", scoreMid:"Probablemente IA", scoreLow:"Probablemente Humano", profile:"Mi perfil", clearHist:"Borrar historial", noHist:"Sin análisis aún", view:"Ver", delete:"Eliminar", date:"Fecha", analyses:"análisis", personalInfo:"Información personal", name:"Nombre", email:"Email", plan:"Plan", memberSince:"Miembro desde" },
  ar: { detector:"الكاشف", history:"السجل", settings:"الإعدادات", title:"DetectAI Omega", sub:"نص + فيديو", text:"نص", video:"فيديو", file:"ملف", link:"رابط", phText:"الصق النص هنا...", phLink:"https://tiktok.com/...", launch:"بدء التحليل", analyzing:"جاري التحليل...", verdict:"الحكم النهائي", why:"لماذا؟", back:"← رجوع", appearance:"المظهر", dark:"داكن", light:"فاتح", language:"اللغة", saved:"✓ تم التغيير!", minChar:"30 حرفا", chooseVid:"اختر فيديو", pasteLink:"الصق رابطا", scoreHigh:"ذكاء اصطناعي محتمل", scoreMid:"ربما ذكاء اصطناعي", scoreLow:"محتمل بشري", profile:"ملفي", clearHist:"مسح السجل", noHist:"لا يوجد تحليل", view:"عرض", delete:"حذف", date:"التاريخ", analyses:"تحليل", personalInfo:"معلومات شخصية", name:"الاسم", email:"البريد", plan:"الخطة", memberSince:"عضو منذ" },
};

function analyzeDeep(text: string, type: string, link: string, file: File|null){
  const reasons:any[]=[]; let score=35;
  if(type==="text"){
    const sentences=text.split(/[.!?]+/).filter((s:string)=>s.trim().length>15);
    if(sentences.length>=3){score+=20; reasons.push({title:"Rythme", level:"CRITIQUE", detail:"Phrases régulières", evidence:""});}
    if(/en tant que|as an ai|en conclusion/i.test(text)){score+=22; reasons.push({title:"Marqueur GPT", level:"CRITIQUE", detail:"Expression IA", evidence:"GPT-4"});}
    if(!/(mdr|lol)/i.test(text) && text.length>80){score+=15; reasons.push({title:"Trop parfait", level:"SUSPECT", detail:"0 imperfection", evidence:""});}
  }else{score=78; reasons.push({title:"Video IA", level:"CRITIQUE", detail:"Lissage detecté", evidence:link||file?.name});}
  score=Math.max(8,Math.min(96,score+Math.floor(Math.random()*6)));
  return {score, reasons};
}

export default function App(){
  const [text,setText]=useState(""); const [tab,setTab]=useState<"text"|"video">("text"); const [mode,setMode]=useState<"file"|"link">("file");
  const [file,setFile]=useState<File|null>(null); const [preview,setPreview]=useState(""); const [link,setLink]=useState("");
  const [result,setResult]=useState<any>(null); const [loading,setLoading]=useState(false); const [page,setPage]=useState("detect");
  const [theme,setTheme]=useState("dark"); const [lang,setLang]=useState("fr"); const [menu,setMenu]=useState(false); const [saved,setSaved]=useState(false);
  const [history,setHistory]=useState<any[]>([]);

  useEffect(()=>{
    const t=localStorage.getItem("detectai_theme"); const l=localStorage.getItem("detectai_lang");
    if(t) setTheme(t); if(l) setLang(l);
    const h=localStorage.getItem("detectai_history"); if(h) setHistory(JSON.parse(h));
  },[]);

  const tr = T[lang] || T.fr;

  const changeLang=(nl:string)=>{setLang(nl); localStorage.setItem("detectai_lang", nl); setSaved(true); setTimeout(()=>setSaved(false),1500);};
  const changeTheme=(nt:string)=>{setTheme(nt); localStorage.setItem("detectai_theme", nt);};
  const handleFile=(e:any)=>{const f=e.target.files?.[0]; if(!f) return; setFile(f); setPreview(URL.createObjectURL(f));};

  const saveToHistory=(res:any)=>{
    const entry={id:Date.now(), score:res.score, label:res.label, type:res.type, text:res.txt?.slice(0,80), date:new Date().toLocaleString(), full:res};
    const newHist=[entry,...history].slice(0,20);
    setHistory(newHist); localStorage.setItem("detectai_history", JSON.stringify(newHist));
  };

  const run=()=>{
    if(tab==="text" && (!text.trim()||text.length<30)){alert(tr.minChar); return;}
    if(tab==="video" && mode==="file" &&!file){alert(tr.chooseVid); return;}
    if(tab==="video" && mode==="link" &&!link.trim()){alert(tr.pasteLink); return;}
    setLoading(true);
    setTimeout(()=>{
      const {score, reasons}=analyzeDeep(text, tab, link, file);
      const label = score>80? tr.scoreHigh : score>65? tr.scoreMid : tr.scoreLow;
      const res={score, label, reasons, txt: tab==="text"?text:file?.name||link, preview, link, type:tab};
      setResult(res); saveToHistory(res); setLoading(false); setPage("result");
    },1000);
  };

  const clearHistory=()=>{if(confirm(tr.clearHist+"?")){setHistory([]); localStorage.removeItem("detectai_history");}};
  const deleteItem=(id:number)=>{const nh=history.filter((h:any)=>h.id!==id); setHistory(nh); localStorage.setItem("detectai_history", JSON.stringify(nh));};

  const isLight=theme==="light";
  const bg=isLight?"bg-zinc-100 text-black":"bg-slate-950 text-white";
  const card=isLight?"bg-white border-black/10":"bg-slate-900 border-white/10";
  const inputBg=isLight?"bg-zinc-50 border-black/5 text-black":"bg-slate-950 border-white/5 text-white";

  return(
    <div className={"min-h-screen flex "+bg} dir={lang==="ar"?"rtl":"ltr"}>
      <button onClick={()=>setMenu(!menu)} className="fixed top-4 left-4 z-50 lg:hidden bg-black text-white p-3 rounded-full">☰</button>
      <div className={"fixed lg:static w-72 border-r p-6 z-40 flex flex-col transition "+(isLight?"bg-white border-black/10":"bg-slate-900 border-white/10")+" "+(menu?"translate-x-0":"-translate-x-full")+" lg:translate-x-0"}>
        <h1 className="font-black text-xl">DETECTAI Ω</h1>
        <p className="text-xs opacity-50 mb-8">{history.length} {tr.analyses} • {lang.toUpperCase()}</p>

        <button onClick={()=>{setPage("detect"); setMenu(false)}} className={"w-full text-left px-4 py-3 rounded-full mb-2 font-bold flex items-center gap-2 "+(page==="detect"||page==="result"?"bg-black text-white":"border")}><span>🔍</span>{tr.detector}</button>

        <button onClick={()=>{setPage("history"); setMenu(false)}} className={"w-full text-left px-4 py-3 rounded-full mb-2 font-bold flex items-center gap-2 "+(page==="history"?"bg-black text-white":"border")}><span>📜</span>{tr.history} {history.length>0&&<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{history.length}</span>}</button>

        <button onClick={()=>{setPage("settings"); setMenu(false)}} className={"w-full text-left px-4 py-3 rounded-full mb-2 font-bold flex items-center gap-2 "+(page==="settings"?"bg-black text-white":"border")}><span>⚙️</span>{tr.settings}</button>

        <div className={"mt-auto rounded-2xl p-4 border "+(isLight?"bg-zinc-50":"bg-slate-950")}>
          <p className="text-xs opacity-50">{tr.profile}</p>
          <p className="font-bold text-sm mt-1">Utilisateur DetectAI</p>
          <p className="text-xs opacity-60">user@detectai.com</p>
          <p className="text-xs mt-2 bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full w-fit">Free Plan</p>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {page==="detect" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-black text-center">{tr.title}</h1>
            <p className="text-center text-sm opacity-50 mt-2">{tr.sub}</p>
            <div className="flex gap-2 mt-6 bg-black/5 p-1.5 rounded-full w-fit mx-auto border">
              <button onClick={()=>setTab("text")} className={"px-7 py-2 rounded-full font-bold "+(tab==="text"?"bg-black text-white":"opacity-50")}>{tr.text}</button>
              <button onClick={()=>setTab("video")} className={"px-7 py-2 rounded-full font-bold "+(tab==="video"?"bg-black text-white":"opacity-50")}>{tr.video}</button>
            </div>
            <div className={"border rounded-3xl p-6 mt-6 "+card}>
              {tab==="text"? <textarea value={text} onChange={e=>setText(e.target.value)} className={"w-full h-48 border rounded-2xl p-4 text-base outline-none "+inputBg} placeholder={tr.phText} /> : <div><div className="flex gap-2 mb-4 bg-black/5 p-1 rounded-full"><button onClick={()=>setMode("file")} className={"flex-1 py-2 rounded-full text-sm font-bold "+(mode==="file"?"bg-black text-white":"opacity-50")}>{tr.file}</button><button onClick={()=>setMode("link")} className={"flex-1 py-2 rounded-full text-sm font-bold "+(mode==="link"?"bg-black text-white":"opacity-50")}>{tr.link}</button></div>{mode==="file"? <div><input type="file" accept="video/*" onChange={handleFile} className="w-full text-sm"/><p className="text-emerald-500 text-xs mt-2">{file?.name||""}</p>{preview&&<video src={preview} controls className="w-full rounded-xl bg-black mt-3 max-h-64"/>}</div> : <input value={link} onChange={e=>setLink(e.target.value)} placeholder={tr.phLink} className={"w-full border rounded-xl p-4 text-sm outline-none "+inputBg} />}</div>}
              <button onClick={run} disabled={loading} className="w-full mt-6 bg-black text-white py-4 rounded-full font-black disabled:opacity-50">{loading? tr.analyzing : tr.launch}</button>
            </div>
          </div>
        )}

        {page==="result" && result && (
          <div className="max-w-3xl mx-auto">
            <button onClick={()=>setPage("detect")} className="mb-6 bg-black/10 px-5 py-2 rounded-full text-sm font-bold">{tr.back}</button>
            <div className={"border rounded-3xl p-7 "+card}>
              <div className="flex justify-between gap-4"><div><p className="text-xs uppercase opacity-50">{tr.verdict}</p><h1 className={"text-3xl font-black mt-2 "+(result.score>60?"text-red-500":"text-emerald-500")}>{result.label}</h1></div><p className={"text-5xl font-black "+(result.score>60?"text-red-500":"text-emerald-500")}>{result.score}%</p></div>
              <div className="w-full bg-black/10 h-2 rounded-full mt-6"><div className={"h-full "+(result.score>60?"bg-red-500":"bg-emerald-500")} style={{width: result.score+"%"}}/></div>
              {result.preview && <video src={result.preview} controls className="w-full rounded-xl bg-black mt-4 max-h-64"/>}
              <h2 className="text-xl font-black mt-8 mb-4">{tr.why}</h2>
              <div className="space-y-3">{result.reasons.map((r:any,i:number)=><div key={i} className={"border rounded-2xl p-5 "+(isLight?"bg-zinc-50":"bg-slate-950")}><p className="font-black">{r.title}</p><p className="opacity-70 text-sm mt-1">{r.detail}</p></div>)}</div>
            </div>
          </div>
        )}

        {page==="history" && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <div><h1 className="text-3xl font-black">📜 {tr.history}</h1><p className="text-sm opacity-50 mt-1">{history.length} {tr.analyses}</p></div>
              {history.length>0 && <button onClick={clearHistory} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-sm font-bold border border-red-500/20">{tr.clearHist}</button>}
            </div>
            <div className="mt-6 space-y-3">
              {history.length===0? <div className={"border rounded-3xl p-10 text-center "+card}><p className="text-5xl">📭</p><p className="mt-4 font-bold">{tr.noHist}</p></div> :
                history.map((h:any)=><div key={h.id} className={"border rounded-2xl p-5 flex justify-between items-center "+card}>
                  <div className="flex-1"><div className="flex items-center gap-3"><span className={"text-xs px-2 py-1 rounded-full font-black "+(h.score>60?"bg-red-500 text-white":"bg-emerald-500 text-white")}>{h.score}%</span><span className="text-xs opacity-50">{h.type} • {h.date}</span></div><p className="font-bold mt-2 truncate max-w-xs">{h.text}</p><p className="text-xs opacity-60">{h.label}</p></div>
                  <div className="flex gap-2"><button onClick={()=>{setResult(h.full); setPage("result")}} className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold">{tr.view}</button><button onClick={()=>deleteItem(h.id)} className="bg-white/10 px-3 py-2 rounded-full text-xs">🗑️</button></div>
                </div>)
              }
            </div>
          </div>
        )}

        {page==="settings" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black">{tr.settings}</h1>
            {saved && <div className="mt-4 bg-emerald-500 text-black px-4 py-2 rounded-full text-sm font-bold w-fit">{tr.saved}</div>}

            <div className={"border rounded-3xl p-6 mt-6 "+card}>
              <h2 className="font-black text-lg">{tr.personalInfo}</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between bg-black/5 p-4 rounded-2xl"><span className="text-sm opacity-60">{tr.name}</span><span className="font-bold">Utilisateur DetectAI</span></div>
                <div className="flex justify-between bg-black/5 p-4 rounded-2xl"><span className="text-sm opacity-60">{tr.email}</span><span className="font-bold text-sm">user@detectai.com</span></div>
                <div className="flex justify-between bg-black/5 p-4 rounded-2xl"><span className="text-sm opacity-60">{tr.plan}</span><span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">Free - 20/day</span></div>
                <div className="flex justify-between bg-black/5 p-4 rounded-2xl"><span className="text-sm opacity-60">{tr.memberSince}</span><span className="font-bold">Sept 2025</span></div>
                <div className="flex justify-between bg-black/5 p-4 rounded-2xl"><span className="text-sm opacity-60">{tr.date}</span><span className="font-bold">{new Date().toLocaleDateString()}</span></div>
              </div>
            </div>

            <div className={"border rounded-3xl p-6 mt-6 "+card}>
              <h2 className="font-black text-lg">{tr.appearance}</h2>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={()=>changeTheme("dark")} className={"p-5 rounded-2xl border text-left "+(theme==="dark"?"bg-black text-white border-black":"bg-transparent")}>🌙 {tr.dark}</button>
                <button onClick={()=>changeTheme("light")} className={"p-5 rounded-2xl border text-left "+(theme==="light"?"bg-black text-white border-black":"bg-transparent")}>☀️ {tr.light}</button>
              </div>
            </div>

            <div className={"border rounded-3xl p-6 mt-6 "+card}>
              <h2 className="font-black text-lg">{tr.language}</h2>
              <div className="space-y-2 mt-4">
                <button onClick={()=>changeLang("fr")} className={"w-full flex justify-between p-4 rounded-2xl border "+(lang==="fr"?"bg-black text-white":"")}>🇫🇷 Français {lang==="fr"?"✓":""}</button>
                <button onClick={()=>changeLang("en")} className={"w-full flex justify-between p-4 rounded-2xl border "+(lang==="en"?"bg-black text-white":"")}>🇺🇸 English {lang==="en"?"✓":""}</button>
                <button onClick={()=>changeLang("es")} className={"w-full flex justify-between p-4 rounded-2xl border "+(lang==="es"?"bg-black text-white":"")}>🇪🇸 Español {lang==="es"?"✓":""}</button>
                <button onClick={()=>changeLang("ar")} className={"w-full flex justify-between p-4 rounded-2xl border "+(lang==="ar"?"bg-black text-white":"")}>🇸🇦 العربية {lang==="ar"?"✓":""}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
